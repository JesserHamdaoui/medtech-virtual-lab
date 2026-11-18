"use client";

import { PointerEvent, useId, useRef, useState } from "react";
import { GraphSample, GraphSeries } from "./graphHistory";
import { formatTime, linePath, nearestIndex } from "./graphPath";
import { Axis, niceAxis, niceStep, tickValues } from "./graphScale";
import { useElementSize } from "./useElementSize";
import DockButton from "./DockButton";

const MARGIN = { left: 56, right: 18, top: 16, bottom: 44 };
/** The time axis is at least this long, s, so a run starts on a readable scale. */
const MIN_SECONDS = 30;
/** The temperature axis is at least this tall, °C, even when zoomed in. */
const MIN_DEGREES = 2;
/** A drag shorter than this many pixels is a click, not a zoom. */
const DRAG_THRESHOLD = 6;
const TOOLTIP_WIDTH = 168;
const TOOLTIP_ROW = 16;

interface View {
  min: number;
  max: number;
}

interface InteractiveGraphProps {
  series: GraphSeries[];
  samples: GraphSample[];
}

/**
 * A large temperature against time chart. Hover reads the values at a moment,
 * dragging across it zooms into that stretch of time, and a double click or
 * the button zooms back out. While not zoomed it follows the run as it grows.
 */
export default function InteractiveGraph({ series, samples }: InteractiveGraphProps) {
  const [containerRef, { width, height }] = useElementSize<HTMLDivElement>();
  const svgRef = useRef<SVGSVGElement>(null);
  const clipId = useId();
  const [view, setView] = useState<View | null>(null);
  const [hoverPx, setHoverPx] = useState<number | null>(null);
  const [drag, setDrag] = useState<{ from: number; to: number } | null>(null);

  const plotW = width - MARGIN.left - MARGIN.right;
  const plotH = height - MARGIN.top - MARGIN.bottom;
  const ready = plotW > 50 && plotH > 50;

  const lastT = samples.length ? samples[samples.length - 1].t : 0;
  const xAxis: Axis = view
    ? { ...view, step: niceStep(view.max - view.min, 8) }
    : { ...niceAxis(0, Math.max(lastT, MIN_SECONDS), MIN_SECONDS, 8), min: 0 };

  const inView = samples.filter((s) => s.t >= xAxis.min && s.t <= xAxis.max);
  const values = inView.flatMap((s) => series.map((line) => s[line.key]).filter((v): v is number => v !== null));
  const yAxis: Axis = niceAxis(values.length ? Math.min(...values) : 20, values.length ? Math.max(...values) : 25, MIN_DEGREES, 6);

  const x = (t: number) => MARGIN.left + ((t - xAxis.min) / (xAxis.max - xAxis.min)) * plotW;
  const y = (v: number) => MARGIN.top + (1 - (v - yAxis.min) / (yAxis.max - yAxis.min)) * plotH;
  const timeAt = (px: number) => xAxis.min + ((px - MARGIN.left) / plotW) * (xAxis.max - xAxis.min);

  /** Pointer position inside the plot, in pixels along x, kept within the plot. */
  const localX = (e: PointerEvent) => {
    const rect = svgRef.current!.getBoundingClientRect();
    return Math.min(MARGIN.left + plotW, Math.max(MARGIN.left, e.clientX - rect.left));
  };

  const onPointerDown = (e: PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const px = localX(e);
    setDrag({ from: px, to: px });
  };

  const onPointerMove = (e: PointerEvent) => {
    const px = localX(e);
    setHoverPx(px);
    setDrag((prev) => (prev ? { ...prev, to: px } : prev));
  };

  const onPointerUp = (e: PointerEvent) => {
    e.currentTarget.releasePointerCapture(e.pointerId);
    if (drag && Math.abs(drag.to - drag.from) > DRAG_THRESHOLD) {
      const a = timeAt(drag.from);
      const b = timeAt(drag.to);
      setView({ min: Math.min(a, b), max: Math.max(a, b) });
    }
    setDrag(null);
  };

  const hovered = hoverPx !== null && samples.length ? samples[nearestIndex(samples, timeAt(hoverPx))] : null;
  const hoverInView = hovered && hovered.t >= xAxis.min && hovered.t <= xAxis.max ? hovered : null;
  const readings = hoverInView
    ? series.flatMap((line) => (hoverInView[line.key] === null ? [] : [{ line, value: hoverInView[line.key] as number }]))
    : [];

  const tooltipH = 24 + readings.length * TOOLTIP_ROW;
  const tooltipX = hoverInView ? (x(hoverInView.t) + 14 + TOOLTIP_WIDTH > width - MARGIN.right ? x(hoverInView.t) - 14 - TOOLTIP_WIDTH : x(hoverInView.t) + 14) : 0;

  return (
    <div ref={containerRef} className="relative h-full w-full">
      {ready && (
        <svg ref={svgRef} width={width} height={height} role="img" aria-label="Temperature against time" className="block select-none">
          <defs>
            <clipPath id={clipId}>
              <rect x={MARGIN.left} y={MARGIN.top} width={plotW} height={plotH} />
            </clipPath>
          </defs>

          {tickValues(yAxis.min, yAxis.max, yAxis.step).map((v) => (
            <g key={`y${v}`}>
              <line x1={MARGIN.left} x2={MARGIN.left + plotW} y1={y(v)} y2={y(v)} stroke="var(--sim-neutral-200)" />
              <text x={MARGIN.left - 8} y={y(v) + 4} textAnchor="end" fontSize="11" fill="var(--sim-neutral-600)">
                {v}
              </text>
            </g>
          ))}
          {tickValues(xAxis.min, xAxis.max, xAxis.step).map((v) => (
            <g key={`x${v}`}>
              <line x1={x(v)} x2={x(v)} y1={MARGIN.top} y2={MARGIN.top + plotH} stroke="var(--sim-neutral-100)" />
              <text x={x(v)} y={MARGIN.top + plotH + 16} textAnchor="middle" fontSize="11" fill="var(--sim-neutral-600)">
                {v}
              </text>
            </g>
          ))}
          <line x1={MARGIN.left} x2={MARGIN.left} y1={MARGIN.top} y2={MARGIN.top + plotH} stroke="var(--sim-neutral-900)" strokeWidth="1.5" />
          <line x1={MARGIN.left} x2={MARGIN.left + plotW} y1={MARGIN.top + plotH} y2={MARGIN.top + plotH} stroke="var(--sim-neutral-900)" strokeWidth="1.5" />
          <text x={MARGIN.left + plotW / 2} y={height - 8} textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--sim-neutral-600)">
            TIME (s)
          </text>
          <text x={14} y={MARGIN.top + plotH / 2} textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--sim-neutral-600)" transform={`rotate(-90 14 ${MARGIN.top + plotH / 2})`}>
            TEMPERATURE (°C)
          </text>

          <g clipPath={`url(#${clipId})`}>
            {series.map((line) => (
              <path key={line.key} d={linePath(samples, line.key, x, y)} fill="none" stroke={line.color} strokeWidth="2.25" strokeLinejoin="round" />
            ))}
            {drag && (
              <rect
                x={Math.min(drag.from, drag.to)}
                y={MARGIN.top}
                width={Math.abs(drag.to - drag.from)}
                height={plotH}
                fill="var(--sim-accent-tint-10)"
                stroke="var(--sim-accent-500)"
              />
            )}
          </g>

          {hoverInView && !drag && (
            <g pointerEvents="none">
              <line x1={x(hoverInView.t)} x2={x(hoverInView.t)} y1={MARGIN.top} y2={MARGIN.top + plotH} stroke="var(--sim-neutral-500)" strokeDasharray="4 3" />
              {readings.map(({ line, value }) => (
                <circle key={line.key} cx={x(hoverInView.t)} cy={y(value)} r="4" fill={line.color} stroke="white" strokeWidth="1.5" />
              ))}
              <g transform={`translate(${tooltipX} ${MARGIN.top + 8})`}>
                <rect width={TOOLTIP_WIDTH} height={tooltipH} fill="var(--sim-neutral-0)" stroke="var(--sim-border)" strokeWidth="1.5" />
                <text x="8" y="16" fontSize="11" fontWeight="700" fill="var(--sim-neutral-900)">
                  {formatTime(hoverInView.t)}
                </text>
                {readings.map(({ line, value }, i) => (
                  <g key={line.key} transform={`translate(8 ${30 + i * TOOLTIP_ROW})`}>
                    <rect y="-8" width="10" height="3" fill={line.color} />
                    <text x="16" fontSize="11" fill="var(--sim-neutral-900)">
                      {line.label}
                    </text>
                    <text x={TOOLTIP_WIDTH - 16} textAnchor="end" fontSize="11" fontWeight="700" fill="var(--sim-neutral-900)" fontFamily="var(--font-mono, monospace)">
                      {value.toFixed(1)} °C
                    </text>
                  </g>
                ))}
              </g>
            </g>
          )}

          {/* Catches the pointer over the plot for hover, drag to zoom and double click to reset. */}
          <rect
            x={MARGIN.left}
            y={MARGIN.top}
            width={plotW}
            height={plotH}
            fill="transparent"
            className={drag ? "cursor-col-resize" : "cursor-crosshair"}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={() => !drag && setHoverPx(null)}
            onDoubleClick={() => setView(null)}
          />
        </svg>
      )}

      {view && (
        <div className="absolute right-4 top-2">
          <DockButton onClick={() => setView(null)}>Reset zoom</DockButton>
        </div>
      )}
    </div>
  );
}

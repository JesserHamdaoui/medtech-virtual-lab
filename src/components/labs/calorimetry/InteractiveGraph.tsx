"use client";

import { faMagnifyingGlassMinus, faMagnifyingGlassPlus, faRotateLeft } from "@fortawesome/free-solid-svg-icons";
import { KeyboardEvent, PointerEvent, WheelEvent, useId, useRef, useState } from "react";
import { GraphSample, GraphSeries } from "./graphHistory";
import { formatTime, linePath, nearestIndex } from "./graphPath";
import { Axis, Range, niceAxis, niceStep, panRange, tickValues, zoomRange } from "./graphScale";
import { useElementSize } from "./useElementSize";
import DockButton from "./DockButton";

const MARGIN = { left: 56, right: 18, top: 16, bottom: 44 };
/** The time axis is at least this long, s, so a run starts on a readable scale. */
const MIN_SECONDS = 30;
/** The temperature axis is at least this tall, °C, even when zoomed in. */
const MIN_DEGREES = 2;
/** How much one wheel notch, button press or key press zooms by. */
const ZOOM_STEP = 0.8;
/** How far an arrow key pans, as a share of what is on screen. */
const KEY_PAN = 0.15;
const TOOLTIP_WIDTH = 168;
const TOOLTIP_ROW = 16;

interface InteractiveGraphProps {
  series: GraphSeries[];
  samples: GraphSample[];
}

/**
 * A large temperature against time chart. Hover reads the values at a moment,
 * dragging moves along the run, the wheel (or the buttons, or + and -) zooms
 * around the pointer, and a double click shows everything again. While not
 * zoomed it follows the run as it grows.
 */
export default function InteractiveGraph({ series, samples }: InteractiveGraphProps) {
  const [containerRef, { width, height }] = useElementSize<HTMLDivElement>();
  const svgRef = useRef<SVGSVGElement>(null);
  const clipId = useId();
  const [view, setView] = useState<Range | null>(null);
  const [hoverPx, setHoverPx] = useState<number | null>(null);
  // Where a pan started: the pointer, and the stretch of time shown then.
  const panRef = useRef<{ px: number; start: Range } | null>(null);
  const [panning, setPanning] = useState(false);

  const plotW = width - MARGIN.left - MARGIN.right;
  const plotH = height - MARGIN.top - MARGIN.bottom;
  const ready = plotW > 50 && plotH > 50;

  const lastT = samples.length ? samples[samples.length - 1].t : 0;
  const full: Axis = { ...niceAxis(0, Math.max(lastT, MIN_SECONDS), MIN_SECONDS, 8), min: 0 };
  const xAxis: Axis = view ? { ...view, step: niceStep(view.max - view.min, 8) } : full;

  const inView = samples.filter((s) => s.t >= xAxis.min && s.t <= xAxis.max);
  const values = inView.flatMap((s) => series.map((line) => s[line.key]).filter((v): v is number => v !== null));
  const yAxis: Axis = niceAxis(values.length ? Math.min(...values) : 20, values.length ? Math.max(...values) : 25, MIN_DEGREES, 6);

  const x = (t: number) => MARGIN.left + ((t - xAxis.min) / (xAxis.max - xAxis.min)) * plotW;
  const y = (v: number) => MARGIN.top + (1 - (v - yAxis.min) / (yAxis.max - yAxis.min)) * plotH;
  const timeAt = (px: number) => xAxis.min + ((px - MARGIN.left) / plotW) * (xAxis.max - xAxis.min);

  /** Pointer position along x, in pixels from the left of the chart. */
  const pointerX = (e: PointerEvent | WheelEvent) => e.clientX - svgRef.current!.getBoundingClientRect().left;
  const clampToPlot = (px: number) => Math.min(MARGIN.left + plotW, Math.max(MARGIN.left, px));

  const zoomAround = (factor: number, anchorT: number) => setView(zoomRange(xAxis, factor, anchorT, 0, full.max));
  const zoomAtCentre = (factor: number) => zoomAround(factor, (xAxis.min + xAxis.max) / 2);
  const panBy = (delta: number) => setView(panRange(xAxis, delta, 0, full.max));
  const zoomed = view !== null;

  const onPointerDown = (e: PointerEvent) => {
    if (!zoomed) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    panRef.current = { px: pointerX(e), start: xAxis };
    setPanning(true);
  };

  const onPointerMove = (e: PointerEvent) => {
    const pan = panRef.current;
    if (pan) {
      // Dragging right pulls earlier times into view.
      const delta = -((pointerX(e) - pan.px) / plotW) * (pan.start.max - pan.start.min);
      setView(panRange(pan.start, delta, 0, full.max));
      return;
    }
    setHoverPx(clampToPlot(pointerX(e)));
  };

  const endPan = (e: PointerEvent) => {
    if (!panRef.current) return;
    e.currentTarget.releasePointerCapture(e.pointerId);
    panRef.current = null;
    setPanning(false);
  };

  const onWheel = (e: WheelEvent) => zoomAround(e.deltaY < 0 ? ZOOM_STEP : 1 / ZOOM_STEP, timeAt(clampToPlot(pointerX(e))));

  const onKeyDown = (e: KeyboardEvent) => {
    const range = xAxis.max - xAxis.min;
    if (e.key === "ArrowLeft" && zoomed) panBy(-range * KEY_PAN);
    else if (e.key === "ArrowRight" && zoomed) panBy(range * KEY_PAN);
    else if (e.key === "+" || e.key === "=") zoomAtCentre(ZOOM_STEP);
    else if (e.key === "-") zoomAtCentre(1 / ZOOM_STEP);
    else if (e.key === "0") setView(null);
    else return;
    e.preventDefault();
  };

  const hovered = hoverPx !== null && samples.length ? samples[nearestIndex(samples, timeAt(hoverPx))] : null;
  const hoverInView = hovered && hovered.t >= xAxis.min && hovered.t <= xAxis.max ? hovered : null;
  const readings = hoverInView
    ? series.flatMap((line) => (hoverInView[line.key] === null ? [] : [{ line, value: hoverInView[line.key] as number }]))
    : [];

  const tooltipH = 24 + readings.length * TOOLTIP_ROW;
  const tooltipX = hoverInView ? (x(hoverInView.t) + 14 + TOOLTIP_WIDTH > width - MARGIN.right ? x(hoverInView.t) - 14 - TOOLTIP_WIDTH : x(hoverInView.t) + 14) : 0;

  return (
    <div
      tabIndex={0}
      onKeyDown={onKeyDown}
      className="flex h-full w-full flex-col focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sim-accent-700)]"
    >
      <div className="flex justify-end gap-2 border-b-2 border-[var(--sim-border-subtle)] bg-[var(--sim-neutral-50)] px-3 py-2">
        <DockButton icon={faMagnifyingGlassPlus} onClick={() => zoomAtCentre(ZOOM_STEP)}>
          Zoom in
        </DockButton>
        <DockButton icon={faMagnifyingGlassMinus} onClick={() => zoomAtCentre(1 / ZOOM_STEP)} disabled={!zoomed}>
          Zoom out
        </DockButton>
        <DockButton icon={faRotateLeft} onClick={() => setView(null)} disabled={!zoomed}>
          Show all
        </DockButton>
      </div>
      <div ref={containerRef} className="relative min-h-0 flex-1">
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
            </g>

            {hoverInView && !panning && (
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

            {/* Catches the pointer over the plot: hover, drag to move, wheel to zoom, double click to show everything. */}
            <rect
              x={MARGIN.left}
              y={MARGIN.top}
              width={plotW}
              height={plotH}
              fill="transparent"
              style={{ touchAction: "none" }}
              className={panning ? "cursor-grabbing" : zoomed ? "cursor-grab" : "cursor-crosshair"}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={endPan}
              onPointerCancel={endPan}
              onPointerLeave={() => !panRef.current && setHoverPx(null)}
              onWheel={onWheel}
              onDoubleClick={() => setView(null)}
            />
          </svg>
        )}
      </div>
    </div>
  );
}

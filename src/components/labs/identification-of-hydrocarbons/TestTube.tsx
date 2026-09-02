"use client";

import { useId, useState } from "react";
import { HeatLevel, ReagentId } from "./types";

export interface TestTubeLayer {
  color: string;
  heightPx: number;
}

interface TestTubeProps {
  /** Bottom-to-top stack of liquid layers. */
  layers: TestTubeLayer[];
  onReagentDrop?: (reagentId: ReagentId) => void;
  isShaking?: boolean;
  heatLevel?: HeatLevel;
}

const HEAT_GLOW_COLOR: Record<Exclude<HeatLevel, "none">, string> = {
  noticeable: "#f5a35c",
  high: "#e8462f",
};

const TUBE_BOTTOM_Y = 236;
const TUBE_TOP_Y = 12;
const TUBE_LEFT_X = 36;
const TUBE_RIGHT_X = 76;

// Open outline for the stroked glass silhouette — left wall, rounded
// bottom, right wall — deliberately NOT closed back across the top, since
// the tube mouth is open.
const TUBE_OUTLINE_PATH = `M${TUBE_LEFT_X} ${TUBE_TOP_Y} V${TUBE_BOTTOM_Y} a20 20 0 0 0 40 0 V${TUBE_TOP_Y}`;

// Closed version of the same silhouette, straight across the top — used
// only for fill/clip regions, which need a closed boundary.
const TUBE_FILL_PATH = `${TUBE_OUTLINE_PATH} Z`;

/**
 * 100x13mm test tube per the lab manual, charged with a small dropwise
 * amount of hydrocarbon — deliberately far from full so the quantity
 * itself reads as data, not just a container prop. Accepts dragged
 * reagent bottles as a drop target when a handler is provided.
 *
 * Layers stack bottom-to-top so adding an immiscible reagent (water sinks
 * below the organic layer; ligroin joins the hydrocarbon on top) shows up
 * as a visible band rather than just a taller single-color fill.
 */
export default function TestTube({ layers, onReagentDrop, isShaking, heatLevel = "none" }: TestTubeProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const clipId = useId();
  const glowId = useId();

  let cursorY = TUBE_BOTTOM_Y;
  const bands = layers
    .filter((layer) => layer.heightPx > 0)
    .map((layer) => {
      const bottomY = cursorY;
      const topY = cursorY - layer.heightPx;
      cursorY = topY;
      return { ...layer, bottomY, topY };
    });

  return (
    <svg
      width="112"
      height="320"
      viewBox="0 0 112 320"
      fill="none"
      className={isShaking ? "sim-shake" : undefined}
      onDragOver={(e) => {
        if (!onReagentDrop) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = "copy";
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(e) => {
        if (!onReagentDrop) return;
        e.preventDefault();
        setIsDragOver(false);
        const reagentId = e.dataTransfer.getData("application/x-reagent") as ReagentId;
        if (reagentId) onReagentDrop(reagentId);
      }}
    >
      <defs>
        <clipPath id={clipId}>
          <path d={TUBE_FILL_PATH} />
        </clipPath>
        {heatLevel !== "none" && (
          <filter id={glowId} x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation={heatLevel === "high" ? 6 : 3.5} result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        )}
      </defs>

      <path d={TUBE_FILL_PATH} fill="var(--sim-neutral-0)" />

      <g clipPath={`url(#${clipId})`}>
        {bands.map((band, i) => (
          <rect
            key={i}
            x={TUBE_LEFT_X}
            y={band.topY}
            width={TUBE_RIGHT_X - TUBE_LEFT_X}
            height={band.bottomY - band.topY}
            fill={band.color}
            className="transition-all duration-300 ease-out"
          />
        ))}
        {bands.slice(0, -1).map((band, i) => (
          <line
            key={`seam-${i}`}
            x1={TUBE_LEFT_X}
            y1={band.topY}
            x2={TUBE_RIGHT_X}
            y2={band.topY}
            stroke="var(--sim-neutral-900)"
            strokeOpacity="0.3"
            strokeWidth="1"
            strokeDasharray="3 2"
          />
        ))}
      </g>

      {heatLevel !== "none" && (
        <path
          d={TUBE_FILL_PATH}
          fill={HEAT_GLOW_COLOR[heatLevel]}
          fillOpacity={heatLevel === "high" ? 0.5 : 0.3}
          filter={`url(#${glowId})`}
          className={heatLevel === "high" ? "sim-heat-pulse" : undefined}
        />
      )}

      <path
        d={TUBE_OUTLINE_PATH}
        stroke={isDragOver ? "var(--sim-accent-700)" : "var(--sim-border)"}
        strokeWidth={isDragOver ? 4 : 3}
        strokeDasharray={isDragOver ? "6 4" : undefined}
        fill="none"
        strokeLinecap="round"
      />

      <line x1="28" y1={TUBE_TOP_Y} x2="84" y2={TUBE_TOP_Y} stroke="var(--sim-border)" strokeWidth="3" />
    </svg>
  );
}

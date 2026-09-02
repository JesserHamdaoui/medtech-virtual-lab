"use client";

import { useId, useState } from "react";
import { SmokeLevel } from "./types";

interface WatchGlassProps {
  drops: number;
  onSampleDrop?: () => void;
  isIgnited: boolean;
  flameColor?: string;
  smokeLevel?: SmokeLevel;
}

const DISH_CENTER_X = 100;
const DISH_CENTER_Y = 240;
const DISH_RX = 90;
const DISH_RY = 26;

// Puddle grows toward the dish's own radius as more drops are added, so
// the liquid's footprint visibly spreads across the glass rather than
// staying a fixed blob. Capped short of the rim so it never touches the
// dish outline.
const MAX_PUDDLE_DROPS = 10;
const MIN_PUDDLE_SCALE = 0.22;
const MAX_PUDDLE_SCALE = 0.85;

function puddleScale(drops: number): number {
  const t = Math.min(drops, MAX_PUDDLE_DROPS) / MAX_PUDDLE_DROPS;
  return MIN_PUDDLE_SCALE + t * (MAX_PUDDLE_SCALE - MIN_PUDDLE_SCALE);
}

const SMOKE_PUFF_COUNT: Record<SmokeLevel, number> = {
  none: 0,
  light: 1,
  moderate: 2,
  heavy: 3,
};

/**
 * A shallow watch glass rather than a test tube, matching the combustion
 * procedure in the manual: a few drops of sample are placed directly on
 * the glass and ignited, no dropper reagent involved. Accepts the active
 * sample's own dropper as a drop target.
 */
export default function WatchGlass({
  drops,
  onSampleDrop,
  isIgnited,
  flameColor,
  smokeLevel = "none",
}: WatchGlassProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const puffId = useId();

  const puffCount = isIgnited ? SMOKE_PUFF_COUNT[smokeLevel] : 0;

  const scale = puddleScale(drops);

  return (
    <svg
      width="320"
      height="300"
      viewBox="0 0 320 300"
      fill="none"
      onDragOver={(e) => {
        if (!onSampleDrop) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = "copy";
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(e) => {
        if (!onSampleDrop) return;
        e.preventDefault();
        setIsDragOver(false);
        const kind = e.dataTransfer.getData("application/x-sample-dropper");
        if (kind) onSampleDrop();
      }}
    >
      <g transform="translate(60, 0)">
        {isIgnited && flameColor && (
          <g>
            <ellipse
              cx={DISH_CENTER_X}
              cy={DISH_CENTER_Y - 52}
              rx="14"
              ry="36"
              fill={flameColor}
              opacity="0.85"
              className="sim-flame-flicker"
            />
            <ellipse
              cx={DISH_CENTER_X}
              cy={DISH_CENTER_Y - 42}
              rx="7"
              ry="20"
              fill="#fff7d6"
              opacity="0.9"
              className="sim-flame-flicker"
            />
            {Array.from({ length: puffCount }).map((_, i) => (
              <circle
                key={`${puffId}-${i}`}
                cx={DISH_CENTER_X + (i - 1) * 14}
                cy={DISH_CENTER_Y - 90 - i * 20}
                r={9 + i * 3}
                fill="#4a4a4a"
                opacity={0.35 - i * 0.06}
                className="sim-smoke-rise"
                style={{ animationDelay: `${i * 0.4}s` }}
              />
            ))}
          </g>
        )}

        {drops > 0 && (
          <ellipse
            cx={DISH_CENTER_X}
            cy={DISH_CENTER_Y}
            rx={DISH_RX * scale}
            ry={DISH_RY * scale}
            fill="var(--sim-accent-100)"
            className="transition-all duration-300 ease-out"
          />
        )}

        <ellipse
          cx={DISH_CENTER_X}
          cy={DISH_CENTER_Y}
          rx={DISH_RX}
          ry={DISH_RY}
          fill="none"
          stroke={isDragOver ? "var(--sim-accent-700)" : "var(--sim-border)"}
          strokeWidth={isDragOver ? 4 : 3}
          strokeDasharray={isDragOver ? "6 4" : undefined}
        />
        <path
          d={`M${DISH_CENTER_X - DISH_RX} ${DISH_CENTER_Y} a${DISH_RX} ${DISH_RY * 1.6} 0 0 0 ${DISH_RX * 2} 0`}
          fill="none"
          stroke="var(--sim-border)"
          strokeWidth="3"
        />
      </g>
    </svg>
  );
}

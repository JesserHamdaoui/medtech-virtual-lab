"use client";

import { faGaugeHigh } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SIM_SPEEDS, SimSpeed } from "./simSpeed";

interface SpeedControlProps {
  speed: SimSpeed;
  onChange: (speed: SimSpeed) => void;
}

/** A row of buttons that sets how fast lab time runs against real time. */
export default function SpeedControl({ speed, onChange }: SpeedControlProps) {
  return (
    <div role="group" aria-label="Simulation speed" className="flex items-center gap-2">
      <FontAwesomeIcon icon={faGaugeHigh} aria-hidden className="text-[var(--sim-label)]" />
      <div className="flex border-2 border-[var(--sim-border)]">
        {SIM_SPEEDS.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            aria-pressed={option === speed}
            className={`px-2 py-1.5 text-xs font-bold tabular-nums cursor-pointer border-r-2 last:border-r-0 border-[var(--sim-border)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sim-accent-700)] ${
              option === speed
                ? "bg-[var(--sim-accent-500)] text-white"
                : "bg-[var(--sim-neutral-0)] text-[var(--sim-neutral-900)] hover:bg-[var(--sim-neutral-100)]"
            }`}
          >
            {option}×
          </button>
        ))}
      </div>
    </div>
  );
}

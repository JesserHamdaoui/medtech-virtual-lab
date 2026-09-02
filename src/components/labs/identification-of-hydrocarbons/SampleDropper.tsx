"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeDropper } from "@fortawesome/free-solid-svg-icons";
import { Card } from "../shared/ui/Card";

interface SampleDropperProps {
  sampleLabel: string;
  disabled?: boolean;
}

/**
 * Drags the active unknown sample itself (not a reagent) onto the watch
 * glass for the combustion test — the manual runs this test straight on
 * the sample, no added chemical.
 */
export default function SampleDropper({ sampleLabel, disabled }: SampleDropperProps) {
  return (
    <Card
      draggable={!disabled}
      onDragStart={(e) => {
        if (disabled) {
          e.preventDefault();
          return;
        }
        e.dataTransfer.setData("application/x-sample-dropper", "sample");
        e.dataTransfer.effectAllowed = "copy";
      }}
      style={{ backgroundColor: "var(--sim-accent-tint-10)", opacity: disabled ? 0.45 : 1 }}
      className={`flex items-center gap-3 px-3 py-2.5 select-none ${
        disabled ? "cursor-not-allowed" : "cursor-grab active:cursor-grabbing"
      }`}
    >
      <FontAwesomeIcon
        icon={faEyeDropper}
        style={{ color: "var(--sim-accent-500)" }}
        className="w-6 h-6 shrink-0"
      />
      <span className="text-xs font-semibold leading-tight text-[var(--sim-neutral-600)]">
        {sampleLabel} Dropper
      </span>
    </Card>
  );
}

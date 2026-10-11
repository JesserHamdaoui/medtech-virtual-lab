"use client";

import { HydrocarbonInfo } from "./types";

interface SampleCardProps {
  hydrocarbon: HydrocarbonInfo;
  disabled?: boolean;
}

export default function SampleCard({ hydrocarbon, disabled }: SampleCardProps) {
  return (
    <div
      draggable={!disabled}
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", hydrocarbon.id);
        e.dataTransfer.effectAllowed = "copy";
      }}
      className={`px-4 py-2 text-sm font-bold tracking-wide text-[var(--sim-neutral-900)] bg-[var(--sim-panel-bg)] border-2 border-[var(--sim-border)] shadow-[var(--sim-shadow-raised)] select-none transition-opacity duration-100 ${
        disabled
          ? "opacity-40 cursor-not-allowed"
          : "cursor-grab active:cursor-grabbing"
      }`}
    >
      {hydrocarbon.label}
    </div>
  );
}

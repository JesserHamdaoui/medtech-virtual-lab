"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFire } from "@fortawesome/free-solid-svg-icons";
import { HeatLevel } from "./types";

interface OutcomeCardProps {
  outcome: {
    label: string;
    detail: string;
    heatLevel?: HeatLevel;
  };
}

const HEAT_LABEL: Record<"noticeable" | "high", string> = {
  noticeable: "Noticeable heat",
  high: "Uncomfortably hot, safety concern",
};

export default function OutcomeCard({ outcome }: OutcomeCardProps) {
  return (
    <div className="absolute bottom-4 right-4 flex flex-col gap-1 px-2.5 py-2 max-w-[16rem] border-2 border-[var(--sim-border)] bg-[var(--sim-neutral-0)] shadow-[var(--sim-shadow-raised)]">
      <span className="text-xs font-bold text-[var(--sim-neutral-900)]">{outcome.label}</span>
      <span className="text-[0.7rem] leading-snug text-[var(--sim-neutral-500)]">
        {outcome.detail}
      </span>
      {outcome.heatLevel && outcome.heatLevel !== "none" && (
        <span className="flex items-center gap-1.5 text-[0.7rem] font-semibold text-[#c2410c]">
          <FontAwesomeIcon icon={faFire} className="w-3 h-3" />
          {HEAT_LABEL[outcome.heatLevel]}
        </span>
      )}
    </div>
  );
}

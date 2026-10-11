"use client";

import { MAX_DROPS_PER_REAGENT, REAGENTS, ReagentId } from "./types";
import ReagentBottle from "./ReagentBottle";

const SOLUBILITY_REAGENT_IDS = ["water", "ligroin"] as const;

interface SolubilityTestPanelProps {
  /** Reagent whose dropper is currently on the bench. */
  dropper: string;
  onPick: (reagentId: ReagentId) => void;
}

export default function SolubilityTestPanel({
  dropper,
  onPick,
}: SolubilityTestPanelProps) {
  const reagents = REAGENTS.filter((r) =>
    (SOLUBILITY_REAGENT_IDS as readonly string[]).includes(r.id),
  );

  return (
    <div className="space-y-3">
      <p className="text-xs text-[var(--sim-neutral-500)]">
        Pick up a dropper bottle, then click the dropper over the test tube to
        add one drop (max {MAX_DROPS_PER_REAGENT}).
      </p>
      <div className="flex flex-col gap-3">
        {reagents.map((reagent) => (
          <ReagentBottle
            key={reagent.id}
            reagent={reagent}
            active={dropper === reagent.id}
            onPick={() => onPick(reagent.id)}
          />
        ))}
      </div>
    </div>
  );
}

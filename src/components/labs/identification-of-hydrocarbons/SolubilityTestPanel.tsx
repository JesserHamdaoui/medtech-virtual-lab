"use client";

import { MAX_DROPS_PER_REAGENT, REAGENTS, SolubilityTestState } from "./types";
import ReagentBottle from "./ReagentBottle";

const SOLUBILITY_REAGENT_IDS = ["water", "ligroin"] as const;

interface SolubilityTestPanelProps {
  state: SolubilityTestState;
}

export default function SolubilityTestPanel({ state }: SolubilityTestPanelProps) {
  const reagents = REAGENTS.filter((r) =>
    (SOLUBILITY_REAGENT_IDS as readonly string[]).includes(r.id),
  );

  return (
    <div className="space-y-3">
      <p className="text-xs text-[var(--sim-neutral-500)]">
        Drag a dropper bottle onto the test tube to add one drop (max {MAX_DROPS_PER_REAGENT}).
      </p>
      <div className="flex flex-col gap-3">
        {reagents.map((reagent) => {
          const drops =
            reagent.id === "water" ? state.waterDrops : state.ligroinDrops;
          return (
            <ReagentBottle
              key={reagent.id}
              reagent={reagent}
              disabled={drops >= MAX_DROPS_PER_REAGENT}
            />
          );
        })}
      </div>
    </div>
  );
}

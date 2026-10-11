"use client";

import { MAX_DROPS_PER_REAGENT, REAGENTS, ReagentId } from "./types";
import ReagentBottle from "./ReagentBottle";

interface ReagentTestPanelProps {
  reagentId: ReagentId;
  /** Reagent whose dropper is currently on the bench. */
  dropper: string;
  onPick: (reagentId: ReagentId) => void;
}

export default function ReagentTestPanel({
  reagentId,
  dropper,
  onPick,
}: ReagentTestPanelProps) {
  const reagent = REAGENTS.find((r) => r.id === reagentId);
  if (!reagent) return null;

  return (
    <div className="space-y-3">
      <p className="text-xs text-[var(--sim-neutral-500)]">
        Pick up the dropper bottle, then click the dropper over the test tube
        to add one drop (max {MAX_DROPS_PER_REAGENT}).
      </p>
      <ReagentBottle
        reagent={reagent}
        active={dropper === reagent.id}
        onPick={() => onPick(reagent.id)}
      />
    </div>
  );
}

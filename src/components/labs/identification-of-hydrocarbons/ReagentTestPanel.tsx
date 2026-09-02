"use client";

import { MAX_DROPS_PER_REAGENT, REAGENTS, ReagentId } from "./types";
import ReagentBottle from "./ReagentBottle";

interface ReagentTestPanelProps {
  reagentId: ReagentId;
  drops: number;
}

export default function ReagentTestPanel({ reagentId, drops }: ReagentTestPanelProps) {
  const reagent = REAGENTS.find((r) => r.id === reagentId);
  if (!reagent) return null;

  return (
    <div className="space-y-3">
      <p className="text-xs text-[var(--sim-neutral-500)]">
        Drag the dropper bottle onto the test tube to add one drop (max {MAX_DROPS_PER_REAGENT}).
      </p>
      <ReagentBottle reagent={reagent} disabled={drops >= MAX_DROPS_PER_REAGENT} />
    </div>
  );
}

"use client";

import { MAX_DROPS_PER_REAGENT } from "./types";
import SampleDropper from "./SampleDropper";
import { SAMPLE_PAYLOAD } from "./unity/protocol";

interface CombustionTestPanelProps {
  sampleLabel: string;
  /** What the dropper on the bench is holding, if anything. */
  dropper: string;
  onPick: () => void;
}

export default function CombustionTestPanel({
  sampleLabel,
  dropper,
  onPick,
}: CombustionTestPanelProps) {
  return (
    <div className="space-y-3">
      <p className="text-xs text-[var(--sim-neutral-500)]">
        Pick up the sample dropper, click it over the watch glass to add a
        drop, then ignite (max {MAX_DROPS_PER_REAGENT}).
      </p>
      <SampleDropper
        sampleLabel={sampleLabel}
        active={dropper === SAMPLE_PAYLOAD}
        onPick={onPick}
      />
    </div>
  );
}

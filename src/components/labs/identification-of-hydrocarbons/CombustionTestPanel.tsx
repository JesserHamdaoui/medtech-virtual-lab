"use client";

import { MAX_DROPS_PER_REAGENT } from "./types";
import SampleDropper from "./SampleDropper";

interface CombustionTestPanelProps {
  sampleLabel: string;
  drops: number;
}

export default function CombustionTestPanel({ sampleLabel, drops }: CombustionTestPanelProps) {
  return (
    <div className="space-y-3">
      <p className="text-xs text-[var(--sim-neutral-500)]">
        Drag the sample dropper onto the watch glass, then ignite (max {MAX_DROPS_PER_REAGENT}).
      </p>
      <SampleDropper sampleLabel={sampleLabel} disabled={drops >= MAX_DROPS_PER_REAGENT} />
    </div>
  );
}

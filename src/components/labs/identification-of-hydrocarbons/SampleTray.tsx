"use client";

import { HYDROCARBONS, HydrocarbonId } from "./types";
import SampleCard from "./SampleCard";

interface SampleTrayProps {
  assignedHydrocarbons: Set<HydrocarbonId>;
}

export default function SampleTray({ assignedHydrocarbons }: SampleTrayProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 border-l-2 border-[var(--sim-border)] bg-[var(--sim-neutral-50)]">
      <span className="text-xs font-bold tracking-widest text-[var(--sim-label)] uppercase mr-1">
        Samples
      </span>
      {HYDROCARBONS.map((hc) => (
        <SampleCard
          key={hc.id}
          hydrocarbon={hc}
          disabled={assignedHydrocarbons.has(hc.id)}
        />
      ))}
    </div>
  );
}

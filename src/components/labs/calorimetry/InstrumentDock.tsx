import { ReactNode } from "react";
import PrimaryReadout from "./PrimaryReadout";
import StatReadout from "./StatReadout";
import StatusChip from "./StatusChip";
import { StationStatus } from "./stationStatus";

interface InstrumentDockProps {
  status: StationStatus;
  /** The station's buttons, shown at the right end. */
  children?: ReactNode;
}

/**
 * The one strip along the bottom of the canvas: the station's main reading,
 * the smaller values beside it, where it is at, and what can be done. It
 * keeps one height on every station so nothing moves when the tab changes.
 */
export default function InstrumentDock({ status, children }: InstrumentDockProps) {
  return (
    <div className="absolute bottom-0 inset-x-0 min-h-20 flex flex-wrap items-center gap-x-6 gap-y-2 border-t-2 border-[var(--sim-border)] bg-[var(--sim-neutral-0)] px-4 py-2">
      <PrimaryReadout {...status.primary} />
      <div className="flex flex-wrap items-center gap-x-5 gap-y-1 flex-1 min-w-0 border-l-2 border-[var(--sim-border-subtle)] pl-5">
        {status.stats.map((stat) => (
          <StatReadout key={stat.label} {...stat} />
        ))}
      </div>
      <StatusChip {...status.status} />
      <div className="flex items-center gap-2">{children}</div>
    </div>
  );
}

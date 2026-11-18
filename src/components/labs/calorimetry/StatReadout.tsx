interface StatReadoutProps {
  label: string;
  value: string;
}

/** A small label over a value, for the secondary numbers in the dock. */
export default function StatReadout({ label, value }: StatReadoutProps) {
  return (
    <div className="flex flex-col gap-0.5 min-w-0">
      <span className="text-[10px] font-bold tracking-widest uppercase text-[var(--sim-label)] whitespace-nowrap">
        {label}
      </span>
      <span className="font-mono text-sm font-semibold tabular-nums text-[var(--sim-neutral-900)] whitespace-nowrap">
        {value}
      </span>
    </div>
  );
}

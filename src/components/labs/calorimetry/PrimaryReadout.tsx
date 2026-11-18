interface PrimaryReadoutProps {
  label: string;
  value: string;
  unit: string;
}

/** The station's one big number, like the display on the instrument itself. */
export default function PrimaryReadout({ label, value, unit }: PrimaryReadoutProps) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] font-bold tracking-widest uppercase text-[var(--sim-label)] whitespace-nowrap">
        {label}
      </span>
      <span className="flex items-baseline gap-1 whitespace-nowrap">
        <span className="font-mono text-3xl font-semibold tabular-nums text-[var(--sim-neutral-900)] min-w-[5ch]">
          {value}
        </span>
        <span className="text-sm font-semibold text-[var(--sim-neutral-600)]">{unit}</span>
      </span>
    </div>
  );
}

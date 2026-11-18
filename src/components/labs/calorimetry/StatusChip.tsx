import { StatusTone } from "./stationStatus";

const DOT: Record<StatusTone, string> = {
  idle: "bg-[var(--sim-neutral-300)]",
  active: "bg-orange-500 animate-pulse",
  done: "bg-green-600",
};

interface StatusChipProps {
  tone: StatusTone;
  label: string;
}

/** A coloured dot and a short word for where a station is at. */
export default function StatusChip({ tone, label }: StatusChipProps) {
  return (
    <span className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase text-[var(--sim-label)] whitespace-nowrap">
      <span aria-hidden className={`h-2.5 w-2.5 rounded-full ${DOT[tone]}`} />
      {label}
    </span>
  );
}

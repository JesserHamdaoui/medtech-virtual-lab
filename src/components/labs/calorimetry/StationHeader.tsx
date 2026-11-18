import DockButton from "./DockButton";

interface StationHeaderProps {
  label: string;
  /** What to do next, in one line. */
  instruction: string;
  /** Zero-based position of the station among its section's stations. */
  stepIndex: number;
  stepCount: number;
  onReset: () => void;
  resetDisabled: boolean;
}

/** The slim bar above the 3D bench: where the student is and what to do next. */
export default function StationHeader({
  label,
  instruction,
  stepIndex,
  stepCount,
  onReset,
  resetDisabled,
}: StationHeaderProps) {
  return (
    <div className="flex items-center gap-4 border-b-2 border-[var(--sim-border)] bg-[var(--sim-neutral-0)] px-4 py-2 text-left">
      <div className="flex flex-col min-w-0 flex-1">
        <span className="text-xs font-bold tracking-widest uppercase text-[var(--sim-label)]">
          {label}
        </span>
        <p className="text-sm text-[var(--sim-neutral-900)]">{instruction}</p>
      </div>
      <span className="text-[10px] font-bold tracking-widest uppercase text-[var(--sim-label)] whitespace-nowrap">
        Step {stepIndex + 1} of {stepCount}
      </span>
      <DockButton onClick={onReset} disabled={resetDisabled}>
        Reset bench
      </DockButton>
    </div>
  );
}

interface ProgressBarProps {
  /** 0..1. */
  value: number;
  /** On the active tab's filled background the bar turns white. */
  onActive: boolean;
}

/** A thin bar under a tab label showing how far the lab has got. */
export default function ProgressBar({ value, onActive }: ProgressBarProps) {
  const percent = Math.round(value * 100);
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent}
      aria-label="Lab progress"
      className={`flex items-center gap-2 w-full max-w-48 ${onActive ? "text-white/80" : "text-[var(--sim-neutral-500)]"}`}
    >
      <div className={`h-1.5 flex-1 ${onActive ? "bg-white/30" : "bg-[var(--sim-neutral-200)]"}`}>
        <div
          className={`h-full transition-[width] duration-200 ${onActive ? "bg-white" : "bg-[var(--sim-accent-500)]"}`}
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="text-[10px] font-semibold tabular-nums w-8 text-right">{percent}%</span>
    </div>
  );
}

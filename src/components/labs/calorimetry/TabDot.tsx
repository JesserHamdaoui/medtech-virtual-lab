interface TabDotProps {
  /** On the active tab's filled background the dot turns white. */
  onActive: boolean;
}

/** A small round marker on a tab that has a sample on it. Its radius is inline because the host app zeroes the rounded-* scale. */
export default function TabDot({ onActive }: TabDotProps) {
  return (
    <span
      aria-label="Has a sample"
      role="img"
      style={{ borderRadius: "50%" }}
      className={`inline-block h-2 w-2 shrink-0 ${onActive ? "bg-white" : "bg-[var(--sim-accent-500)]"}`}
    />
  );
}

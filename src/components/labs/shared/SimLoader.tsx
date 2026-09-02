/**
 * Placeholder shown while a sim's chunk (and p5) is loading, matching
 * the real sim's canvas dimensions (600px tall, full width) so there
 * is no layout shift once the sim mounts.
 */
export default function SimLoader() {
  return (
    <div
      className="relative w-full h-[600px] flex items-center justify-center bg-[var(--sim-neutral-50)]"
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-[var(--sim-neutral-200)] border-t-[var(--sim-accent-500)] rounded-full animate-spin" />
        <span className="text-sm font-semibold tracking-widest text-[var(--sim-label)] uppercase">
          Loading simulation…
        </span>
      </div>
    </div>
  );
}

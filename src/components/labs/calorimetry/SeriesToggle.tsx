import { GraphSeries } from "./graphHistory";

interface SeriesToggleProps {
  series: GraphSeries;
  on: boolean;
  onToggle: () => void;
}

/** A button that shows or hides one line of the graph, with that line's colour beside its name. */
export default function SeriesToggle({ series, on, onToggle }: SeriesToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={on}
      className={`flex items-center gap-2 border-2 px-3 py-1.5 text-xs font-bold cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sim-accent-700)] ${
        on
          ? "border-[var(--sim-border)] bg-[var(--sim-neutral-0)] text-[var(--sim-neutral-900)]"
          : "border-dashed border-[var(--sim-neutral-300)] bg-[var(--sim-neutral-50)] text-[var(--sim-neutral-500)]"
      }`}
    >
      <span aria-hidden className="h-0.5 w-4" style={{ backgroundColor: on ? series.color : "var(--sim-neutral-300)" }} />
      {series.label}
    </button>
  );
}

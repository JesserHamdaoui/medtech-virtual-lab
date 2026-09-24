"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeDropper } from "@fortawesome/free-solid-svg-icons";

interface SampleDropperProps {
  sampleLabel: string;
  disabled?: boolean;
  /** True while the sample dropper is the one standing on the bench. */
  active?: boolean;
  onPick: () => void;
}

/**
 * Picks up the active unknown sample itself (not a reagent) for the combustion
 * test — the manual runs that test straight on the sample, no added chemical.
 * Pressing this stands its dropper over the watch glass; clicking the dropper
 * on the bench is what actually adds a drop.
 */
export default function SampleDropper({
  sampleLabel,
  disabled,
  active,
  onPick,
}: SampleDropperProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      aria-pressed={active}
      onClick={onPick}
      style={{
        backgroundColor: "var(--sim-accent-tint-10)",
        opacity: disabled ? 0.45 : 1,
        borderColor: active ? "var(--sim-accent-500)" : "var(--sim-border)",
      }}
      className={`w-full flex items-center gap-3 px-3 py-2.5 text-left border-2 select-none transition-colors duration-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sim-accent-700)] ${
        disabled ? "cursor-not-allowed" : "cursor-pointer hover:brightness-95"
      }`}
    >
      <FontAwesomeIcon
        icon={faEyeDropper}
        style={{ color: "var(--sim-accent-500)" }}
        className="w-6 h-6 shrink-0"
      />
      <span className="text-xs font-semibold leading-tight text-[var(--sim-neutral-600)]">
        {sampleLabel} Dropper
      </span>
    </button>
  );
}

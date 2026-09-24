"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeDropper } from "@fortawesome/free-solid-svg-icons";
import { ReagentInfo } from "./types";

interface ReagentBottleProps {
  reagent: ReagentInfo;
  disabled?: boolean;
  /** True while this reagent's dropper is the one standing on the bench. */
  active?: boolean;
  onPick: () => void;
}

/**
 * Picks up a reagent. Nothing is dragged any more: pressing this puts the
 * reagent's dropper on the 3D bench, and the drops are added by clicking the
 * dropper itself over the glassware.
 */
export default function ReagentBottle({
  reagent,
  disabled,
  active,
  onPick,
}: ReagentBottleProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      aria-pressed={active}
      onClick={onPick}
      style={{
        backgroundColor: `${reagent.color}14`,
        opacity: disabled ? 0.45 : 1,
        borderColor: active ? reagent.color : "var(--sim-border)",
      }}
      className={`w-full flex items-center gap-3 px-3 py-2.5 text-left border-2 select-none transition-colors duration-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sim-accent-700)] ${
        disabled ? "cursor-not-allowed" : "cursor-pointer hover:brightness-95"
      }`}
    >
      <FontAwesomeIcon
        icon={faEyeDropper}
        style={{ color: reagent.color }}
        className="w-6 h-6 shrink-0"
      />
      <span className="text-xs font-semibold leading-tight text-[var(--sim-neutral-600)]">
        {reagent.label}
      </span>
    </button>
  );
}

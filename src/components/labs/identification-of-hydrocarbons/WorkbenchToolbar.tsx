"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsRotate, faFire, faTableColumns, faVial } from "@fortawesome/free-solid-svg-icons";

interface WorkbenchToolbarProps {
  onReset: () => void;
  splitView: boolean;
  onToggleSplitView: () => void;
  canShake: boolean;
  onShake: () => void;
  canIgnite: boolean;
  onIgnite: () => void;
}

export default function WorkbenchToolbar({
  onReset,
  splitView,
  onToggleSplitView,
  canShake,
  onShake,
  canIgnite,
  onIgnite,
}: WorkbenchToolbarProps) {
  return (
    <div className="absolute top-0 right-0 flex gap-2 p-4">
      <button
        type="button"
        onClick={onToggleSplitView}
        title={splitView ? "Show only the selected sample" : "Compare all three samples"}
        aria-label="Compare samples"
        aria-pressed={splitView}
        className={
          splitView
            ? "w-10 h-10 flex items-center justify-center bg-[var(--sim-accent-500)] border-2 border-[var(--sim-border)] shadow-[var(--sim-shadow-pressed)] text-[var(--sim-neutral-0)] cursor-pointer transition-[background-color,box-shadow,transform] duration-100 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sim-accent-700)] focus-visible:ring-offset-2"
            : "w-10 h-10 flex items-center justify-center bg-[var(--sim-panel-bg)] border-2 border-[var(--sim-border)] shadow-[var(--sim-shadow-raised)] text-[var(--sim-neutral-900)] cursor-pointer hover:bg-[var(--sim-neutral-100)] active:shadow-[var(--sim-shadow-pressed)] active:translate-x-[2px] active:translate-y-[2px] transition-[background-color,box-shadow,transform] duration-100 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sim-accent-700)] focus-visible:ring-offset-2"
        }
      >
        <FontAwesomeIcon icon={faTableColumns} />
      </button>

      <button
        type="button"
        onClick={onReset}
        title="Reset"
        aria-label="Reset"
        className="w-10 h-10 flex items-center justify-center bg-[var(--sim-panel-bg)] border-2 border-[var(--sim-border)] shadow-[var(--sim-shadow-raised)] text-[var(--sim-neutral-900)] cursor-pointer hover:bg-[var(--sim-neutral-100)] active:shadow-[var(--sim-shadow-pressed)] active:translate-x-[2px] active:translate-y-[2px] transition-[background-color,box-shadow,transform] duration-100 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sim-accent-700)] focus-visible:ring-offset-2"
      >
        <FontAwesomeIcon icon={faArrowsRotate} />
      </button>

      <button
        type="button"
        onClick={onShake}
        disabled={!canShake}
        title="Shake"
        aria-label="Shake"
        className={
          canShake
            ? "w-10 h-10 flex items-center justify-center bg-[var(--sim-panel-bg)] border-2 border-[var(--sim-border)] shadow-[var(--sim-shadow-raised)] text-[var(--sim-neutral-900)] cursor-pointer hover:bg-[var(--sim-neutral-100)] active:shadow-[var(--sim-shadow-pressed)] active:translate-x-[2px] active:translate-y-[2px] transition-[background-color,box-shadow,transform] duration-100 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sim-accent-700)] focus-visible:ring-offset-2"
            : "w-10 h-10 flex items-center justify-center bg-[var(--sim-neutral-100)] border-2 border-[var(--sim-neutral-300)] text-[var(--sim-neutral-300)] cursor-not-allowed"
        }
      >
        <FontAwesomeIcon icon={faVial} />
      </button>

      <button
        type="button"
        onClick={onIgnite}
        disabled={!canIgnite}
        title="Ignite"
        aria-label="Ignite"
        className={
          canIgnite
            ? "w-10 h-10 flex items-center justify-center bg-[var(--sim-panel-bg)] border-2 border-[var(--sim-border)] shadow-[var(--sim-shadow-raised)] text-[var(--sim-neutral-900)] cursor-pointer hover:bg-[var(--sim-neutral-100)] active:shadow-[var(--sim-shadow-pressed)] active:translate-x-[2px] active:translate-y-[2px] transition-[background-color,box-shadow,transform] duration-100 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sim-accent-700)] focus-visible:ring-offset-2"
            : "w-10 h-10 flex items-center justify-center bg-[var(--sim-neutral-100)] border-2 border-[var(--sim-neutral-300)] text-[var(--sim-neutral-300)] cursor-not-allowed"
        }
      >
        <FontAwesomeIcon icon={faFire} />
      </button>
    </div>
  );
}

"use client";

import { ReactNode } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp, faCircleInfo } from "@fortawesome/free-solid-svg-icons";

interface TestSectionProps {
  label: string;
  isOpen: boolean;
  onToggle: () => void;
  hasActivity?: boolean;
  /** 0-1 completion, rendered as a thin progress bar under the header. */
  progress?: number;
  onShowInstructions?: () => void;
  children?: ReactNode;
}

export default function TestSection({
  label,
  isOpen,
  onToggle,
  hasActivity,
  progress = 0,
  onShowInstructions,
  children,
}: TestSectionProps) {
  const isDone = progress >= 1;
  return (
    <div className="border-b-2 border-[var(--sim-border)] last:border-b-0">
      <div className="w-full flex items-center gap-2 px-4 py-3 bg-[var(--sim-neutral-50)] hover:bg-[var(--sim-neutral-100)] transition-colors duration-100">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          className="flex-1 flex items-center justify-between gap-2 text-left text-xs font-bold tracking-widest text-[var(--sim-neutral-900)] uppercase cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sim-accent-700)] focus-visible:ring-offset-[-2px]"
        >
          <span className="flex items-center gap-2">
            {label}
            {hasActivity && (
              <span
                aria-label="Has recorded activity"
                style={{ borderRadius: "9999px" }}
                className="w-2 h-2 bg-[var(--sim-accent-500)] shrink-0"
              />
            )}
          </span>
          <FontAwesomeIcon icon={isOpen ? faChevronUp : faChevronDown} className="text-[var(--sim-accent-600)]" />
        </button>
        {onShowInstructions && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onShowInstructions();
            }}
            aria-label={`${label} instructions`}
            className="shrink-0 w-6 h-6 flex items-center justify-center text-[var(--sim-accent-600)] hover:text-[var(--sim-accent-700)] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sim-accent-700)] focus-visible:ring-offset-[-2px]"
          >
            <FontAwesomeIcon icon={faCircleInfo} />
          </button>
        )}
      </div>
      <div
        role="progressbar"
        aria-label={`${label} progress`}
        aria-valuenow={Math.round(progress * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-1 w-full bg-[var(--sim-neutral-100)]"
      >
        <div
          className={`h-full transition-[width] duration-300 ${
            isDone ? "bg-[var(--sim-accent-500)]" : "bg-[var(--sim-accent-700)]"
          }`}
          style={{ width: `${Math.round(progress * 100)}%` }}
        />
      </div>
      {isOpen && (
        <div className="px-4 py-4 bg-[var(--sim-panel-bg)] space-y-3">
          {children ?? (
            <p className="text-sm text-[var(--sim-neutral-500)]">
              Controls for this test are coming soon.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

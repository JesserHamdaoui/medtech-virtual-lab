"use client";

import { ReactNode } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";

interface TestSectionProps {
  label: string;
  isOpen: boolean;
  onToggle: () => void;
  hasActivity?: boolean;
  children?: ReactNode;
}

export default function TestSection({
  label,
  isOpen,
  onToggle,
  hasActivity,
  children,
}: TestSectionProps) {
  return (
    <div className="border-b-2 border-[var(--sim-border)] last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between gap-2 px-4 py-3 text-left text-xs font-bold tracking-widest text-[var(--sim-neutral-900)] uppercase bg-[var(--sim-neutral-50)] hover:bg-[var(--sim-neutral-100)] cursor-pointer transition-colors duration-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sim-accent-700)] focus-visible:ring-offset-[-2px]"
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

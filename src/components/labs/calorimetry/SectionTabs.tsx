"use client";

import TabDot from "./TabDot";
import { CALORIMETRY_SECTIONS, CalorimetrySection } from "./types";

interface SectionTabsProps {
  activeSection: CalorimetrySection;
  /** The sections that have a sample on one of their stations. */
  occupied: CalorimetrySection[];
  onSelect: (section: CalorimetrySection) => void;
}

export default function SectionTabs({ activeSection, occupied, onSelect }: SectionTabsProps) {
  return (
    <div className="flex border-b-2 border-[var(--sim-border)] bg-[var(--sim-neutral-50)]">
      {CALORIMETRY_SECTIONS.map((section) => {
        const isActive = section.id === activeSection;
        return (
          <button
            key={section.id}
            type="button"
            onClick={() => onSelect(section.id)}
            className={`flex-1 flex flex-col items-center gap-1 px-6 py-2.5 border-r-2 last:border-r-0 border-[var(--sim-border)] cursor-pointer transition-colors duration-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sim-accent-700)] focus-visible:ring-offset-[-2px] ${
              isActive
                ? "bg-[var(--sim-accent-500)] text-white"
                : "bg-[var(--sim-neutral-50)] text-[var(--sim-neutral-600)] hover:bg-[var(--sim-neutral-100)]"
            }`}
          >
            <span className="flex items-center gap-2 text-sm font-bold tracking-wide uppercase">
              {section.label}
              {occupied.includes(section.id) && <TabDot onActive={isActive} />}
            </span>
            <span
              className={`text-xs font-semibold ${
                isActive ? "text-white/80" : "text-[var(--sim-neutral-500)]"
              }`}
            >
              {section.subtitle}
            </span>
          </button>
        );
      })}
    </div>
  );
}

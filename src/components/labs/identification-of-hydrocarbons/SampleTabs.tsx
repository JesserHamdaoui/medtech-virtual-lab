"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { HYDROCARBONS, HydrocarbonId, SAMPLES, SampleId } from "./types";

interface SampleTabsProps {
  activeSample: SampleId;
  onSelect: (id: SampleId) => void;
  assignments: Partial<Record<SampleId, HydrocarbonId>>;
  onAssign: (sampleId: SampleId, hydrocarbonId: HydrocarbonId) => void;
  onUnassign: (sampleId: SampleId) => void;
}

function hydrocarbonLabel(id: HydrocarbonId) {
  return HYDROCARBONS.find((hc) => hc.id === id)?.label ?? id;
}

export default function SampleTabs({
  activeSample,
  onSelect,
  assignments,
  onAssign,
  onUnassign,
}: SampleTabsProps) {
  const [dragOverSample, setDragOverSample] = useState<SampleId | null>(null);

  return (
    <div className="flex border-b-2 border-[var(--sim-border)] bg-[var(--sim-neutral-50)]">
      {SAMPLES.map((sample) => {
        const isActive = sample.id === activeSample;
        const assigned = assignments[sample.id];
        const isDragOver = dragOverSample === sample.id;

        return (
          <button
            key={sample.id}
            type="button"
            onClick={() => onSelect(sample.id)}
            onDragOver={(e) => {
              e.preventDefault();
              e.dataTransfer.dropEffect = "copy";
              setDragOverSample(sample.id);
            }}
            onDragLeave={() =>
              setDragOverSample((current) => (current === sample.id ? null : current))
            }
            onDrop={(e) => {
              e.preventDefault();
              setDragOverSample(null);
              const hydrocarbonId = e.dataTransfer.getData("text/plain") as HydrocarbonId;
              if (hydrocarbonId) onAssign(sample.id, hydrocarbonId);
            }}
            className={`flex flex-col items-start gap-1 px-6 py-2.5 border-r-2 border-[var(--sim-border)] cursor-pointer transition-colors duration-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sim-accent-700)] focus-visible:ring-offset-[-2px] ${
              isActive
                ? "bg-[var(--sim-accent-500)] text-white"
                : "bg-[var(--sim-neutral-50)] text-[var(--sim-neutral-600)] hover:bg-[var(--sim-neutral-100)]"
            } ${isDragOver ? "outline outline-2 outline-dashed outline-[var(--sim-accent-900)] outline-offset-[-4px]" : ""}`}
          >
            <span className="text-sm font-bold tracking-wide uppercase">
              {sample.label}
            </span>
            {assigned ? (
              <span
                className={`flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 border-2 ${
                  isActive
                    ? "bg-white text-[var(--sim-accent-700)] border-white"
                    : "bg-[var(--sim-accent-50)] text-[var(--sim-accent-700)] border-[var(--sim-accent-700)]"
                }`}
              >
                {hydrocarbonLabel(assigned)}
                <span
                  role="button"
                  tabIndex={-1}
                  onClick={(e) => {
                    e.stopPropagation();
                    onUnassign(sample.id);
                  }}
                  className="hover:opacity-70 cursor-pointer"
                >
                  <FontAwesomeIcon icon={faXmark} />
                </span>
              </span>
            ) : (
              <span
                className={`text-xs italic px-2 py-0.5 border-2 border-dashed ${
                  isActive
                    ? "text-white/70 border-white/50"
                    : "text-[var(--sim-neutral-500)] border-[var(--sim-border-subtle)]"
                }`}
              >
                Drop sample here
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

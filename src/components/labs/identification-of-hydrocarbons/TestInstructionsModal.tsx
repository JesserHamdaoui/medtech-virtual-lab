"use client";

import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { TestProcedure } from "./types";

interface TestInstructionsModalProps {
  testLabel: string;
  procedures: TestProcedure[];
  onClose: () => void;
}

export default function TestInstructionsModal({
  testLabel,
  procedures,
  onClose,
}: TestInstructionsModalProps) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div
      role="presentation"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${testLabel} instructions`}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md max-h-[80vh] overflow-y-auto bg-[var(--sim-panel-bg)] border-2 border-[var(--sim-border)] shadow-[var(--sim-shadow-raised)]"
      >
        <div className="flex items-center justify-between gap-2 px-4 py-3 border-b-2 border-[var(--sim-border)] bg-[var(--sim-neutral-50)]">
          <span className="text-sm font-bold tracking-widest text-[var(--sim-neutral-900)] uppercase">
            {testLabel}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close instructions"
            className="w-8 h-8 flex items-center justify-center bg-[var(--sim-panel-bg)] border-2 border-[var(--sim-border)] shadow-[var(--sim-shadow-raised)] text-[var(--sim-neutral-900)] cursor-pointer hover:bg-[var(--sim-neutral-100)] active:shadow-[var(--sim-shadow-pressed)] active:translate-x-[2px] active:translate-y-[2px] transition-[background-color,box-shadow,transform] duration-100 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sim-accent-700)] focus-visible:ring-offset-2"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        <div className="px-4 py-4 space-y-4">
          {procedures.map((procedure) => (
            <div key={procedure.title} className="space-y-2">
              {procedures.length > 1 && (
                <h3 className="text-xs font-bold tracking-wide text-[var(--sim-accent-700)] uppercase">
                  {procedure.title}
                </h3>
              )}
              <ol className="list-decimal list-inside space-y-1 text-sm text-[var(--sim-neutral-600)]">
                {procedure.steps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Elasticity } from "./types";

interface ElasticitySelectorProps {
  elasticity: Elasticity;
  handleChangeElasticity: (value: Elasticity) => void;
  isMoving: boolean;
}

export default function ElasticitySelector({
  elasticity,
  handleChangeElasticity,
  isMoving,
}: ElasticitySelectorProps) {
  const [open, setOpen] = useState(false);

  const handleSelect = (value: Elasticity) => {
    handleChangeElasticity(value);
    setOpen(false);
  };

  return (
    <div className="relative w-40">
      <button
        disabled={isMoving}
        onClick={() => setOpen(!open)}
        className={`w-full h-9 px-3 flex justify-between items-center border-2 font-semibold transition-[background-color,box-shadow,transform] duration-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sim-accent-700)] focus-visible:ring-offset-1 ${
          isMoving
            ? "bg-[var(--sim-neutral-200)] text-[var(--sim-neutral-500)] border-[var(--sim-neutral-300)] shadow-none cursor-not-allowed"
            : `bg-[var(--sim-accent-500)] text-white border-[var(--sim-accent-900)] shadow-[var(--sim-shadow-raised-accent)] hover:bg-[var(--sim-accent-400)] cursor-pointer ${
                open
                  ? "translate-x-[2px] translate-y-[2px] shadow-[var(--sim-shadow-pressed-accent)]"
                  : ""
              }`
        }`}
      >
        {elasticity === Elasticity.ELASTIC ? "Elastic" : "Inelastic"}
        <span className="ml-2">{open ? "▲" : "▼"}</span>
      </button>

      {open && !isMoving && (
        <ul className="absolute mt-1 w-full bg-[var(--sim-panel-bg)] border-2 border-[var(--sim-border)] shadow-[var(--sim-shadow-raised)] z-10">
          <li
            onClick={() => handleSelect(Elasticity.ELASTIC)}
            className="px-4 py-2 font-medium hover:bg-[var(--sim-accent-50)] cursor-pointer border-b-2 border-[var(--sim-border-subtle)]"
          >
            Elastic
          </li>
          <li
            onClick={() => handleSelect(Elasticity.INELASTIC)}
            className="px-4 py-2 font-medium hover:bg-[var(--sim-accent-50)] cursor-pointer"
          >
            Inelastic
          </li>
        </ul>
      )}
    </div>
  );
}

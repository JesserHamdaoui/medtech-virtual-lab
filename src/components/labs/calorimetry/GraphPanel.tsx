"use client";

import { faExpand } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import GraphModal from "./GraphModal";
import LiveGraph from "./LiveGraph";
import { GraphSample, graphSeriesFor } from "./graphHistory";

interface GraphPanelProps {
  stationId: string;
  samples: GraphSample[];
}

/**
 * The column right of the 3D bench: the live graph of the open station, with a
 * legend that carries each line's current value. A station with nothing to
 * plot keeps the column, so the 3D view doesn't change width between tabs.
 */
export default function GraphPanel({ stationId, samples }: GraphPanelProps) {
  const [open, setOpen] = useState(false);
  const series = graphSeriesFor(stationId);
  const latest = samples.length ? samples[samples.length - 1] : null;

  return (
    <aside className="w-72 shrink-0 flex flex-col gap-3 border-l-2 border-[var(--sim-border)] bg-[var(--sim-neutral-0)] p-3">
      <span className="text-[10px] font-bold tracking-widest uppercase text-[var(--sim-label)]">
        Temperature vs time
      </span>
      {series.length === 0 ? (
        <p className="text-sm text-[var(--sim-neutral-500)]">Nothing to plot at this station. Temperatures are recorded at the other stations.</p>
      ) : (
        <>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open the interactive graph"
            className="group relative block w-full cursor-zoom-in border-2 border-transparent hover:border-[var(--sim-accent-700)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sim-accent-700)]"
          >
            <LiveGraph series={series} samples={samples} />
            <span className="absolute right-1 top-1 flex items-center gap-1 bg-[var(--sim-neutral-0)] px-1.5 py-0.5 text-[10px] font-bold tracking-widest uppercase text-[var(--sim-label)] opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100">
              <FontAwesomeIcon icon={faExpand} aria-hidden />
              Enlarge
            </span>
          </button>
          <ul className="flex flex-col gap-1">
            {series.map((line) => {
              const value = latest ? latest[line.key] : null;
              return (
                <li key={line.key} className="flex items-center gap-2 text-xs text-[var(--sim-neutral-900)]">
                  <span aria-hidden className="h-0.5 w-4" style={{ backgroundColor: line.color }} />
                  <span className="flex-1">{line.label}</span>
                  <span className="font-mono font-semibold tabular-nums">
                    {value === null ? "-" : `${value.toFixed(1)} °C`}
                  </span>
                </li>
              );
            })}
          </ul>
        </>
      )}
      {open && <GraphModal stationId={stationId} samples={samples} onClose={() => setOpen(false)} />}
    </aside>
  );
}

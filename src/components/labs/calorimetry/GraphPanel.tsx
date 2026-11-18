"use client";

import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import GraphModal from "./GraphModal";
import GraphPanelBody from "./GraphPanelBody";
import ResizeHandle from "./ResizeHandle";
import { GraphSample } from "./graphHistory";

/** How wide the panel starts, and how far it may be dragged, px. */
const DEFAULT_WIDTH = 288;
const MIN_WIDTH = 224;
const MAX_WIDTH = 560;
/** Width of the strip left when the panel is collapsed, px. */
const COLLAPSED_WIDTH = 40;

const TITLE = "Temperature vs time";

interface GraphPanelProps {
  stationId: string;
  samples: GraphSample[];
}

/**
 * The column right of the 3D bench, holding the live graph of the open
 * station. Drag its left edge to resize it, or collapse it to a thin strip to
 * give the 3D view the room. A station with nothing to plot keeps the column,
 * so the 3D view doesn't change width between tabs.
 */
export default function GraphPanel({ stationId, samples }: GraphPanelProps) {
  const [open, setOpen] = useState(false);
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const [collapsed, setCollapsed] = useState(false);

  return (
    // The grip sticks out over the panel's left edge, so this wrapper must not clip it.
    <div style={{ width: collapsed ? COLLAPSED_WIDTH : width }} className="relative flex shrink-0">
      {!collapsed && (
        <ResizeHandle value={width} min={MIN_WIDTH} max={MAX_WIDTH} onChange={setWidth} direction={-1} label="Resize the graph panel" />
      )}
      <aside className="flex min-w-0 flex-1 flex-col gap-3 overflow-y-auto border-l-2 border-[var(--sim-border)] bg-[var(--sim-neutral-0)] p-3">
        {collapsed ? (
          <button
            type="button"
            onClick={() => setCollapsed(false)}
            aria-label="Show the graph"
            className="flex flex-col items-center gap-3 text-[var(--sim-label)] cursor-pointer hover:text-[var(--sim-accent-700)]"
          >
            <FontAwesomeIcon icon={faChevronLeft} aria-hidden />
            <span className="text-[10px] font-bold tracking-widest uppercase [writing-mode:vertical-rl]">{TITLE}</span>
          </button>
        ) : (
          <>
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-bold tracking-widest uppercase text-[var(--sim-label)]">{TITLE}</span>
              <button
                type="button"
                onClick={() => setCollapsed(true)}
                aria-label="Hide the graph"
                className="flex h-6 w-6 items-center justify-center text-[var(--sim-label)] cursor-pointer hover:text-[var(--sim-accent-700)]"
              >
                <FontAwesomeIcon icon={faChevronRight} aria-hidden />
              </button>
            </div>
            <GraphPanelBody stationId={stationId} samples={samples} onOpen={() => setOpen(true)} />
          </>
        )}
      </aside>
      {open && <GraphModal stationId={stationId} samples={samples} onClose={() => setOpen(false)} />}
    </div>
  );
}

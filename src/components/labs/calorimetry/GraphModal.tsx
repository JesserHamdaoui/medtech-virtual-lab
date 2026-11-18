"use client";

import { useState } from "react";
import InteractiveGraph from "./InteractiveGraph";
import Modal from "./Modal";
import SeriesToggle from "./SeriesToggle";
import { ALL_GRAPH_SERIES, GraphKey, GraphSample, graphSeriesFor } from "./graphHistory";

interface GraphModalProps {
  /** The station whose lines are shown to start with. */
  stationId: string;
  samples: GraphSample[];
  onClose: () => void;
}

/** The big graph: every recorded line can be turned on, and it keeps drawing while the bench runs. */
export default function GraphModal({ stationId, samples, onClose }: GraphModalProps) {
  const [enabled, setEnabled] = useState<GraphKey[]>(() => graphSeriesFor(stationId).map((s) => s.key));
  const toggle = (key: GraphKey) =>
    setEnabled((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  const shown = ALL_GRAPH_SERIES.filter((s) => enabled.includes(s.key));

  return (
    <Modal
      size="lg"
      title="Temperature vs time"
      description="Hover to read values. Scroll to zoom, then drag to move along the run. Double click shows everything."
      onClose={onClose}
    >
      <div className="flex min-h-0 flex-1 flex-col gap-3 p-5">
        <div className="flex flex-wrap gap-2">
          {ALL_GRAPH_SERIES.map((series) => (
            <SeriesToggle key={series.key} series={series} on={enabled.includes(series.key)} onToggle={() => toggle(series.key)} />
          ))}
        </div>
        <div className="h-[55vh] min-h-72 border-2 border-[var(--sim-border-subtle)]">
          <InteractiveGraph series={shown} samples={samples} />
        </div>
      </div>
    </Modal>
  );
}

import { useEffect, useRef, useState } from "react";
import { GraphSample, appendSample, sampleBench } from "./graphHistory";
import { CalorimetryBench } from "./types";

/** Samples are recorded no closer together than this, s. */
const RECORD_EVERY = 0.25;
/** Matches the bench clock: a long idle gap counts as no more than this, s. */
const MAX_STEP_SECONDS = 1;

/**
 * Records the bench's temperatures as it changes, for the live graph. One
 * recording runs for the whole bench, so switching stations never loses the
 * curve, and resetting the bench (back to `initial`) starts a new one.
 */
export function useGraphHistory(bench: CalorimetryBench, initial: CalorimetryBench): GraphSample[] {
  const [samples, setSamples] = useState<GraphSample[]>([]);
  const clock = useRef({ t: 0, last: 0 });

  useEffect(() => {
    const now = performance.now();

    if (bench === initial) {
      clock.current = { t: 0, last: now };
      setSamples([sampleBench(bench, 0)]);
      return;
    }

    const gap = (now - clock.current.last) / 1000;
    if (gap < RECORD_EVERY) return;
    clock.current = { t: clock.current.t + Math.min(MAX_STEP_SECONDS, gap), last: now };
    const sample = sampleBench(bench, clock.current.t);
    setSamples((prev) => appendSample(prev, sample));
  }, [bench, initial]);

  return samples;
}

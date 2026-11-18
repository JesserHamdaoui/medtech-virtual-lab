import { GraphKey, GraphSample } from "./graphHistory";

/** SVG path for one series. A missing value lifts the pen, so a metal that leaves a station breaks its line. */
export function linePath(
  samples: GraphSample[],
  key: GraphKey,
  x: (t: number) => number,
  y: (v: number) => number,
): string {
  let d = "";
  let pen = false;
  for (const sample of samples) {
    const value = sample[key];
    if (value === null) {
      pen = false;
      continue;
    }
    d += `${pen ? "L" : "M"}${x(sample.t).toFixed(1)} ${y(value).toFixed(1)}`;
    pen = true;
  }
  return d;
}

/** Index of the sample closest in time to t. The samples are in time order. */
export function nearestIndex(samples: GraphSample[], t: number): number {
  let lo = 0;
  let hi = samples.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (samples[mid].t < t) lo = mid + 1;
    else hi = mid;
  }
  if (lo > 0 && Math.abs(samples[lo - 1].t - t) <= Math.abs(samples[lo].t - t)) return lo - 1;
  return lo;
}

/** A time as seconds, and as minutes and seconds once it is past a minute. */
export function formatTime(t: number): string {
  const seconds = Math.round(t);
  if (seconds < 60) return `${seconds} s`;
  return `${seconds} s (${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")})`;
}

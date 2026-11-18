/** A tidy step size (1, 2, 5, 10, 20 ...) that gives about `ticks` divisions of a range. */
export function niceStep(range: number, ticks: number): number {
  const raw = range / ticks;
  const magnitude = 10 ** Math.floor(Math.log10(raw));
  const fraction = raw / magnitude;
  const nice = fraction <= 1 ? 1 : fraction <= 2 ? 2 : fraction <= 5 ? 5 : 10;
  return nice * magnitude;
}

export interface Axis {
  min: number;
  max: number;
  step: number;
}

/** An axis that covers [lo, hi] on tidy tick values, at least `minRange` wide. */
export function niceAxis(lo: number, hi: number, minRange: number, ticks: number): Axis {
  const range = Math.max(hi - lo, minRange);
  const mid = (hi + lo) / 2;
  const step = niceStep(range, ticks);
  return {
    min: Math.floor((mid - range / 2) / step) * step,
    max: Math.ceil((mid + range / 2) / step) * step,
    step,
  };
}

/** Tick values from the axis minimum to its maximum. */
export function ticksOf(axis: Axis): number[] {
  const out: number[] = [];
  for (let v = axis.min; v <= axis.max + axis.step / 2; v += axis.step) out.push(Number(v.toFixed(6)));
  return out;
}

/** Tick values inside [min, max] on multiples of step, for an axis that has been zoomed to a range. */
export function tickValues(min: number, max: number, step: number): number[] {
  const out: number[] = [];
  for (let v = Math.ceil(min / step) * step; v <= max + step / 1000; v += step) out.push(Number(v.toFixed(6)));
  return out;
}

export interface Range {
  min: number;
  max: number;
}

/** The narrowest stretch of time a graph can zoom in to, s. */
export const MIN_VIEW_SECONDS = 2;

/** Moves a range so it stays inside [lo, hi], keeping its width. */
export function clampRange(range: Range, lo: number, hi: number): Range {
  const width = Math.min(range.max - range.min, hi - lo);
  const min = Math.max(lo, Math.min(range.min, hi - width));
  return { min, max: min + width };
}

/** Slides a range by delta, stopping at the ends of [lo, hi]. */
export function panRange(range: Range, delta: number, lo: number, hi: number): Range {
  return clampRange({ min: range.min + delta, max: range.max + delta }, lo, hi);
}

/**
 * Scales a range's width by factor (below 1 zooms in) while the point at
 * `anchor` stays where it is on screen. Returns null once it would show all
 * of [lo, hi], meaning there is nothing left to zoom out of.
 */
export function zoomRange(range: Range, factor: number, anchor: number, lo: number, hi: number): Range | null {
  const width = Math.min(hi - lo, Math.max(MIN_VIEW_SECONDS, (range.max - range.min) * factor));
  if (width >= hi - lo - 1e-9) return null;
  const k = (anchor - range.min) / (range.max - range.min);
  const min = anchor - k * width;
  return clampRange({ min, max: min + width }, lo, hi);
}

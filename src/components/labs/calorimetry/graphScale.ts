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

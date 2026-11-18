import {
  BATH_STATION,
  CUP_STATION,
  CalorimetryBench,
  metalTempOf,
  sampleAt,
} from "./types";

/** One reading of every plotted variable at a moment of the run. null means it doesn't exist then. */
export interface GraphSample {
  /** Seconds since the bench was last reset, counted the way the bench clock counts. */
  t: number;
  bath: number;
  /** The metal sitting in the bath, °C. */
  metalBath: number | null;
  cup: number;
  /** The metal sitting in the cup, °C. */
  metalCup: number | null;
  flask: number;
}

export type GraphKey = Exclude<keyof GraphSample, "t">;

export interface GraphSeries {
  key: GraphKey;
  label: string;
  color: string;
}

/** The most samples kept, so a long session can't grow without bound. */
export const MAX_SAMPLES = 7200;

/** Every plotted line, each with its own colour so they can share one chart. */
export const ALL_GRAPH_SERIES: GraphSeries[] = [
  { key: "bath", label: "Bath water", color: "var(--sim-accent-500)" },
  { key: "metalBath", label: "Metal in bath", color: "#e8590c" },
  { key: "cup", label: "Cup water", color: "#7048e8" },
  { key: "metalCup", label: "Metal in cup", color: "#c2255c" },
  { key: "flask", label: "Flask water", color: "#2f9e44" },
];

const seriesOf = (...keys: GraphKey[]) => ALL_GRAPH_SERIES.filter((series) => keys.includes(series.key));

/** What each station plots. A station missing here has nothing to plot. */
const SERIES_BY_STATION: Record<string, GraphSeries[]> = {
  [BATH_STATION]: seriesOf("bath", "metalBath"),
  [CUP_STATION]: seriesOf("cup", "metalCup"),
  "tin-can-calorimeter": seriesOf("flask"),
};

export function graphSeriesFor(stationId: string): GraphSeries[] {
  return SERIES_BY_STATION[stationId] ?? [];
}

/** Reads every plotted variable off the bench at time t. */
export function sampleBench(bench: CalorimetryBench, t: number): GraphSample {
  const inBath = sampleAt(bench, "metal", BATH_STATION);
  const inCup = sampleAt(bench, "metal", CUP_STATION);
  return {
    t,
    bath: bench.bathTemp,
    metalBath: inBath ? metalTempOf(bench, inBath.id) : null,
    cup: bench.cupTemp,
    metalCup: inCup ? metalTempOf(bench, inCup.id) : null,
    flask: bench.flaskTemp,
  };
}

/** Adds a sample, dropping the oldest ones past the cap. */
export function appendSample(samples: GraphSample[], sample: GraphSample): GraphSample[] {
  const next = [...samples, sample];
  return next.length > MAX_SAMPLES ? next.slice(next.length - MAX_SAMPLES) : next;
}

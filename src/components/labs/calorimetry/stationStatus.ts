import {
  BOILING_POINT,
  CUP_COLD_TEMP,
  CUP_STATION,
  CUP_WATER_GRAMS,
  CalorimetryBench,
  CalorimetrySection,
  FLASK_WATER_GRAMS,
  ROOM_TEMP,
  burnRemaining,
  cupSettled,
  metalTempOf,
  sampleAt,
  scaleReading,
} from "./types";

/** How a status reads at a glance: grey is idle, orange in progress, green done. */
export type StatusTone = "idle" | "active" | "done";

export interface DockStat {
  label: string;
  value: string;
}

/** Everything the instrument dock and the header show for one station. */
export interface StationStatus {
  /** The one big number of the station. */
  primary: { label: string; value: string; unit: string };
  /** Smaller values beside it. */
  stats: DockStat[];
  status: { tone: StatusTone; label: string };
  /** What the student should do next, in one line. */
  instruction: string;
}

/** The bath counts as boiling within this of its ceiling, °C. */
const BOILING_GAP = 0.05;
/** The metal counts as level with the bath within this, °C. */
const METAL_LEVEL_GAP = 0.1;
/** The bath counts as warm above room temperature by this much, °C. */
const WARM_GAP = 0.5;

const celsius = (value: number) => `${value.toFixed(1)} °C`;

function balanceStatus(bench: CalorimetryBench, section: CalorimetrySection, stationId: string): StationStatus {
  const sample = sampleAt(bench, section, stationId);
  const burnt = !!sample && bench.burnt.includes(sample.id);
  return {
    primary: { label: "Mass", value: scaleReading(bench, section), unit: "g" },
    stats: [{ label: "Sample", value: sample ? `${sample.label}${burnt ? " (burnt)" : ""}` : "None" }],
    status: sample ? { tone: "done", label: "Sample on pan" } : { tone: "idle", label: "Empty" },
    instruction: sample
      ? "Read the mass on the display and note it down."
      : "Drag a sample onto the pan to weigh it.",
  };
}

function bathStatus(bench: CalorimetryBench): StationStatus {
  const metal = sampleAt(bench, "metal", "hot-water-bath");
  const boiling = bench.heaterOn && bench.bathTemp >= BOILING_POINT - BOILING_GAP;
  const level = !!metal && Math.abs(metalTempOf(bench, metal.id) - bench.bathTemp) <= METAL_LEVEL_GAP;

  let status: StationStatus["status"];
  if (boiling) status = { tone: "done", label: "Boiling" };
  else if (bench.heaterOn) status = { tone: "active", label: "Heating" };
  else if (bench.bathTemp > ROOM_TEMP + WARM_GAP) status = { tone: "active", label: "Cooling" };
  else status = { tone: "idle", label: "Heater off" };

  let instruction: string;
  if (!metal) instruction = "Drag a metal into the beaker.";
  else if (!bench.heaterOn && bench.bathTemp <= ROOM_TEMP + WARM_GAP) instruction = "Switch the heater on to warm the bath.";
  else if (boiling && level) instruction = "The metal has reached the bath temperature. Move it to the coffee cup.";
  else instruction = "Wait until the bath boils and the metal reaches its temperature.";

  const stats: DockStat[] = [{ label: "Room", value: celsius(ROOM_TEMP) }];
  if (metal) stats.unshift({ label: metal.label, value: celsius(metalTempOf(bench, metal.id)) });

  return {
    primary: { label: "Bath", value: bench.bathTemp.toFixed(1), unit: "°C" },
    stats,
    status,
    instruction,
  };
}

function cupStatus(bench: CalorimetryBench): StationStatus {
  const metal = sampleAt(bench, "metal", CUP_STATION);
  const stats: DockStat[] = [
    { label: "Water", value: `${CUP_WATER_GRAMS} g` },
    { label: "Water start", value: celsius(CUP_COLD_TEMP) },
  ];
  if (metal) {
    stats.push({ label: "Metal in at", value: celsius(bench.cupMetalTemp) });
    stats.push({ label: "ΔT water", value: celsius(bench.cupTemp - CUP_COLD_TEMP) });
  }

  let status: StationStatus["status"];
  if (!metal) status = { tone: "idle", label: "Waiting for metal" };
  else if (cupSettled(bench)) status = { tone: "done", label: "Stable" };
  else status = { tone: "active", label: "Settling" };

  let instruction: string;
  if (!metal) instruction = "Drag the heated metal into the cup.";
  else if (cupSettled(bench)) instruction = "The temperature is stable. Note the final temperature.";
  else instruction = "Wait for the temperature to stop changing.";

  return {
    primary: { label: "Cup water", value: bench.cupTemp.toFixed(1), unit: "°C" },
    stats,
    status,
    instruction,
  };
}

function tinCanStatus(bench: CalorimetryBench): StationStatus {
  const sample = sampleAt(bench, "biomass", "tin-can-calorimeter");
  const burning = !!sample && bench.burning === sample.id;
  const burnt = !!sample && bench.burnt.includes(sample.id);

  const stats: DockStat[] = [
    { label: "Max", value: celsius(bench.flaskMax) },
    { label: "Water", value: `${FLASK_WATER_GRAMS} g` },
  ];
  if (sample) stats.push({ label: "Sample", value: sample.label });
  if (burning) stats.push({ label: "Burn left", value: `${Math.ceil(burnRemaining(bench))} s` });

  let status: StationStatus["status"];
  let instruction: string;
  if (!sample) {
    status = { tone: "idle", label: "Empty" };
    instruction = "Drag a biomass sample onto the dish.";
  } else if (burning) {
    status = { tone: "active", label: "Burning" };
    instruction = "Watch the flask water and note the maximum temperature.";
  } else if (burnt) {
    status = { tone: "done", label: "Burnt out" };
    instruction = "Note the maximum temperature, then weigh the residue on the balance.";
  } else {
    status = { tone: "idle", label: "Ready" };
    instruction = "Light the sample to start heating the flask.";
  }

  return {
    primary: { label: "Flask water", value: bench.flaskTemp.toFixed(1), unit: "°C" },
    stats,
    status,
    instruction,
  };
}

/** Builds what a station's header and dock show from the bench. */
export function buildStationStatus(
  bench: CalorimetryBench,
  section: CalorimetrySection,
  stationId: string,
): StationStatus {
  switch (stationId) {
    case "hot-water-bath":
      return bathStatus(bench);
    case "coffee-cup-calorimeter":
      return cupStatus(bench);
    case "tin-can-calorimeter":
      return tinCanStatus(bench);
    default:
      return balanceStatus(bench, section, stationId);
  }
}

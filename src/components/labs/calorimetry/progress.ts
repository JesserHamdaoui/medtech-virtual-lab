import {
  BATH_STATION,
  BOILING_POINT,
  CUP_COLD_TEMP,
  CUP_STATION,
  CalorimetryBench,
  CalorimetrySection,
  MaterialInfo,
  ROOM_TEMP,
  cupSettled,
  getMaterialsFor,
  metalTempOf,
} from "./types";

/**
 * How far along a lab is. Every sample goes through four milestones, each
 * worth a quarter. A milestone counts in full once done and by how far along
 * it is while under way, and it only ever goes up: a step done once stays done
 * even when the sample moves on. A section's progress is the average over its
 * samples. It counts steps taken, not whether the data is right.
 */

const BOILING_GAP = 0.05;
const METAL_LEVEL_GAP = 0.1;

type Milestones = Record<string, number>;

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const flag = (done: boolean) => (done ? 1 : 0);

/** Metal: weigh it, heat it in the bath, put it in the cup, let the cup settle. */
function metalMilestones(bench: CalorimetryBench, metal: MaterialInfo): Milestones {
  const temp = metalTempOf(bench, metal.id);
  const inBath = bench.placements.metal[BATH_STATION] === metal.id;
  const inCup = bench.placements.metal[CUP_STATION] === metal.id;
  const hot = inBath && bench.heaterOn && bench.bathTemp >= BOILING_POINT - BOILING_GAP && Math.abs(temp - bench.bathTemp) <= METAL_LEVEL_GAP;

  const cupSpan = bench.cupTarget - CUP_COLD_TEMP;
  const settling = inCup && cupSpan > 0 ? (bench.cupTemp - CUP_COLD_TEMP) / cupSpan : 0;

  return {
    weighed: flag(bench.placements.metal.balance === metal.id),
    heated: hot ? 1 : clamp01((temp - ROOM_TEMP) / (BOILING_POINT - ROOM_TEMP)),
    inCup: flag(inCup),
    settled: inCup && cupSettled(bench) ? 1 : clamp01(settling),
  };
}

/** Biomass: weigh it, light it, let it burn out, weigh what is left. */
function biomassMilestones(bench: CalorimetryBench, sample: MaterialInfo): Milestones {
  const burnt = bench.burnt.includes(sample.id);
  const burning = bench.burning === sample.id;
  const burnFraction = burning ? bench.burnTime / (sample.burnSeconds ?? 30) : 0;

  return {
    weighed: flag(bench.placements.biomass.balance === sample.id),
    lit: flag(burning || burnt),
    burnt: burnt ? 1 : clamp01(burnFraction),
    residue: flag(burnt && bench.placements.biomass.balance === sample.id),
  };
}

function milestonesOf(bench: CalorimetryBench, section: CalorimetrySection, material: MaterialInfo): Milestones {
  return section === "metal" ? metalMilestones(bench, material) : biomassMilestones(bench, material);
}

/**
 * Folds what the bench shows right now into its record of progress, keeping
 * the highest value each milestone has reached. Returns the same bench when
 * nothing went up, so an idle bench still costs no render.
 */
export function recordProgress(bench: CalorimetryBench): CalorimetryBench {
  let progress = bench.progress;

  for (const section of ["metal", "biomass"] as const) {
    for (const material of getMaterialsFor(section)) {
      const now = milestonesOf(bench, section, material);
      const before = progress[material.id] ?? {};
      let next: Milestones | null = null;
      for (const [id, value] of Object.entries(now)) {
        if (value > (before[id] ?? 0)) next = { ...(next ?? before), [id]: value };
      }
      if (!next) continue;
      if (progress === bench.progress) progress = { ...progress };
      progress[material.id] = next;
    }
  }

  return progress === bench.progress ? bench : { ...bench, progress };
}

/** A section's progress, 0..1: the average over its samples of their four milestones. */
export function sectionProgress(bench: CalorimetryBench, section: CalorimetrySection): number {
  const materials = getMaterialsFor(section);
  const total = materials.reduce((sum, material) => {
    const milestones = Object.values(bench.progress[material.id] ?? {});
    return sum + milestones.reduce((a, b) => a + b, 0) / 4;
  }, 0);
  return total / materials.length;
}

export type SampleId = "unknown-1" | "unknown-2" | "unknown-3";

export type TestId =
  | "solubility"
  | "bromine"
  | "kmno4"
  | "h2so4"
  | "combustion";

export interface SampleInfo {
  id: SampleId;
  label: string;
}

export interface TestInfo {
  id: TestId;
  label: string;
}

export type HydrocarbonId = "hexane" | "cyclohexene" | "toluene";

export interface HydrocarbonInfo {
  id: HydrocarbonId;
  label: string;
}

export const HYDROCARBONS: HydrocarbonInfo[] = [
  { id: "hexane", label: "Hexane" },
  { id: "cyclohexene", label: "Cyclohexene" },
  { id: "toluene", label: "Toluene" },
];

export const SAMPLES: SampleInfo[] = [
  { id: "unknown-1", label: "Unknown Sample 1" },
  { id: "unknown-2", label: "Unknown Sample 2" },
  { id: "unknown-3", label: "Unknown Sample 3" },
];

export const TESTS: TestInfo[] = [
  { id: "solubility", label: "Solubility Test" },
  { id: "bromine", label: "Bromine Test" },
  { id: "kmno4", label: "Potassium Permanganate Test" },
  { id: "h2so4", label: "Sulfuric Acid Test" },
  { id: "combustion", label: "Combustion Test" },
];

/**
 * Secretly shuffles the 3 known compounds onto the 3 unknown samples,
 * one-to-one, matching how a real unknowns kit is prepared. This is the
 * ground truth the tube reactions are computed against — never shown to
 * the user directly. The tags a user drags onto a sample tab are just
 * their own notes and don't affect this mapping.
 */
export function shuffleSampleIdentities(): Record<SampleId, HydrocarbonId> {
  const shuffled = [...HYDROCARBONS];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return {
    "unknown-1": shuffled[0].id,
    "unknown-2": shuffled[1].id,
    "unknown-3": shuffled[2].id,
  };
}

export type ReagentId = "water" | "ligroin" | "bromine" | "kmno4" | "h2so4";

export interface ReagentInfo {
  id: ReagentId;
  label: string;
  /** Bold color for the dropper-bottle icon. */
  color: string;
  /** Lighter tint used for the liquid band in the test tube. */
  tubeColor: string;
}

export const REAGENTS: ReagentInfo[] = [
  { id: "water", label: "Water", color: "#2596be", tubeColor: "#cfeaf4" },
  {
    id: "ligroin",
    label: "Petroleum Ether (Ligroin)",
    color: "#c98a1f",
    tubeColor: "#f3ddb0",
  },
  {
    id: "bromine",
    label: "Bromine Solution (1%)",
    color: "#c2410c",
    tubeColor: "#f3c9a8",
  },
  {
    id: "kmno4",
    label: "Potassium Permanganate (1%)",
    color: "#7e22ce",
    tubeColor: "#ddc4ee",
  },
  {
    id: "h2so4",
    label: "Conc. Sulfuric Acid",
    color: "#94a3b8",
    tubeColor: "#eef1f5",
  },
];

export const MAX_DROPS_PER_REAGENT = 10;

export interface SolubilityTestState {
  waterDrops: number;
  ligroinDrops: number;
}

export const EMPTY_SOLUBILITY_STATE: SolubilityTestState = {
  waterDrops: 0,
  ligroinDrops: 0,
};

export interface TestSessionState {
  solubility: SolubilityTestState;
  bromine: number;
  kmno4: number;
  h2so4: number;
  /** Drops of sample placed on the watch glass for the combustion test. */
  combustionDrops: number;
  /** Whether the watch glass sample has been ignited. */
  ignited: boolean;
  /** Whether the sample has been shaken since drops last changed, per test. */
  reacted: Partial<Record<TestId, boolean>>;
}

export function createEmptyTestSession(): TestSessionState {
  return {
    solubility: { ...EMPTY_SOLUBILITY_STATE },
    bromine: 0,
    kmno4: 0,
    h2so4: 0,
    combustionDrops: 0,
    ignited: false,
    reacted: {},
  };
}

export function testSessionHasActivity(
  session: TestSessionState | undefined,
  testId: TestId,
): boolean {
  if (!session) return false;
  if (testId === "solubility") {
    return session.solubility.waterDrops > 0 || session.solubility.ligroinDrops > 0;
  }
  if (testId === "bromine") return session.bromine > 0;
  if (testId === "kmno4") return session.kmno4 > 0;
  if (testId === "h2so4") return session.h2so4 > 0;
  if (testId === "combustion") return session.combustionDrops > 0;
  return false;
}

export type HeatLevel = "none" | "noticeable" | "high";

export interface ReactionOutcome {
  /** Liquid color the tube's top layer takes on once the reaction resolves. */
  tubeColor: string;
  /** Short verdict line shown in the workbench readout. */
  label: string;
  /** Longer explanation of what's happening chemically. */
  detail: string;
  /** Optional sediment/precipitate band drawn above the reacted layer. */
  precipitateColor?: string;
  heatLevel?: HeatLevel;
  /** Solubility outcomes only: true once the reagent fully blends into the sample, so the tube should render one merged band instead of separate layers. */
  miscible?: boolean;
}

type DropBucket = "faint" | "clear" | "low" | "high" | "underdose" | "correct" | "overdose";

function bucketFor(test: TestId, drops: number): DropBucket {
  if (test === "solubility") return drops <= 2 ? "faint" : "clear";
  if (test === "bromine" || test === "kmno4") return drops <= 5 ? "low" : "high";
  // h2so4
  if (drops <= 2) return "underdose";
  if (drops === 3) return "correct";
  return "overdose";
}

// Water and ligroin never flip result by amount — miscibility is yes/no, not
// quantity-dependent. Same two outcomes apply to every hydrocarbon.
const SOLVENT_OUTCOMES: Record<"water" | "ligroin", Record<"faint" | "clear", ReactionOutcome>> = {
  water: {
    faint: {
      tubeColor: "#cfeaf4",
      label: "Layers separate (faint)",
      detail: "Too little water to see the separation clearly yet.",
    },
    clear: {
      tubeColor: "#cfeaf4",
      label: "Two layers, immiscible",
      detail: "Clean heterogeneous separation. Nonpolar hydrocarbon doesn't mix with water.",
    },
  },
  ligroin: {
    faint: {
      tubeColor: "#f3ddb0",
      label: "Mixing (faint)",
      detail: "Too little ligroin to see the result clearly yet.",
    },
    clear: {
      tubeColor: "#f3ddb0",
      label: "One layer, miscible",
      detail: "Single homogeneous layer. Both nonpolar, so they mix freely.",
      miscible: true,
    },
  },
};

const BROMINE_OUTCOMES: Record<HydrocarbonId, Record<"low" | "high", ReactionOutcome>> = {
  hexane: {
    low: { tubeColor: "#8a3a12", label: "No reaction", detail: "Stays dark brown, no double bond to react with." },
    high: { tubeColor: "#8a3a12", label: "No reaction", detail: "Still dark brown, no double bond to react with." },
  },
  cyclohexene: {
    low: {
      tubeColor: "#f3d9c4",
      label: "Positive, decolorized",
      detail: "Bromine is fully consumed by the double bonds. Clean positive result.",
    },
    high: {
      tubeColor: "#c97a4a",
      label: "Ambiguous, excess Br₂ remains",
      detail:
        "The double bonds only consume some of the bromine. Leftover unreacted Br₂ still tints the tube brown, a real reaction happened, but it can look like a false negative.",
    },
  },
  toluene: {
    low: { tubeColor: "#8a3a12", label: "No reaction", detail: "Stays dark brown, no double bond to react with." },
    high: { tubeColor: "#8a3a12", label: "No reaction", detail: "Still dark brown, no double bond to react with." },
  },
};

const KMNO4_OUTCOMES: Record<HydrocarbonId, Record<"low" | "high", ReactionOutcome>> = {
  hexane: {
    low: { tubeColor: "#7e22ce", label: "No reaction", detail: "Stays purple, no reaction." },
    high: { tubeColor: "#7e22ce", label: "No reaction", detail: "Still purple, no reaction." },
  },
  cyclohexene: {
    low: {
      tubeColor: "#e8dfc8",
      label: "Positive, decolorized",
      detail: "Purple fully disappears and brown MnO₂ precipitate forms. Clean positive result.",
      precipitateColor: "#6b4a1f",
    },
    high: {
      tubeColor: "#b483d6",
      label: "Ambiguous, excess KMnO₄ remains",
      detail:
        "Excess KMnO₄ stays unreacted, so the solution stays partly purple with only some brown precipitate, masking a true positive as ambiguous.",
      precipitateColor: "#6b4a1f",
    },
  },
  toluene: {
    low: { tubeColor: "#7e22ce", label: "No reaction", detail: "Stays purple, no reaction." },
    high: { tubeColor: "#7e22ce", label: "No reaction", detail: "Still purple, no reaction." },
  },
};

const H2SO4_OUTCOMES: Record<
  HydrocarbonId,
  Record<"underdose" | "correct" | "overdose", ReactionOutcome>
> = {
  hexane: {
    underdose: { tubeColor: "#eef1f5", label: "No visible change", detail: "Acid just sits as a separate dense layer.", heatLevel: "none" },
    correct: { tubeColor: "#eef1f5", label: "No visible change", detail: "No reaction, acid stays a separate layer.", heatLevel: "none" },
    overdose: { tubeColor: "#eef1f5", label: "No visible change", detail: "Just a bigger acid layer, no reaction.", heatLevel: "none" },
  },
  cyclohexene: {
    underdose: {
      tubeColor: "#f0e4d8",
      label: "Reacts, heat easy to miss",
      detail: "Reaction occurs, but with so little acid the heat released is small and easy to miss.",
      heatLevel: "noticeable",
    },
    correct: {
      tubeColor: "#e8cdb0",
      label: "Positive, clear heat release",
      detail: "Clear, noticeable heat release. Mixture becomes homogeneous.",
      heatLevel: "noticeable",
    },
    overdose: {
      tubeColor: "#e0b98f",
      label: "Positive, excess heat (caution)",
      detail: "Progressively more heat is released, can get uncomfortably hot. Real safety concern, not just a bigger version of the same result.",
      heatLevel: "high",
    },
  },
  toluene: {
    underdose: { tubeColor: "#eef1f5", label: "No visible change", detail: "Won't sulfonate at room temp with just a few drops, that needs fuming acid and heat.", heatLevel: "none" },
    correct: { tubeColor: "#eef1f5", label: "No visible change", detail: "Won't sulfonate at room temp with just a few drops, that needs fuming acid and heat.", heatLevel: "none" },
    overdose: {
      tubeColor: "#eef1f5",
      label: "No reaction, acid itself is now a hazard",
      detail: "No sulfonation at room temp, but the excess strong acid becomes a handling hazard on its own, regardless of the hydrocarbon.",
      heatLevel: "none",
    },
  },
};

export function getSolubilityOutcome(
  reagentId: "water" | "ligroin",
  drops: number,
): ReactionOutcome {
  const bucket = bucketFor("solubility", drops) as "faint" | "clear";
  return SOLVENT_OUTCOMES[reagentId][bucket];
}

export function getReagentOutcome(
  testId: "bromine" | "kmno4" | "h2so4",
  hydrocarbonId: HydrocarbonId,
  drops: number,
): ReactionOutcome {
  const bucket = bucketFor(testId, drops);
  if (testId === "bromine") return BROMINE_OUTCOMES[hydrocarbonId][bucket as "low" | "high"];
  if (testId === "kmno4") return KMNO4_OUTCOMES[hydrocarbonId][bucket as "low" | "high"];
  return H2SO4_OUTCOMES[hydrocarbonId][bucket as "underdose" | "correct" | "overdose"];
}

export type SmokeLevel = "none" | "light" | "moderate" | "heavy";

export interface CombustionOutcome {
  flameColor: string;
  smokeLevel: SmokeLevel;
  label: string;
  detail: string;
}

// Combustion is run on a watch glass, not the tube, and there's no dose to
// vary, it either burns clean or it doesn't. Cyclohexene isn't shown in the
// source material (only hexane and toluene are), so it's placed between
// them: alkenes have a higher carbon-to-hydrogen ratio than alkanes but
// lower than aromatics, so a moderately smoky flame is the chemically
// consistent middle ground.
const COMBUSTION_OUTCOMES: Record<HydrocarbonId, CombustionOutcome> = {
  hexane: {
    flameColor: "#4a90e2",
    smokeLevel: "light",
    label: "Blue flame, clean combustion",
    detail: "Very little smoke. Low carbon-to-hydrogen ratio burns relatively clean.",
  },
  cyclohexene: {
    flameColor: "#f2a63c",
    smokeLevel: "moderate",
    label: "Yellow-orange flame, some soot",
    detail: "Moderate smoke, burns less cleanly than a clear flame but not as sooty as a heavy smoker.",
  },
  toluene: {
    flameColor: "#f5d020",
    smokeLevel: "heavy",
    label: "Bright yellow flame, smoky combustion",
    detail: "Thick black smoke (soot). Higher carbon-to-hydrogen ratio burns sooty.",
  },
};

export function getCombustionOutcome(hydrocarbonId: HydrocarbonId): CombustionOutcome {
  return COMBUSTION_OUTCOMES[hydrocarbonId];
}

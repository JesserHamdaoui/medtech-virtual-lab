/**
 * What the student can change about the lab's set-up: how much each sample
 * weighs and how much water is in the cup and the flask. React owns it
 * (it lives on the bench), and the physics reads it from there.
 */
export interface LabSettings {
  /** Sample masses, g, by material id. A sample missing here keeps the mass in its material table. */
  masses: Record<string, number>;
  /** Cold water in the coffee cup, mL. */
  cupWaterMl: number;
  /** Water in the flask on the tin can, mL. */
  flaskWaterMl: number;
  /** The cup's water starts at this temperature, °C. */
  cupColdTemp: number;
}

export const DEFAULT_LAB_SETTINGS: LabSettings = {
  masses: {},
  cupWaterMl: 20,
  flaskWaterMl: 100,
  cupColdTemp: 10,
};

/** Water weighs 1 g per mL. */
export const WATER_GRAMS_PER_ML = 1;

export interface Limits {
  min: number;
  max: number;
}

/** What each setting may be set to. */
export const SETTING_LIMITS = {
  mass: { min: 0.1, max: 100 },
  cupWaterMl: { min: 5, max: 200 },
  flaskWaterMl: { min: 20, max: 300 },
  cupColdTemp: { min: 0, max: 20 },
} satisfies Record<string, Limits>;

export type ParsedField = { value: number; error?: undefined } | { value?: undefined; error: string };

/** Reads a number typed into a field and checks it against its limits. */
export function parseField(text: string, { min, max }: Limits): ParsedField {
  const value = Number(text);
  if (text.trim() === "" || !Number.isFinite(value)) return { error: "Enter a number" };
  if (value < min || value > max) return { error: `Between ${min} and ${max}` };
  return { value };
}

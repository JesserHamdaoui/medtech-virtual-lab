/**
 * Real-world heat transfer figures for the bench. Each one comes from a
 * published range, so the lab takes about as long as the real one would.
 */

/** Nameplate power of the hot plate, W. A common 400 W laboratory plate. */
export const HEATER_WATTS = 400;
/** Share of the plate's power that reaches the water, the rest heating the plate and the room. */
export const HEATER_EFFICIENCY = 0.65;
/** Power that actually goes into the bath, W. */
export const HEATER_NET_WATTS = HEATER_WATTS * HEATER_EFFICIENCY;

/** Convection coefficient, W/(m²·K), of a metal in the hot bath: natural convection in water is 60 to 900. */
export const H_BATH = 500;
/** Of a metal in the stirred coffee cup: forced convection in water is 500 to 1000 when laminar. */
export const H_CUP = 800;
/** Of a metal in still air: natural convection in air is 1 to 10. */
export const H_AIR = 8;

/**
 * Surface of a small puck, m², from its mass and density. The puck is
 * modelled as a cylinder as tall as it is wide, so a heavier puck is bigger.
 */
export function puckAreaM2(massGrams: number, densityGramsPerCm3: number): number {
  const volumeCm3 = massGrams / densityGramsPerCm3;
  const radiusCm = Math.cbrt(volumeCm3 / Math.PI);
  return 4 * Math.PI * radiusCm * radiusCm * 1e-4;
}

/**
 * How fast a puck closes on the temperature around it, per second: h·A
 * divided by its heat capacity. A light puck of a low specific heat follows
 * its surroundings faster.
 */
export function filmRate(massGrams: number, densityGramsPerCm3: number, specificHeat: number, h: number): number {
  return (h * puckAreaM2(massGrams, densityGramsPerCm3)) / (massGrams * specificHeat);
}

/**
 * The rate, per second, at which a puck and a body of water meet in the
 * middle: the gap between them closes at h·A over each one's heat capacity,
 * added together.
 */
export function meetingRate(
  massGrams: number,
  densityGramsPerCm3: number,
  specificHeat: number,
  h: number,
  waterHeatCapacity: number,
): number {
  const hA = h * puckAreaM2(massGrams, densityGramsPerCm3);
  return hA * (1 / (massGrams * specificHeat) + 1 / waterHeatCapacity);
}

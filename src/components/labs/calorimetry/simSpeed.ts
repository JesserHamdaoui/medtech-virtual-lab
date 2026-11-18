/** How many seconds of lab pass per real second. The real lab is slow, so the student can skip ahead. */
export const SIM_SPEEDS = [1, 5, 10, 20] as const;
export type SimSpeed = (typeof SIM_SPEEDS)[number];
export const DEFAULT_SIM_SPEED: SimSpeed = 1;

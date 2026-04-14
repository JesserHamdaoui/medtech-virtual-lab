// Physics constants calibrated for wave simulation

// Mass of each point (kg) - lighter for more responsive motion
export const MASS = 0.01;

// Match reference default values
export const AMPLITUDE = 0.75;
export const FREQUENCY = 1.5;
export const DAMPING = 20;
export const TENSION = 0.8; // Default tension within stable range

// Constants from reference
export const AMPLITUDE_MULTIPLIER = 50;
export const FRAMES_PER_SECOND = 50;

// Wave speed will be sqrt(TENSION/MASS) ≈ 100 m/s
// This gives reasonable wave propagation for the simulation scale

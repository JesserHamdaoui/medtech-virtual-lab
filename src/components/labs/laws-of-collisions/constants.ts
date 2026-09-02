import { Color } from "./types";

export const BODIES = [
  {
    mass: 1,
    xPosition: 300,
    xVelocity: 189,
    color: Color.RED,
    width: 120,
    height: 60,
  },
  {
    mass: 2,
    xPosition: 800,
    xVelocity: -189,
    color: Color.BLUE,
    width: 120,
    height: 60,
  },
];

export const PROPERTY_BOUNDAERIES = {
  mass: {
    min: 0.1,
    max: 3,
  },
  velocity: {
    min: -1500,
    max: 1500,
  },
  position: {
    min: 0,
    max: 600,
  },
};

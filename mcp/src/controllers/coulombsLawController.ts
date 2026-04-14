const KE = 8.99e9;
const DISTANCE_MIN = 2e-2;
const DISTANCE_MAX = 20e-2;
const CHARGE_MIN = -10e-6;
const CHARGE_MAX = 10e-6;

interface CoulombState {
  distanceMeters: number;
  chargeA: number;
  chargeB: number;
}

export class CoulombsLawController {
  private state: CoulombState = {
    distanceMeters: 6e-2,
    chargeA: -5e-6,
    chargeB: 10e-6,
  };

  private clampDistance(value: number) {
    return Math.min(DISTANCE_MAX, Math.max(DISTANCE_MIN, value));
  }

  private clampCharge(value: number) {
    return Math.min(CHARGE_MAX, Math.max(CHARGE_MIN, value));
  }

  private calculateForces() {
    const magnitude =
      (KE * Math.abs(this.state.chargeA * this.state.chargeB)) /
      (this.state.distanceMeters * this.state.distanceMeters);
    const sign = this.state.chargeA * this.state.chargeB > 0 ? 1 : -1;
    const forceOnA = magnitude * sign;
    const forceOnB = -forceOnA;
    return { forceOnA, forceOnB };
  }

  getStatus() {
    const { forceOnA, forceOnB } = this.calculateForces();
    return {
      lab: "coulombs-law",
      distanceMeters: this.state.distanceMeters,
      chargeA: {
        name: "q1",
        chargeCoulombs: this.state.chargeA,
        exercisedForceNewtons: forceOnA,
      },
      chargeB: {
        name: "q2",
        chargeCoulombs: this.state.chargeB,
        exercisedForceNewtons: forceOnB,
      },
    };
  }

  getCapabilities() {
    return {
      lab: "coulombs-law",
      actions: [
        "reset",
        "set_distance",
        "nudge_distance",
        "set_charge_a",
        "set_charge_b",
        "nudge_charge_a",
        "nudge_charge_b",
      ],
      parameters: [
        { name: "distance", type: "number", min: DISTANCE_MIN, max: DISTANCE_MAX, unit: "m" },
        { name: "charge_a", type: "number", min: CHARGE_MIN, max: CHARGE_MAX, unit: "C" },
        { name: "charge_b", type: "number", min: CHARGE_MIN, max: CHARGE_MAX, unit: "C" },
      ],
    };
  }

  control(input: {
    action:
      | "reset"
      | "set_distance"
      | "nudge_distance"
      | "set_charge_a"
      | "set_charge_b"
      | "nudge_charge_a"
      | "nudge_charge_b";
    value?: number;
  }) {
    switch (input.action) {
      case "reset":
        this.state = {
          distanceMeters: 6e-2,
          chargeA: -5e-6,
          chargeB: 10e-6,
        };
        break;
      case "set_distance":
        if (typeof input.value !== "number") {
          throw new Error("numeric value is required");
        }
        this.state.distanceMeters = this.clampDistance(input.value);
        break;
      case "nudge_distance":
        if (typeof input.value !== "number") {
          throw new Error("numeric value is required");
        }
        this.state.distanceMeters = this.clampDistance(
          this.state.distanceMeters + input.value,
        );
        break;
      case "set_charge_a":
        if (typeof input.value !== "number") {
          throw new Error("numeric value is required");
        }
        this.state.chargeA = this.clampCharge(input.value);
        break;
      case "set_charge_b":
        if (typeof input.value !== "number") {
          throw new Error("numeric value is required");
        }
        this.state.chargeB = this.clampCharge(input.value);
        break;
      case "nudge_charge_a":
        if (typeof input.value !== "number") {
          throw new Error("numeric value is required");
        }
        this.state.chargeA = this.clampCharge(this.state.chargeA + input.value);
        break;
      case "nudge_charge_b":
        if (typeof input.value !== "number") {
          throw new Error("numeric value is required");
        }
        this.state.chargeB = this.clampCharge(this.state.chargeB + input.value);
        break;
      default:
        throw new Error(`Unsupported action: ${input.action}`);
    }

    return this.getStatus();
  }
}

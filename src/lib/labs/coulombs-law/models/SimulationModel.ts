import {
  SimulationProps,
  SettingsProps,
  Ke,
} from "../constants/simulationConstants";
import { convertMToPx } from "../utils/units";
import { ChargeModel } from "./ChargeModel";

export class SimulationModel {
  private readonly _chargeModelA: ChargeModel;
  private readonly _chargeModelB: ChargeModel;
  private _distance: number;

  constructor() {
    this._distance = SimulationProps.DISTANCE;
    const chargeA = SimulationProps.INITIAL_CHARGE_A;
    const chargeB = SimulationProps.INITIAL_CHARGE_B;
    const forces = this.calculateForcesWithCharges(chargeA, chargeB);
    this._chargeModelA = new ChargeModel("1", chargeA, forces[0], {
      x:
        SimulationProps.SIMULATION_WIDTH / 2 - convertMToPx(this._distance) / 2,
      y: SimulationProps.Y_REFERENCE,
    });
    this._chargeModelB = new ChargeModel("2", chargeB, forces[1], {
      x:
        SimulationProps.SIMULATION_WIDTH / 2 + convertMToPx(this._distance) / 2,
      y: SimulationProps.Y_REFERENCE,
    });
  }

  public calculateForcesWithCharges(
    chargeA: number,
    chargeB: number
  ): [number, number] {
    const qA = chargeA;
    const qB = chargeB;
    const r = this._distance;

    // Always positive magnitude
    const magnitude = (Ke * Math.abs(qA * qB)) / (r * r);

    // repulsive if same sign, attractive if opposite
    const sign = qA * qB > 0 ? 1 : -1;

    // force on A due to B, and equal/opposite on B
    const forceOnA = magnitude * sign;
    const forceOnB = -forceOnA;

    return [forceOnB, forceOnA];
  }

  public calculateForces(): [number, number] {
    const chargeA = this._chargeModelA.charge;
    const chargeB = this._chargeModelB.charge;
    return this.calculateForcesWithCharges(chargeA, chargeB);
  }

  public updateDistance(newDistance: number): void {
    if (newDistance < SettingsProps.DISTANCE_MIN) {
      newDistance = SettingsProps.DISTANCE_MIN;
    } else if (newDistance > SettingsProps.DISTANCE_MAX) {
      newDistance = SettingsProps.DISTANCE_MAX;
    } else {
      this._distance = newDistance;
    }

    this._chargeModelA.xPosition =
      SimulationProps.SIMULATION_WIDTH / 2 - convertMToPx(this._distance) / 2;

    this._chargeModelB.xPosition =
      SimulationProps.SIMULATION_WIDTH / 2 + convertMToPx(this._distance) / 2;

    const forces = this.calculateForces();
    this._chargeModelA.exercisedForce = forces[0];
    this._chargeModelB.exercisedForce = forces[1];
  }

  public updateChargeA(newCharge: number): void {
    this._chargeModelA.charge = newCharge;
    const forces = this.calculateForces();
    this._chargeModelA.exercisedForce = forces[0];
    this._chargeModelB.exercisedForce = forces[1];
  }

  public updateChargeB(newCharge: number): void {
    this._chargeModelB.charge = newCharge;
    const forces = this.calculateForces();
    this._chargeModelA.exercisedForce = forces[0];
    this._chargeModelB.exercisedForce = forces[1];
  }

  public updatePositions(width: number, height: number): void {
    if (width == 1200) {
      this._chargeModelA.xPosition =
        width / 2 - convertMToPx(this._distance) / 2;
      this._chargeModelA.yPosition = SimulationProps.Y_REFERENCE;
      this._chargeModelB.xPosition =
        width / 2 + convertMToPx(this._distance) / 2;
      this._chargeModelB.yPosition = SimulationProps.Y_REFERENCE;
    } else {
      this._chargeModelA.xPosition =
        width / 2 - convertMToPx(this._distance) / 2;
      this._chargeModelA.yPosition = (height - 300) / 2;
      this._chargeModelB.xPosition =
        width / 2 + convertMToPx(this._distance) / 2;
      this._chargeModelB.yPosition = (height - 300) / 2;
    }
  }

  public get distance(): number {
    return this._distance;
  }

  public get chargeModelA(): ChargeModel {
    return this._chargeModelA;
  }

  public get chargeModelB(): ChargeModel {
    return this._chargeModelB;
  }
}

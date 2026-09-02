import { SimulationProps, SettingsProps, Ke } from "./constants";
import { convertMToPx } from "./units";
import { ChargeModel } from "./ChargeModel";
import { Property } from "@/lib/sims/core/Property";

export class SimulationModel {
  private readonly _chargeModelA: ChargeModel;
  private readonly _chargeModelB: ChargeModel;
  private readonly distanceProperty: Property<number>;
  private canvasWidth: number = SimulationProps.SIMULATION_WIDTH;

  constructor() {
    this.distanceProperty = new Property(SimulationProps.DISTANCE);
    const chargeA = SimulationProps.INITIAL_CHARGE_A;
    const chargeB = SimulationProps.INITIAL_CHARGE_B;
    const forces = this.calculateForcesWithCharges(chargeA, chargeB);
    this._chargeModelA = new ChargeModel("1", chargeA, forces[0], {
      x: this.canvasWidth / 2 - convertMToPx(this.distance) / 2,
      y: SimulationProps.Y_REFERENCE,
    });
    this._chargeModelB = new ChargeModel("2", chargeB, forces[1], {
      x: this.canvasWidth / 2 + convertMToPx(this.distance) / 2,
      y: SimulationProps.Y_REFERENCE,
    });
  }

  public calculateForcesWithCharges(
    chargeA: number,
    chargeB: number,
  ): [number, number] {
    const qA = chargeA;
    const qB = chargeB;
    const r = this.distance;

    const magnitude = (Ke * Math.abs(qA * qB)) / (r * r);
    const sign = qA * qB > 0 ? 1 : -1;

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
    }
    this.distanceProperty.value = newDistance;

    this._chargeModelA.xPosition = this.canvasWidth / 2 - convertMToPx(this.distance) / 2;

    this._chargeModelB.xPosition = this.canvasWidth / 2 + convertMToPx(this.distance) / 2;

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

  public updatePositions(width: number): void {
    this.canvasWidth = width;
    this._chargeModelA.xPosition = width / 2 - convertMToPx(this.distance) / 2;
    this._chargeModelA.yPosition = SimulationProps.Y_REFERENCE;
    this._chargeModelB.xPosition = width / 2 + convertMToPx(this.distance) / 2;
    this._chargeModelB.yPosition = SimulationProps.Y_REFERENCE;
  }

  public get distance(): number {
    return this.distanceProperty.value;
  }

  public getDistanceProperty() {
    return this.distanceProperty;
  }

  public get chargeModelA(): ChargeModel {
    return this._chargeModelA;
  }

  public get chargeModelB(): ChargeModel {
    return this._chargeModelB;
  }
}

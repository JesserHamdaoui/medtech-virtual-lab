import { Property } from "@/lib/sims/core/Property";
import { ChargeProps, SettingsProps } from "./constants";

export class ChargeModel {
  private readonly _id: string;
  private readonly _name: string;
  private readonly _radius: number;

  private readonly chargeProperty: Property<number>;
  private readonly exercisedForceProperty: Property<number>;
  private readonly initialPositionProperty: Property<{ x: number; y: number }>;
  private readonly positionProperty: Property<{ x: number; y: number }>;
  private readonly colorProperty: Property<number[]>;

  constructor(
    id: string,
    charge: number,
    exercisedForce: number,
    position: { x: number; y: number },
  ) {
    this._id = id;
    this._name = "q" + this._id;
    this._radius = ChargeProps.RADIUS;

    this.chargeProperty = new Property(charge);
    this.exercisedForceProperty = new Property(exercisedForce);
    this.initialPositionProperty = new Property({ ...position });
    this.positionProperty = new Property({ ...position });
    this.colorProperty = new Property(id === "1" ? [255, 0, 0] : [0, 0, 255]);
  }

  public get name(): string {
    return this._name;
  }

  public get radius(): number {
    return this._radius;
  }

  public get charge(): number {
    return this.chargeProperty.value;
  }

  public set charge(value: number) {
    if (value < SettingsProps.CHARGE_MIN) {
      value = SettingsProps.CHARGE_MIN;
    } else if (value > SettingsProps.CHARGE_MAX) {
      value = SettingsProps.CHARGE_MAX;
    }
    this.chargeProperty.value = value;
  }

  public get color(): number[] {
    return this.colorProperty.value;
  }

  public get initialPosition(): { x: number; y: number } {
    return this.initialPositionProperty.value;
  }

  public get position(): { x: number; y: number } {
    return this.positionProperty.value;
  }

  public set xPosition(value: number) {
    this.positionProperty.value = { ...this.positionProperty.value, x: value };
  }

  public set yPosition(value: number) {
    this.positionProperty.value = { ...this.positionProperty.value, y: value };
  }

  public set position(value: { x: number; y: number }) {
    this.positionProperty.value = value;
  }

  public set exercisedForce(value: number) {
    this.exercisedForceProperty.value = value;
  }

  public get exercisedForce() {
    return this.exercisedForceProperty.value;
  }

  public getChargeProperty() {
    return this.chargeProperty;
  }

  public getExercisedForceProperty() {
    return this.exercisedForceProperty;
  }

  public getPositionProperty() {
    return this.positionProperty;
  }
}

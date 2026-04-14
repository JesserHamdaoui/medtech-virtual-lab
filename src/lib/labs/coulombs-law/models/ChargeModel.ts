import { ChargeProps, SettingsProps } from "../constants/simulationConstants";

export class ChargeModel {
  private readonly _id: string;
  private readonly _name: string;

  private _charge: number;
  private _color: number[];

  private _exercisedForce: number = 0;

  private _initialPosition: { x: number; y: number };
  private _position: { x: number; y: number };
  private readonly _radius: number;

  constructor(
    id: string,
    charge: number,
    exercisedForce: number,
    position: { x: number; y: number }
  ) {
    this._id = id;
    this._name = "q" + this._id;
    this._charge = charge;
    this._exercisedForce = exercisedForce;
    // this._color = this.getColorByCharge(charge);
    this._color = id === "1" ? [255, 0, 0] : [0, 0, 255]; // Red for q1, Blue for q2
    this._position = this._initialPosition = position;
    this._radius = ChargeProps.RADIUS;
  }

  // private getColorByCharge = (charge: number): number[] => {
  //   const colorIntensity =
  //     255 -
  //     (Math.abs(charge * 1e6) * 255) /
  //       ((SettingsProps.CHARGE_MAX * 1e6 - SettingsProps.CHARGE_MIN * 1e6) / 2);
  //   if (charge > 0) {
  //     return [255, colorIntensity, colorIntensity]; // Lighter red for positive charge
  //   } else {
  //     return [colorIntensity, colorIntensity, 255]; // Lighter blue for negative charge
  //   }
  // };

  public get name(): string {
    return this._name;
  }

  public get charge(): number {
    return this._charge;
  }

  public set charge(value: number) {
    if (value < SettingsProps.CHARGE_MIN) {
      value = SettingsProps.CHARGE_MIN;
    } else if (value > SettingsProps.CHARGE_MAX) {
      value = SettingsProps.CHARGE_MAX;
    } else {
      this._charge = value;
    }
    // this._color = this.getColorByCharge(value);
  }

  public get color(): number[] {
    return this._color;
  }

  public get initialPosition(): { x: number; y: number } {
    return this._initialPosition;
  }

  public get position(): { x: number; y: number } {
    return this._position;
  }

  public set xPosition(value: number) {
    this._position.x = value;
  }

  public set yPosition(value: number) {
    this._position.y = value;
  }

  public set position(value: { x: number; y: number }) {
    this._position = value;
  }

  public get radius(): number {
    return this._radius;
  }

  public set exercisedForce(value: number) {
    this._exercisedForce = value;
  }

  public get exercisedForce() {
    return this._exercisedForce;
  }
}

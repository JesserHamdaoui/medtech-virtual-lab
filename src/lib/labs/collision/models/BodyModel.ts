import { Property } from "../utils/Property";
import { Color } from "../types/Color";

export class BodyModel {
  private readonly massProperty: Property<number>;

  private readonly initialVelocityProperty: Property<number>;
  private readonly velocityProperty: Property<number>;

  private readonly initialPositionProperty: Property<{ x: number; y: number }>;
  private readonly positionProperty: Property<{ x: number; y: number }>;

  private readonly widthProperty: Property<number>;
  private readonly heightProperty: Property<number>;

  private readonly yReferenceProperty: Property<number>;

  private readonly colorProperty: Property<Color>;

  private readonly collidedProperty: Property<boolean>;

  constructor(
    mass: number,
    xPosition: number,
    xVelocity: number,
    width: number,
    height: number,
    color: Color,
    yReference: number
  ) {
    this.massProperty = new Property(mass);

    this.widthProperty = new Property(width);
    this.heightProperty = new Property(height);

    this.yReferenceProperty = new Property(yReference);

    this.initialVelocityProperty = new Property(xVelocity);
    this.velocityProperty = new Property(xVelocity);
    this.initialPositionProperty = new Property({
      x: xPosition,
      y: this.yReferenceProperty.value - height / 2,
    });
    this.positionProperty = new Property({
      x: xPosition,
      y: this.yReferenceProperty.value - height / 2,
    });
    this.colorProperty = new Property(color);

    this.collidedProperty = new Property(false);
  }

  public get mass() {
    return this.massProperty.value;
  }

  public get width() {
    return this.widthProperty.value;
  }

  public get height() {
    return this.heightProperty.value;
  }

  public get initialVelocity() {
    return this.initialVelocityProperty.value;
  }

  public get velocity() {
    return this.velocityProperty.value;
  }

  public get initialPosition() {
    return this.initialPositionProperty.value;
  }

  public get position() {
    return this.positionProperty.value;
  }

  public get yReference() {
    return this.yReferenceProperty.value;
  }

  public get color() {
    return this.colorProperty.value;
  }

  public get collided() {
    return this.collidedProperty.value;
  }

  public updateMass(newMass: number) {
    this.massProperty.value = newMass;
  }

  public updateInitialVelocity(newVelocity: number) {
    this.initialVelocityProperty.value = newVelocity;
  }

  public updateVelocity(newVelocity: number) {
    this.velocityProperty.value = newVelocity;
  }

  public updateInitialPosition(newPosition: number) {
    this.initialPositionProperty.value.x = newPosition;
  }

  public updateXPosition(newXPosition: number) {
    this.positionProperty.value.x = newXPosition;
  }

  public updateYReference(newYReference: number) {
    this.yReferenceProperty.value = newYReference;
    this.positionProperty.value.y = newYReference - this.height / 2;
  }

  public updateCollided(newCollided: boolean) {
    this.collidedProperty.value = newCollided;
  }
}

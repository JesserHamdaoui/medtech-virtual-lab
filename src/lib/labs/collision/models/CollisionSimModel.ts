import { Elasticity } from "../types/Elasticity";
import { TimeSpeed } from "../types/TimeSpeed";
import { Property } from "../utils/Property";
import { BodyModel } from "./BodyModel";
import { BODIES } from "../constants/config";
import { Emitter } from "@/components/labs/shared";

export class CollisionSimModel {
  private readonly elasticityProperty: Property<Elasticity>;
  private readonly isMovingProperty: Property<boolean>;
  private readonly timeSpeedProperty: Property<TimeSpeed>;
  private readonly timeElapsedProperty: Property<number>;
  private readonly timeStepProperty: Property<number>;

  private readonly bodies: BodyModel[] = [];
  private readonly collisionDetectedEmitter = new Emitter<{
    body1: BodyModel;
    body2: BodyModel;
  }>();

  constructor(timeStep: number = 0.01, yReference: number) {
    this.elasticityProperty = new Property<Elasticity>(Elasticity.INELASTIC);
    this.elasticityProperty.range = { min: 0, max: 1 };

    this.isMovingProperty = new Property(false);
    this.timeSpeedProperty = new Property<TimeSpeed>(TimeSpeed.NORMAL);

    this.timeElapsedProperty = new Property(0);
    this.timeStepProperty = new Property(timeStep);

    for (const body of BODIES) {
      this.bodies.push(
        new BodyModel(
          body.mass,
          body.xPosition,
          body.xVelocity,
          body.width,
          body.height,
          body.color,
          yReference,
        ),
      );
    }

    this.collisionDetectedEmitter.addListener((collidedBodies) => {
      const m1 = collidedBodies.body1.mass;
      const m2 = collidedBodies.body2.mass;
      const u1 = collidedBodies.body1.velocity;
      const u2 = collidedBodies.body2.velocity;
      const totalMass = m1 + m2;

      const e = this.elasticityProperty.value == Elasticity.ELASTIC ? 1 : 0;

      const newVelocity1 = (m1 * u1 + m2 * u2 - m2 * e * (u1 - u2)) / totalMass;
      const newVelocity2 = (m1 * u1 + m2 * u2 + m1 * e * (u1 - u2)) / totalMass;

      collidedBodies.body1.updateVelocity(newVelocity1);
      collidedBodies.body2.updateVelocity(newVelocity2);

      collidedBodies.body1.updateCollided(true);
      collidedBodies.body2.updateCollided(true);
    });
  }

  public get elasticity() {
    return this.elasticityProperty.value;
  }

  public get isMoving() {
    return this.isMovingProperty.value;
  }

  public get timeSpeed() {
    return this.timeSpeedProperty.value;
  }

  public get timeElapsed() {
    return this.timeElapsedProperty.value;
  }

  public getBodies() {
    return this.bodies;
  }

  public updateElasticity(newElasticity: Elasticity) {
    this.elasticityProperty.value = newElasticity;
  }

  public updateIsMoving(newIsMoving: boolean) {
    this.isMovingProperty.value = newIsMoving;
  }

  public updateTimeSpeed(newTimeSpeed: TimeSpeed) {
    this.timeSpeedProperty.value = newTimeSpeed;
  }

  public updateTimeElapsed(newTimeElapsed: number) {
    this.timeElapsedProperty.value = newTimeElapsed;
  }

  public updateTimeStep(newTimeStep: number) {
    this.timeStepProperty.value = newTimeStep;
  }

  public updateBodyMass(bodyIndex: number, newMass: number) {
    const body = this.bodies[bodyIndex];
    body.updateMass(newMass);
  }

  public updateBodyVelocity(bodyIndex: number, newVelocity: number) {
    const body = this.bodies[bodyIndex];
    body.updateVelocity(newVelocity);
  }

  public updateBodyInitialVelocity(
    bodyIndex: number,
    newInitialVelocity: number,
  ) {
    const body = this.bodies[bodyIndex];
    body.updateInitialVelocity(newInitialVelocity);
  }

  public updateBodyPosition(bodyIndex: number, newPosition: number) {
    const body = this.bodies[bodyIndex];
    body.updateXPosition(newPosition);
  }

  public updateBodyInitialPosition(
    bodyIndex: number,
    newInitialPosition: number,
  ) {
    const body = this.bodies[bodyIndex];
    body.updateInitialPosition(newInitialPosition);
  }

  public updateBodiesY(yReference: number) {
    this.bodies.forEach((body) => {
      body.updateYReference(yReference);
    });
  }

  public update() {
    if (!this.isMoving) {
      return;
    }

    const timeStep = this.timeStepProperty.value;
    const timeSpeed = this.timeSpeedProperty.value;
    const timeElapsed = this.timeElapsedProperty.value + timeStep * timeSpeed;

    this.timeElapsedProperty.value = timeElapsed;

    this.bodies.forEach((body) => {
      body.updateXPosition(
        body.position.x + body.velocity * timeStep * timeSpeed,
      );
    });

    for (let i = 0; i < this.bodies.length; i++) {
      for (let j = i + 1; j < this.bodies.length; j++) {
        const body1 = this.bodies[i];
        const body2 = this.bodies[j];

        const dx = body2.position.x - body1.position.x;
        const dy = body2.position.y - body1.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const minDistance = 120;

        if (distance < minDistance) {
          this.collisionDetectedEmitter.emit({ body1, body2 });

          const overlap = minDistance - distance;
          const correctionFactor = overlap / (2 * distance);

          body1.updateXPosition(body1.position.x - dx * correctionFactor);
          body2.updateXPosition(body2.position.x + dx * correctionFactor);
        }
      }
    }
  }

  public restart() {
    this.updateTimeElapsed(0);
    this.updateIsMoving(false);

    this.bodies.forEach((body) => {
      body.updateXPosition(body.initialPosition.x);
      body.updateVelocity(body.initialVelocity);
      body.updateCollided(false);
    });
  }
}

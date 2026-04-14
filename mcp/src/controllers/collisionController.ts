type Elasticity = "elastic" | "inelastic";
type TimeSpeed = "normal" | "slow";

interface CollisionBodyState {
  index: number;
  mass: number;
  velocity: number;
  initialVelocity: number;
  position: { x: number; y: number };
  initialPosition: { x: number; y: number };
  collided: boolean;
}

export class CollisionController {
  private readonly trackMin = 0;
  private readonly trackMax = 1200;
  private readonly bodyWidth = 120;
  private readonly timeStep = 0.01;
  private elasticity: Elasticity = "inelastic";
  private isMoving = false;
  private timeSpeed: TimeSpeed = "normal";
  private timeElapsed = 0;
  private readonly bodies: CollisionBodyState[] = [
    {
      index: 0,
      mass: 1,
      velocity: 189,
      initialVelocity: 189,
      position: { x: 300, y: 170 },
      initialPosition: { x: 300, y: 170 },
      collided: false,
    },
    {
      index: 1,
      mass: 2,
      velocity: -189,
      initialVelocity: -189,
      position: { x: 800, y: 170 },
      initialPosition: { x: 800, y: 170 },
      collided: false,
    },
  ];

  getStatus() {
    return {
      lab: "collision",
      elasticity: this.elasticity,
      isMoving: this.isMoving,
      timeSpeed: this.timeSpeed,
      timeElapsed: this.timeElapsed,
      bodies: this.bodies,
    };
  }

  getCapabilities() {
    return {
      lab: "collision",
      actions: [
        "start",
        "pause",
        "toggle_play",
        "restart",
        "step",
        "set_elasticity",
        "set_time_speed",
        "set_body_mass",
        "set_body_velocity",
        "set_body_position",
      ],
      parameters: [
        { name: "elasticity", type: "enum", values: ["elastic", "inelastic"] },
        { name: "time_speed", type: "enum", values: ["normal", "slow"] },
        { name: "body_mass", type: "number", min: 0.1, max: 20 },
        { name: "body_velocity", type: "number", min: -1000, max: 1000 },
        { name: "body_position", type: "number", min: this.trackMin, max: this.trackMax },
      ],
    };
  }

  private resolveSpeedMultiplier() {
    return this.timeSpeed === "slow" ? 0.5 : 1;
  }

  private clampBodyPositions() {
    this.bodies.forEach((body) => {
      if (body.position.x < this.trackMin) {
        body.position.x = this.trackMin;
      }
      if (body.position.x > this.trackMax) {
        body.position.x = this.trackMax;
      }
    });
  }

  private applyCollisionIfNeeded() {
    const bodyA = this.bodies[0];
    const bodyB = this.bodies[1];
    const dx = bodyB.position.x - bodyA.position.x;

    if (Math.abs(dx) > this.bodyWidth) {
      return;
    }

    const m1 = bodyA.mass;
    const m2 = bodyB.mass;
    const u1 = bodyA.velocity;
    const u2 = bodyB.velocity;
    const totalMass = m1 + m2;
    const e = this.elasticity === "elastic" ? 1 : 0;

    bodyA.velocity = (m1 * u1 + m2 * u2 - m2 * e * (u1 - u2)) / totalMass;
    bodyB.velocity = (m1 * u1 + m2 * u2 + m1 * e * (u1 - u2)) / totalMass;
    bodyA.collided = true;
    bodyB.collided = true;

    const midpoint = (bodyA.position.x + bodyB.position.x) / 2;
    bodyA.position.x = midpoint - this.bodyWidth / 2;
    bodyB.position.x = midpoint + this.bodyWidth / 2;
  }

  private stepOnce() {
    const speedMultiplier = this.resolveSpeedMultiplier();
    this.timeElapsed += this.timeStep * speedMultiplier;
    this.bodies.forEach((body) => {
      body.position.x += body.velocity * this.timeStep * speedMultiplier;
    });
    this.applyCollisionIfNeeded();
    this.clampBodyPositions();
  }

  private getBodyByIndex(bodyIndex: number) {
    const body = this.bodies[bodyIndex];
    if (!body) {
      throw new Error("bodyIndex must be 0 or 1");
    }
    return body;
  }

  control(input: {
    action:
      | "start"
      | "pause"
      | "toggle_play"
      | "restart"
      | "step"
      | "set_elasticity"
      | "set_time_speed"
      | "set_body_mass"
      | "set_body_velocity"
      | "set_body_position";
    bodyIndex?: number;
    value?: number | string | boolean;
    steps?: number;
  }) {
    switch (input.action) {
      case "start":
        this.isMoving = true;
        break;
      case "pause":
        this.isMoving = false;
        break;
      case "toggle_play":
        this.isMoving = !this.isMoving;
        break;
      case "restart":
        this.timeElapsed = 0;
        this.isMoving = false;
        this.bodies.forEach((body) => {
          body.position.x = body.initialPosition.x;
          body.velocity = body.initialVelocity;
          body.collided = false;
        });
        break;
      case "step": {
        const steps = Math.max(1, Math.floor(input.steps ?? 1));
        for (let i = 0; i < steps; i += 1) {
          this.stepOnce();
        }
        break;
      }
      case "set_elasticity": {
        if (input.value !== "elastic" && input.value !== "inelastic") {
          throw new Error("value must be 'elastic' or 'inelastic'");
        }
        this.elasticity = input.value;
        break;
      }
      case "set_time_speed": {
        if (input.value === "normal") {
          this.timeSpeed = "normal";
        } else if (input.value === "slow") {
          this.timeSpeed = "slow";
        } else {
          throw new Error("value must be 'normal' or 'slow'");
        }
        break;
      }
      case "set_body_mass": {
        if (
          typeof input.bodyIndex !== "number" ||
          typeof input.value !== "number"
        ) {
          throw new Error("bodyIndex and numeric value are required");
        }
        this.getBodyByIndex(input.bodyIndex).mass = input.value;
        break;
      }
      case "set_body_velocity": {
        if (
          typeof input.bodyIndex !== "number" ||
          typeof input.value !== "number"
        ) {
          throw new Error("bodyIndex and numeric value are required");
        }
        const body = this.getBodyByIndex(input.bodyIndex);
        body.velocity = input.value;
        body.initialVelocity = input.value;
        break;
      }
      case "set_body_position": {
        if (
          typeof input.bodyIndex !== "number" ||
          typeof input.value !== "number"
        ) {
          throw new Error("bodyIndex and numeric value are required");
        }
        const body = this.getBodyByIndex(input.bodyIndex);
        body.position.x = input.value;
        body.initialPosition.x = input.value;
        break;
      }
      default:
        throw new Error(`Unsupported action: ${input.action}`);
    }

    return this.getStatus();
  }
}

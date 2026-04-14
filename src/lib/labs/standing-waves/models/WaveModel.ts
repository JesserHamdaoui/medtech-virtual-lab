import { Property } from "../utils/Property";
import { Emitter } from "../utils/Emitter";
import { EndType } from "../types/EndType";
import { TimeSpeed } from "../types/TimeSpeed";
import { linear } from "../utils/math";
import { FIXED_Y, BALL_COUNT } from "../constants/config";
import { FRAMES_PER_SECOND, AMPLITUDE_MULTIPLIER } from "../constants/physics";

export class WaveModel {
  // Arrays for wave calculation
  private yDraw: Float64Array;
  private yNow: Float64Array;
  private yLast: Float64Array;
  private yNext: Float64Array;

  // Properties matching reference implementation
  public readonly endTypeProperty: Property<EndType>;
  public readonly isPlayingProperty: Property<boolean>;
  public readonly isOscillatingProperty: Property<boolean>;
  public readonly timeSpeedProperty: Property<TimeSpeed>;

  // Visibility properties
  public readonly rulersVisibleProperty: Property<boolean>;
  public readonly referenceLineVisibleProperty: Property<boolean>;

  // Physics properties with ranges
  public readonly tensionProperty: Property<number>;
  public readonly dampingProperty: Property<number>;
  public readonly frequencyProperty: Property<number>;
  public readonly amplitudeProperty: Property<number>;

  // Time tracking properties
  public readonly timeElapsedProperty: Property<number>;
  public readonly lastDtProperty: Property<number>;
  public readonly angleProperty: Property<number>;

  // Events
  public readonly yNowChangedEmitter = new Emitter();

  // Add new properties for internal state
  private readonly LAST_INDEX = BALL_COUNT - 1;
  private readonly NEXT_TO_LAST_INDEX = BALL_COUNT - 2;
  private stepDtProperty: Property<number>;
  private nextLeftYProperty: Property<number>;

  constructor() {
    // Initialize arrays at FIXED_Y
    this.yDraw = new Float64Array(BALL_COUNT).fill(FIXED_Y);
    this.yNow = new Float64Array(BALL_COUNT).fill(FIXED_Y);
    this.yLast = new Float64Array(BALL_COUNT).fill(FIXED_Y);
    this.yNext = new Float64Array(BALL_COUNT).fill(FIXED_Y);

    // Initialize properties with ranges
    this.tensionProperty = new Property(0.8, { range: { min: 0.2, max: 0.8 } });
    this.dampingProperty = new Property(20, { range: { min: 0, max: 100 } });
    this.frequencyProperty = new Property(1.5, { range: { min: 0, max: 3 } });
    this.amplitudeProperty = new Property(0.75, {
      range: { min: 0, max: 1.3 },
    });
    this.angleProperty = new Property(0, {
      range: { min: 0, max: 2 * Math.PI },
    });

    // Initialize other properties
    this.endTypeProperty = new Property<EndType>(EndType.FIXED_END);
    this.isPlayingProperty = new Property(false);
    this.isOscillatingProperty = new Property(true);
    this.timeSpeedProperty = new Property<TimeSpeed>(TimeSpeed.NORMAL);
    this.rulersVisibleProperty = new Property(true);
    this.referenceLineVisibleProperty = new Property(true);
    this.timeElapsedProperty = new Property(0);
    this.lastDtProperty = new Property(0.03);
    this.stepDtProperty = new Property(0);
    this.nextLeftYProperty = new Property(0);

    // Listen for mode changes
  }

  update(
    time: number,
    dt: number,
    params: {
      amplitude: number;
      frequency: number;
      damping: number;
      tension: number;
      speedMultiplier?: number;
    },
  ) {
    const {
      amplitude,
      frequency,
      damping,
      tension,
      speedMultiplier = 1,
    } = params;

    // Calculate coefficients
    const beta =
      damping === 0 ? 0 : (linear(0, 100, 0, 0.05, damping) * dt) / 2;

    // Calculate tension factor with stability check
    const tensionFactor = linear(
      Math.sqrt(0.2),
      Math.sqrt(0.8),
      0.2,
      1,
      Math.sqrt(tension),
    );

    const v = 1;
    const dx = dt * v;
    const alpha = (v * dt * tensionFactor) / dx;
    const alphaSq = alpha * alpha;

    // Check CFL condition
    if (alphaSq > 1) {
      console.warn("CFL condition violated - simulation may become unstable");
    }

    // Wave equation coefficients
    const a = 1 / (beta + 1);
    const c = 2 * (1 - alphaSq);

    // Store current positions
    this.yLast.set(this.yNow);

    // Update driven end
    this.yNow[0] =
      FIXED_Y +
      amplitude * Math.sin(2 * Math.PI * frequency * time * speedMultiplier);

    // Main wave equation calculation
    for (let i = 1; i < BALL_COUNT - 1; i++) {
      this.yNext[i] =
        FIXED_Y +
        a *
          ((beta - 1) * (this.yLast[i] - FIXED_Y) +
            c * (this.yNow[i] - FIXED_Y) +
            alphaSq * (this.yNow[i + 1] + this.yNow[i - 1] - 2 * FIXED_Y));
    }

    // Fixed end condition
    this.yNext[BALL_COUNT - 1] = FIXED_Y;

    // Rotate arrays for next step
    [this.yLast, this.yNow, this.yNext] = [this.yNow, this.yNext, this.yLast];

    // Update drawing array
    this.yDraw.set(this.yNow);
  }

  getPositions(): Float64Array {
    return this.yDraw;
  }

  manualRestart() {
    // Reset all properties to initial values
    this.angleProperty.value = 0;
    this.timeElapsedProperty.value = 0;
    this.nextLeftYProperty.value = FIXED_Y;

    // Reset all arrays to FIXED_Y
    this.yDraw.fill(FIXED_Y);
    this.yNow.fill(FIXED_Y);
    this.yLast.fill(FIXED_Y);
    this.yNext.fill(FIXED_Y);

    // Notify listeners of the change
    this.yNowChangedEmitter.emit();
  }

  step(dt: number) {
    const fixDt = 1 / FRAMES_PER_SECOND;

    // Limit changes in dt
    const lastDt = this.lastDtProperty.value;
    if (Math.abs(dt - lastDt) > lastDt * 0.3) {
      dt = lastDt + (dt - lastDt < 0 ? -1 : 1) * lastDt * 0.3;
    }
    this.lastDtProperty.value = dt;

    if (this.isPlayingProperty.value) {
      this.stepDtProperty.value += dt;

      // Limit min dt
      if (this.stepDtProperty.value >= fixDt) {
        this.manualStep(this.stepDtProperty.value);
        this.stepDtProperty.value %= fixDt;
      }
    }
    this.nextLeftYProperty.value = this.yNow[0];
  }

  evolve() {
    const dt = 1;
    const v = 1;
    const dx = dt * v;
    const b = this.dampingProperty.value * 0.002;

    // Calculate coefficients
    const beta = (b * dt) / 2;
    const alpha = (v * dt) / dx;

    // Keep first point's position
    this.yNext[0] = this.yNow[0];

    // Handle end conditions
    switch (this.endTypeProperty.value) {
      case EndType.FIXED_END:
        this.yNow[this.LAST_INDEX] = FIXED_Y;
        break;
      case EndType.LOOSE_END:
        this.yNow[this.LAST_INDEX] = this.yNow[this.NEXT_TO_LAST_INDEX];
        break;
      default:
        throw new Error(`Unknown end type: ${this.endTypeProperty.value}`);
    }

    // Main wave equation calculation
    const a = 1 / (beta + 1);
    const alphaSq = alpha * alpha;
    const c = 2 * (1 - alphaSq);

    for (let i = 1; i < this.LAST_INDEX; i++) {
      this.yNext[i] =
        FIXED_Y +
        a *
          ((beta - 1) * (this.yLast[i] - FIXED_Y) +
            c * (this.yNow[i] - FIXED_Y) +
            alphaSq * (this.yNow[i + 1] + this.yNow[i - 1] - 2 * FIXED_Y));
    }

    // Store old values for the last point
    const oldLast = this.yLast[this.LAST_INDEX];
    const oldNow = this.yNow[this.LAST_INDEX];
    const oldNext = this.yNext[this.LAST_INDEX];

    // Rotate arrays for efficiency
    const old = this.yLast;
    this.yLast = this.yNow;
    this.yNow = this.yNext;
    this.yNext = old;

    // Restore last point values
    this.yLast[this.LAST_INDEX] = oldLast;
    this.yNow[this.LAST_INDEX] = oldNow;
    this.yNext[this.LAST_INDEX] = oldNext;

    // Handle end conditions again after rotation
    switch (this.endTypeProperty.value) {
      case EndType.FIXED_END:
        this.yLast[this.LAST_INDEX] = FIXED_Y;
        this.yNow[this.LAST_INDEX] = FIXED_Y;
        break;
      case EndType.LOOSE_END:
        this.yLast[this.LAST_INDEX] = this.yNow[this.LAST_INDEX];
        this.yNow[this.LAST_INDEX] = this.yNow[this.NEXT_TO_LAST_INDEX];
        break;
      default:
        throw new Error(`Unknown end type: ${this.endTypeProperty.value}`);
    }
  }

  manualStep(dt: number) {
    const fixDt = 1 / FRAMES_PER_SECOND;
    dt = dt !== undefined && dt > 0 ? dt : fixDt;

    const speedMultiplier =
      this.timeSpeedProperty.value === TimeSpeed.NORMAL
        ? 1
        : this.timeSpeedProperty.value === TimeSpeed.SLOW
          ? 0.25
          : 1;

    // Calculate tension factor for dt adjustment
    const tensionFactor = linear(
      Math.sqrt(0.2),
      Math.sqrt(0.8),
      0.2,
      1,
      Math.sqrt(this.tensionProperty.value),
    );
    const minDt = 1 / (FRAMES_PER_SECOND * tensionFactor * speedMultiplier);

    // Main simulation loop
    while (dt >= fixDt) {
      this.timeElapsedProperty.value = this.timeElapsedProperty.value + fixDt;

      // Only update oscillator if oscillating is active
      if (this.isOscillatingProperty.value) {
        this.angleProperty.value =
          (this.angleProperty.value +
            Math.PI *
              2 *
              this.frequencyProperty.value *
              fixDt *
              speedMultiplier) %
          (Math.PI * 2);
        this.yDraw[0] = this.yNow[0] =
          FIXED_Y +
          this.amplitudeProperty.value *
            AMPLITUDE_MULTIPLIER *
            Math.sin(-this.angleProperty.value);
      }

      // Evolve the system
      if (this.timeElapsedProperty.value >= minDt) {
        this.timeElapsedProperty.value %= minDt;
        this.evolve();
        // Update drawing array
        this.yDraw.set(this.yLast);
      } else {
        // Interpolate between steps
        for (let i = 1; i < BALL_COUNT; i++) {
          this.yDraw[i] =
            this.yLast[i] +
            (this.yNow[i] - this.yLast[i]) *
              (this.timeElapsedProperty.value / minDt);
        }
      }

      dt -= fixDt;
    }

    this.yNowChangedEmitter.emit();
  }

  toggleEndMode() {
    this.endTypeProperty.value =
      this.endTypeProperty.value === EndType.FIXED_END
        ? EndType.LOOSE_END
        : EndType.FIXED_END;
  }

  setEndMode(isFixedEnd: boolean) {
    this.endTypeProperty.value = isFixedEnd
      ? EndType.FIXED_END
      : EndType.LOOSE_END;
  }
}

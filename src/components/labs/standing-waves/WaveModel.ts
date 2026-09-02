import { Property } from "@/lib/sims/core/Property";
import { Emitter } from "@/lib/sims/core/Emitter";
import { EndType, TimeSpeed } from "./types";
import { linear } from "./math";
import { FIXED_Y, BALL_COUNT, FRAMES_PER_SECOND, AMPLITUDE_MULTIPLIER } from "./constants";

export class WaveModel {
  private yDraw: Float64Array;
  private yNow: Float64Array;
  private yLast: Float64Array;
  private yNext: Float64Array;

  public readonly endTypeProperty: Property<EndType>;
  public readonly isPlayingProperty: Property<boolean>;
  public readonly isOscillatingProperty: Property<boolean>;
  public readonly timeSpeedProperty: Property<TimeSpeed>;

  public readonly rulersVisibleProperty: Property<boolean>;
  public readonly referenceLineVisibleProperty: Property<boolean>;

  public readonly tensionProperty: Property<number>;
  public readonly dampingProperty: Property<number>;
  public readonly frequencyProperty: Property<number>;
  public readonly amplitudeProperty: Property<number>;

  public readonly timeElapsedProperty: Property<number>;
  public readonly lastDtProperty: Property<number>;
  public readonly angleProperty: Property<number>;

  public readonly yNowChangedEmitter = new Emitter();

  private readonly LAST_INDEX = BALL_COUNT - 1;
  private readonly NEXT_TO_LAST_INDEX = BALL_COUNT - 2;
  private stepDtProperty: Property<number>;
  private nextLeftYProperty: Property<number>;

  constructor() {
    this.yDraw = new Float64Array(BALL_COUNT).fill(FIXED_Y);
    this.yNow = new Float64Array(BALL_COUNT).fill(FIXED_Y);
    this.yLast = new Float64Array(BALL_COUNT).fill(FIXED_Y);
    this.yNext = new Float64Array(BALL_COUNT).fill(FIXED_Y);

    this.tensionProperty = new Property(0.8, { range: { min: 0.2, max: 0.8 } });
    this.dampingProperty = new Property(20, { range: { min: 0, max: 100 } });
    this.frequencyProperty = new Property(1.5, { range: { min: 0, max: 3 } });
    this.amplitudeProperty = new Property(0.75, { range: { min: 0, max: 1.3 } });
    this.angleProperty = new Property(0, { range: { min: 0, max: 2 * Math.PI } });

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
  }

  getPositions(): Float64Array {
    return this.yDraw;
  }

  manualRestart() {
    this.angleProperty.value = 0;
    this.timeElapsedProperty.value = 0;
    this.nextLeftYProperty.value = FIXED_Y;

    this.yDraw.fill(FIXED_Y);
    this.yNow.fill(FIXED_Y);
    this.yLast.fill(FIXED_Y);
    this.yNext.fill(FIXED_Y);

    this.yNowChangedEmitter.emit();
  }

  step(dt: number) {
    const fixDt = 1 / FRAMES_PER_SECOND;

    const lastDt = this.lastDtProperty.value;
    if (Math.abs(dt - lastDt) > lastDt * 0.3) {
      dt = lastDt + (dt - lastDt < 0 ? -1 : 1) * lastDt * 0.3;
    }
    this.lastDtProperty.value = dt;

    if (this.isPlayingProperty.value) {
      this.stepDtProperty.value += dt;

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

    const beta = (b * dt) / 2;
    const alpha = (v * dt) / dx;

    this.yNext[0] = this.yNow[0];

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

    const oldLast = this.yLast[this.LAST_INDEX];
    const oldNow = this.yNow[this.LAST_INDEX];
    const oldNext = this.yNext[this.LAST_INDEX];

    const old = this.yLast;
    this.yLast = this.yNow;
    this.yNow = this.yNext;
    this.yNext = old;

    this.yLast[this.LAST_INDEX] = oldLast;
    this.yNow[this.LAST_INDEX] = oldNow;
    this.yNext[this.LAST_INDEX] = oldNext;

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
          : null;

    if (speedMultiplier === null) {
      throw new Error("Unsupported time speed value");
    }

    const tensionFactor = linear(
      Math.sqrt(0.2),
      Math.sqrt(0.8),
      0.2,
      1,
      Math.sqrt(this.tensionProperty.value),
    );
    const minDt = 1 / (FRAMES_PER_SECOND * tensionFactor * speedMultiplier);

    while (dt >= fixDt) {
      this.timeElapsedProperty.value = this.timeElapsedProperty.value + fixDt;

      if (this.isOscillatingProperty.value) {
        this.angleProperty.value =
          (this.angleProperty.value +
            Math.PI * 2 * this.frequencyProperty.value * fixDt * speedMultiplier) %
          (Math.PI * 2);
        this.yDraw[0] = this.yNow[0] =
          FIXED_Y +
          this.amplitudeProperty.value *
            AMPLITUDE_MULTIPLIER *
            Math.sin(-this.angleProperty.value);
      }

      if (this.timeElapsedProperty.value >= minDt) {
        this.timeElapsedProperty.value %= minDt;
        this.evolve();
        this.yDraw.set(this.yLast);
      } else {
        for (let i = 1; i < BALL_COUNT; i++) {
          this.yDraw[i] =
            this.yLast[i] +
            (this.yNow[i] - this.yLast[i]) * (this.timeElapsedProperty.value / minDt);
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
}

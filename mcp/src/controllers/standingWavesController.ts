type EndType = "FIXED_END" | "LOOSE_END";
type TimeSpeed = "NORMAL" | "SLOW";

interface StandingState {
  endType: EndType;
  isPlaying: boolean;
  isOscillating: boolean;
  timeSpeed: TimeSpeed;
  rulersVisible: boolean;
  referenceLineVisible: boolean;
  tension: number;
  damping: number;
  frequency: number;
  amplitude: number;
  elapsed: number;
  phase: number;
  positions: number[];
}

export class StandingWavesController {
  private readonly pointCount = 81;
  private readonly fixedY = 200;
  private state: StandingState = this.createInitialState();

  private createInitialState(): StandingState {
    return {
      endType: "FIXED_END",
      isPlaying: false,
      isOscillating: true,
      timeSpeed: "NORMAL",
      rulersVisible: true,
      referenceLineVisible: true,
      tension: 0.8,
      damping: 20,
      frequency: 1.5,
      amplitude: 0.75,
      elapsed: 0,
      phase: 0,
      positions: Array(this.pointCount).fill(this.fixedY),
    };
  }

  private speedMultiplier() {
    return this.state.timeSpeed === "SLOW" ? 0.25 : 1;
  }

  private clampRange(value: number, min: number, max: number) {
    return Math.min(max, Math.max(min, value));
  }

  private advance(seconds: number) {
    const scaledSeconds = seconds * this.speedMultiplier();
    this.state.elapsed += scaledSeconds;
    this.state.phase += 2 * Math.PI * this.state.frequency * scaledSeconds;

    const dampingFactor = this.clampRange(1 - this.state.damping / 200, 0.4, 1);
    const amplitudePx = this.state.amplitude * 60;
    const endMultiplier = this.state.endType === "FIXED_END" ? 1 : 0.6;

    for (let i = 0; i < this.pointCount; i += 1) {
      const x = i / (this.pointCount - 1);
      const envelope = Math.sin(Math.PI * x * endMultiplier);
      const oscillation = this.state.isOscillating
        ? Math.sin(this.state.phase * (1 + x * this.state.tension))
        : 0;
      this.state.positions[i] =
        this.fixedY + amplitudePx * envelope * oscillation * dampingFactor;
    }

    this.state.positions[this.pointCount - 1] =
      this.state.endType === "FIXED_END"
        ? this.fixedY
        : this.state.positions[this.pointCount - 2];
  }

  getStatus() {
    return {
      lab: "standing-waves",
      endType: this.state.endType,
      isPlaying: this.state.isPlaying,
      isOscillating: this.state.isOscillating,
      timeSpeed: this.state.timeSpeed,
      rulersVisible: this.state.rulersVisible,
      referenceLineVisible: this.state.referenceLineVisible,
      tension: this.state.tension,
      damping: this.state.damping,
      frequency: this.state.frequency,
      amplitude: this.state.amplitude,
      positions: this.state.positions,
    };
  }

  getCapabilities() {
    return {
      lab: "standing-waves",
      actions: [
        "play",
        "pause",
        "toggle_play",
        "restart",
        "step",
        "toggle_end",
        "set_end",
        "set_time_speed",
        "set_tension",
        "set_damping",
        "set_frequency",
        "set_amplitude",
        "toggle_oscillation",
        "toggle_rulers",
        "toggle_reference_line",
      ],
      parameters: [
        { name: "end", type: "enum", values: ["fixed", "loose"] },
        { name: "time_speed", type: "enum", values: ["normal", "slow"] },
        { name: "tension", type: "number", min: 0.2, max: 0.8 },
        { name: "damping", type: "number", min: 0, max: 100 },
        { name: "frequency", type: "number", min: 0, max: 3 },
        { name: "amplitude", type: "number", min: 0, max: 1.3 },
      ],
    };
  }

  control(input: {
    action:
      | "play"
      | "pause"
      | "toggle_play"
      | "restart"
      | "step"
      | "toggle_end"
      | "set_end"
      | "set_time_speed"
      | "set_tension"
      | "set_damping"
      | "set_frequency"
      | "set_amplitude"
      | "toggle_oscillation"
      | "toggle_rulers"
      | "toggle_reference_line";
    value?: number | string | boolean;
    seconds?: number;
  }) {
    switch (input.action) {
      case "play":
        this.state.isPlaying = true;
        break;
      case "pause":
        this.state.isPlaying = false;
        break;
      case "toggle_play":
        this.state.isPlaying = !this.state.isPlaying;
        break;
      case "restart":
        this.state = this.createInitialState();
        break;
      case "step": {
        const seconds = Math.max(1 / 60, Number(input.seconds ?? 1 / 60));
        this.advance(seconds);
        break;
      }
      case "toggle_end":
        this.state.endType =
          this.state.endType === "FIXED_END" ? "LOOSE_END" : "FIXED_END";
        break;
      case "set_end":
        if (input.value === "fixed") {
          this.state.endType = "FIXED_END";
        } else if (input.value === "loose") {
          this.state.endType = "LOOSE_END";
        } else {
          throw new Error("value must be 'fixed' or 'loose'");
        }
        break;
      case "set_time_speed":
        if (input.value === "normal") {
          this.state.timeSpeed = "NORMAL";
        } else if (input.value === "slow") {
          this.state.timeSpeed = "SLOW";
        } else {
          throw new Error("value must be 'normal' or 'slow'");
        }
        break;
      case "set_tension":
        if (typeof input.value !== "number") {
          throw new Error("numeric value is required");
        }
        this.state.tension = this.clampRange(input.value, 0.2, 0.8);
        break;
      case "set_damping":
        if (typeof input.value !== "number") {
          throw new Error("numeric value is required");
        }
        this.state.damping = this.clampRange(input.value, 0, 100);
        break;
      case "set_frequency":
        if (typeof input.value !== "number") {
          throw new Error("numeric value is required");
        }
        this.state.frequency = this.clampRange(input.value, 0, 3);
        break;
      case "set_amplitude":
        if (typeof input.value !== "number") {
          throw new Error("numeric value is required");
        }
        this.state.amplitude = this.clampRange(input.value, 0, 1.3);
        break;
      case "toggle_oscillation":
        this.state.isOscillating = !this.state.isOscillating;
        break;
      case "toggle_rulers":
        this.state.rulersVisible = !this.state.rulersVisible;
        break;
      case "toggle_reference_line":
        this.state.referenceLineVisible = !this.state.referenceLineVisible;
        break;
      default:
        throw new Error(`Unsupported action: ${input.action}`);
    }

    if (this.state.isPlaying) {
      this.advance(1 / 60);
    }

    return this.getStatus();
  }
}

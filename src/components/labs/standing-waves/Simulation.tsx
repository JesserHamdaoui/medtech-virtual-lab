import { useEffect, useRef } from "react";
import P5 from "p5";
import { createStandingWavesSketch } from "@/lib/labs/standing-waves/sketches/main";
import { useKeyboardControls } from "@/components/labs/shared";
import { WaveModel } from "@/lib/labs/standing-waves/models/WaveModel";
import { TimeSpeed } from "@/lib/labs/standing-waves/types/TimeSpeed";
import {
  LAB_ASSISTANT_CONTROL_EVENT,
  LabAssistantControlDetail,
} from "@/components/labs/assistant/events";

const standingWavesStyles = `
.standing-waves-lab {
  position: relative;
  width: 100%;
  min-height: 600px;
  background-color: rgb(230, 236, 238);
  overflow-x: auto;
  overflow-y: hidden;
}

.standing-waves-lab input {
  border: none;
  background-color: #f2f2f2;
  border-radius: 0.5em;
  padding: 10px 15px;
  text-align: center;
  font-size: 16px;
}

.standing-waves-lab .control-container {
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  justify-content: space-between;
  margin: 16px auto 0;
  width: calc(100% - 80px);
  max-width: 1120px;
  min-width: 980px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  box-sizing: border-box;
}

.standing-waves-lab .parameters-container,
.standing-waves-lab .control-buttons-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  height: 100%;
}

.standing-waves-lab .parameters-container {
  padding: 10px 16px;
  background-color: #f2f2f2;
  opacity: 0.9;
  border-radius: 0 10px 10px 0;
  gap: 15px;
  flex: 1;
  min-width: 0;
}

.standing-waves-lab .control-buttons-container {
  background-color: #83cbe5;
  border-radius: 10px 0 0 10px;
  padding: 14px 16px;
  gap: 10px;
  position: relative;
  min-width: 280px;
}

.standing-waves-lab .sliders-container,
.standing-waves-lab .steppers-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.standing-waves-lab .sliders-container {
  gap: 7.5px;
  border-right: 1px solid #0c455a;
  border-left: 1px solid #0c455a;
  padding: 0 15px;
}

.standing-waves-lab button {
  border: none;
  background-color: #2596be;
  border-radius: 0.5em;
  color: white;
  padding: 10px 15px;
  text-align: center;
  font-size: 12px;
  cursor: pointer;
}

.standing-waves-lab button:hover {
  background-color: #1a6c8f;
}

.standing-waves-lab button.toggle-button[data-type="icon"] {
  position: static;
}

.standing-waves-lab .control-buttons-container .control-button {
  min-height: 42px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  white-space: nowrap;
}

.standing-waves-lab .slider-container,
.standing-waves-lab .stepper-container,
.standing-waves-lab .toggle-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.standing-waves-lab .slider-label {
  width: 80px;
  text-align: right;
}

.standing-waves-lab .stepper-label {
  width: 100px;
  text-align: right;
}

.standing-waves-lab .stepper-button {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.standing-waves-lab .stepper-input {
  width: 70px;
  text-align: center;
}

.standing-waves-lab .control-with-key {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.standing-waves-lab .key-hint {
  position: absolute;
  right: -4px;
  top: -14px;
  font-size: 10px;
  color: #0c455a;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  white-space: nowrap;
  background: rgba(5, 121, 153, 0.12);
  border: 1px solid rgba(5, 121, 153, 0.35);
  border-radius: 9999px;
  padding: 1px 6px;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.standing-waves-lab .stopwatch-key-hint {
  position: absolute;
  top: -10px;
  right: -8px;
  background: #057999;
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.75);
  border-radius: 9999px;
  padding: 1px 6px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.standing-waves-lab .toggle-switch {
  min-width: 50px;
  height: 24px;
  background-color: #ccc;
  border-radius: 12px;
  position: relative;
  cursor: pointer;
  display: inline-block;
  transition: background-color 0.2s ease-in-out;
}

.standing-waves-lab .toggle-switch.active {
  background-color: #2596be;
}

.standing-waves-lab .toggle-knob {
  width: 20px;
  height: 20px;
  background-color: #fff;
  border-radius: 50%;
  position: absolute;
  top: 2px;
  left: 2px;
  transition: left 0.2s ease-in-out;
}

.standing-waves-lab .toggle-switch.active .toggle-knob {
  left: 26px;
}

.standing-waves-lab #stopwatch {
  background: #f2f2f2;
  border-radius: 8px;
  padding: 12px 15px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  min-width: 160px;
  transform: scale(0.9);
  transform-origin: top right;
  border: 1px solid #0c455a;
  opacity: 0.9;
  z-index: 20;
}

.standing-waves-lab #stopwatch p {
  font-size: 1.5em;
  margin: 0 0 12px 0;
  padding: 8px;
  text-align: center;
  color: #0c455a;
  background: white;
  border-radius: 6px;
  border: 1px solid #83cbe5;
  font-family: "Courier New", monospace;
}

.standing-waves-lab #stopwatch button {
  padding: 6px 12px;
  min-width: 32px;
  border-radius: 6px;
  font-size: 0.8em;
  background: #83cbe5;
  color: #0c455a;
  margin: 0 4px;
}

.standing-waves-lab .fas {
  pointer-events: none;
}
`;

export default function Simulation() {
  const canvasHostRef = useRef<HTMLDivElement | null>(null);
  const p5InstanceRef = useRef<P5 | null>(null);
  const modelRef = useRef<WaveModel | null>(null);
  const controlsRef = useRef<{
    startPause: () => void;
    restart: () => void;
    toggleSlowFast: () => void;
    stopwatchPlayPause: () => void;
    stopwatchReset: () => void;
    toggleEnd: () => void;
  } | null>(null);
  const keyState = useKeyboardControls();

  useEffect(() => {
    const styleTag = document.createElement("style");
    styleTag.dataset.standingWaves = "true";
    styleTag.textContent = standingWavesStyles;
    document.head.appendChild(styleTag);

    return () => {
      document.head.removeChild(styleTag);
    };
  }, []);

  useEffect(() => {
    if (!canvasHostRef.current) {
      return;
    }

    const hostElement = canvasHostRef.current;

    const sketch = createStandingWavesSketch({
      hostElement,
      getCanvasSize: () => ({
        width: 1120,
        height: 400,
      }),
      onModelCreated: (model) => {
        modelRef.current = model;
      },
      onControlsReady: (controls) => {
        controlsRef.current = controls;
      },
    });

    p5InstanceRef.current = new P5(sketch, hostElement);

    return () => {
      p5InstanceRef.current?.remove();
      p5InstanceRef.current = null;
      hostElement.replaceChildren();
    };
  }, []);

  // Handle keyboard controls
  useEffect(() => {
    if (!modelRef.current) return;

    const model = modelRef.current;
    const stepSize = 0.05;

    // w1: Amplitude
    if (keyState.w1Increase) {
      model.amplitudeProperty.value = Math.min(
        model.amplitudeProperty.value + stepSize,
        1.3,
      );
    }
    if (keyState.w1Decrease) {
      model.amplitudeProperty.value = Math.max(
        model.amplitudeProperty.value - stepSize,
        0,
      );
    }

    // w2: Frequency
    if (keyState.w2Increase) {
      model.frequencyProperty.value = Math.min(
        model.frequencyProperty.value + stepSize * 0.5,
        3,
      );
    }
    if (keyState.w2Decrease) {
      model.frequencyProperty.value = Math.max(
        model.frequencyProperty.value - stepSize * 0.5,
        0,
      );
    }

    // w3: Tension
    if (keyState.w3Increase) {
      model.tensionProperty.value = Math.min(
        model.tensionProperty.value + stepSize,
        0.8,
      );
    }
    if (keyState.w3Decrease) {
      model.tensionProperty.value = Math.max(
        model.tensionProperty.value - stepSize,
        0.2,
      );
    }

    // w4: Damping
    if (keyState.w4Increase) {
      model.dampingProperty.value = Math.min(
        model.dampingProperty.value + stepSize * 5,
        100,
      );
    }
    if (keyState.w4Decrease) {
      model.dampingProperty.value = Math.max(
        model.dampingProperty.value - stepSize * 5,
        0,
      );
    }

    if (keyState.b1) controlsRef.current?.startPause();
    if (keyState.b2) {
      controlsRef.current?.restart();
      controlsRef.current?.stopwatchReset();
    }
    if (keyState.b3) controlsRef.current?.toggleSlowFast();
    if (keyState.b4) controlsRef.current?.stopwatchPlayPause();
    if (keyState.b5) controlsRef.current?.toggleEnd();
  }, [keyState]);

  useEffect(() => {
    const handleAssistantControl = (event: Event) => {
      const customEvent = event as CustomEvent<LabAssistantControlDetail>;
      if (
        !customEvent.detail ||
        customEvent.detail.labId !== "standing-waves"
      ) {
        return;
      }

      const model = modelRef.current;
      if (!model) {
        return;
      }

      const action = customEvent.detail.action as {
        action?: string;
        value?: number | string;
        seconds?: number;
      };

      switch (action.action) {
        case "play":
          model.isPlayingProperty.value = true;
          break;
        case "pause":
          model.isPlayingProperty.value = false;
          break;
        case "toggle_play":
          controlsRef.current?.startPause();
          break;
        case "restart":
          controlsRef.current?.restart();
          controlsRef.current?.stopwatchReset();
          break;
        case "step":
          model.manualStep(Math.max(1 / 60, Number(action.seconds ?? 1 / 60)));
          break;
        case "toggle_end":
          controlsRef.current?.toggleEnd();
          break;
        case "set_end":
          if (action.value === "fixed") {
            model.setEndMode(true);
          }
          if (action.value === "loose") {
            model.setEndMode(false);
          }
          break;
        case "set_time_speed":
          if (action.value === "normal") {
            model.timeSpeedProperty.value = TimeSpeed.NORMAL;
          }
          if (action.value === "slow") {
            model.timeSpeedProperty.value = TimeSpeed.SLOW;
          }
          break;
        case "set_tension":
          if (typeof action.value === "number") {
            model.tensionProperty.value = action.value;
          }
          break;
        case "set_damping":
          if (typeof action.value === "number") {
            model.dampingProperty.value = action.value;
          }
          break;
        case "set_frequency":
          if (typeof action.value === "number") {
            model.frequencyProperty.value = action.value;
          }
          break;
        case "set_amplitude":
          if (typeof action.value === "number") {
            model.amplitudeProperty.value = action.value;
          }
          break;
        case "toggle_oscillation":
          model.isOscillatingProperty.value =
            !model.isOscillatingProperty.value;
          break;
        case "toggle_rulers":
          model.rulersVisibleProperty.value =
            !model.rulersVisibleProperty.value;
          break;
        case "toggle_reference_line":
          model.referenceLineVisibleProperty.value =
            !model.referenceLineVisibleProperty.value;
          break;
        default:
          break;
      }
    };

    window.addEventListener(
      LAB_ASSISTANT_CONTROL_EVENT,
      handleAssistantControl,
    );
    return () => {
      window.removeEventListener(
        LAB_ASSISTANT_CONTROL_EVENT,
        handleAssistantControl,
      );
    };
  }, []);

  return (
    <div className="standing-waves-lab relative w-full min-h-160">
      <div ref={canvasHostRef} className="pt-14" />
    </div>
  );
}

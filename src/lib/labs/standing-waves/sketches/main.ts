import p5 from "p5";
import { WaveModel } from "../models/WaveModel";
import {
  DASH_PATTERN,
  ReferenceLine,
} from "@/components/labs/standing-waves/ReferenceLine";
import {
  drawRulers,
  handleRulerInteractions,
} from "@/components/labs/standing-waves/Rulers";
import {
  FIXED_Y,
  BALL_RADIUS,
  BALL_COUNT,
  BALL_SPACING,
} from "../constants/config";
import { EndType } from "../types/EndType";
import { TimeSpeed } from "../types/TimeSpeed";
import { initControlButtons, initParameters } from "../utils/helpers";
import { Stopwatch } from "@/components/labs/standing-waves/Stopwatch";

export interface StandingWavesSketchConfig {
  hostElement?: HTMLElement | null;
  getCanvasSize?: (p: p5) => { width: number; height: number };
  onModelCreated?: (model: WaveModel) => void;
  onControlsReady?: (controls: {
    startPause: () => void;
    restart: () => void;
    toggleSlowFast: () => void;
    stopwatchPlayPause: () => void;
    stopwatchReset: () => void;
    toggleEnd: () => void;
  }) => void;
}

const DEFAULT_SIZE = {
  width: 1120,
  height: 400,
};

export const createStandingWavesSketch = (
  config: StandingWavesSketchConfig = {},
) => {
  const getCanvasSize = config.getCanvasSize || (() => ({ ...DEFAULT_SIZE }));

  return (p: p5) => {
    let model: WaveModel;
    let balls: { x: number; y: number }[] = [];
    let referenceLines: ReferenceLine[] = [];
    let interactionHandler: ReturnType<typeof handleRulerInteractions>;
    let stopwatch: Stopwatch;
    let controlButtons: ReturnType<typeof initControlButtons> | undefined;
    let parameterControls: ReturnType<typeof initParameters> | undefined;

    p.setup = () => {
      const { width, height } = getCanvasSize(p);
      const canvas = p.createCanvas(width, height);

      if (config.hostElement) {
        canvas.parent(config.hostElement);
      }

      p.frameRate(120);

      model = new WaveModel();

      // Call the callback if provided
      if (config.onModelCreated) {
        config.onModelCreated(model);
      }

      balls = Array.from({ length: BALL_COUNT }, (_, i) => ({
        x: 100 + i * BALL_SPACING,
        y: FIXED_Y,
      }));

      interactionHandler = handleRulerInteractions(
        p,
        () => referenceLines,
        (newLines) => {
          referenceLines = newLines;
        },
      );

      stopwatch = new Stopwatch(config.hostElement ?? document.body);

      const controlContainer = p.createDiv();
      controlContainer.addClass("control-container");
      if (config.hostElement) {
        controlContainer.parent(config.hostElement);
      }

      parameterControls = initParameters(p, {
        onAmplitudeChange: (value) => (model.amplitudeProperty.value = value),
        onFrequencyChange: (value) => (model.frequencyProperty.value = value),
        onTensionChange: (value) => (model.tensionProperty.value = value),
        onDampingChange: (value) => (model.dampingProperty.value = value),
        onEndModeChange: (isFixedEnd) => model.setEndMode(isFixedEnd),
      });

      controlButtons = initControlButtons(p, {
        onPause: () => {
          stopwatch.setPaused(model.isPlayingProperty.value);
          model.isPlayingProperty.value = !model.isPlayingProperty.value;
        },
        onRestart: () => model.manualRestart(),
        onSlow: () => {
          model.timeSpeedProperty.value =
            model.timeSpeedProperty.value === TimeSpeed.NORMAL
              ? TimeSpeed.SLOW
              : TimeSpeed.NORMAL;

          p.frameRate(
            model.timeSpeedProperty.value === TimeSpeed.SLOW ? 30 : 120,
          );
        },
      });

      config.onControlsReady?.({
        startPause: () => controlButtons?.startPauseButton.trigger(),
        restart: () => controlButtons?.restartButton.trigger(),
        toggleSlowFast: () => controlButtons?.slowFastButton.trigger(),
        stopwatchPlayPause: () => stopwatch.togglePlayPause(),
        stopwatchReset: () => stopwatch.reset(),
        toggleEnd: () => parameterControls?.endToggle.trigger(),
      });

      model.yNowChangedEmitter.addListener(() => {
        const positions = model.getPositions();
        balls.forEach((ball, i) => {
          ball.y = positions[i];
        });
      });
    };

    p.draw = () => {
      const dt = p.deltaTime / 1000;
      model.step(dt);

      if (parameterControls) {
        parameterControls.amplitudeStepper.setValue(
          model.amplitudeProperty.value,
        );
        parameterControls.frequencyStepper.setValue(
          model.frequencyProperty.value,
        );
        parameterControls.tensionSlider.setValue(model.tensionProperty.value);
        parameterControls.dampingSlider.setValue(model.dampingProperty.value);
      }

      p.background(230, 236, 238);

      stopwatch.update(p.deltaTime, model.timeSpeedProperty.value);

      if (model.referenceLineVisibleProperty.value) {
        p.stroke(150);
        p.strokeWeight(1);
        p.drawingContext.setLineDash(DASH_PATTERN);
        p.line(70, FIXED_Y, p.width, FIXED_Y);
        p.drawingContext.setLineDash([]);
      }

      if (model.rulersVisibleProperty.value) {
        drawRulers(p, referenceLines, interactionHandler.getActiveLine());
      }

      p.stroke(12, 69, 90);
      p.fill(12, 69, 90);

      balls.forEach((ball, i) => {
        if (i < balls.length - 1) {
          p.line(ball.x, ball.y, balls[i + 1].x, balls[i + 1].y);
        }
        if (i % 10 === 0) {
          p.fill(190, 77, 37);
          p.stroke(190, 77, 37);
        }
        p.ellipse(ball.x, ball.y, BALL_RADIUS);
        p.fill(12, 69, 90);
        p.stroke(12, 69, 90);
      });

      if (model.endTypeProperty.value === EndType.FIXED_END) {
        const lastBall = balls[balls.length - 1];
        p.push();
        p.stroke(120);
        p.fill(180);
        p.rect(lastBall.x + 18, lastBall.y - 60, 14, 120, 4);
        p.pop();
      }
    };

    p.windowResized = () => {
      const { width, height } = getCanvasSize(p);
      p.resizeCanvas(width, height);
    };

    (
      p as unknown as {
        registerMethod?: (name: string, fn: () => void) => void;
      }
    ).registerMethod?.("remove", () => {
      stopwatch?.destroy();
    });
  };
};

export default createStandingWavesSketch();

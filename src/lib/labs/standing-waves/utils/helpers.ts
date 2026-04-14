import { ControlButton } from "@/components/labs/standing-waves/Buttons/ControlButton";
import { ToggleButton } from "@/components/labs/standing-waves/Buttons/ToggleButton";
import { Slider } from "@/components/labs/standing-waves/Parameters/Slider";
import { Stepper } from "@/components/labs/standing-waves/Parameters/Stepper";
import { Toggle } from "@/components/labs/standing-waves/Parameters/Toggle";
import p5 from "p5";
import { icon } from "@fortawesome/fontawesome-svg-core";
import {
  faPause,
  faPlay,
  faRotateRight,
} from "@fortawesome/free-solid-svg-icons";

const playIconHtml = icon(faPlay).html.join("");
const pauseIconHtml = icon(faPause).html.join("");
const restartIconHtml = icon(faRotateRight).html.join("");

export const createDiv = (id: string, text: string) => {
  let div = document.getElementById(id);
  if (!div) {
    div = document.createElement("div");
    div.id = id;
    document.body.appendChild(div);
  }
  div.innerText = text;
  return div;
};

export const createButton = (id: string, text: string, onClick: () => void) => {
  let button = document.getElementById(id);
  if (!button) {
    button = document.createElement("button");
    button.id = id;
    button.innerText = text;
    button.onclick = onClick;
    document.body.appendChild(button);
    console.log(button);
  }
};

interface ControlButtonsProps {
  onPause: () => void;
  onRestart: () => void;
  onSlow: () => void;
}
export const initControlButtons = (p: p5, buttons: ControlButtonsProps) => {
  const controlButtons = p.createDiv("");
  controlButtons.addClass("control-buttons-container");
  p.select(".control-container")?.child(controlButtons);

  const startPauseButton = new ToggleButton(p, {
    dataLabel: "start-pause",
    label: "Start",
    icon: null,
    initialIsActive: true,
    activeLabel: "Start",
    inactiveLabel: "Pause",
    activeIcon: playIconHtml,
    inactiveIcon: pauseIconHtml,
    onClick: buttons.onPause,
    onlyIcon: false,
    onlyText: false,
    container: controlButtons,
    keyHint: "b1",
  });

  const restartButton = new ControlButton(p, {
    dataLabel: "restart",
    label: "Restart",
    icon: restartIconHtml,
    onClick: buttons.onRestart,
    onlyIcon: false,
    onlyText: false,
    container: controlButtons,
    keyHint: "b2",
  });

  const slowFastButton = new ToggleButton(p, {
    dataLabel: "slow-fast",
    label: "Slower",
    icon: null,
    activeLabel: "Slower",
    inactiveLabel: "Faster",
    initialIsActive: true,
    onClick: buttons.onSlow,
    onlyIcon: false,
    onlyText: true,
    container: controlButtons,
    keyHint: "b3",
  });

  return {
    startPauseButton,
    restartButton,
    slowFastButton,
  };
};

interface ParametersProps {
  onTensionChange: (value: number) => void;
  onDampingChange: (value: number) => void;
  onAmplitudeChange: (value: number) => void;
  onFrequencyChange: (value: number) => void;
  onEndModeChange: (value: boolean) => void;
}

export const initParameters = (p: p5, props: ParametersProps) => {
  const parameters = p.createDiv("");
  parameters.addClass("parameters-container");
  p.select(".control-container")?.child(parameters);

  const stepperContainer = p.createDiv("");
  stepperContainer.addClass("steppers-container");
  parameters.child(stepperContainer);

  const sliderContainer = p.createDiv("");
  sliderContainer.addClass("sliders-container");
  parameters.child(sliderContainer);

  const tensionSlider = new Slider(p, {
    label: "Tension",
    min: 0.2,
    max: 0.8,
    step: 0.01,
    minIndicator: "Low",
    maxIndicator: "High",
    initialValue: 0.5,
    onChange: props.onTensionChange,
    sliderContainer: sliderContainer,
    keyHint: "w3",
  });

  const dampingSlider = new Slider(p, {
    label: "Damping",
    min: 0,
    max: 100,
    step: 1,
    minIndicator: "None",
    maxIndicator: "Strong",
    initialValue: 20,
    onChange: props.onDampingChange,
    sliderContainer: sliderContainer,
    keyHint: "w4",
  });

  const amplitudeStepper = new Stepper(p, {
    label: "Amplitude",
    min: 0,
    max: 1.3,
    step: 0.01,
    initialValue: 0.75,
    onChange: props.onAmplitudeChange,
    stepperContainer: stepperContainer,
    keyHint: "w1",
  });

  const frequencyStepper = new Stepper(p, {
    label: "Frequency",
    min: 0,
    max: 3.0,
    step: 0.001,
    initialValue: 1.5,
    onChange: props.onFrequencyChange,
    stepperContainer: stepperContainer,
    keyHint: "w2",
  });

  const endToggle = new Toggle(p, {
    isActive: true,
    label: "Fixed end",
    onChange: props.onEndModeChange,
    toggleContainer: parameters,
    keyHint: "bz",
  });

  return {
    tensionSlider,
    dampingSlider,
    amplitudeStepper,
    frequencyStepper,
    endToggle,
  };
};

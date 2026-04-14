import p5 from "p5";

type SliderElement = p5.Element & {
  input: (callback: () => void) => void;
};

interface SliderProps {
  label: string;
  min: number;
  max: number;
  minIndicator: string;
  maxIndicator: string;
  step: number;
  initialValue: number;
  onChange: (value: number) => void;
  sliderContainer?: p5.Element;
  keyHint?: string;
}

export class Slider {
  private sliderContainer: p5.Element;
  private container: p5.Element;
  private slider: p5.Element;

  constructor(p: p5, props: SliderProps) {
    this.sliderContainer = props.sliderContainer || p.createDiv();
    this.container = p.createDiv();
    this.container.addClass("slider-container");

    // Style the container
    const containerElement = this.container.elt as HTMLElement;
    containerElement.style.display = "flex";
    containerElement.style.flexDirection = "column";
    containerElement.style.alignItems = "center";
    containerElement.style.gap = "6px";

    const label = p.createSpan(props.label);
    label.addClass("slider-label");
    const labelElement = label.elt as HTMLElement;
    labelElement.style.fontSize = "13px";
    labelElement.style.fontWeight = "600";
    labelElement.style.color = "#057999";
    labelElement.style.textTransform = "capitalize";

    const lowLabel = p.createSpan(props.minIndicator);
    lowLabel.addClass("indicator");
    const lowElement = lowLabel.elt as HTMLElement;
    lowElement.style.fontSize = "11px";
    lowElement.style.color = "#666";

    const range = Math.max(props.max - props.min, 0.000001);
    const adaptiveStep = Math.max(range / 400, 0.000001);
    const effectiveStep = Math.min(props.step, adaptiveStep);

    const slider = p.createSlider(
      props.min,
      props.max,
      props.initialValue,
      effectiveStep,
    );
    this.slider = slider;
    slider.addClass("slider-input");
    const sliderElement = slider.elt as HTMLInputElement;
    sliderElement.style.width = "120px";
    sliderElement.style.height = "6px";
    sliderElement.style.cursor = "pointer";
    sliderElement.style.accentColor = "#057999";
    (slider as SliderElement).input(() =>
      props.onChange(slider.value() as number),
    );

    const highLabel = p.createSpan(props.maxIndicator);
    highLabel.addClass("indicator");
    const highElement = highLabel.elt as HTMLElement;
    highElement.style.fontSize = "11px";
    highElement.style.color = "#666";

    this.container.child(label);
    this.container.child(lowLabel);
    if (props.keyHint) {
      const sliderWrapper = p.createDiv();
      sliderWrapper.addClass("control-with-key");
      sliderWrapper.child(slider);
      const hint = p.createSpan(props.keyHint);
      hint.addClass("key-hint");
      sliderWrapper.child(hint);
      this.container.child(sliderWrapper);
    } else {
      this.container.child(slider);
    }
    this.container.child(highLabel);

    if (this.sliderContainer) {
      this.sliderContainer.child(this.container);
    }
  }

  public setValue(value: number): void {
    const sliderElement = this.slider.elt as HTMLInputElement;
    sliderElement.value = String(value);
  }
}

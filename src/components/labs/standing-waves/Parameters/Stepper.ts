import p5 from "p5";
import { icon } from "@fortawesome/fontawesome-svg-core";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";

type InputControlElement = p5.Element & {
  input: (callback: () => void) => void;
  attribute: (name: string, value: string) => void;
};

const minusIconHtml = icon(faMinus).html.join("");
const plusIconHtml = icon(faPlus).html.join("");

interface StepperProps {
  label: string;
  min: number;
  max: number;
  step: number;
  initialValue: number;
  onChange: (value: number) => void;
  stepperContainer?: p5.Element;
  keyHint?: string;
}

export class Stepper {
  private container: p5.Element;
  private valueInput: p5.Element;
  private currentValue: number;
  private stepperContainer: p5.Element;
  private intervalId: ReturnType<typeof setTimeout> | null = null;

  constructor(p: p5, props: StepperProps) {
    this.currentValue = this.roundToPrecision(props.initialValue, 3);

    this.stepperContainer = props.stepperContainer || p.createDiv();
    this.container = p.createDiv();
    this.container.addClass("stepper-container");

    const label = p.createSpan(props.label);
    label.addClass("stepper-label");

    const minusButton = p.createButton(minusIconHtml);
    minusButton.addClass("stepper-button");

    const plusButton = p.createButton(plusIconHtml);
    plusButton.addClass("stepper-button");

    // Button events with press-and-hold functionality
    this.addHoldEvent(minusButton, () => this.updateValue(props, -props.step));
    this.addHoldEvent(plusButton, () => this.updateValue(props, props.step));

    this.valueInput = p.createInput(this.currentValue.toString(), "text");
    this.valueInput.addClass("stepper-input");

    // Input event handling
    const inputControl = this.valueInput as InputControlElement;
    inputControl.input(() => this.handleInputChange(props));
    inputControl.attribute("pattern", "[0-9]*[.]?[0-9]*");
    inputControl.attribute("inputmode", "decimal");

    // Auto-select all text when focused
    this.valueInput.mousePressed((event: MouseEvent) => {
      event.preventDefault(); // Prevent default behavior that causes deselection
      this.valueInput.elt.select();
    });
    this.valueInput.elt.addEventListener("focus", () =>
      this.valueInput.elt.select(),
    );

    // Pressing "Enter" blurs the input
    this.valueInput.elt.addEventListener("keydown", (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        this.valueInput.elt.blur();
      }
    });

    // Enforce bounds when losing focus
    this.valueInput.elt.addEventListener("blur", () =>
      this.enforceBounds(props),
    );

    this.container.child(label);

    const controlRow = p.createDiv();
    controlRow.addClass("control-with-key");
    controlRow.child(minusButton);
    controlRow.child(this.valueInput);
    controlRow.child(plusButton);

    if (props.keyHint) {
      const hint = p.createSpan(props.keyHint);
      hint.addClass("key-hint");
      controlRow.child(hint);
    }

    this.container.child(controlRow);

    if (this.stepperContainer) {
      this.stepperContainer.child(this.container);
    }
  }

  private addHoldEvent(button: p5.Element, action: () => void): void {
    let isHeld = false;
    const delay = 500; // Initial delay before holding
    const interval = 100; // Speed of repeated execution

    const startHolding = () => {
      if (!isHeld) {
        isHeld = true;
        action(); // Perform action immediately
        this.intervalId = setTimeout(() => {
          this.intervalId = setInterval(action, interval);
        }, delay);
      }
    };

    const stopHolding = () => {
      isHeld = false;
      if (this.intervalId) {
        clearTimeout(this.intervalId);
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
    };

    button.mousePressed(startHolding);
    button.mouseReleased(stopHolding);
    button.mouseOut(stopHolding); // Ensures stopping if the mouse leaves the button
  }

  private updateValue(props: StepperProps, delta: number): void {
    const newValue = this.roundToPrecision(this.currentValue + delta, 3);
    if (newValue >= props.min && newValue <= props.max) {
      this.currentValue = newValue;
      this.valueInput.value(this.currentValue.toString());
      props.onChange(this.currentValue);
    }
  }

  private handleInputChange(props: StepperProps): void {
    const inputValue = (this.valueInput.value() as string).trim();

    if (inputValue === "") return; // Ignore empty input

    const parsedValue = parseFloat(inputValue);
    if (!isNaN(parsedValue)) {
      this.currentValue = this.roundToPrecision(parsedValue, 3);
      props.onChange(this.currentValue);
    }
  }

  private enforceBounds(props: StepperProps): void {
    let inputValue = parseFloat(this.valueInput.value() as string);

    if (isNaN(inputValue)) {
      this.valueInput.value(this.currentValue.toString()); // Revert to last valid value
      return;
    }

    if (inputValue < props.min) inputValue = props.min;
    if (inputValue > props.max) inputValue = props.max;

    this.currentValue = this.roundToPrecision(inputValue, 3);
    this.valueInput.value(this.currentValue.toString());
    props.onChange(this.currentValue);
  }

  private roundToPrecision(value: number, precision: number): number {
    const factor = Math.pow(10, precision);
    return Math.round(value * factor) / factor;
  }

  public setValue(value: number): void {
    this.currentValue = this.roundToPrecision(value, 3);
    this.valueInput.value(this.currentValue.toString());
  }
}

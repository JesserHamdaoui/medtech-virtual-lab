import p5 from "p5";

interface ToggleProps {
  label: string;
  isActive: boolean;
  onChange: (value: boolean) => void;
  toggleContainer?: p5.Element;
  keyHint?: string;
}

export class Toggle {
  private container: p5.Element;
  private toggle: p5.Element;
  private knob: p5.Element;
  private isActive: boolean;
  private toggleContainer?: p5.Element;
  private props: ToggleProps;

  constructor(p: p5, props: ToggleProps) {
    this.toggleContainer = props.toggleContainer || p.createDiv();
    this.isActive = props.isActive;
    this.props = props;

    // Create the container for the toggle and label
    this.container = p.createDiv();
    this.container.addClass("toggle-container");

    // Create the label
    const label = p.createSpan(props.label);
    label.addClass("toggle-label");

    // Create the toggle switch
    this.toggle = p.createDiv("");
    this.toggle.addClass("toggle-switch");
    if (this.isActive) {
      this.toggle.addClass("active"); // Add "active" class if the toggle is on
    }
    this.toggle.mousePressed(() => this.handleToggle(props));

    // Create the knob inside the toggle switch
    this.knob = p.createDiv("");
    this.knob.addClass("toggle-knob");
    this.toggle.child(this.knob);

    // Append label and toggle to the container
    this.container.child(label);
    this.container.child(this.toggle);

    // Add the container to the body
    if (this.toggleContainer) {
      this.toggleContainer.child(this.container);
    }

    if (props.keyHint) {
      const hint = p.createSpan(props.keyHint);
      hint.addClass("key-hint");
      this.container.child(hint);
    }
  }

  // Method to handle toggling state
  private handleToggle(props: ToggleProps): void {
    this.isActive = !this.isActive;
    if (this.isActive) {
      this.toggle.addClass("active");
    } else {
      this.toggle.removeClass("active");
    }
    props.onChange(this.isActive); // Update external state
  }

  public trigger(): void {
    this.handleToggle(this.props);
  }
}

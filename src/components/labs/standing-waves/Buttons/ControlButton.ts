import p5 from "p5";

// Define interface for ControlButton properties
export interface ControlButtonProps {
  dataLabel: string; // Label for the button
  label?: string | null; // Optional label for the button
  icon?: string | null; // Optional icon for the button
  onClick: () => void; // Click handler
  onlyIcon?: boolean; // Whether to display only the icon
  onlyText?: boolean; // Whether to display only the text
  container?: p5.Element; // Container for the button (optional)
  keyHint?: string;
}

// Base class for ControlButton
export class ControlButton {
  public button: p5.Element; // Button element
  protected onClick: () => void; // Click handler
  private container?: p5.Element; // Container for the button

  constructor(p: p5, props: ControlButtonProps) {
    const {
      dataLabel,
      label,
      icon,
      onClick,
      onlyIcon = false,
      onlyText = false,
      container,
      keyHint,
    } = props;

    this.button = p.createButton("");
    this.onClick = onClick;
    this.container = container;

    // Generate the button text based on `onlyIcon`, `onlyText`, or both
    const text = this.generateButtonText(icon, label, onlyIcon, onlyText);
    const type = this.determineType(onlyIcon, onlyText);

    // Set up the button element
    this.setupButton(p, text, dataLabel, type, keyHint);
  }

  // Generate the text for the button
  private generateButtonText(
    icon: string | null | undefined,
    label: string | null | undefined,
    onlyIcon: boolean,
    onlyText: boolean,
  ): string {
    if (onlyIcon) {
      return icon || ""; // Display only the icon
    }
    if (onlyText) {
      return label || ""; // Display only the text
    }
    return `${icon || ""} ${label || ""}`.trim(); // Display both icon and text
  }

  // Determine the type of button
  private determineType(
    onlyIcon: boolean,
    onlyText: boolean,
  ): "icon" | "text" | "icon-text" {
    if (onlyIcon) return "icon";
    if (onlyText) return "text";
    return "icon-text";
  }

  // Set up the button element
  private setupButton(
    p: p5,
    text: string,
    dataLabel: string,
    type: "icon" | "text" | "icon-text",
    keyHint?: string,
  ) {
    this.button.html(text);
    this.button.addClass("control-button");
    this.button.attribute("data-label", dataLabel);
    this.button.attribute("data-type", type);
    this.button.mousePressed(this.onClick);

    // Append the button to the container if provided
    if (this.container) {
      if (keyHint) {
        const wrapper = p.createDiv();
        wrapper.addClass("control-with-key");
        wrapper.child(this.button);

        const hint = p.createSpan(keyHint);
        hint.addClass("key-hint");
        wrapper.child(hint);

        this.container.child(wrapper);
      } else {
        this.container.child(this.button);
      }
    }
  }

  public trigger(): void {
    this.onClick();
  }
}

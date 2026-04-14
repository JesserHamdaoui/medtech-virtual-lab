import { ControlButtonProps } from "./ControlButton";
import p5 from "p5";
import { ControlButton } from "./ControlButton";

// Define interface for ToggleButton properties
export interface ToggleButtonProps extends ControlButtonProps {
  activeLabel?: string | null; // Label when active
  inactiveLabel?: string | null; // Label when inactive
  activeIcon?: string | null; // Icon when active
  inactiveIcon?: string | null; // Icon when inactive
  initialIsActive: boolean; // Initial toggle state
}

// ToggleButton class extending ControlButton
export class ToggleButton extends ControlButton {
  private isActive: boolean; // Current toggle state
  private props: ToggleButtonProps; // Props specific to toggle button

  constructor(p: p5, props: ToggleButtonProps) {
    const {
      dataLabel,
      activeLabel,
      inactiveLabel,
      activeIcon,
      inactiveIcon,
      initialIsActive,
      onlyIcon = false,
      onlyText = false,
      container,
      keyHint,
    } = props;

    // Determine the initial label and icon based on `initialIsActive`
    const initialLabel = initialIsActive ? activeLabel : inactiveLabel;
    const initialIcon = initialIsActive ? activeIcon : inactiveIcon;

    super(p, {
      dataLabel,
      label: onlyIcon
        ? null
        : onlyText
          ? initialLabel || ""
          : `${initialIcon || ""} ${initialLabel || ""}`.trim(),
      icon: onlyText ? null : initialIcon || "",
      onClick: () => {}, // Placeholder, will be overridden
      onlyIcon,
      onlyText,
      container,
      keyHint,
    });

    this.isActive = initialIsActive;
    this.props = props;

    // Add specific class for toggle button
    this.button.addClass("toggle-button");

    // Set up the click handler to toggle state
    this.button.mousePressed(() => this.toggle());

    // Set initial UI state
    this.updateUI();
  }

  // Toggle the button state
  private toggle(): void {
    this.isActive = !this.isActive;
    this.updateUI();

    // Trigger the onClick handler provided in the props
    if (this.props.onClick) {
      this.props.onClick();
    }
  }

  public trigger(): void {
    this.toggle();
  }

  // Update the button's UI based on the current state
  private updateUI(): void {
    const {
      activeLabel,
      inactiveLabel,
      activeIcon,
      inactiveIcon,
      onlyIcon,
      onlyText,
    } = this.props;

    // Determine the text content based on `isActive` state
    let text = "";
    if (onlyIcon) {
      text = this.isActive ? activeIcon || "" : inactiveIcon || "";
    } else if (onlyText) {
      text = this.isActive ? activeLabel || "" : inactiveLabel || "";
    } else {
      text = `${this.isActive ? activeIcon || "" : inactiveIcon || ""} ${
        this.isActive ? activeLabel || "" : inactiveLabel || ""
      }`.trim();
    }

    // Update the button's text and data attributes
    this.button.html(text);
    this.button.attribute(
      "data-label",
      this.isActive ? activeLabel || "" : inactiveLabel || "",
    );
  }
}

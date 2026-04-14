import p5 from "p5";
import "./buttons.css";
import { ControlButton, ControlButtonProps } from "./ControlButton";

// Tool Button Class
export class ToolButton extends ControlButton {
  private isActive: boolean = false;

  constructor(p: p5, props: ControlButtonProps) {
    super(p, props);
    this.button.addClass("tool-button");
  }

  toggle() {
    this.isActive = !this.isActive;
    this.button.style("display", this.isActive ? "block" : "none");
  }
}

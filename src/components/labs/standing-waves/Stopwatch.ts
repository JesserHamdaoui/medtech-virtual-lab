import { TimeSpeed } from "@/lib/labs/standing-waves/types/TimeSpeed";
import { icon } from "@fortawesome/fontawesome-svg-core";
import {
  faPause,
  faPlay,
  faRotateRight,
} from "@fortawesome/free-solid-svg-icons";

const playIconHtml = icon(faPlay).html.join("");
const pauseIconHtml = icon(faPause).html.join("");
const resetIconHtml = icon(faRotateRight).html.join("");

export class Stopwatch {
  private isPaused: boolean;
  private stopwatchTime: number;
  private stopwatchDiv: HTMLDivElement;
  private stopwatchTimeLabel: HTMLParagraphElement;
  private playPauseButton: HTMLButtonElement;
  private resetButton: HTMLButtonElement;
  private container: HTMLElement;

  // Drag handling properties
  private isDragging = false;
  private dragStartX = 0;
  private dragStartY = 0;
  private elementOffsetX = 0;
  private elementOffsetY = 0;

  constructor(container: HTMLElement = document.body) {
    this.isPaused = true;
    this.stopwatchTime = 0;
    this.container = container;

    // Create main container with styling
    this.stopwatchDiv = document.createElement("div");
    this.stopwatchDiv.id = "stopwatch";
    this.stopwatchDiv.style.position = "absolute";
    this.stopwatchDiv.style.top = "16px";
    this.stopwatchDiv.style.right = "16px";
    this.stopwatchDiv.style.left = "auto";
    this.stopwatchDiv.style.cursor = "move";
    this.stopwatchDiv.style.zIndex = "20";
    this.stopwatchDiv.style.backgroundColor = "#f2f2f2";
    this.stopwatchDiv.style.border = "1px solid #ccc";
    this.stopwatchDiv.style.borderRadius = "8px";
    this.stopwatchDiv.style.padding = "10px 15px";
    this.stopwatchDiv.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
    this.stopwatchDiv.style.fontFamily = "system-ui, -apple-system, sans-serif";
    this.stopwatchDiv.style.minWidth = "140px";

    // Create label
    const label = document.createElement("div");
    label.textContent = "Stopwatch";
    label.style.fontSize = "12px";
    label.style.fontWeight = "bold";
    label.style.color = "#333";
    label.style.marginBottom = "5px";
    this.stopwatchDiv.appendChild(label);

    // Create time display
    this.stopwatchTimeLabel = document.createElement("p");
    this.stopwatchTimeLabel.textContent = "0.00";
    this.stopwatchTimeLabel.style.fontSize = "16px";
    this.stopwatchTimeLabel.style.fontWeight = "bold";
    this.stopwatchTimeLabel.style.margin = "5px 0";
    this.stopwatchTimeLabel.style.fontFamily = "monospace";
    this.stopwatchTimeLabel.style.color = "#057999";
    this.stopwatchDiv.appendChild(this.stopwatchTimeLabel);

    // Create button container
    const buttonContainer = document.createElement("div");
    buttonContainer.style.display = "flex";
    buttonContainer.style.gap = "5px";
    buttonContainer.style.marginTop = "8px";
    this.stopwatchDiv.appendChild(buttonContainer);

    // Create control buttons
    this.playPauseButton = this.createIconButton(playIconHtml, () =>
      this.togglePlayPause(),
    );
    this.playPauseButton.setAttribute("data-key-hint", "b4");
    this.playPauseButton.style.fontSize = "12px";
    const playWrapper = document.createElement("div");
    playWrapper.style.position = "relative";
    playWrapper.appendChild(this.playPauseButton);
    const playHint = document.createElement("span");
    playHint.className = "stopwatch-key-hint";
    playHint.textContent = "b4";
    playWrapper.appendChild(playHint);
    buttonContainer.appendChild(playWrapper);

    this.resetButton = this.createIconButton(resetIconHtml, () => this.reset());
    this.resetButton.setAttribute("data-key-hint", "b2");
    this.resetButton.style.fontSize = "12px";
    const resetWrapper = document.createElement("div");
    resetWrapper.style.position = "relative";
    resetWrapper.appendChild(this.resetButton);
    const resetHint = document.createElement("span");
    resetHint.className = "stopwatch-key-hint";
    resetHint.textContent = "b2";
    resetWrapper.appendChild(resetHint);
    buttonContainer.appendChild(resetWrapper);

    // Add drag event listeners
    this.stopwatchDiv.addEventListener("mousedown", this.handleMouseDown);
    document.addEventListener("mouseup", this.handleMouseUp);

    this.container.appendChild(this.stopwatchDiv);
  }

  private handleMouseDown = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName === "BUTTON") return;

    this.isDragging = true;
    this.dragStartX = e.clientX;
    this.dragStartY = e.clientY;
    this.elementOffsetX = parseInt(this.stopwatchDiv.style.left) || 0;
    this.elementOffsetY = parseInt(this.stopwatchDiv.style.top) || 0;

    document.addEventListener("mousemove", this.handleMouseMove);
    this.stopwatchDiv.classList.add("dragging");
  };

  private handleMouseMove = (e: MouseEvent) => {
    if (!this.isDragging) return;

    const dx = e.clientX - this.dragStartX;
    const dy = e.clientY - this.dragStartY;

    this.stopwatchDiv.style.left = `${this.elementOffsetX + dx}px`;
    this.stopwatchDiv.style.top = `${this.elementOffsetY + dy}px`;
    this.stopwatchDiv.style.right = "auto";
  };

  private handleMouseUp = () => {
    this.isDragging = false;
    document.removeEventListener("mousemove", this.handleMouseMove);
    this.stopwatchDiv.classList.remove("dragging");
  };

  private createIconButton(iconHtml: string, onClick: () => void) {
    const button = document.createElement("button");
    button.innerHTML = iconHtml;
    button.onclick = onClick;
    button.style.backgroundColor = "#057999";
    button.style.color = "white";
    button.style.border = "none";
    button.style.borderRadius = "4px";
    button.style.padding = "6px 10px";
    button.style.cursor = "pointer";
    button.style.fontWeight = "bold";
    button.style.transition = "background-color 0.2s";
    button.onmouseover = () => {
      button.style.backgroundColor = "#044d6b";
    };
    button.onmouseout = () => {
      button.style.backgroundColor = "#057999";
    };
    return button;
  }

  public togglePlayPause() {
    this.isPaused = !this.isPaused;
    this.playPauseButton.innerHTML = this.isPaused
      ? playIconHtml
      : pauseIconHtml;
  }

  public reset() {
    this.isPaused = true;
    this.stopwatchTime = 0;
    this.stopwatchTimeLabel.textContent = "0.00";
    this.playPauseButton.innerHTML = playIconHtml;
  }

  public update(deltaTime: number, timeSpeed: TimeSpeed) {
    const speedMultiplier =
      timeSpeed === TimeSpeed.NORMAL
        ? 1
        : timeSpeed === TimeSpeed.SLOW
          ? 0.25
          : 1;

    if (!this.isPaused) {
      this.stopwatchTime += (deltaTime / 1000) * speedMultiplier;
      this.stopwatchTimeLabel.textContent = this.stopwatchTime.toFixed(2);
    }
  }

  public toggleVisibility() {
    this.stopwatchDiv.style.display =
      this.stopwatchDiv.style.display === "none" ? "block" : "none";
  }

  public setPaused(paused: boolean) {
    this.isPaused = paused;
  }

  public destroy() {
    this.stopwatchDiv.removeEventListener("mousedown", this.handleMouseDown);
    document.removeEventListener("mouseup", this.handleMouseUp);
    document.removeEventListener("mousemove", this.handleMouseMove);

    if (this.stopwatchDiv.parentElement) {
      this.stopwatchDiv.parentElement.removeChild(this.stopwatchDiv);
    }
  }
}

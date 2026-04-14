import p5 from "p5";

// Constants
export const LINE_PROXIMITY_THRESHOLD = 10;
export const DOUBLE_CLICK_DELAY = 300; // milliseconds
export const DASH_PATTERN = [5, 15];
export const RULER_OFFSET = 50;
export const PX_PER_CM = 50;

// Type for reference lines
export interface ReferenceLine {
  x?: number;
  y?: number;
  isDragging?: boolean;
  id?: string;
}

// Line interaction utilities
export const ReferenceLineUtils = {
  isPointNearLine: (
    p: p5,
    line: ReferenceLine,
    mx: number,
    my: number
  ): boolean => {
    if (!p) return false;
    if (line.x !== undefined) {
      return Math.abs(mx - line.x) < LINE_PROXIMITY_THRESHOLD;
    }
    if (line.y !== undefined) {
      return Math.abs(my - line.y) < LINE_PROXIMITY_THRESHOLD;
    }
    return false;
  },

  createLine: (p: p5, vertical: boolean): ReferenceLine => {
    return vertical ? { x: p.mouseX } : { y: p.mouseY };
  },

  drawLine: (p: p5, line: ReferenceLine, isActive = false) => {
    p.push();
    p.stroke(isActive ? 255 : 37, isActive ? 0 : 150, isActive ? 0 : 190);
    p.strokeWeight(2);
    p.drawingContext.setLineDash(DASH_PATTERN);

    if (line.x !== undefined) {
      p.line(line.x, 0, line.x, p.height);
    }
    if (line.y !== undefined) {
      p.line(0, line.y, p.width, line.y);
    }

    p.drawingContext.setLineDash([]);
    p.pop();
  },

  handleLineMovement: (
    line: ReferenceLine,
    mx: number,
    my: number
  ): ReferenceLine => {
    if (line.isDragging) {
      return {
        ...line,
        x: line.x !== undefined ? mx : undefined,
        y: line.y !== undefined ? my : undefined,
      };
    }
    return line;
  },
};

// Double-click handler type
export type DoubleClickHandler = {
  check: (currentTime: number, lastClickTime: number) => boolean;
  process: (
    p: p5,
    lines: ReferenceLine[],
    mx: number,
    my: number
  ) => ReferenceLine[];
};

export const DoubleClickProcessor: DoubleClickHandler = {
  check: (currentTime, lastClickTime) =>
    currentTime - lastClickTime < DOUBLE_CLICK_DELAY,

  process: (p, lines, mx, my) => {
    return lines.filter(
      (line) => !ReferenceLineUtils.isPointNearLine(p, line, mx, my)
    );
  },
};

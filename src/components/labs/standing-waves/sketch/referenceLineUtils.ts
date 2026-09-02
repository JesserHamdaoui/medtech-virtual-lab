import P5 from "p5";
import { ReferenceLine } from "../types";
import { LINE_PROXIMITY_THRESHOLD, DASH_PATTERN, DOUBLE_CLICK_DELAY } from "../constants";

export const ReferenceLineUtils = {
  isPointNearLine: (
    p: P5,
    line: ReferenceLine,
    mx: number,
    my: number,
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

  createLine: (p: P5, vertical: boolean): ReferenceLine => {
    return vertical ? { x: p.mouseX } : { y: p.mouseY };
  },

  drawLine: (p: P5, line: ReferenceLine, isActive = false) => {
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
};

export const DoubleClickProcessor = {
  check: (currentTime: number, lastClickTime: number) =>
    currentTime - lastClickTime < DOUBLE_CLICK_DELAY,

  process: (p: P5, lines: ReferenceLine[], mx: number, my: number) => {
    return lines.filter((line) => !ReferenceLineUtils.isPointNearLine(p, line, mx, my));
  },
};

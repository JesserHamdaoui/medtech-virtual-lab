import P5 from "p5";
import { FIXED_Y, DASH_PATTERN } from "../constants";

export function drawReferenceLine(p5: P5) {
  p5.stroke(150);
  p5.strokeWeight(1);
  p5.drawingContext.setLineDash(DASH_PATTERN);
  p5.line(70, FIXED_Y, p5.width, FIXED_Y);
  p5.drawingContext.setLineDash([]);
}

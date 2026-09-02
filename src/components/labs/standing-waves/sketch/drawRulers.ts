import P5 from "p5";
import { ReferenceLine } from "../types";
import { ReferenceLineUtils } from "./referenceLineUtils";
import { FIXED_Y, RULER_OFFSET, PX_PER_CM } from "../constants";
import { CANVAS_MONO_FONT, CANVAS_LABEL_SIZE } from "@/lib/sims/core/canvasFont";

const REFERENCE_X = 100;
const REFERENCE_Y = FIXED_Y;

export function drawRulers(
  p5: P5,
  referenceLines: ReferenceLine[],
  activeLine: ReferenceLine | null,
) {
  const horizontalRulerY = p5.height - 200;
  const verticalRulerX = REFERENCE_X - RULER_OFFSET;

  p5.stroke(150);
  p5.strokeWeight(1);
  p5.textSize(CANVAS_LABEL_SIZE);
  p5.textFont(CANVAS_MONO_FONT);
  p5.textAlign(p5.LEFT, p5.CENTER);

  p5.line(50, horizontalRulerY, p5.width, horizontalRulerY);
  for (let x = 50; x <= p5.width; x += PX_PER_CM) {
    p5.line(x, horizontalRulerY - 5, x, horizontalRulerY + 5);
    const distCm = (x - REFERENCE_X) / PX_PER_CM;
    p5.push();
    p5.noStroke();
    p5.text(`${distCm.toFixed(2)}`, x + 5, horizontalRulerY - 15);
    p5.pop();
  }

  p5.line(verticalRulerX, 100, verticalRulerX, p5.height - 50);
  for (let y = 100; y <= p5.height - 100; y += PX_PER_CM) {
    p5.line(verticalRulerX - 5, y, verticalRulerX + 5, y);
    const distCm = (REFERENCE_Y - y) / PX_PER_CM;
    p5.push();
    p5.noStroke();
    p5.text(`${distCm.toFixed(2)}`, verticalRulerX - 40, y + 5);
    p5.pop();
  }

  referenceLines.forEach((line) => {
    ReferenceLineUtils.drawLine(p5, line);

    if (line.x !== undefined) {
      const cmX = ((line.x - REFERENCE_X) / PX_PER_CM).toFixed(2);
      p5.push();
      p5.fill(0);
      p5.textAlign(p5.CENTER, p5.TOP);
      p5.text(`${cmX} cm`, line.x, horizontalRulerY + 15);
      p5.pop();
    }

    if (line.y !== undefined) {
      const cmY = ((REFERENCE_Y - line.y) / PX_PER_CM).toFixed(2);
      p5.push();
      p5.fill(0);
      p5.textAlign(p5.RIGHT, p5.CENTER);
      p5.text(`${cmY} cm`, p5.width - 20, line.y);
      p5.pop();
    }
  });

  if (activeLine) {
    ReferenceLineUtils.drawLine(p5, activeLine, true);

    if (activeLine.x !== undefined) {
      const cmX = ((activeLine.x - REFERENCE_X) / PX_PER_CM).toFixed(2);
      p5.fill(255, 0, 0);
      p5.textAlign(p5.CENTER, p5.TOP);
      p5.text(`${cmX} cm`, activeLine.x, horizontalRulerY + 15);
    }
    if (activeLine.y !== undefined) {
      const cmY = ((REFERENCE_Y - activeLine.y) / PX_PER_CM).toFixed(2);
      p5.fill(255, 0, 0);
      p5.textAlign(p5.RIGHT, p5.CENTER);
      p5.text(`${cmY} cm`, p5.width - 20, activeLine.y);
    }
  }
}

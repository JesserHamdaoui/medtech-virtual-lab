import P5 from "p5";
import { ChargeModel } from "../ChargeModel";
import { arrowLength, arrowYOffset } from "../constants";
import { CANVAS_MONO_FONT, CANVAS_LABEL_SIZE } from "@/lib/sims/core/canvasFont";

export default function drawCharge(p5: P5, charge: ChargeModel) {
  const radius = charge.radius;

  p5.strokeWeight(3);
  p5.stroke(255, 150);
  p5.drawingContext.setLineDash([6, 6]);
  const yOffset = charge.name === "q1" ? arrowYOffset : -arrowYOffset;
  const baseArrowLength = arrowLength;
  p5.line(
    charge.position.x,
    charge.position.y + (charge.name === "q1" ? radius / 2 : -radius / 2),
    charge.position.x,
    charge.position.y + yOffset,
  );
  p5.drawingContext.setLineDash([]);

  p5.fill(charge.color);
  p5.noStroke();
  p5.ellipse(charge.position.x, charge.position.y, radius, radius);

  p5.fill(0);
  p5.noStroke();
  p5.textAlign(p5.CENTER, p5.CENTER);
  p5.textFont(CANVAS_MONO_FONT);
  p5.textSize(32);
  p5.text(charge.name.toUpperCase(), charge.position.x, charge.position.y);

  const forceVector = charge.exercisedForce;
  const arrowSize = 10;

  p5.push();

  p5.fill(255);
  p5.noStroke();
  p5.textFont(CANVAS_MONO_FONT);
  p5.textSize(CANVAS_LABEL_SIZE);
  if (forceVector > 0) {
    p5.textAlign(p5.LEFT, p5.BOTTOM);
  } else {
    p5.textAlign(p5.RIGHT, p5.BOTTOM);
  }
  p5.text(
    charge.name == "q1"
      ? `F2/1: ${Math.abs(forceVector).toFixed(2)} N`
      : `F1/2: ${Math.abs(forceVector).toFixed(2)} N`,
    charge.position.x + (forceVector > 0 ? 10 : -10),
    charge.position.y + yOffset - 10,
  );

  const totalArrowLength =
    (forceVector >= 0 ? 1 : -1) * (baseArrowLength + Math.abs(forceVector));

  p5.stroke(charge.color);
  p5.strokeWeight(10);
  p5.line(
    charge.position.x,
    charge.position.y + yOffset,
    charge.position.x + totalArrowLength,
    charge.position.y + yOffset,
  );

  p5.translate(charge.position.x + totalArrowLength, charge.position.y + yOffset);

  if (totalArrowLength > 0) {
    p5.triangle(0, 0, -arrowSize, arrowSize / 2, -arrowSize, -arrowSize / 2);
  } else {
    p5.triangle(0, 0, arrowSize, arrowSize / 2, arrowSize, -arrowSize / 2);
  }

  p5.pop();

  p5.fill(255);
}

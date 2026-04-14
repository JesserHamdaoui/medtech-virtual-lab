import P5 from "p5";
import { ChargeModel } from "../models/ChargeModel";
import { arrowLength, arrowYOffset } from "../constants/simulationConstants";

export default function sketchCharge(
  p5: P5,
  charge: ChargeModel,
  isFullscreen: boolean
) {
  const radius = isFullscreen ? charge.radius * 1.3 : charge.radius; // Adjust radius for fullscreen

  // Draw dashed line from center of circle to tail of arrow
  p5.strokeWeight(3);
  p5.stroke(255, 150); // White with some opacity
  p5.drawingContext.setLineDash([6, 6]);
  const yOffset =
    charge.name === "q1"
      ? isFullscreen
        ? arrowYOffset * 1.5
        : arrowYOffset
      : isFullscreen
      ? -arrowYOffset * 1.5
      : -arrowYOffset; // Adjust yOffset for fullscreen
  const baseArrowLength = arrowLength; // Base length of the arrow
  p5.line(
    charge.position.x,
    charge.position.y + (charge.name === "q1" ? radius / 2 : -radius / 2),
    charge.position.x,
    charge.position.y + yOffset
  );
  p5.drawingContext.setLineDash([]); // Reset dash

  // Draw the charge circle
  p5.fill(charge.color);
  p5.noStroke();
  p5.ellipse(charge.position.x, charge.position.y, radius, radius);

  // Write the charge name
  p5.fill(0);
  p5.noStroke();
  p5.textAlign(p5.CENTER, p5.CENTER);
  p5.textFont("Monospace");
  p5.textSize(24);
  p5.text(charge.name.toUpperCase(), charge.position.x, charge.position.y);

  const forceVector = charge.exercisedForce;
  const arrowSize = 10;

  p5.push();

  // write the force magnitude
  p5.fill(255);
  p5.noStroke();
  p5.textFont("Monospace");
  p5.textSize(12);
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
    charge.position.y + yOffset - 10
  );

  // Calculate total arrow length: base length plus forceVector (preserving direction)
  const _arrowLength =
    (forceVector >= 0 ? 1 : -1) * (baseArrowLength + Math.abs(forceVector));

  const totalArrowLength =
    Math.abs(_arrowLength) > 500
      ? _arrowLength > 0
        ? 500
        : -500
      : _arrowLength;

  // Draw the line representing the force vector
  p5.stroke(charge.color);
  p5.strokeWeight(10);
  p5.line(
    charge.position.x,
    charge.position.y + yOffset,
    charge.position.x + totalArrowLength,
    charge.position.y + yOffset
  );

  // Draw the arrowhead
  p5.translate(
    charge.position.x + totalArrowLength,
    charge.position.y + yOffset
  );

  if (totalArrowLength > 0) {
    p5.triangle(0, 0, -arrowSize, arrowSize / 2, -arrowSize, -arrowSize / 2);
  } else {
    p5.triangle(0, 0, arrowSize, arrowSize / 2, arrowSize, -arrowSize / 2);
  }

  p5.pop();

  p5.fill(255);
}

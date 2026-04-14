import P5 from "p5";
import { BodyModel } from "../models/BodyModel";

export default function sketchBody(p5: P5, Body: BodyModel) {
  // Draw the Body body (rectangle)
  p5.fill(Body.color);
  const width = 120;
  const height = 60;

  p5.rect(
    Body.position.x - width / 2,
    Body.position.y - 15 - height / 2,
    width,
    height
  );

  // Draw two wheels (circles)
  // Left wheel
  p5.ellipse(Body.position.x - 30, Body.position.y + 15, 30, 30);
  // Right wheel
  p5.ellipse(Body.position.x + 30, Body.position.y + 15, 30, 30);
}

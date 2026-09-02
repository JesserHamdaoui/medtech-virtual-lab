import P5 from "p5";
import { BodyModel } from "../BodyModel";

export default function drawBody(p5: P5, body: BodyModel) {
  p5.fill(body.color);
  const width = 120;
  const height = 60;

  p5.rect(
    body.position.x - width / 2,
    body.position.y - 15 - height / 2,
    width,
    height,
  );

  p5.ellipse(body.position.x - 30, body.position.y + 15, 30, 30);
  p5.ellipse(body.position.x + 30, body.position.y + 15, 30, 30);
}

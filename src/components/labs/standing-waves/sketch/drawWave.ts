import P5 from "p5";
import { BALL_RADIUS } from "../constants";
import { EndType } from "../types";

interface Ball {
  x: number;
  y: number;
}

export function drawWave(
  p5: P5,
  balls: Ball[],
  endType: EndType,
  clampImg: P5.Image | null,
) {
  p5.stroke(12, 69, 90);
  p5.fill(12, 69, 90);

  balls.forEach((ball, i) => {
    if (i < balls.length - 1) {
      p5.line(ball.x, ball.y, balls[i + 1].x, balls[i + 1].y);
    }
    if (i % 10 === 0) {
      p5.fill(190, 77, 37);
      p5.stroke(190, 77, 37);
    }
    p5.ellipse(ball.x, ball.y, BALL_RADIUS);
    p5.fill(12, 69, 90);
    p5.stroke(12, 69, 90);
  });

  if (endType === EndType.FIXED_END && clampImg) {
    const lastBall = balls[balls.length - 1];
    p5.image(clampImg, lastBall.x - 16, lastBall.y - 26.5, 70, 120);
  }
}

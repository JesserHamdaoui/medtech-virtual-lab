import P5 from "p5";
import { SimulationProps } from "../constants";
import { CANVAS_MONO_FONT, CANVAS_LABEL_SIZE } from "@/lib/sims/core/canvasFont";

export default function drawRuler(p5: P5) {
  const yPosition = SimulationProps.Y_REFERENCE;
  const length = p5.width;
  const width = 2;

  p5.fill(255, 255, 80);
  p5.noStroke();
  p5.rect(0, yPosition - width / 2, length, width);

  const notchLength = 10;
  const notchWidth = 2;
  const notchInterval = 37.8;
  const center = length / 2;

  p5.fill(255, 255, 80);
  p5.noStroke();
  p5.rect(center, yPosition - notchLength / 2, notchWidth, notchLength);

  p5.textAlign(p5.CENTER, p5.TOP);
  p5.textSize(CANVAS_LABEL_SIZE);
  p5.textFont(CANVAS_MONO_FONT);
  p5.fill(255, 255, 80);

  p5.text(
    "0cm",
    center,
    Math.abs(0) % 2 == 0
      ? yPosition + notchLength / 2 + 2
      : yPosition - notchLength / 2 - 12,
  );

  for (
    let offset = notchInterval, cm = 1;
    center + offset < length || center - offset > 0;
    offset += notchInterval, cm++
  ) {
    if (center + offset < length) {
      p5.rect(center + offset, yPosition - notchLength / 2, notchWidth, notchLength);
      p5.text(
        `${cm}`,
        center + offset,
        Math.abs(cm) % 2 == 0
          ? yPosition + notchLength / 2 + 2
          : yPosition - notchLength / 2 - 12,
      );
    }
    if (center - offset > 0) {
      p5.rect(center - offset, yPosition - notchLength / 2, notchWidth, notchLength);
      p5.text(
        `-${cm}`,
        center - offset,
        cm % 2 == 0
          ? yPosition + notchLength / 2 + 2
          : yPosition - notchLength / 2 - 12,
      );
    }
  }
}

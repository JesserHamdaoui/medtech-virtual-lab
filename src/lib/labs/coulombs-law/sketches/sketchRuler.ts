import P5 from "p5";
import { SimulationProps } from "../constants/simulationConstants";

export default function sketchRuler(p5: P5, isFullscreen: boolean) {
  const yPosition = isFullscreen
    ? (p5.windowHeight - 300) / 2
    : SimulationProps.Y_REFERENCE;
  const length = isFullscreen
    ? p5.windowWidth
    : SimulationProps.SIMULATION_WIDTH;
  const width = 2;

  // Draw the ruler base
  p5.fill(255, 255, 80);
  p5.noStroke();
  p5.rect(0, yPosition - width / 2, length, width);

  // Draw a notch every 1 cm, starting from the middle and adding to each side
  const notchLength = 10;
  const notchWidth = 2;
  const notchInterval = 37.8; // 1 cm in pixels
  const center = length / 2;

  // Draw center notch
  p5.fill(255, 255, 80);
  p5.noStroke();
  p5.rect(center, yPosition - notchLength / 2, notchWidth, notchLength);

  // Draw notches to the right and left of center
  p5.textAlign(p5.CENTER, p5.TOP);
  p5.textSize(12);
  p5.fill(255, 255, 80);

  // Draw 0 ticket (label)
  p5.text(
    "0cm",
    center,
    Math.abs(0) % 2 == 0
      ? yPosition + notchLength / 2 + 2
      : yPosition - notchLength / 2 - 12
  );

  for (
    let offset = notchInterval, cm = 1;
    center + offset < length || center - offset > 0;
    offset += notchInterval, cm++
  ) {
    if (center + offset < length) {
      p5.rect(
        center + offset,
        yPosition - notchLength / 2,
        notchWidth,
        notchLength
      );
      // Draw distance ticket (label)
      p5.text(
        `${cm}`,
        center + offset,
        Math.abs(cm) % 2 == 0
          ? yPosition + notchLength / 2 + 2
          : yPosition - notchLength / 2 - 12
      );
    }
    if (center - offset > 0) {
      p5.rect(
        center - offset,
        yPosition - notchLength / 2,
        notchWidth,
        notchLength
      );
      // Draw distance ticket (label)
      p5.text(
        `-${cm}`,
        center - offset,
        cm % 2 == 0
          ? yPosition + notchLength / 2 + 2
          : yPosition - notchLength / 2 - 12
      );
    }
  }
}

import p5 from "p5";
import {
  ReferenceLine,
  LINE_PROXIMITY_THRESHOLD,
  RULER_OFFSET,
  PX_PER_CM,
  ReferenceLineUtils,
  DoubleClickProcessor,
} from "./ReferenceLine";

// Constants
const REFERENCE_X = 100;
const REFERENCE_Y = 200;

export const drawRulers = (
  p: p5,
  referenceLines: ReferenceLine[],
  activeLine: ReferenceLine | null
) => {
  const horizontalRulerY = REFERENCE_Y + 150;
  const verticalRulerX = REFERENCE_X - RULER_OFFSET;

  // Draw rulers
  p.stroke(150);
  p.strokeWeight(1);
  p.textSize(14);
  p.textFont("Monospace");
  p.textAlign(p.LEFT, p.CENTER);

  // Horizontal ruler
  p.line(50, horizontalRulerY, p.width, horizontalRulerY);
  for (let x = 50; x <= p.width; x += PX_PER_CM) {
    p.line(x, horizontalRulerY - 5, x, horizontalRulerY + 5);
    const distCm = (x - REFERENCE_X) / PX_PER_CM;
    p.push();
    p.noStroke();
    p.text(`${distCm.toFixed(2)}`, x + 5, horizontalRulerY - 15);
    p.pop();
  }

  // Vertical ruler
  p.line(verticalRulerX, 100, verticalRulerX, p.height - 50);
  for (let y = 100; y <= p.height - 100; y += PX_PER_CM) {
    p.line(verticalRulerX - 5, y, verticalRulerX + 5, y);
    const distCm = (REFERENCE_Y - y) / PX_PER_CM;
    p.push();
    p.noStroke();
    p.text(`${distCm.toFixed(2)}`, verticalRulerX - 40, y + 5);
    p.pop();
  }

  // Draw reference lines with measurements
  referenceLines.forEach((line) => {
    ReferenceLineUtils.drawLine(p, line);

    // Vertical line measurement (centered below)
    if (line.x !== undefined) {
      const cmX = ((line.x - REFERENCE_X) / PX_PER_CM).toFixed(2);
      p.push();
      p.fill(0);
      p.textAlign(p.CENTER, p.TOP);
      p.text(`${cmX} cm`, line.x, horizontalRulerY + 15);
      p.pop();
    }

    // Horizontal line measurement (right side)
    if (line.y !== undefined) {
      const cmY = ((REFERENCE_Y - line.y) / PX_PER_CM).toFixed(2);
      p.push();
      p.fill(0);
      p.textAlign(p.RIGHT, p.CENTER);
      p.text(`${cmY} cm`, p.width - 20, line.y); // Right-aligned at canvas edge
      p.pop();
    }
  });

  // Draw active line (if any)
  if (activeLine) {
    ReferenceLineUtils.drawLine(p, activeLine, true);

    // Draw temporary measurement during drag
    if (activeLine.x !== undefined) {
      const cmX = ((activeLine.x - REFERENCE_X) / PX_PER_CM).toFixed(2);
      p.fill(255, 0, 0);
      p.textAlign(p.CENTER, p.TOP);
      p.text(`${cmX} cm`, activeLine.x, horizontalRulerY + 15);
    }
    if (activeLine.y !== undefined) {
      const cmY = ((REFERENCE_Y - activeLine.y) / PX_PER_CM).toFixed(2);
      p.fill(255, 0, 0);
      p.textAlign(p.RIGHT, p.CENTER);
      p.text(`${cmY} cm`, p.width - 20, activeLine.y); // Right side measurement
    }
  }
};

export const handleRulerInteractions = (
  p: p5,
  getReferenceLines: () => ReferenceLine[], // Getter function for current state
  setReferenceLines: (lines: ReferenceLine[]) => void
) => {
  const horizontalRulerY = REFERENCE_Y + 150;
  const verticalRulerX = REFERENCE_X - RULER_OFFSET;

  let activeLine: ReferenceLine | null = null;
  let lastClickTime = 0;

  p.mousePressed = () => {
    const referenceLines = getReferenceLines(); // Get fresh state
    const now = Date.now();

    // Handle double-click deletion
    if (DoubleClickProcessor.check(now, lastClickTime)) {
      setReferenceLines(
        DoubleClickProcessor.process(p, referenceLines, p.mouseX, p.mouseY)
      );
      lastClickTime = now;
      return;
    }
    lastClickTime = now;

    // Check for existing line to move
    const clickedLine = referenceLines.find((line) =>
      ReferenceLineUtils.isPointNearLine(p, line, p.mouseX, p.mouseY)
    );

    if (clickedLine) {
      activeLine = { ...clickedLine, isDragging: true };
      setReferenceLines(referenceLines.filter((l) => l !== clickedLine));
      return;
    }

    // Create new line if clicking near rulers
    const nearVerticalRuler =
      Math.abs(p.mouseX - verticalRulerX) < LINE_PROXIMITY_THRESHOLD;
    const nearHorizontalRuler =
      Math.abs(p.mouseY - horizontalRulerY) < LINE_PROXIMITY_THRESHOLD;

    if (nearVerticalRuler || nearHorizontalRuler) {
      activeLine = ReferenceLineUtils.createLine(p, nearVerticalRuler);
      activeLine.isDragging = true;
    }
  };

  p.mouseDragged = () => {
    if (activeLine?.isDragging) {
      // Allow free positioning (no grid snapping)
      if (activeLine.x !== undefined) {
        activeLine.x = p.mouseX;
      } else if (activeLine.y !== undefined) {
        activeLine.y = p.mouseY;
      }
    }
  };

  p.mouseReleased = () => {
    if (activeLine?.isDragging) {
      activeLine.isDragging = false;
      setReferenceLines([...getReferenceLines(), activeLine]);
      activeLine = null;
    }
  };

  return {
    getActiveLine: () => activeLine,
  };
};

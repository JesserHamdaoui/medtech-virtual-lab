import P5 from "p5";
import { useRef, useCallback } from "react";
import { ReferenceLine } from "../types";
import { ReferenceLineUtils, DoubleClickProcessor } from "../sketch/referenceLineUtils";
import { RULER_OFFSET, LINE_PROXIMITY_THRESHOLD } from "../constants";

const REFERENCE_X = 100;

export function useRulerInteractions() {
  const referenceLinesRef = useRef<ReferenceLine[]>([]);
  const activeLineRef = useRef<ReferenceLine | null>(null);
  const lastClickTimeRef = useRef(0);

  const attach = useCallback((p: P5) => {
    const horizontalRulerY = p.height - 200;
    const verticalRulerX = REFERENCE_X - RULER_OFFSET;

    p.mousePressed = (event?: MouseEvent) => {
      if (event && event.target !== p.drawingContext.canvas) {
        return;
      }

      const referenceLines = referenceLinesRef.current;
      const now = Date.now();

      if (DoubleClickProcessor.check(now, lastClickTimeRef.current)) {
        referenceLinesRef.current = DoubleClickProcessor.process(
          p,
          referenceLines,
          p.mouseX,
          p.mouseY,
        );
        lastClickTimeRef.current = now;
        return;
      }
      lastClickTimeRef.current = now;

      const clickedLine = referenceLines.find((line) =>
        ReferenceLineUtils.isPointNearLine(p, line, p.mouseX, p.mouseY),
      );

      if (clickedLine) {
        activeLineRef.current = { ...clickedLine, isDragging: true };
        referenceLinesRef.current = referenceLines.filter((l) => l !== clickedLine);
        return;
      }

      const nearVerticalRuler =
        Math.abs(p.mouseX - verticalRulerX) < LINE_PROXIMITY_THRESHOLD;
      const nearHorizontalRuler =
        Math.abs(p.mouseY - horizontalRulerY) < LINE_PROXIMITY_THRESHOLD;

      if (nearVerticalRuler || nearHorizontalRuler) {
        activeLineRef.current = ReferenceLineUtils.createLine(p, nearVerticalRuler);
        activeLineRef.current.isDragging = true;
      }
    };

    p.mouseDragged = () => {
      const activeLine = activeLineRef.current;
      if (activeLine?.isDragging) {
        if (activeLine.x !== undefined) {
          activeLine.x = p.mouseX;
        } else if (activeLine.y !== undefined) {
          activeLine.y = p.mouseY;
        }
      }
    };

    p.mouseReleased = () => {
      const activeLine = activeLineRef.current;
      if (activeLine?.isDragging) {
        activeLine.isDragging = false;
        referenceLinesRef.current = [...referenceLinesRef.current, activeLine];
        activeLineRef.current = null;
      }
    };
  }, []);

  const getReferenceLines = useCallback(() => referenceLinesRef.current, []);
  const getActiveLine = useCallback(() => activeLineRef.current, []);

  return { attach, getReferenceLines, getActiveLine };
}

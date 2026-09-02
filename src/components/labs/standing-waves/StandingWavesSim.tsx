"use client";

import { useRef, useState } from "react";
import type P5 from "p5";
import { WaveModel } from "./WaveModel";
import { drawWave } from "./sketch/drawWave";
import { drawRulers } from "./sketch/drawRulers";
import { drawReferenceLine } from "./sketch/drawReferenceLine";
import { useRulerInteractions } from "./hooks/useRulerInteractions";
import Controls from "./Controls";
import { useP5Sketch } from "@/lib/sims/core/useP5Sketch";
import { FIXED_Y, BALL_COUNT, BALL_SPACING } from "./constants";
import SimLoader from "../shared/SimLoader";

interface Ball {
  x: number;
  y: number;
}

export default function StandingWavesSim() {
  const [model] = useState(() => new WaveModel());
  const ballsRef = useRef<Ball[]>(
    Array.from({ length: BALL_COUNT }, (_, i) => ({
      x: 100 + i * BALL_SPACING,
      y: FIXED_Y,
    })),
  );
  const clampImgRef = useRef<P5.Image | null>(null);
  const ruler = useRulerInteractions();

  const { containerRef, ready } = useP5Sketch({
    preload: (p5) => {
      clampImgRef.current = p5.loadImage("/images/clamp.png");
    },
    setup: (p5, container) => {
      p5.createCanvas(container.clientWidth, 600).parent(container);
      p5.frameRate(120);

      ruler.attach(p5);

      model.yNowChangedEmitter.addListener(() => {
        const positions = model.getPositions();
        ballsRef.current.forEach((ball, i) => {
          ball.y = positions[i];
        });
      });
    },
    draw: (p5) => {
      const dt = p5.deltaTime / 1000;
      model.step(dt);
      p5.background(230, 236, 238);

      if (model.referenceLineVisibleProperty.value) {
        drawReferenceLine(p5);
      }

      if (model.rulersVisibleProperty.value) {
        drawRulers(p5, ruler.getReferenceLines(), ruler.getActiveLine());
      }

      drawWave(p5, ballsRef.current, model.endTypeProperty.value, clampImgRef.current);
    },
    containerResized: (p5, width) => {
      p5.resizeCanvas(width, 600);
    },
  });

  return (
    <div className="relative w-full max-h-[600px] bg-white overflow-hidden">
      {!ready && (
        <div className="absolute inset-0 z-20">
          <SimLoader />
        </div>
      )}

      <div ref={containerRef} style={{ display: "block" }} />

      {ready && <Controls model={model} />}
    </div>
  );
}

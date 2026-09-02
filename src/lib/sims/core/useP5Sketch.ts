import { useEffect, useRef, useState } from "react";
import type p5Types from "p5";

export interface P5SketchHandlers {
  preload?: (p5: p5Types) => void;
  setup: (p5: p5Types, container: HTMLDivElement) => void;
  draw: (p5: p5Types) => void;
  windowResized?: (p5: p5Types) => void;
  /** Called whenever the container element's own box resizes (not just the window). */
  containerResized?: (p5: p5Types, width: number, height: number) => void;
}

export function useP5Sketch(handlers: P5SketchHandlers) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const p5InstanceRef = useRef<p5Types | null>(null);
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let instance: p5Types | null = null;
    let resizeObserver: ResizeObserver | null = null;

    import("p5").then(({ default: P5 }) => {
      if (cancelled || !containerRef.current) return;

      instance = new P5((p5: p5Types) => {
        p5.preload = () => handlersRef.current.preload?.(p5);
        p5.setup = () => {
          handlersRef.current.setup(p5, containerRef.current!);
          setReady(true);
        };
        p5.draw = () => handlersRef.current.draw(p5);
        p5.windowResized = () => handlersRef.current.windowResized?.(p5);
      }, containerRef.current);

      p5InstanceRef.current = instance;

      if (handlersRef.current.containerResized) {
        resizeObserver = new ResizeObserver((entries) => {
          const entry = entries[0];
          if (!entry || !p5InstanceRef.current) return;
          const { width, height } = entry.contentRect;
          handlersRef.current.containerResized?.(p5InstanceRef.current, width, height);
        });
        resizeObserver.observe(containerRef.current);
      }
    });

    return () => {
      cancelled = true;
      resizeObserver?.disconnect();
      instance?.remove();
      p5InstanceRef.current = null;
    };
  }, []);

  return { containerRef, p5InstanceRef, ready };
}

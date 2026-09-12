"use client";

import { RefObject, useEffect, useRef, useState } from "react";

export interface UnityInstance {
  SendMessage(objectName: string, methodName: string, value?: string | number): void;
  Quit(): Promise<void>;
}

interface UnityConfig {
  dataUrl: string;
  frameworkUrl: string;
  codeUrl: string;
  streamingAssetsUrl: string;
  companyName: string;
  productName: string;
  productVersion: string;
  matchWebGLToCanvasSize?: boolean;
  devicePixelRatio?: number;
}

declare global {
  interface Window {
    createUnityInstance?: (
      canvas: HTMLCanvasElement,
      config: UnityConfig,
      onProgress?: (progress: number) => void,
    ) => Promise<UnityInstance>;
  }
}

export type UnityStatus = "loading" | "ready" | "error";

interface UseUnityInstanceOptions {
  /** Folder the build was written to, served from public/. */
  buildUrl: string;
  /** Base file name Unity gave the build — its output folder's name. */
  buildName: string;
  companyName?: string;
  productName?: string;
  productVersion?: string;
}

/**
 * Loads a Unity WebGL build into a canvas and tears it down on unmount.
 *
 * The teardown is not optional housekeeping: each instance holds a WebGL
 * context and browsers cap those at around sixteen, so a student clicking
 * between labs would otherwise run out of contexts and get a blank canvas
 * with no error.
 */
export function useUnityInstance(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  {
    buildUrl,
    buildName,
    companyName = "MedTech Virtual Labs",
    productName = "Hydrocarbons Workbench",
    productVersion = "1.0",
  }: UseUnityInstanceOptions,
) {
  const [status, setStatus] = useState<UnityStatus>("loading");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const instanceRef = useRef<UnityInstance | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Guards the async gap: in development React mounts effects twice, and
    // an instance that finishes loading after unmount must be disposed
    // rather than left holding a context.
    let cancelled = false;
    let created: UnityInstance | null = null;

    const loaderUrl = `${buildUrl}/Build/${buildName}.loader.js`;

    const config: UnityConfig = {
      // .unityweb rather than .br: the build enables Unity's JavaScript
      // decompression fallback, which renames the Brotli payloads and lets
      // them load from Next.js's static public/ handler, which does not send
      // Content-Encoding headers. Turning the fallback off renames these
      // back to .br and makes those headers the server's job.
      dataUrl: `${buildUrl}/Build/${buildName}.data.unityweb`,
      frameworkUrl: `${buildUrl}/Build/${buildName}.framework.js.unityweb`,
      codeUrl: `${buildUrl}/Build/${buildName}.wasm.unityweb`,
      streamingAssetsUrl: `${buildUrl}/StreamingAssets`,
      companyName,
      productName,
      productVersion,
      // Unity otherwise sizes its framebuffer to the canvas's CSS box, so on a
      // higher-density display the browser upscales the result and the whole
      // workbench looks soft. Sizing it here in device pixels instead keeps it
      // sharp; syncCanvasSize below owns canvas.width/height from now on.
      matchWebGLToCanvasSize: false,
      devicePixelRatio: window.devicePixelRatio || 1,
    };

    const syncCanvasSize = () => {
      const ratio = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      const width = Math.max(1, Math.round(rect.width * ratio));
      const height = Math.max(1, Math.round(rect.height * ratio));
      if (canvas.width !== width) canvas.width = width;
      if (canvas.height !== height) canvas.height = height;
    };

    syncCanvasSize();
    const resizeObserver = new ResizeObserver(syncCanvasSize);
    resizeObserver.observe(canvas);
    window.addEventListener("resize", syncCanvasSize);

    const start = () => {
      if (cancelled) return;
      if (!window.createUnityInstance) {
        setError("Unity loader did not register createUnityInstance.");
        setStatus("error");
        return;
      }

      window
        .createUnityInstance(canvas, config, (value) => {
          if (!cancelled) setProgress(value);
        })
        .then((instance) => {
          if (cancelled) {
            void instance.Quit();
            return;
          }
          created = instance;
          instanceRef.current = instance;
          setStatus("ready");
        })
        .catch((reason: unknown) => {
          if (cancelled) return;
          setError(reason instanceof Error ? reason.message : String(reason));
          setStatus("error");
        });
    };

    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${loaderUrl}"]`,
    );

    if (existing && window.createUnityInstance) {
      start();
    } else if (existing) {
      existing.addEventListener("load", start, { once: true });
    } else {
      const script = document.createElement("script");
      script.src = loaderUrl;
      script.async = true;
      script.addEventListener("load", start, { once: true });
      script.addEventListener("error", () => {
        if (cancelled) return;
        setError(`Could not load ${loaderUrl}. Has the Unity build been produced?`);
        setStatus("error");
      });
      document.body.appendChild(script);
    }

    return () => {
      cancelled = true;
      instanceRef.current = null;
      resizeObserver.disconnect();
      window.removeEventListener("resize", syncCanvasSize);
      if (created) {
        void created.Quit();
      }
    };
  }, [buildUrl, buildName, canvasRef, companyName, productName, productVersion]);

  return { status, progress, error, instanceRef };
}

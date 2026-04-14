"use client";

import { ComponentType, useEffect, useRef, useState } from "react";
import { FullscreenProvider } from "@/components/labs/shared";
import LabLoadingIndicator from "@/components/labs/LabLoadingIndicator";
import {
  isCollisionLabId,
  LAB_ASSISTANT_CONTROL_EVENT,
  LabAssistantControlDetail,
} from "@/components/labs/assistant/events";

interface InternalLabRendererProps {
  labId: string;
  title: string;
  fallbackUrl: string;
}

export default function InternalLabRenderer({
  labId,
  title,
  fallbackUrl,
}: InternalLabRendererProps) {
  const [Renderer, setRenderer] = useState<ComponentType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [iframeReady, setIframeReady] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const [assistantPulse, setAssistantPulse] = useState(false);
  const pulseTimeoutRef = useRef<number | null>(null);

  const isInternalLab =
    labId === "laws-of-collisions" ||
    labId === "collision" ||
    labId === "coulombs-law" ||
    labId === "standing-waves";

  useEffect(() => {
    let active = true;

    const loadInternalRenderer = async () => {
      if (!isInternalLab) {
        setRenderer(null);
        setLoadFailed(false);
        setIsLoading(false);
        setProgress(0);
        setIframeReady(false);
        return;
      }

      setIsLoading(true);
      setProgress(0);
      setLoadFailed(false);

      try {
        if (labId === "laws-of-collisions" || labId === "collision") {
          const collisionModule =
            await import("@/components/labs/collision/SimulationContainer");

          if (active) {
            setRenderer(() => collisionModule.default);
            setProgress(100);
            setIsLoading(false);
          }

          return;
        }

        if (labId === "standing-waves") {
          const standingWavesModule =
            await import("@/components/labs/standing-waves/SimulationContainer");

          if (active) {
            setRenderer(() => standingWavesModule.default);
            setProgress(100);
            setIsLoading(false);
          }

          return;
        }

        const coulombModule =
          await import("@/components/labs/coulombs-law/SimulationContainer");

        if (active) {
          setRenderer(() => coulombModule.default);
          setProgress(100);
          setIsLoading(false);
        }
      } catch (error) {
        if (active) {
          console.error(
            `Failed to load internal lab renderer for ${labId}`,
            error,
          );
          setRenderer(null);
          setLoadFailed(true);
          setIsLoading(false);
        }
      }
    };

    loadInternalRenderer();

    return () => {
      active = false;
    };
  }, [isInternalLab, labId]);

  useEffect(() => {
    if (!isLoading) {
      return;
    }

    const interval = window.setInterval(() => {
      setProgress((current) => {
        if (current >= 92) {
          return current;
        }

        return current + 4;
      });
    }, 120);

    return () => {
      window.clearInterval(interval);
    };
  }, [isLoading]);

  useEffect(() => {
    if (isInternalLab && !loadFailed) {
      return;
    }

    setProgress(0);
    setIframeReady(false);

    const interval = window.setInterval(() => {
      setProgress((current) => {
        if (current >= 90 || iframeReady) {
          return current;
        }

        return current + 3;
      });
    }, 130);

    return () => {
      window.clearInterval(interval);
    };
  }, [iframeReady, isInternalLab, labId, loadFailed]);

  useEffect(() => {
    const isMatchingLab = (incomingLabId: string) => {
      if (isCollisionLabId(labId)) {
        return isCollisionLabId(incomingLabId);
      }
      return incomingLabId === labId;
    };

    const handleAssistantControl = (event: Event) => {
      const customEvent = event as CustomEvent<LabAssistantControlDetail>;
      if (
        !customEvent.detail?.labId ||
        !isMatchingLab(customEvent.detail.labId)
      ) {
        return;
      }

      if (pulseTimeoutRef.current) {
        window.clearTimeout(pulseTimeoutRef.current);
      }

      setAssistantPulse(false);
      window.requestAnimationFrame(() => {
        setAssistantPulse(true);
      });

      pulseTimeoutRef.current = window.setTimeout(() => {
        setAssistantPulse(false);
      }, 900);
    };

    window.addEventListener(
      LAB_ASSISTANT_CONTROL_EVENT,
      handleAssistantControl,
    );

    return () => {
      window.removeEventListener(
        LAB_ASSISTANT_CONTROL_EVENT,
        handleAssistantControl,
      );
      if (pulseTimeoutRef.current) {
        window.clearTimeout(pulseTimeoutRef.current);
      }
    };
  }, [labId]);

  const assistantPulseStyle = {
    borderColor: assistantPulse
      ? "rgba(5, 121, 153, 0.75)"
      : "rgba(5, 121, 153, 0)",
    boxShadow: assistantPulse
      ? "0 0 0 2px rgba(5, 121, 153, 0.35), 0 0 30px rgba(5, 121, 153, 0.45)"
      : "0 0 0 0 rgba(5, 121, 153, 0), 0 0 0 rgba(5, 121, 153, 0)",
    transition: "box-shadow 900ms ease-in-out, border-color 900ms ease-in-out",
  } satisfies React.CSSProperties;

  if (isLoading) {
    return (
      <div className="w-full">
        <LabLoadingIndicator progress={progress} label={title} />
      </div>
    );
  }

  if (Renderer) {
    return (
      <FullscreenProvider>
        <div className="w-full border-2 rounded-xl" style={assistantPulseStyle}>
          <Renderer />
        </div>
      </FullscreenProvider>
    );
  }

  return (
    <div className="w-full border-2 rounded-xl" style={assistantPulseStyle}>
      {!iframeReady && (
        <LabLoadingIndicator progress={progress} label={title} />
      )}
      <iframe
        src={fallbackUrl}
        className={`w-full h-150 border-0 ${iframeReady ? "block" : "hidden"}`}
        title={title}
        allow="accelerometer; gyroscope; magnetometer; fullscreen"
        onLoad={() => {
          setProgress(100);
          setIframeReady(true);
        }}
      />
    </div>
  );
}

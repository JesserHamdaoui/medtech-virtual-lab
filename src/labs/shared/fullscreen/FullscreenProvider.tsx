"use client";

import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  FullscreenContextValue,
  MSElement,
  MSDocument,
  MozDocument,
  MozElement,
  WebkitDocument,
  WebkitElement,
} from "./types";

const FullscreenContext = createContext<FullscreenContextValue>({
  isFullscreen: false,
  enterFullscreen: () => {},
  exitFullscreen: () => {},
  toggleFullscreen: () => {},
});

interface FullscreenProviderProps {
  children: ReactNode;
}

export function FullscreenProvider({ children }: FullscreenProviderProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const enterFullscreen = useCallback(
    (element: HTMLElement = document.documentElement) => {
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if ("webkitRequestFullscreen" in element) {
        (element as WebkitElement).webkitRequestFullscreen();
      } else if ("mozRequestFullScreen" in element) {
        (element as MozElement).mozRequestFullScreen();
      } else if ("msRequestFullscreen" in element) {
        (element as MSElement).msRequestFullscreen();
      }
    },
    [],
  );

  const exitFullscreen = useCallback(() => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if ("webkitExitFullscreen" in document) {
      (document as WebkitDocument).webkitExitFullscreen();
    } else if ("mozCancelFullScreen" in document) {
      (document as MozDocument).mozCancelFullScreen();
    } else if ("msExitFullscreen" in document) {
      (document as MSDocument).msExitFullscreen();
    }
  }, []);

  const toggleFullscreen = useCallback(
    (element?: HTMLElement) => {
      if (!isFullscreen) {
        enterFullscreen(element);
      } else {
        exitFullscreen();
      }
    },
    [isFullscreen, enterFullscreen, exitFullscreen],
  );

  const handleFullscreenChange = useCallback(() => {
    setIsFullscreen(
      Boolean(
        document.fullscreenElement ||
        (document as Document & { webkitFullscreenElement?: Element })
          .webkitFullscreenElement ||
        (document as Document & { mozFullScreenElement?: Element })
          .mozFullScreenElement ||
        (document as Document & { msFullscreenElement?: Element })
          .msFullscreenElement,
      ),
    );
  }, []);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "F11") {
        event.preventDefault();
        toggleFullscreen();
      }

      if (event.key === "Escape" && isFullscreen) {
        exitFullscreen();
      }
    },
    [isFullscreen, toggleFullscreen, exitFullscreen],
  );

  useEffect(() => {
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener(
      "webkitfullscreenchange",
      handleFullscreenChange as EventListener,
    );
    document.addEventListener(
      "mozfullscreenchange",
      handleFullscreenChange as EventListener,
    );
    document.addEventListener(
      "MSFullscreenChange",
      handleFullscreenChange as EventListener,
    );
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange as EventListener,
      );
      document.removeEventListener(
        "mozfullscreenchange",
        handleFullscreenChange as EventListener,
      );
      document.removeEventListener(
        "MSFullscreenChange",
        handleFullscreenChange as EventListener,
      );
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleFullscreenChange, handleKeyDown]);

  return (
    <FullscreenContext.Provider
      value={{
        isFullscreen,
        enterFullscreen,
        exitFullscreen,
        toggleFullscreen,
      }}
    >
      {children}
    </FullscreenContext.Provider>
  );
}

export function useFullscreen() {
  return useContext(FullscreenContext);
}

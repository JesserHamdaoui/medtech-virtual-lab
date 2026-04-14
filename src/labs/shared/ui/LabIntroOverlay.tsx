"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface LabIntroOverlayProps {
  title: string;
  logoSrc: string;
  titleClassName?: string;
  containerClassName?: string;
  fadeInDelayMs?: number;
  moveDelayMs?: number;
  completeDelayMs?: number;
}

export function LabIntroOverlay({
  title,
  logoSrc,
  titleClassName = "text-primary-700",
  containerClassName = "top-[15px] right-[24px]",
  fadeInDelayMs = 500,
  moveDelayMs = 1500,
  completeDelayMs = 3000,
}: LabIntroOverlayProps) {
  const [fadeIn, setFadeIn] = useState(false);
  const [moved, setMoved] = useState(false);
  const [startFadeOutOverlay, setStartFadeOutOverlay] = useState(false);
  const [hideOverlay, setHideOverlay] = useState(false);
  const [initialAnimationDone, setInitialAnimationDone] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFadeIn(true), fadeInDelayMs);

    const moveAndFadeOutTimer = setTimeout(() => {
      setMoved(true);
      setStartFadeOutOverlay(true);
    }, moveDelayMs);

    const removeOverlayTimer = setTimeout(() => {
      setHideOverlay(true);
      setInitialAnimationDone(true);
    }, completeDelayMs);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(moveAndFadeOutTimer);
      clearTimeout(removeOverlayTimer);
    };
  }, [fadeInDelayMs, moveDelayMs, completeDelayMs]);

  return (
    <>
      {!hideOverlay && (
        <div
          className={`fixed top-0 left-0 w-full h-full bg-[#e6ecee] z-9999 transition-opacity duration-1500 ${
            startFadeOutOverlay
              ? "opacity-0 pointer-events-none"
              : "opacity-100"
          }`}
        />
      )}

      <div
        className={`absolute z-10000 flex items-center gap-2 ${
          moved
            ? containerClassName
            : "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        } ${
          initialAnimationDone ? "" : "transition-all duration-1500 ease-in-out"
        }`}
      >
        <h1
          className={`${titleClassName} whitespace-nowrap ${
            fadeIn ? "opacity-100" : "opacity-0"
          } ${moved ? "text-xl" : "text-4xl"} ${
            initialAnimationDone
              ? ""
              : "transition-all duration-1500 ease-in-out"
          }`}
        >
          {title}
        </h1>

        <Image
          src={logoSrc}
          alt="Lab logo"
          width={moved ? 80 : 160}
          height={moved ? 80 : 160}
          className={`${fadeIn ? "opacity-100" : "opacity-0"} ${
            initialAnimationDone
              ? ""
              : "transition-all duration-1500 ease-in-out"
          }`}
        />
      </div>
    </>
  );
}

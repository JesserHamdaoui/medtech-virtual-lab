import { useState, useEffect } from "react";
import logo from "../assets/medtech-logo.png";
import { useFullscreen } from "@/components/labs/shared";

const IntroAnimation = () => {
  const [fadeIn, setFadeIn] = useState(false);
  const [moved, setMoved] = useState(false);
  const [startFadeOutOverlay, setStartFadeOutOverlay] = useState(false);
  const [hideOverlay, setHideOverlay] = useState(false);
  const [initialAnimationDone, setInitialAnimationDone] = useState(false);

  const { isFullscreen } = useFullscreen();

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFadeIn(true), 500);

    const moveAndFadeOutTimer = setTimeout(() => {
      setMoved(true);
      setStartFadeOutOverlay(true);
    }, 1500);

    const removeOverlayTimer = setTimeout(() => {
      setHideOverlay(true);
      setInitialAnimationDone(true);
    }, 3000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(moveAndFadeOutTimer);
      clearTimeout(removeOverlayTimer);
    };
  }, []);

  return (
    <>
      {!hideOverlay && (
        <div
          className={`fixed top-0 left-0 w-full h-full bg-[#e6ecee] z-[9999] transition-opacity duration-[1500ms] ${
            startFadeOutOverlay
              ? "opacity-0 pointer-events-none"
              : "opacity-100"
          }`}
        />
      )}

      <div
        className={`absolute z-[10000] flex items-center gap-2
          ${
            moved
              ? isFullscreen
                ? "top-[30px] left-[calc(100%-230px)]"
                : "top-[15px] left-[1000px]"
              : "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          }
          ${
            initialAnimationDone
              ? ""
              : "transition-all duration-[1500ms] ease-in-out"
          }
        `}
      >
        <h1
          className={`
            text-[#2596be] text-nowrap
            ${fadeIn ? "opacity-100" : "opacity-0"}
            ${
              moved
                ? isFullscreen
                  ? "text-[1.25rem]"
                  : "text-[1rem]"
                : isFullscreen
                  ? "text-[2.75rem]"
                  : "text-[2.25rem]"
            }
            ${
              initialAnimationDone
                ? ""
                : "transition-all duration-[1500ms] ease-in-out"
            }
          `}
        >
          Coulomb&apos;s Law
        </h1>

        <img
          src={logo}
          alt="logo"
          className={`
            ${fadeIn ? "opacity-100" : "opacity-0"}
            ${
              moved
                ? isFullscreen
                  ? "w-[80px]"
                  : "w-[70px]"
                : isFullscreen
                  ? "w-[170px]"
                  : "w-[120px]"
            }
            ${
              initialAnimationDone
                ? ""
                : "transition-all duration-[1500ms] ease-in-out"
            }
          `}
        />
      </div>
    </>
  );
};

export default IntroAnimation;

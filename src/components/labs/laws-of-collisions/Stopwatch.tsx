"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause, faRotateRight } from "@fortawesome/free-solid-svg-icons";
import { CollisionSimModel } from "./CollisionSimModel";
import { useProperty } from "@/lib/sims/core/useProperty";

interface StopwatchProps {
  simulation: CollisionSimModel;
}

export default function Stopwatch({ simulation }: StopwatchProps) {
  const timeElapsed = useProperty(simulation.getTimeElapsedProperty());
  const isMoving = useProperty(simulation.getIsMovingProperty());

  const handlePlayPauseClick = () => {
    simulation.updateIsMoving(!isMoving);
  };

  const handleRestartClick = () => {
    simulation.restart();
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const milliseconds = Math.floor((time % 1) * 1000);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}:${milliseconds.toString().padStart(3, "0")}`;
  };

  return (
    <div
      className="
        absolute top-5 right-[350px] z-10 min-w-[160px]
        p-[12px] rounded-[8px] shadow-md border border-[#0c455a]
        bg-[#f2f2f2] scale-[0.9] origin-top-left
        font-[Poppins,sans-serif] opacity-90 select-none
      "
    >
      <div
        className="
          text-[#0c455a] font-semibold text-[0.8em]
          mb-2 pb-[6px] border-b border-[#83cbe5]
        "
      >
        Stopwatch
      </div>

      <p
        className="
          text-[1.5em] m-0 mb-[12px] p-[8px] text-center
          text-[#0c455a] bg-white rounded-[6px]
          border border-[#83cbe5] font-[Courier_New,monospace]
        "
      >
        {formatTime(timeElapsed)}
      </p>

      <div className="flex justify-center space-x-2">
        <button
          onClick={handlePlayPauseClick}
          className="
            flex items-center justify-center
            px-[12px] py-[6px] min-w-[32px] rounded-[6px]
            text-[0.8em] bg-[#83cbe5] text-[#0c455a]
            cursor-pointer border-none transition-all
            duration-300 ease-in-out hover:brightness-105
            hover:shadow-sm active:scale-95
          "
        >
          <FontAwesomeIcon icon={isMoving ? faPause : faPlay} />
        </button>

        <button
          onClick={handleRestartClick}
          className="
            flex items-center justify-center
            px-[12px] py-[6px] min-w-[32px] rounded-[6px]
            text-[0.8em] bg-[#83cbe5] text-[#0c455a]
            cursor-pointer border-none transition-all
            duration-300 ease-in-out hover:brightness-105
            hover:shadow-sm active:scale-95
          "
        >
          <FontAwesomeIcon icon={faRotateRight} />
        </button>
      </div>
    </div>
  );
}

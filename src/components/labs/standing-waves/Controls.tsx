"use client";

import { WaveModel } from "./WaveModel";
import { EndType, TimeSpeed } from "./types";
import Slider from "../shared/ui/Slider";
import Stepper from "../shared/ui/Stepper";
import Toggle from "../shared/ui/Toggle";
import Button from "../shared/ui/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause, faRotateRight } from "@fortawesome/free-solid-svg-icons";
import { useProperty } from "@/lib/sims/core/useProperty";

interface ControlsProps {
  model: WaveModel;
}

export default function Controls({ model }: ControlsProps) {
  const isPlaying = useProperty(model.isPlayingProperty);
  const timeSpeed = useProperty(model.timeSpeedProperty);
  const endType = useProperty(model.endTypeProperty);
  const tension = useProperty(model.tensionProperty);
  const damping = useProperty(model.dampingProperty);
  const amplitude = useProperty(model.amplitudeProperty);
  const frequency = useProperty(model.frequencyProperty);

  return (
    <div className="control-container absolute bottom-0 left-0 right-0 z-10 bg-slate-100 border-t border-blue-300 px-5 py-4 flex flex-wrap items-end gap-6 shadow-md">
      <div className="flex flex-row items-center gap-2">
        <Button handleClick={() => (model.isPlayingProperty.value = !isPlaying)}>
          <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
        </Button>
        <Button handleClick={() => model.manualRestart()}>
          <FontAwesomeIcon icon={faRotateRight} />
        </Button>
        <Button
          handleClick={() =>
            (model.timeSpeedProperty.value =
              timeSpeed === TimeSpeed.NORMAL ? TimeSpeed.SLOW : TimeSpeed.NORMAL)
          }
          className={timeSpeed === TimeSpeed.SLOW ? "!text-xs" : undefined}
        >
          {timeSpeed === TimeSpeed.SLOW ? "0.25x" : "1x"}
        </Button>
      </div>

      <div className="flex flex-row gap-6 min-w-[220px]">
        <Stepper
          label="Amplitude"
          min={0}
          max={1.3}
          step={0.01}
          value={amplitude}
          onChange={(v) => (model.amplitudeProperty.value = v)}
        />
        <Stepper
          label="Frequency"
          min={0}
          max={3.0}
          step={0.001}
          value={frequency}
          onChange={(v) => (model.frequencyProperty.value = v)}
        />
      </div>

      <div className="flex flex-row gap-6 flex-1 min-w-[260px]">
        <div className="flex-1 min-w-[120px]">
          <Slider
            label="Tension"
            min={0.2}
            max={0.8}
            step={0.01}
            minIndicator="Low"
            maxIndicator="High"
            initialValue={tension}
            onChange={(v) => (model.tensionProperty.value = v)}
          />
        </div>
        <div className="flex-1 min-w-[120px]">
          <Slider
            label="Damping"
            min={0}
            max={100}
            step={1}
            minIndicator="None"
            maxIndicator="Strong"
            initialValue={damping}
            onChange={(v) => (model.dampingProperty.value = v)}
          />
        </div>
      </div>

      <Toggle
        label="Fixed end"
        checked={endType === EndType.FIXED_END}
        onChange={() => model.toggleEndMode()}
      />
    </div>
  );
}

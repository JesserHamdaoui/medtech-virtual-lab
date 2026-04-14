import React from "react";

export interface SliderProps {
  min: number;
  max: number;
  minIndicator: string;
  maxIndicator: string;
  step: number;
  initialValue: number;
  onChange: (value: number) => void;
}

const Slider: React.FC<SliderProps> = ({
  min,
  max,
  minIndicator,
  maxIndicator,
  step,
  initialValue,
  onChange,
}) => {
  const handleSliderChange = (nextValue: number) => {
    onChange(nextValue);
  };

  return (
    <div className={`flex flex-row justify-center items-center space-x-2`}>
      <span className="text-xs text-gray-600">{minIndicator}</span>
      <input
        type="range"
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-rect-thumb"
        min={min}
        max={max}
        step={step}
        value={initialValue}
        onChange={(e) => handleSliderChange(Number(e.target.value))}
      />
      <span className="text-xs text-gray-600">{maxIndicator}</span>
      <style>{`
                                .slider-rect-thumb::-webkit-slider-thumb {
                                        appearance: none;
                                        width: 18px;
                                        height: 24px;
                                        background: #2596be;
                                        border-radius: 4px;
                                        border: none;
                                        box-shadow: 0 0 2px rgba(0,0,0,0.2);
                                        cursor: pointer;
                                        transition: background 0.2s;
                                }
                                .slider-rect-thumb:focus::-webkit-slider-thumb,
                                .slider-rect-thumb:hover::-webkit-slider-thumb {
                                        background: #2187ab;
                                }
                                .slider-rect-thumb::-moz-range-thumb {
                                        width: 18px;
                                        height: 24px;
                                        background: #2596be;
                                        border-radius: 4px;
                                        border: none;
                                        box-shadow: 0 0 2px rgba(0,0,0,0.2);
                                        cursor: pointer;
                                        transition: background 0.2s;
                                }
                                .slider-rect-thumb:focus::-moz-range-thumb,
                                .slider-rect-thumb:hover::-moz-range-thumb {
                                        background: #2187ab;
                                }
                                .slider-rect-thumb::-ms-thumb {
                                        width: 18px;
                                        height: 24px;
                                        background: #2596be;
                                        border-radius: 4px;
                                        border: none;
                                        box-shadow: 0 0 2px rgba(0,0,0,0.2);
                                        cursor: pointer;
                                        transition: background 0.2s;
                                }
                                .slider-rect-thumb:focus::-ms-thumb,
                                .slider-rect-thumb:hover::-ms-thumb {
                                        background: #2187ab;
                                }
                                .slider-rect-thumb:focus {
                                        outline: none;
                                }
                                .slider-rect-thumb::-moz-focus-outer {
                                        border: 0;
                                }
                        `}</style>
    </div>
  );
};

export default Slider;

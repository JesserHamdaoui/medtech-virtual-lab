import { Card } from "../shared/ui/Card";
import { SettingsProps } from "./constants";
import Slider from "../shared/ui/Slider";
import MetricBadge from "../shared/ui/MetricBadge";

export default function ChargeCard({
  name,
  charge,
  exercisedForce,
  handleChargeChange,
}: {
  name: string;
  charge: number;
  exercisedForce: number;
  handleChargeChange: (newCharge: number) => void;
}) {
  const { CHARGE_MIN, CHARGE_MAX } = SettingsProps;
  const chargeMin = CHARGE_MIN * 1e6;
  const chargeMax = CHARGE_MAX * 1e6;

  const onChange = (value: number) => {
    handleChargeChange(value * 1e-6);
  };

  return (
    <div>
      <Card>
        <div className="flex flex-col items-p-4 space-y-2 px-5 py-3 min-w-[300px]">
          <span className="text-lg text-[#2596be] font-semibold">
            Charge {name.toUpperCase()}
          </span>
          <span>
            Force<sub>{name === "q1" ? "2/1" : "1/2"}</sub>:
            <MetricBadge value={exercisedForce.toFixed(2)} unit="N" />
          </span>
          <span>
            Charge:
            <MetricBadge value={(charge * 1e6).toFixed(2)} unit="C" />
          </span>
          <Slider
            min={chargeMin}
            max={chargeMax}
            minIndicator={String(chargeMin) + " μC"}
            maxIndicator={String(chargeMax) + " μC"}
            step={1}
            initialValue={charge * 1e6}
            onChange={onChange}
          />
        </div>
      </Card>
    </div>
  );
}

import { Card } from "./ui/Card";
import { SettingsProps } from "@/lib/labs/coulombs-law/constants/simulationConstants";
import Slider from "./ui/Slider";
import MetricBadge from "./ui/MetricBadge";
import { useFullscreen } from "@/components/labs/shared";

export default function ChargeCard({
  name,
  charge,
  exercisedForce,
  handleChargeChange,
  keyHint,
}: {
  name: string;
  charge: number;
  exercisedForce: number;
  handleChargeChange: (newCharge: number) => void;
  keyHint: string;
}) {
  const { CHARGE_MIN, CHARGE_MAX } = SettingsProps;
  const chargeMin = CHARGE_MIN * 1e6; // Convert to μC
  const chargeMax = CHARGE_MAX * 1e6; // Convert to μC

  const onChange = (value: number) => {
    handleChargeChange(value * 1e-6);
  };

  const { isFullscreen } = useFullscreen();

  const containerClass = isFullscreen
    ? "flex flex-col items-p-4 space-y-4 px-10 py-6 min-w-[400px] text-2xl"
    : "flex flex-col items-p-4 space-y-2 px-5 py-3 min-w-[300px]";

  return (
    <div>
      <Card>
        <div className={containerClass}>
          <span
            className={`text-lg font-semibold`}
            style={
              isFullscreen
                ? { fontSize: "2rem", color: name === "q1" ? "red" : "blue" }
                : { color: name === "q1" ? "red" : "blue" }
            }
          >
            Charge {name.toUpperCase()}
          </span>
          <span style={isFullscreen ? { fontSize: "1.5rem" } : {}}>
            Force<sub>{name === "q1" ? "2/1" : "1/2"}</sub>:
            <MetricBadge value={exercisedForce.toFixed(2)} unit="N" />
          </span>
          <span style={isFullscreen ? { fontSize: "1.5rem" } : {}}>
            Charge:
            <MetricBadge value={(charge * 1e6).toFixed(2)} unit="C" />
          </span>
          <div className="relative">
            <Slider
              min={chargeMin}
              max={chargeMax}
              minIndicator={String(chargeMin) + " μC"}
              maxIndicator={String(chargeMax) + " μC"}
              step={0.1}
              initialValue={charge * 1e6}
              onChange={onChange}
            />
            <span className="absolute -top-4 -right-1 rounded-full bg-primary-600/10 text-primary-700 border border-primary-600/30 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide">
              {keyHint}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}

import { BodyModel } from "@/lib/labs/collision/models/BodyModel";
import { Card, CardContent } from "./ui/Card";
import { Input } from "./ui/Input";
import { Label } from "./ui/Label";
import { PROPERTY_BOUNDAERIES } from "@/lib/labs/collision/constants/config";
import { useState, useEffect } from "react";

interface BodyCardProps {
  body: BodyModel;
  index: number;
  onMassChange: (index: number, newMass: number) => void;
  onVelocityChange: (index: number, newVelocity: number) => void;
  onPositionChange: (index: number, newPosition: number) => void;
  isMoving: boolean;
}

export default function BodyCard({
  body,
  index,
  onMassChange,
  onVelocityChange,
  isMoving,
}: BodyCardProps) {
  const pixleToMeter = (pixel: number) => {
    return pixel * 0.0002645833;
  };

  const meterToPixel = (meter: number) => {
    return meter * 3779.527559055;
  };

  // Track displayed values for keyboard control
  const [displayMass, setDisplayMass] = useState(body.mass.toFixed(2));
  const [displayVelocity, setDisplayVelocity] = useState(
    pixleToMeter(body.velocity).toFixed(2),
  );

  // Update display values when body values change
  useEffect(() => {
    setDisplayMass(body.mass.toFixed(2));
  }, [body.mass]);

  useEffect(() => {
    setDisplayVelocity(pixleToMeter(body.velocity).toFixed(2));
  }, [body.velocity]);

  return (
    <Card>
      <CardContent>
        <h3
          className={`text-md font-semibold border-b border-blue-300  text-[${body.color}]`}
        >
          Body {index + 1}
        </h3>

        <div className="grid grid-cols-2 gap-4 relative">
          <div>
            <div className="flex justify-between items-center">
              <Label htmlFor="mass">Mass</Label>
              <span className="rounded-full bg-primary-600/10 text-primary-700 border border-primary-600/30 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide">
                {index === 0 ? "w1" : "w3"}
              </span>
            </div>
            <span className="flex items-center gap-2 font-mono">
              <Input
                id="mass"
                type="number"
                disabled={isMoving}
                value={displayMass}
                onChange={(e) => setDisplayMass(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.currentTarget.blur();
                  }
                }}
                onBlur={(e) => {
                  let value = parseFloat(e.target.value);
                  if (isNaN(value)) {
                    value = body.mass;
                  }
                  if (value < PROPERTY_BOUNDAERIES.mass.min) {
                    value = PROPERTY_BOUNDAERIES.mass.min;
                  } else if (value > PROPERTY_BOUNDAERIES.mass.max) {
                    value = PROPERTY_BOUNDAERIES.mass.max;
                  }
                  value = parseFloat(value.toFixed(2));
                  setDisplayMass(value.toFixed(2));
                  onMassChange(index, value);
                }}
                min={PROPERTY_BOUNDAERIES.mass.min}
                max={PROPERTY_BOUNDAERIES.mass.max}
              />
              Kg
            </span>
          </div>

          <div>
            <div className="flex justify-between items-center">
              <Label htmlFor="velocity">Initial Velocity</Label>
              <span className="rounded-full bg-primary-600/10 text-primary-700 border border-primary-600/30 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide">
                {index === 0 ? "w2" : "w4"}
              </span>
            </div>
            <span className="flex items-center gap-2 font-mono">
              <Input
                id="velocity"
                type="number"
                disabled={isMoving}
                value={displayVelocity}
                onChange={(e) => setDisplayVelocity(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.currentTarget.blur();
                  }
                }}
                onBlur={(e) => {
                  let value = parseFloat(e.target.value);
                  if (isNaN(value)) {
                    value = pixleToMeter(body.velocity);
                  }
                  if (value < PROPERTY_BOUNDAERIES.velocity.min) {
                    value = PROPERTY_BOUNDAERIES.velocity.min;
                  } else if (value > PROPERTY_BOUNDAERIES.velocity.max) {
                    value = PROPERTY_BOUNDAERIES.velocity.max;
                  }
                  value = parseFloat(value.toFixed(2));
                  setDisplayVelocity(value.toFixed(2));
                  onVelocityChange(index, meterToPixel(value));
                }}
                min={pixleToMeter(PROPERTY_BOUNDAERIES.velocity.min).toFixed(2)}
                max={pixleToMeter(PROPERTY_BOUNDAERIES.velocity.max).toFixed(2)}
              />
              m/s
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

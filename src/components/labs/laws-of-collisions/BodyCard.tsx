import { BodyModel } from "./BodyModel";
import { Card, CardContent } from "../shared/ui/Card";
import { Input } from "../shared/ui/Input";
import { Label } from "../shared/ui/Label";
import { PROPERTY_BOUNDAERIES } from "./constants";

interface BodyCardProps {
  body: BodyModel;
  index: number;
  onMassChange: (index: number, newMass: number) => void;
  onVelocityChange: (index: number, newVelocity: number) => void;
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
            <Label htmlFor="mass">Mass</Label>
            <span className="flex items-center gap-2 font-mono">
              <Input
                id="mass"
                type="number"
                disabled={isMoving}
                defaultValue={body.mass.toFixed(2)}
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
                  e.target.value = value.toFixed(2);
                  onMassChange(index, value);
                }}
                min={PROPERTY_BOUNDAERIES.mass.min}
                max={PROPERTY_BOUNDAERIES.mass.max}
              />
              Kg
            </span>
          </div>

          <div>
            <Label htmlFor="velocity">Initial Velocity</Label>
            <span className="flex items-center gap-2 font-mono">
              <Input
                id="velocity"
                type="number"
                disabled={isMoving}
                defaultValue={pixleToMeter(body.velocity).toFixed(2)}
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
                  e.target.value = value.toFixed(2);
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

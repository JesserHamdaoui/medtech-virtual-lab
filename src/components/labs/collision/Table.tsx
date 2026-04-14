import React from "react";
import { BodyModel } from "@/lib/labs/collision/models/BodyModel";
import { Card, CardContent } from "./ui/Card";

interface TableProps {
  bodies: BodyModel[];
}

const Table: React.FC<TableProps> = ({ bodies }) => {
  const pixelToMeter = (pixel: number) => pixel * 0.0002645833;

  // Before collision metrics for Body 1
  const body1InitialVelocity = pixelToMeter(bodies[0].initialVelocity);
  const body1InitialMomentum = bodies[0].mass * body1InitialVelocity;
  const body1InitialKE = 0.5 * bodies[0].mass * body1InitialVelocity ** 2;

  // Before collision metrics for Body 2
  const body2InitialVelocity = pixelToMeter(bodies[1].initialVelocity);
  const body2InitialMomentum = bodies[1].mass * body2InitialVelocity;
  const body2InitialKE = 0.5 * bodies[1].mass * body2InitialVelocity ** 2;

  // After collision metrics for Body 1
  const body1FinalVelocity = pixelToMeter(bodies[0].velocity);
  const body1FinalMomentum = bodies[0].mass * body1FinalVelocity;
  const body1FinalKE = 0.5 * bodies[0].mass * body1FinalVelocity ** 2;

  // After collision metrics for Body 2
  const body2FinalVelocity = pixelToMeter(bodies[1].velocity);
  const body2FinalMomentum = bodies[1].mass * body2FinalVelocity;
  const body2FinalKE = 0.5 * bodies[1].mass * body2FinalVelocity ** 2;

  // Determine if collision has happened (if velocity changed)
  const hasCollisionOccurred = bodies[0].collided && bodies[1].collided;

  const fmt = (val: number) => val.toFixed(2);

  return (
    <Card>
      <CardContent>
        <div className="overflow-hidden">
          <table className="w-full table-auto text-md font-mono min-h-[260px]">
            {/* Header */}
            <thead>
              <tr>
                <th className="px-3 py-2 border-r border-blue-300"></th>
                <th className="px-3 py-2 border-r border-blue-300" colSpan={3}>
                  <span className="text-[#ff4c4c] font-semibold font-sans">
                    Body 1
                  </span>
                </th>
                <th className="px-3 py-2" colSpan={3}>
                  <span className="text-[#4c4cff] font-semibold font-sans">
                    Body 2
                  </span>
                </th>
              </tr>
              <tr className="border-b border-blue-300">
                <th className="px-3 py-2 border-r border-blue-300"></th>
                <th className="px-3 py-2 border-r">Velocity (m/s)</th>
                <th className="px-3 py-2 border-r">Momentum (kg·m/s)</th>
                <th className="px-3 py-2 border-r border-blue-300">KE (J)</th>
                <th className="px-3 py-2 border-r">Velocity (m/s)</th>
                <th className="px-3 py-2 border-r">Momentum (kg·m/s)</th>
                <th className="px-3 py-2 ">KE (J)</th>
              </tr>
            </thead>

            {/* Body */}
            <tbody className="text-gray-800">
              <tr className=" hover:bg-gray-50">
                <td className="px-3 py-2 border-r border-blue-300 font-semibold font-sans text-blue-900">
                  Before Collision
                </td>
                <td className="px-3 py-2 border-r border-gray-200">
                  {fmt(body1InitialVelocity)}
                </td>
                <td className="px-3 py-2 border-r border-gray-200">
                  {fmt(body1InitialMomentum)}
                </td>
                <td className="px-3 py-2 border-r border-blue-300">
                  {fmt(body1InitialKE * 1000)}
                </td>
                <td className="px-3 py-2 border-r border-gray-200">
                  {fmt(body2InitialVelocity)}
                </td>
                <td className="px-3 py-2 border-r border-gray-200">
                  {fmt(body2InitialMomentum)}
                </td>
                <td className="px-3 py-2">{fmt(body2InitialKE * 1000)}</td>
              </tr>

              <tr className="hover:bg-gray-50">
                <td className="px-3 py-2 border-r border-blue-300 font-semibold font-sans text-blue-900">
                  After Collision
                </td>
                <td className="px-3 py-2 border-r border-gray-200">
                  {hasCollisionOccurred ? fmt(body1FinalVelocity) : ""}
                </td>
                <td className="px-3 py-2 border-r border-gray-200">
                  {hasCollisionOccurred ? fmt(body1FinalMomentum) : ""}
                </td>
                <td className="px-3 py-2 border-r border-blue-300">
                  {hasCollisionOccurred ? fmt(body1FinalKE * 1000) : ""}
                </td>
                <td className="px-3 py-2 border-r border-gray-200">
                  {hasCollisionOccurred ? fmt(body2FinalVelocity) : ""}
                </td>
                <td className="px-3 py-2 border-r border-gray-200">
                  {hasCollisionOccurred ? fmt(body2FinalMomentum) : ""}
                </td>
                <td className="px-3 py-2">
                  {hasCollisionOccurred ? fmt(body2FinalKE * 1000) : ""}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default Table;

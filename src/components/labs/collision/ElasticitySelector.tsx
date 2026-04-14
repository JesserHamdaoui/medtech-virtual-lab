import { useState } from "react";
import { Elasticity } from "@/lib/labs/collision/types/Elasticity";

interface ElasticitySelectorProps {
  elasticity: Elasticity;
  handleChangeElasticity: (value: Elasticity) => void;
  isMoving: boolean;
}

export default function ElasticitySelector({
  elasticity,
  handleChangeElasticity,
  isMoving,
}: ElasticitySelectorProps) {
  const [open, setOpen] = useState(false);

  const handleSelect = (value: Elasticity) => {
    handleChangeElasticity(value);
    setOpen(false);
  };

  return (
    <div className="relative w-40">
      <button
        disabled={isMoving}
        onClick={() => setOpen(!open)}
        className={`w-full h-10 px-3 flex justify-between items-center rounded-md shadow ${
          isMoving
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-[#2596be] text-white hover:bg-[#2187ab]"
        } focus:outline-none`}
      >
        {elasticity === Elasticity.ELASTIC ? "Elastic" : "Inelastic"}
        <span className="ml-2">{open ? "▲" : "▼"}</span>
      </button>

      {open && !isMoving && (
        <ul
          className="absolute mt-1 w-full bg-white border rounded-md shadow-md z-10 
          transition-all duration-300 ease-in-out origin-top animate-slideDown"
        >
          <li
            onClick={() => handleSelect(Elasticity.ELASTIC)}
            className="px-4 py-2 hover:bg-[#f0f0f0] cursor-pointer"
          >
            Elastic
          </li>
          <li
            onClick={() => handleSelect(Elasticity.INELASTIC)}
            className="px-4 py-2 hover:bg-[#f0f0f0] cursor-pointer"
          >
            Inelastic
          </li>
        </ul>
      )}
    </div>
  );
}

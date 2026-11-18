import { faBoxOpen, faFire, faPowerOff } from "@fortawesome/free-solid-svg-icons";
import DockButton from "./DockButton";
import { CalorimetryBench, MaterialInfo, canIgnite } from "./types";

interface DockActionsProps {
  stationId: string;
  bench: CalorimetryBench;
  /** The sample on this station, if any. */
  sample: MaterialInfo | undefined;
  onHeaterToggle: () => void;
  onIgnite: () => void;
  onRemoveSample: () => void;
}

/** The buttons a station offers in the dock: its own control, then removing the sample. */
export default function DockActions({
  stationId,
  bench,
  sample,
  onHeaterToggle,
  onIgnite,
  onRemoveSample,
}: DockActionsProps) {
  const burning = !!sample && bench.burning === sample.id;

  return (
    <>
      {stationId === "hot-water-bath" && (
        <DockButton variant="primary" icon={faPowerOff} onClick={onHeaterToggle}>
          {bench.heaterOn ? "Heater off" : "Heater on"}
        </DockButton>
      )}
      {stationId === "tin-can-calorimeter" && sample && (
        <DockButton variant="primary" icon={faFire} onClick={onIgnite} disabled={!canIgnite(bench)}>
          {burning ? "Burning" : "Ignite"}
        </DockButton>
      )}
      {sample && !burning && <DockButton icon={faBoxOpen} onClick={onRemoveSample}>Remove sample</DockButton>}
    </>
  );
}

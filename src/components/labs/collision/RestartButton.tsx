import { faRotateRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface RestartButtonProps {
  handleRestart: () => void;
}

export default function RestartButton({ handleRestart }: RestartButtonProps) {
  return (
    <button
      onClick={handleRestart}
      className="w-10 h-10 text-base bg-[#2596be] text-white hover:bg-[#2187ab] rounded-md shadow transition-all duration-200 focus:outline-none active:scale-95 mr-3"
    >
      <FontAwesomeIcon icon={faRotateRight} />
    </button>
  );
}

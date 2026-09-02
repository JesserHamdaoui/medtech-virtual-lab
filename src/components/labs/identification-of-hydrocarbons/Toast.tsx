"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";

interface ToastProps {
  message: string;
}

export default function Toast({ message }: ToastProps) {
  return (
    <div
      role="alert"
      className="absolute bottom-4 left-4 z-50 flex items-start gap-2.5 max-w-sm px-4 py-3 bg-[#fdecea] border-2 border-[#b3261e] shadow-[3px_3px_0_0_#7a1a15] animate-[toast-in_150ms_ease-out]"
    >
      <FontAwesomeIcon icon={faTriangleExclamation} className="text-[#b3261e] mt-0.5 shrink-0" />
      <p className="text-sm font-semibold text-[#7a1a15] leading-snug">{message}</p>
      <style>{`
        @keyframes toast-in {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

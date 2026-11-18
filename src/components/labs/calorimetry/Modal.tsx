"use client";

import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactNode, useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

interface ModalProps {
  title: string;
  /** One line under the title. */
  description?: string;
  onClose: () => void;
  children: ReactNode;
}

/**
 * A dialog over the whole page: dimmed backdrop, a titled frame with a close
 * button, and the content below it. Escape or a click on the backdrop closes
 * it, Tab stays inside it, the page behind stops scrolling, and focus goes
 * back to where it was when it closes.
 */
export default function Modal({ title, description, onClose, children }: ModalProps) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);

  useEffect(() => {
    closeRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // The first field is a better start than the close button.
    (dialog.querySelector<HTMLElement>("input") ?? dialog).focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeRef.current();
        return;
      }
      if (e.key !== "Tab") return;
      const items = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, []);

  return createPortal(
    <div
      // mousedown, not click, so dragging a text selection out of the dialog doesn't close it.
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="flex w-full max-w-3xl max-h-[90vh] flex-col border-2 border-[var(--sim-border)] bg-[var(--sim-neutral-0)] shadow-2xl focus:outline-none"
      >
        <header className="flex items-start gap-4 border-b-2 border-[var(--sim-border)] bg-[var(--sim-neutral-50)] px-5 py-4">
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <h2 id={titleId} className="text-sm font-bold tracking-widest uppercase text-[var(--sim-neutral-900)]">
              {title}
            </h2>
            {description && <p className="text-sm text-[var(--sim-neutral-600)]">{description}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 shrink-0 items-center justify-center border-2 border-[var(--sim-border)] bg-[var(--sim-neutral-0)] text-[var(--sim-neutral-900)] cursor-pointer hover:border-[var(--sim-accent-700)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sim-accent-700)]"
          >
            <FontAwesomeIcon icon={faXmark} aria-hidden />
          </button>
        </header>
        {children}
      </div>
    </div>,
    document.body,
  );
}

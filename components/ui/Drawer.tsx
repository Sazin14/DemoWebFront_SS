"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  titleId: string;
  footer?: ReactNode;
  children: ReactNode;
}

const EXIT_MS = 200;

/**
 * Right-hand sheet on top of the native <dialog>: focus trapping, Esc and
 * inert background come from the browser. Enter/exit motion is CSS (globals.css).
 */
export default function Drawer({ open, onClose, title, titleId, footer, children }: DrawerProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;

    if (open) {
      if (!dialog.open) dialog.showModal();
      dialog.dataset.state = "open";
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }

    if (dialog.open) {
      dialog.dataset.state = "closing";
      const timer = setTimeout(() => dialog.close(), EXIT_MS);
      return () => clearTimeout(timer);
    }
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      className="drawer"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClose={onClose}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          onClose();
        }
      }}
      onClick={(event) => {
        if (event.target === ref.current) onClose();
      }}
    >
      <div className="ml-auto flex h-full w-full max-w-md flex-col border-l border-line bg-surface text-fg shadow-pop">
        <div className="flex items-center justify-between border-b border-line px-4 py-3 sm:px-5">
          <h2 id={titleId} className="text-base font-semibold">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={`Close ${title.toLowerCase()}`}
            className="inline-flex size-10 items-center justify-center rounded-lg text-fg-muted transition hover:bg-surface-muted hover:text-fg"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-5">{children}</div>
        {footer && <div className="border-t border-line p-4 sm:p-5">{footer}</div>}
      </div>
    </dialog>
  );
}

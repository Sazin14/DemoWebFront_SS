"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";

interface FilterDrawerProps {
  open: boolean;
  onClose: () => void;
  onClear: () => void;
  resultCount: number;
  children: ReactNode;
}

/** Mobile filter panel built on the native <dialog> for focus trapping and Esc. */
export default function FilterDrawer({
  open,
  onClose,
  onClear,
  resultCount,
  children,
}: FilterDrawerProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === ref.current) onClose();
      }}
      aria-labelledby="filter-drawer-title"
      className="m-0 ml-auto h-full max-h-none w-full max-w-sm bg-transparent p-0 backdrop:bg-zinc-950/50 backdrop:backdrop-blur-sm"
    >
      <div className="flex h-full flex-col bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3">
          <h2 id="filter-drawer-title" className="text-base font-semibold">
            Filters
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close filters"
            className="inline-flex size-10 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-100"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-5">{children}</div>
        <div className="flex gap-3 border-t border-zinc-200 p-4">
          <button
            type="button"
            onClick={onClear}
            className="h-12 flex-1 rounded-xl border border-zinc-300 text-sm font-semibold text-zinc-800 hover:border-indigo-300"
          >
            Clear all
          </button>
          <button
            type="button"
            onClick={onClose}
            className="h-12 flex-[2] rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 text-sm font-semibold text-white"
          >
            Show {resultCount} {resultCount === 1 ? "product" : "products"}
          </button>
        </div>
      </div>
    </dialog>
  );
}

"use client";

import type { ReactNode } from "react";
import Drawer from "@/components/ui/Drawer";

interface FilterDrawerProps {
  open: boolean;
  onClose: () => void;
  onClear: () => void;
  resultCount: number;
  children: ReactNode;
}

export default function FilterDrawer({
  open,
  onClose,
  onClear,
  resultCount,
  children,
}: FilterDrawerProps) {
  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Filters"
      titleId="filter-drawer-title"
      footer={
        <div className="flex gap-3">
          <button type="button" onClick={onClear} className="btn btn-secondary h-12 flex-1">
            Clear all
          </button>
          <button type="button" onClick={onClose} className="btn btn-primary h-12 flex-[2]">
            Show {resultCount} {resultCount === 1 ? "product" : "products"}
          </button>
        </div>
      }
    >
      {children}
    </Drawer>
  );
}

"use client";

import { Minus, Plus } from "lucide-react";

interface QuantitySelectorProps {
  value: number;
  min?: number;
  max: number;
  onChange: (value: number) => void;
  label?: string;
  compact?: boolean;
}

export default function QuantitySelector({
  value,
  min = 1,
  max,
  onChange,
  label = "Quantity",
  compact = false,
}: QuantitySelectorProps) {
  const size = compact ? "size-9" : "size-11";
  const clamp = (next: number) => onChange(Math.min(max, Math.max(min, next)));

  return (
    <div role="group" aria-label={label} className="inline-flex items-center rounded-xl border border-zinc-300 bg-white">
      <button
        type="button"
        onClick={() => clamp(value - 1)}
        disabled={value <= min}
        aria-label="Decrease quantity"
        className={`${size} inline-flex items-center justify-center rounded-l-xl text-zinc-700 hover:bg-zinc-100 disabled:text-zinc-300 disabled:hover:bg-transparent`}
      >
        <Minus className="size-4" aria-hidden="true" />
      </button>
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        aria-label={label}
        value={value}
        onChange={(event) => {
          const parsed = parseInt(event.target.value.replace(/\D/g, ""), 10);
          if (Number.isFinite(parsed)) clamp(parsed);
        }}
        className={`${compact ? "h-9 w-10" : "h-11 w-12"} border-x border-zinc-300 bg-transparent text-center text-base font-semibold text-zinc-900 focus:outline-none focus-visible:bg-indigo-50 sm:text-sm`}
      />
      <button
        type="button"
        onClick={() => clamp(value + 1)}
        disabled={value >= max}
        aria-label="Increase quantity"
        className={`${size} inline-flex items-center justify-center rounded-r-xl text-zinc-700 hover:bg-zinc-100 disabled:text-zinc-300 disabled:hover:bg-transparent`}
      >
        <Plus className="size-4" aria-hidden="true" />
      </button>
    </div>
  );
}

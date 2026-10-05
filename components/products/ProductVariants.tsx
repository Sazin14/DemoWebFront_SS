"use client";

import { Check } from "lucide-react";
import type { ProductVariant, VariantSelection } from "@/lib/products/types";

interface ProductVariantsProps {
  variants: ProductVariant[];
  selection: VariantSelection;
  onSelect: (name: string, value: string) => void;
  errorGroup?: string | null;
  errorId?: string;
}

export default function ProductVariants({
  variants,
  selection,
  onSelect,
  errorGroup,
  errorId,
}: ProductVariantsProps) {
  return (
    <div className="space-y-5">
      {variants.map((group) => {
        const hasError = errorGroup === group.name;
        return (
          <fieldset key={group.name} aria-describedby={hasError ? errorId : undefined}>
            <legend className="mb-2 text-sm font-semibold text-zinc-900">
              {group.name}
              {selection[group.name] && (
                <span className="ml-2 font-normal text-zinc-600">{selection[group.name]}</span>
              )}
            </legend>
            <div className="flex flex-wrap gap-2">
              {group.options.map((option) => {
                const unavailable = option.available === false;
                const selected = selection[group.name] === option.value;
                const id = `variant-${group.name}-${option.value}`.replace(/\s+/g, "-");
                return (
                  <div key={option.value}>
                    <input
                      id={id}
                      type="radio"
                      name={`variant-${group.name}`}
                      value={option.value}
                      checked={selected}
                      disabled={unavailable}
                      onChange={() => onSelect(group.name, option.value)}
                      className="peer sr-only"
                    />
                    <label
                      htmlFor={id}
                      className={`inline-flex min-h-11 min-w-12 cursor-pointer items-center justify-center gap-1.5 rounded-xl border px-4 text-sm font-medium transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-indigo-600 ${
                        unavailable
                          ? "cursor-not-allowed border-zinc-200 bg-zinc-50 text-zinc-400 line-through"
                          : selected
                            ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                            : hasError
                              ? "border-rose-400 bg-white text-zinc-800 hover:border-rose-500"
                              : "border-zinc-300 bg-white text-zinc-800 hover:border-indigo-400"
                      }`}
                    >
                      {selected && <Check className="size-4" aria-hidden="true" />}
                      {option.value}
                      {unavailable && <span className="sr-only"> (unavailable)</span>}
                    </label>
                  </div>
                );
              })}
            </div>
          </fieldset>
        );
      })}
    </div>
  );
}

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
            <legend className="mb-2 text-sm font-semibold text-fg">
              {group.name}
              {selection[group.name] && (
                <span className="ml-2 font-normal text-fg-muted">{selection[group.name]}</span>
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
                      className={`inline-flex min-h-11 min-w-12 cursor-pointer items-center justify-center gap-1.5 rounded-xl border px-4 text-sm font-medium transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent ${
                        unavailable
                          ? "cursor-not-allowed border-line bg-surface-muted text-fg-subtle line-through"
                          : selected
                            ? "border-accent bg-accent-soft text-accent-ink"
                            : hasError
                              ? "border-danger bg-surface text-fg hover:border-danger"
                              : "border-line-strong bg-surface text-fg hover:border-accent"
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

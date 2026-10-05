"use client";

import type { ReactNode } from "react";
import { Star } from "lucide-react";
import {
  PRICE_RANGES,
  RATING_OPTIONS,
  type CatalogFilters,
} from "@/lib/products/catalog";

interface ProductFiltersProps {
  idPrefix: string;
  filters: CatalogFilters;
  categories: string[];
  onChange: (patch: Partial<CatalogFilters>) => void;
}

function Group({ legend, children }: { legend: string; children: ReactNode }) {
  return (
    <fieldset className="min-w-0 border-t border-line pt-5 first:border-0 first:pt-0">
      <legend className="mb-3 text-sm font-semibold text-fg">{legend}</legend>
      <div className="space-y-1">{children}</div>
    </fieldset>
  );
}

function Option({
  id,
  name,
  checked,
  onChange,
  children,
  type = "radio",
}: {
  id: string;
  name: string;
  checked: boolean;
  onChange: () => void;
  children: ReactNode;
  type?: "radio" | "checkbox";
}) {
  return (
    <label
      htmlFor={id}
      className="flex min-h-10 cursor-pointer items-center gap-3 rounded-lg px-2 text-sm text-fg-muted hover:bg-surface-muted"
    >
      <input
        id={id}
        type={type}
        name={name}
        checked={checked}
        onChange={onChange}
        className="size-4 accent-[var(--accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      />
      {children}
    </label>
  );
}

export default function ProductFilters({
  idPrefix,
  filters,
  categories,
  onChange,
}: ProductFiltersProps) {
  return (
    <div className="space-y-5">
      <Group legend="Category">
        <Option
          id={`${idPrefix}-cat-all`}
          name={`${idPrefix}-category`}
          checked={filters.category === ""}
          onChange={() => onChange({ category: "" })}
        >
          All categories
        </Option>
        {categories.map((category) => (
          <Option
            key={category}
            id={`${idPrefix}-cat-${category}`}
            name={`${idPrefix}-category`}
            checked={filters.category === category}
            onChange={() => onChange({ category })}
          >
            {category}
          </Option>
        ))}
      </Group>

      <Group legend="Price">
        <Option
          id={`${idPrefix}-price-any`}
          name={`${idPrefix}-price`}
          checked={filters.price === ""}
          onChange={() => onChange({ price: "" })}
        >
          Any price
        </Option>
        {PRICE_RANGES.map((range) => (
          <Option
            key={range.id}
            id={`${idPrefix}-price-${range.id}`}
            name={`${idPrefix}-price`}
            checked={filters.price === range.id}
            onChange={() => onChange({ price: range.id })}
          >
            {range.label}
          </Option>
        ))}
      </Group>

      <Group legend="Rating">
        <Option
          id={`${idPrefix}-rating-any`}
          name={`${idPrefix}-rating`}
          checked={filters.minRating === 0}
          onChange={() => onChange({ minRating: 0 })}
        >
          Any rating
        </Option>
        {RATING_OPTIONS.map((rating) => (
          <Option
            key={rating}
            id={`${idPrefix}-rating-${rating}`}
            name={`${idPrefix}-rating`}
            checked={filters.minRating === rating}
            onChange={() => onChange({ minRating: rating })}
          >
            <span className="flex items-center gap-1">
              {rating}
              <Star className="size-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
              &amp; up
            </span>
          </Option>
        ))}
      </Group>

      <Group legend="Availability">
        <Option
          id={`${idPrefix}-stock`}
          name={`${idPrefix}-stock`}
          type="checkbox"
          checked={filters.inStockOnly}
          onChange={() => onChange({ inStockOnly: !filters.inStockOnly })}
        >
          In stock only
        </Option>
      </Group>
    </div>
  );
}

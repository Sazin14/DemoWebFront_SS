"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronRight, Search, SlidersHorizontal, X } from "lucide-react";
import {
  SORT_OPTIONS,
  applyFilters,
  countActiveFilters,
  hasActiveCriteria,
  parseFilters,
  serializeFilters,
  DEFAULT_FILTERS,
  type CatalogFilters,
} from "@/lib/products/catalog";
import type { Product } from "@/lib/products/types";
import FilterDrawer from "./FilterDrawer";
import ProductFilters from "./ProductFilters";
import ProductGrid from "./ProductGrid";

const PAGE_SIZE = 12;

interface ProductCatalogProps {
  products: Product[];
  categories: string[];
}

export default function ProductCatalog({ products, categories }: ProductCatalogProps) {
  const searchParams = useSearchParams();
  const filters = useMemo(() => parseFilters(searchParams), [searchParams]);

  const [searchText, setSearchText] = useState(filters.query);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [limitState, setLimitState] = useState({ key: "", limit: PAGE_SIZE });
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  const filterKey = serializeFilters(filters);
  const visibleLimit = limitState.key === filterKey ? limitState.limit : PAGE_SIZE;

  // Keep the input in sync when the URL changes from outside (header search, back button).
  const [syncedQuery, setSyncedQuery] = useState(filters.query);
  if (syncedQuery !== filters.query) {
    setSyncedQuery(filters.query);
    setSearchText(filters.query);
  }

  useEffect(
    () => () => {
      if (debounce.current) clearTimeout(debounce.current);
    },
    [],
  );

  const update = useCallback(
    (patch: Partial<CatalogFilters>) => {
      const next = { ...parseFilters(new URLSearchParams(window.location.search)), ...patch };
      const query = serializeFilters(next);
      window.history.replaceState(
        null,
        "",
        query ? `${window.location.pathname}?${query}` : window.location.pathname,
      );
    },
    [],
  );

  function handleSearchChange(value: string) {
    setSearchText(value);
    if (debounce.current) clearTimeout(debounce.current);
    debounce.current = setTimeout(() => update({ query: value }), 200);
  }

  function clearSearch() {
    if (debounce.current) clearTimeout(debounce.current);
    setSearchText("");
    update({ query: "" });
  }

  function clearAll() {
    if (debounce.current) clearTimeout(debounce.current);
    setSearchText("");
    update({ ...DEFAULT_FILTERS, sort: filters.sort });
  }

  const results = useMemo(() => applyFilters(products, filters), [products, filters]);
  const visible = results.slice(0, visibleLimit);
  const activeCount = countActiveFilters(filters);
  const criteria = hasActiveCriteria(filters);
  const searchActive = filters.query !== "";

  const chips: { label: string; remove: () => void }[] = [];
  if (filters.category) chips.push({ label: filters.category, remove: () => update({ category: "" }) });
  if (filters.price)
    chips.push({
      label: ({ "under-50": "Under $50", "50-100": "$50 – $100", "100-500": "$100 – $500", "500-plus": "$500+" })[filters.price],
      remove: () => update({ price: "" }),
    });
  if (filters.minRating)
    chips.push({ label: `${filters.minRating}★ & up`, remove: () => update({ minRating: 0 }) });
  if (filters.inStockOnly) chips.push({ label: "In stock", remove: () => update({ inStockOnly: false }) });

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-zinc-500">
        <ol className="flex items-center gap-1.5">
          <li>
            <Link href="/" className="hover:text-indigo-600">Home</Link>
          </li>
          <ChevronRight className="size-3.5" aria-hidden="true" />
          <li aria-current="page" className="font-medium text-zinc-800">Products</li>
        </ol>
      </nav>

      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {searchActive ? `Results for “${filters.query}”` : "All products"}
        </h1>
        <p className="text-sm text-zinc-600" role="status" aria-live="polite">
          {results.length} {results.length === 1 ? "product" : "products"}
        </p>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <label htmlFor="catalog-search" className="sr-only">Search products</label>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-zinc-400" aria-hidden="true" />
          <input
            id="catalog-search"
            type="search"
            value={searchText}
            onChange={(event) => handleSearchChange(event.target.value)}
            placeholder="Search products…"
            autoComplete="off"
            className="h-12 w-full rounded-xl border border-zinc-300 bg-white pl-10 pr-11 text-base text-zinc-900 placeholder:text-zinc-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 sm:text-sm [&::-webkit-search-cancel-button]:hidden"
          />
          {searchText && (
            <button
              type="button"
              onClick={clearSearch}
              aria-label="Clear search"
              className="absolute right-1.5 top-1/2 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          )}
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-zinc-300 bg-white px-4 text-sm font-semibold text-zinc-800 hover:border-indigo-300 lg:hidden"
          >
            <SlidersHorizontal className="size-4" aria-hidden="true" />
            Filters{activeCount > 0 ? ` (${activeCount})` : ""}
          </button>
          <div className="flex-1 sm:flex-none">
            <label htmlFor="catalog-sort" className="sr-only">Sort products</label>
            <select
              id="catalog-sort"
              value={filters.sort}
              onChange={(event) => update({ sort: event.target.value as CatalogFilters["sort"] })}
              className="h-12 w-full rounded-xl border border-zinc-300 bg-white px-3 text-base text-zinc-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 sm:w-56 sm:text-sm"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {chips.length > 0 && (
        <ul className="mt-4 flex flex-wrap items-center gap-2" aria-label="Active filters">
          {chips.map((chip) => (
            <li key={chip.label}>
              <button
                type="button"
                onClick={chip.remove}
                aria-label={`Remove filter ${chip.label}`}
                className="inline-flex h-8 items-center gap-1.5 rounded-full bg-indigo-50 px-3 text-xs font-medium text-indigo-700 hover:bg-indigo-100"
              >
                {chip.label}
                <X className="size-3" aria-hidden="true" />
              </button>
            </li>
          ))}
          <li>
            <button type="button" onClick={clearAll} className="h-8 px-2 text-xs font-semibold text-zinc-600 underline-offset-2 hover:text-indigo-600 hover:underline">
              Clear all
            </button>
          </li>
        </ul>
      )}

      <div className="mt-6 flex gap-8">
        <aside aria-label="Filters" className="hidden w-60 shrink-0 lg:block">
          <div className="sticky top-24 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold">Filters</h2>
              {criteria && (
                <button type="button" onClick={clearAll} className="text-xs font-semibold text-indigo-600 hover:underline">
                  Clear all
                </button>
              )}
            </div>
            <ProductFilters idPrefix="desktop" filters={filters} categories={categories} onChange={update} />
          </div>
        </aside>

        <section aria-label="Product results" className="min-w-0 flex-1">
          {results.length === 0 ? (
            <div className="flex flex-col items-center rounded-2xl border border-dashed border-zinc-300 bg-white px-6 py-16 text-center">
              <span className="flex size-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                <Search className="size-6" aria-hidden="true" />
              </span>
              <h2 className="mt-4 text-lg font-semibold">
                {searchActive && activeCount === 0
                  ? "No products found"
                  : "No products match your filters"}
              </h2>
              <p className="mt-1 max-w-sm text-sm text-zinc-600">
                {searchActive
                  ? `We couldn’t find anything for “${filters.query}”. Check the spelling or try a broader search.`
                  : "Try removing a filter or two to see more products."}
              </p>
              <button
                type="button"
                onClick={clearAll}
                className="mt-6 h-11 rounded-xl bg-zinc-950 px-5 text-sm font-semibold text-white hover:bg-indigo-600"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <>
              <ProductGrid products={visible} />
              {visible.length < results.length && (
                <div className="mt-8 flex flex-col items-center gap-2">
                  <p className="text-sm text-zinc-500">
                    Showing {visible.length} of {results.length}
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      setLimitState({ key: filterKey, limit: visibleLimit + PAGE_SIZE })
                    }
                    className="h-12 rounded-xl border border-zinc-300 bg-white px-8 text-sm font-semibold text-zinc-800 hover:border-indigo-300 hover:text-indigo-600"
                  >
                    Load more
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>

      <FilterDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onClear={clearAll}
        resultCount={results.length}
      >
        <ProductFilters idPrefix="drawer" filters={filters} categories={categories} onChange={update} />
      </FilterDrawer>
    </div>
  );
}

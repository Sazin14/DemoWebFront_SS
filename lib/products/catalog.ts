import { categorySlug } from "./categories";
import type { Product, ProductAttributeValue } from "./types";
import { getStockStatus } from "./product-utils";

export const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Rating" },
  { value: "popular", label: "Most Popular" },
] as const;

export type SortValue = (typeof SORT_OPTIONS)[number]["value"];

export const PRICE_RANGES = [
  { id: "under-50", label: "Under $50", min: 0, max: 50 },
  { id: "50-100", label: "$50 – $100", min: 50, max: 100 },
  { id: "100-500", label: "$100 – $500", min: 100, max: 500 },
  { id: "500-plus", label: "$500+", min: 500, max: Infinity },
] as const;

export type PriceRangeId = (typeof PRICE_RANGES)[number]["id"];

export const RATING_OPTIONS = [4, 3] as const;

export interface CatalogFilters {
  query: string;
  category: string;
  attributes: Record<string, string[]>;
  price: PriceRangeId | "";
  minRating: number;
  inStockOnly: boolean;
  sort: SortValue;
}

export const DEFAULT_FILTERS: CatalogFilters = {
  query: "",
  category: "",
  attributes: {},
  price: "",
  minRating: 0,
  inStockOnly: false,
  sort: "featured",
};

type ParamSource = {
  get(name: string): string | null;
  forEach?: (callback: (value: string, key: string) => void) => void;
};

export function parseFilters(
  params: ParamSource,
  defaultCategory = "",
): CatalogFilters {
  const sort = params.get("sort");
  const price = params.get("price");
  const rating = Number(params.get("rating"));
  const attributes: Record<string, string[]> = {};
  params.forEach?.((value, key) => {
    if (!key.startsWith("attr.")) return;
    const id = key.slice(5);
    attributes[id] ??= [];
    if (!attributes[id].includes(value)) attributes[id].push(value);
  });

  return {
    query: (params.get("q") ?? "").trim(),
    category: categorySlug(params.get("category") ?? defaultCategory),
    attributes,
    price: PRICE_RANGES.some((range) => range.id === price)
      ? (price as PriceRangeId)
      : "",
    minRating: (RATING_OPTIONS as readonly number[]).includes(rating) ? rating : 0,
    inStockOnly: params.get("stock") === "1",
    sort: SORT_OPTIONS.some((option) => option.value === sort)
      ? (sort as SortValue)
      : DEFAULT_FILTERS.sort,
  };
}

export function serializeFilters(filters: CatalogFilters): string {
  const params = new URLSearchParams();
  if (filters.query.trim()) params.set("q", filters.query.trim());
  if (filters.category) params.set("category", filters.category);
  for (const [id, values] of Object.entries(filters.attributes).sort(([a], [b]) => a.localeCompare(b))) {
    for (const value of [...values].sort()) params.append(`attr.${id}`, value);
  }
  if (filters.price) params.set("price", filters.price);
  if (filters.minRating) params.set("rating", String(filters.minRating));
  if (filters.inStockOnly) params.set("stock", "1");
  if (filters.sort !== DEFAULT_FILTERS.sort) params.set("sort", filters.sort);
  return params.toString();
}

export function countActiveFilters(filters: CatalogFilters): number {
  return (
    (filters.category ? 1 : 0) +
    Object.values(filters.attributes).reduce((count, values) => count + (values.length > 0 ? 1 : 0), 0) +
    (filters.price ? 1 : 0) +
    (filters.minRating ? 1 : 0) +
    (filters.inStockOnly ? 1 : 0)
  );
}

export function hasActiveCriteria(filters: CatalogFilters): boolean {
  return countActiveFilters(filters) > 0 || filters.query.trim() !== "";
}

function matchesQuery(product: Product, query: string): boolean {
  const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return true;
  const attributeText = Object.values(product.attributes).flatMap((value) =>
    Array.isArray(value) ? value : String(value),
  );
  const haystack = [product.name, product.brand, product.category, ...product.tags, ...attributeText]
    .join(" ")
    .toLowerCase();
  return tokens.every((token) => haystack.includes(token));
}

export function applyFilters(
  products: Product[],
  filters: CatalogFilters,
): Product[] {
  const range = PRICE_RANGES.find((item) => item.id === filters.price);

  const filtered = products.filter((product) => {
    if (!matchesQuery(product, filters.query)) return false;
    if (filters.category && product.categoryId !== filters.category) return false;
    for (const [attributeId, selected] of Object.entries(filters.attributes)) {
      if (selected.length === 0) continue;
      const value: ProductAttributeValue | undefined = product.attributes[attributeId];
      const values = Array.isArray(value) ? value.map(String) : value === undefined ? [] : [String(value)];
      if (!selected.some((option) => values.includes(option))) return false;
    }
    if (range && (product.price < range.min || product.price >= range.max))
      return false;
    if (filters.minRating && product.rating < filters.minRating) return false;
    if (filters.inStockOnly && getStockStatus(product.stock) === "out-of-stock")
      return false;
    return true;
  });

  return sortProducts(filtered, filters.sort);
}

export function sortProducts(products: Product[], sort: SortValue): Product[] {
  const list = [...products];
  switch (sort) {
    case "newest":
      return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    case "price-asc":
      return list.sort((a, b) => a.price - b.price);
    case "price-desc":
      return list.sort((a, b) => b.price - a.price);
    case "rating":
      return list.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
    case "popular":
      return list.sort((a, b) => b.soldCount - a.soldCount);
    case "featured":
    default:
      return list.sort(
        (a, b) =>
          Number(!!b.featured) - Number(!!a.featured) ||
          b.rating * Math.log10(b.reviewCount + 10) -
            a.rating * Math.log10(a.reviewCount + 10),
      );
  }
}

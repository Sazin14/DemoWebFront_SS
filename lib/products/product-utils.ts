import { roundMoney } from "@/lib/format";
import type { Product, VariantSelection } from "./types";

export const LOW_STOCK_THRESHOLD = 5;

export type StockStatus = "in-stock" | "low-stock" | "out-of-stock";

export function getStockStatus(stock: number): StockStatus {
  if (stock <= 0) return "out-of-stock";
  if (stock <= LOW_STOCK_THRESHOLD) return "low-stock";
  return "in-stock";
}

export function getDiscountPercentage(
  price: number,
  originalPrice?: number,
): number | null {
  if (!originalPrice || originalPrice <= price) return null;
  const percentage = Math.round((1 - price / originalPrice) * 100);
  return percentage > 0 ? percentage : null;
}

export function hasVariants(product: Product): boolean {
  return (product.variants?.length ?? 0) > 0;
}

export interface UnitPricing {
  price: number;
  originalPrice?: number;
  discountPercentage: number | null;
}

/** Price for a product with the selected options applied. */
export function getUnitPricing(
  product: Product,
  selection: VariantSelection = {},
): UnitPricing {
  let delta = 0;
  for (const group of product.variants ?? []) {
    const chosen = group.options.find(
      (option) => option.value === selection[group.name],
    );
    delta += chosen?.priceDelta ?? 0;
  }

  const price = roundMoney(product.price + delta);
  const originalPrice =
    product.originalPrice !== undefined
      ? roundMoney(product.originalPrice + delta)
      : undefined;

  return {
    price,
    originalPrice,
    discountPercentage: getDiscountPercentage(price, originalPrice),
  };
}

/** Returns an error message, or null when the selection is valid. */
export function getSelectionError(
  product: Product,
  selection: VariantSelection,
): string | null {
  for (const group of product.variants ?? []) {
    const value = selection[group.name];
    if (!value) return `Select a ${group.name.toLowerCase()} to continue.`;

    const option = group.options.find((candidate) => candidate.value === value);
    if (!option || option.available === false || option.stock === 0) {
      return `The selected ${group.name.toLowerCase()} is not available.`;
    }
  }
  return null;
}

export function getSelectedStock(
  product: Product,
  selection: VariantSelection = {},
): number {
  return (product.variants ?? []).reduce((stock, group) => {
    const option = group.options.find((candidate) => candidate.value === selection[group.name]);
    if (!option) return stock;
    if (option.available === false) return 0;
    return Math.min(stock, option.stock ?? stock);
  }, product.stock);
}

export function getSelectedSku(
  product: Product,
  selection: VariantSelection = {},
): string {
  const selectedSkus = (product.variants ?? [])
    .map((group) => group.options.find((option) => option.value === selection[group.name])?.sku)
    .filter((sku): sku is string => Boolean(sku));
  if (selectedSkus.length > 0) return selectedSkus.at(-1) ?? product.sku;
  const selectedValues = Object.values(selection);
  return selectedValues.length > 0
    ? `${product.sku}-${selectedValues.join("-").toUpperCase().replace(/\s+/g, "-")}`
    : product.sku;
}

export function getSelectedImage(
  product: Product,
  selection: VariantSelection = {},
): string | undefined {
  for (const group of product.variants ?? []) {
    const image = group.options.find((option) => option.value === selection[group.name])?.image;
    if (image) return image;
  }
  return undefined;
}

export function getPriceFrom(product: Product): number {
  const deltas = (product.variants ?? []).map((group) =>
    Math.min(...group.options.map((option) => option.priceDelta ?? 0)),
  );
  return roundMoney(product.price + deltas.reduce((sum, d) => sum + d, 0));
}

export function getProductImage(product: Product, index = 0): string {
  return product.images[index] ?? product.images[0];
}

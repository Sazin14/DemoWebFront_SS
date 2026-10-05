import { roundMoney } from "@/lib/format";
import type { Product, VariantSelection } from "@/lib/products/types";
import {
  getSelectionError,
  getStockStatus,
  getUnitPricing,
} from "@/lib/products/product-utils";
import type { CartItem, CartTotals } from "./types";

export const FREE_SHIPPING_THRESHOLD = 50;
export const FLAT_SHIPPING = 5.99;
export const MAX_LINE_QUANTITY = 10;

export type AddToCartResult =
  | { ok: true; item: CartItem; quantity: number }
  | { ok: false; error: string };

export function buildItemKey(
  productId: string,
  options: VariantSelection,
): string {
  const parts = Object.keys(options)
    .sort()
    .map((name) => `${name}=${options[name]}`);
  return [productId, ...parts].join("|");
}

function lineLimit(stock: number): number {
  return Math.max(0, Math.min(stock, MAX_LINE_QUANTITY));
}

export function addItem(
  items: CartItem[],
  product: Product,
  selection: VariantSelection,
  quantity: number,
): { items: CartItem[]; result: AddToCartResult } {
  if (getStockStatus(product.stock) === "out-of-stock") {
    return { items, result: { ok: false, error: "This product is out of stock." } };
  }
  const selectionError = getSelectionError(product, selection);
  if (selectionError) {
    return { items, result: { ok: false, error: selectionError } };
  }

  const options: VariantSelection = {};
  for (const group of product.variants ?? []) options[group.name] = selection[group.name];

  const key = buildItemKey(product.id, options);
  const limit = lineLimit(product.stock);
  const existing = items.find((item) => item.key === key);
  const nextQuantity = Math.min(
    limit,
    Math.max(1, Math.floor(quantity)) + (existing?.quantity ?? 0),
  );

  const pricing = getUnitPricing(product, options);
  const line: CartItem = {
    key,
    productId: product.id,
    slug: product.slug,
    name: product.name,
    brand: product.brand,
    image: product.images[0],
    unitPrice: pricing.price,
    originalUnitPrice: pricing.originalPrice,
    currency: product.currency,
    quantity: nextQuantity,
    maxQuantity: limit,
    options,
  };

  const nextItems = existing
    ? items.map((item) => (item.key === key ? line : item))
    : [...items, line];

  return { items: nextItems, result: { ok: true, item: line, quantity: nextQuantity } };
}

export function updateQuantity(
  items: CartItem[],
  key: string,
  quantity: number,
): CartItem[] {
  if (!Number.isFinite(quantity) || quantity < 1) return removeItem(items, key);
  return items.map((item) =>
    item.key === key
      ? { ...item, quantity: Math.min(Math.floor(quantity), item.maxQuantity) }
      : item,
  );
}

export function removeItem(items: CartItem[], key: string): CartItem[] {
  return items.filter((item) => item.key !== key);
}

export function calculateTotals(items: CartItem[]): CartTotals {
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = roundMoney(
    items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
  );
  const shipping =
    items.length === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING;
  return { itemCount, subtotal, shipping, total: roundMoney(subtotal + shipping) };
}

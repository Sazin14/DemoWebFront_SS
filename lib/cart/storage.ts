import type { CartItem } from "./types";

export const CART_STORAGE_KEY = "ecomms_cart";
export const CART_CHANGE_EVENT = "ecomms:cart-change";

const EMPTY: CartItem[] = [];
let cachedRaw: string | null = null;
let cachedItems: CartItem[] = EMPTY;

function isCartItem(value: unknown): value is CartItem {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<CartItem>;
  return (
    typeof item.key === "string" &&
    typeof item.productId === "string" &&
    typeof item.slug === "string" &&
    typeof item.name === "string" &&
    typeof item.unitPrice === "number" &&
    typeof item.quantity === "number" &&
    item.quantity > 0 &&
    typeof item.maxQuantity === "number"
  );
}

/** Referentially stable between changes so it can feed useSyncExternalStore. */
export function readCart(): CartItem[] {
  if (typeof window === "undefined") return EMPTY;
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(CART_STORAGE_KEY);
  } catch {
    return EMPTY;
  }
  if (raw === cachedRaw) return cachedItems;

  cachedRaw = raw;
  try {
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    cachedItems = Array.isArray(parsed) ? parsed.filter(isCartItem) : EMPTY;
  } catch {
    cachedItems = EMPTY;
  }
  return cachedItems;
}

export function writeCart(items: CartItem[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Storage may be full or blocked; the cart simply won't persist.
  }
  window.dispatchEvent(new Event(CART_CHANGE_EVENT));
}

export function subscribeToCart(callback: () => void): () => void {
  const onStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === CART_STORAGE_KEY) callback();
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener(CART_CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(CART_CHANGE_EVENT, callback);
  };
}

export function getServerCart(): CartItem[] {
  return EMPTY;
}

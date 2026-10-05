import type { VariantSelection } from "@/lib/products/types";

/**
 * A cart line holds a SNAPSHOT of the product at add time.
 * Prices and stock stored here are NOT authoritative; the backend must
 * re-validate them at checkout.
 */
export interface CartItem {
  key: string;
  productId: string;
  slug: string;
  name: string;
  brand: string;
  image: string;
  unitPrice: number;
  originalUnitPrice?: number;
  currency: string;
  quantity: number;
  maxQuantity: number;
  options: VariantSelection;
}

export interface CartTotals {
  itemCount: number;
  subtotal: number;
  shipping: number;
  total: number;
}

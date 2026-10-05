"use client";

import Link from "next/link";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  addItem,
  calculateTotals,
  removeItem as removeCartItem,
  updateQuantity as updateCartQuantity,
  type AddToCartResult,
} from "@/lib/cart/cart";
import {
  getServerCart,
  readCart,
  subscribeToCart,
  writeCart,
} from "@/lib/cart/storage";
import type { CartItem, CartTotals } from "@/lib/cart/types";
import type { Product, VariantSelection } from "@/lib/products/types";

interface CartContextValue extends CartTotals {
  items: CartItem[];
  isReady: boolean;
  addToCart: (
    product: Product,
    options?: { selection?: VariantSelection; quantity?: number },
  ) => AddToCartResult;
  setQuantity: (key: string, quantity: number) => void;
  removeItem: (key: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const subscribeHydration = () => () => {};

interface Toast {
  id: number;
  message: string;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const items = useSyncExternalStore(subscribeToCart, readCart, getServerCart);
  const isReady = useSyncExternalStore(
    subscribeHydration,
    () => true,
    () => false,
  );
  const [toast, setToast] = useState<Toast | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const showToast = useCallback((message: string) => {
    if (timer.current) clearTimeout(timer.current);
    setToast({ id: Date.now(), message });
    timer.current = setTimeout(() => setToast(null), 4000);
  }, []);

  const addToCart = useCallback<CartContextValue["addToCart"]>(
    (product, { selection = {}, quantity = 1 } = {}) => {
      const { items: next, result } = addItem(
        readCart(),
        product,
        selection,
        quantity,
      );
      if (result.ok) {
        writeCart(next);
        showToast(`${product.name} added to cart`);
      }
      return result;
    },
    [showToast],
  );

  const setQuantity = useCallback((key: string, quantity: number) => {
    writeCart(updateCartQuantity(readCart(), key, quantity));
  }, []);

  const removeItem = useCallback((key: string) => {
    writeCart(removeCartItem(readCart(), key));
  }, []);

  const clearCart = useCallback(() => writeCart([]), []);

  const totals = useMemo(() => calculateTotals(items), [items]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      isReady,
      ...totals,
      addToCart,
      setQuantity,
      removeItem,
      clearCart,
    }),
    [items, isReady, totals, addToCart, setQuantity, removeItem, clearCart],
  );

  return (
    <CartContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        role="status"
        className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex justify-center px-4"
      >
        {toast && (
          <div
            key={toast.id}
            className="animate-fade-up pointer-events-auto flex max-w-md items-center gap-3 rounded-xl bg-zinc-900 px-4 py-3 text-sm text-white shadow-xl"
          >
            <span className="line-clamp-2">{toast.message}</span>
            <Link
              href="/cart"
              onClick={() => setToast(null)}
              className="shrink-0 font-semibold text-indigo-300 underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-white"
            >
              View cart
            </Link>
          </div>
        )}
      </div>
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { useToast } from "@/components/feedback/ToastProvider";
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
  /** Increments on every successful add; used to animate the header cart icon. */
  addedPulse: number;
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
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

export function CartProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const items = useSyncExternalStore(subscribeToCart, readCart, getServerCart);
  const isReady = useSyncExternalStore(
    subscribeHydration,
    () => true,
    () => false,
  );
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [addedPulse, setAddedPulse] = useState(0);

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
        setAddedPulse((count) => count + 1);
        toast({
          message: `${product.name} added to cart`,
          action: { label: "View cart", href: "/cart" },
        });
      }
      return result;
    },
    [toast],
  );

  const setQuantity = useCallback((key: string, quantity: number) => {
    writeCart(updateCartQuantity(readCart(), key, quantity));
  }, []);

  const removeItem = useCallback(
    (key: string) => {
      writeCart(removeCartItem(readCart(), key));
      toast({ message: "Removed from cart", variant: "info" });
    },
    [toast],
  );

  const clearCart = useCallback(() => {
    writeCart([]);
    toast({ message: "Cart cleared", variant: "info" });
  }, [toast]);

  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  const totals = useMemo(() => calculateTotals(items), [items]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      isReady,
      ...totals,
      addedPulse,
      drawerOpen,
      openDrawer,
      closeDrawer,
      addToCart,
      setQuantity,
      removeItem,
      clearCart,
    }),
    [
      items,
      isReady,
      totals,
      addedPulse,
      drawerOpen,
      openDrawer,
      closeDrawer,
      addToCart,
      setQuantity,
      removeItem,
      clearCart,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}

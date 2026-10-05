"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ShoppingBag, Trash2, Truck } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/cart/cart";
import { formatPrice } from "@/lib/format";
import DemoBadge from "@/components/feedback/DemoBadge";
import ProductImage from "@/components/products/ProductImage";
import QuantitySelector from "@/components/products/QuantitySelector";

export default function CartView() {
  const { items, isReady, itemCount, subtotal, shipping, total, setQuantity, removeItem, clearCart } =
    useCart();
  const [removing, setRemoving] = useState<string[]>([]);
  const [confirmClear, setConfirmClear] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  function handleRemove(key: string) {
    setRemoving((current) => [...current, key]);
    timers.current.push(
      setTimeout(() => {
        removeItem(key);
        setRemoving((current) => current.filter((k) => k !== key));
      }, 220),
    );
  }

  if (!isReady) {
    return (
      <div className="space-y-4" aria-busy="true" aria-label="Loading cart">
        {[0, 1].map((key) => (
          <div key={key} className="h-32 animate-pulse rounded-2xl bg-surface-sunken" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex animate-reveal flex-col items-center rounded-2xl border border-dashed border-line-strong bg-surface px-6 py-16 text-center">
        <span className="flex size-14 items-center justify-center rounded-2xl bg-accent-soft text-accent-ink">
          <ShoppingBag className="size-6" aria-hidden="true" />
        </span>
        <h2 className="mt-4 text-lg font-semibold">Your cart is empty</h2>
        <p className="mt-1 max-w-sm text-sm text-fg-muted">
          Looks like you haven’t added anything yet. Discover something you’ll love.
        </p>
        <Link
          href="/products"
          className="btn btn-primary mt-6 h-12 px-6"
        >
          Start shopping
        </Link>
      </div>
    );
  }

  const remaining = FREE_SHIPPING_THRESHOLD - subtotal;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_22rem] lg:items-start">
      <section aria-label="Cart items">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm text-fg-muted">
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </p>
          {confirmClear ? (
            <div className="flex items-center gap-1" role="group" aria-label="Confirm clearing cart">
              <span className="text-sm text-fg-muted">Remove all items?</span>
              <button
                type="button"
                onClick={() => {
                  setConfirmClear(false);
                  clearCart();
                }}
                className="btn h-9 bg-danger px-3 text-canvas"
              >
                Clear
              </button>
              <button type="button" onClick={() => setConfirmClear(false)} className="btn btn-ghost h-9 px-3">
                Keep
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmClear(true)}
              className="inline-flex h-10 items-center gap-1.5 rounded-lg px-2 text-sm font-medium text-fg-muted hover:text-danger-ink"
            >
              <Trash2 className="size-4" aria-hidden="true" /> Clear cart
            </button>
          )}
        </div>

        <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
          {items.map((item) => {
            const options = Object.entries(item.options);
            return (
              <li
                key={item.key}
                className={`flex gap-3 p-3 sm:gap-5 sm:p-5 ${
                  removing.includes(item.key) ? "pointer-events-none animate-item-out" : ""
                }`}
              >
                <Link
                  href={`/products/${item.slug}`}
                  className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-surface-sunken sm:size-28"
                >
                  <ProductImage src={item.image} alt={item.name} sizes="112px" />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-medium uppercase tracking-wide text-fg-subtle">
                        {item.brand}
                      </p>
                      <Link
                        href={`/products/${item.slug}`}
                        className="line-clamp-2 text-sm font-semibold leading-5 text-fg hover:text-accent-ink sm:text-base"
                      >
                        {item.name}
                      </Link>
                      {options.length > 0 && (
                        <p className="mt-0.5 text-xs text-fg-subtle">
                          {options.map(([name, value]) => `${name}: ${value}`).join(" · ")}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemove(item.key)}
                      aria-label={`Remove ${item.name} from cart`}
                      className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg text-fg-subtle hover:bg-danger-soft hover:text-danger-ink"
                    >
                      <Trash2 className="size-4" aria-hidden="true" />
                    </button>
                  </div>

                  <div className="mt-auto flex flex-wrap items-center justify-between gap-3">
                    <QuantitySelector
                      compact
                      value={item.quantity}
                      max={item.maxQuantity}
                      label={`Quantity for ${item.name}`}
                      onChange={(next) => setQuantity(item.key, next)}
                    />
                    <div className="text-right">
                      <p key={item.quantity} className="animate-swap text-base font-bold text-fg">
                        {formatPrice(item.unitPrice * item.quantity, item.currency)}
                      </p>
                      {item.quantity > 1 && (
                        <p className="text-xs text-fg-subtle">
                          {formatPrice(item.unitPrice, item.currency)} each
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <Link
          href="/products"
          className="mt-4 inline-flex h-11 items-center text-sm font-semibold text-accent-ink hover:underline"
        >
          ← Continue shopping
        </Link>
      </section>

      <aside
        aria-label="Order summary"
        className="rounded-2xl border border-line bg-surface p-5 shadow-sm lg:sticky lg:top-24"
      >
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-lg font-semibold">Order summary</h2>
          <DemoBadge label="Demo cart" />
        </div>
        <dl className="mt-4 space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-fg-muted">Subtotal</dt>
            <dd className="font-medium">{formatPrice(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-fg-muted">Estimated shipping</dt>
            <dd className="font-medium">{shipping === 0 ? "Free" : formatPrice(shipping)}</dd>
          </div>
          <div className="flex justify-between border-t border-line pt-3 text-base">
            <dt className="font-semibold">Estimated total</dt>
            <dd className="font-bold">{formatPrice(total)}</dd>
          </div>
        </dl>
        {remaining > 0 && (
          <p className="mt-4 flex items-start gap-2 rounded-lg bg-accent-soft px-3 py-2 text-xs text-accent-ink">
            <Truck className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
            Add {formatPrice(remaining)} more for free shipping.
          </p>
        )}
        <Link
          href="/checkout"
          className="btn btn-primary mt-5 h-13 w-full text-base"
        >
          Proceed to checkout
        </Link>
        <p className="mt-3 text-center text-xs text-fg-subtle">
          Demo cart — sample prices, no real order is placed.
        </p>
      </aside>
    </div>
  );
}

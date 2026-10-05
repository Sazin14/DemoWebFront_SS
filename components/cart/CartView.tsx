"use client";

import Link from "next/link";
import { ShoppingBag, Trash2, Truck } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/cart/cart";
import { formatPrice } from "@/lib/format";
import ProductImage from "@/components/products/ProductImage";
import QuantitySelector from "@/components/products/QuantitySelector";

export default function CartView() {
  const { items, isReady, itemCount, subtotal, shipping, total, setQuantity, removeItem, clearCart } =
    useCart();

  if (!isReady) {
    return (
      <div className="space-y-4" aria-busy="true" aria-label="Loading cart">
        {[0, 1].map((key) => (
          <div key={key} className="h-32 animate-pulse rounded-2xl bg-zinc-100" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-dashed border-zinc-300 bg-white px-6 py-16 text-center">
        <span className="flex size-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
          <ShoppingBag className="size-6" aria-hidden="true" />
        </span>
        <h2 className="mt-4 text-lg font-semibold">Your cart is empty</h2>
        <p className="mt-1 max-w-sm text-sm text-zinc-600">
          Looks like you haven’t added anything yet. Discover something you’ll love.
        </p>
        <Link
          href="/products"
          className="mt-6 inline-flex h-12 items-center rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 px-6 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25"
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
          <p className="text-sm text-zinc-600">
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </p>
          <button
            type="button"
            onClick={() => {
              if (window.confirm("Remove all items from your cart?")) clearCart();
            }}
            className="inline-flex h-10 items-center gap-1.5 rounded-lg px-2 text-sm font-medium text-zinc-600 hover:text-rose-600"
          >
            <Trash2 className="size-4" aria-hidden="true" /> Clear cart
          </button>
        </div>

        <ul className="divide-y divide-zinc-200 overflow-hidden rounded-2xl border border-zinc-200 bg-white">
          {items.map((item) => {
            const options = Object.entries(item.options);
            return (
              <li key={item.key} className="flex gap-3 p-3 sm:gap-5 sm:p-5">
                <Link
                  href={`/products/${item.slug}`}
                  className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-zinc-100 sm:size-28"
                >
                  <ProductImage src={item.image} alt={item.name} sizes="112px" />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                        {item.brand}
                      </p>
                      <Link
                        href={`/products/${item.slug}`}
                        className="line-clamp-2 text-sm font-semibold leading-5 text-zinc-900 hover:text-indigo-600 sm:text-base"
                      >
                        {item.name}
                      </Link>
                      {options.length > 0 && (
                        <p className="mt-0.5 text-xs text-zinc-500">
                          {options.map(([name, value]) => `${name}: ${value}`).join(" · ")}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.key)}
                      aria-label={`Remove ${item.name} from cart`}
                      className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-rose-50 hover:text-rose-600"
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
                      <p className="text-base font-bold text-zinc-900">
                        {formatPrice(item.unitPrice * item.quantity, item.currency)}
                      </p>
                      {item.quantity > 1 && (
                        <p className="text-xs text-zinc-500">
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
          className="mt-4 inline-flex h-11 items-center text-sm font-semibold text-indigo-600 hover:underline"
        >
          ← Continue shopping
        </Link>
      </section>

      <aside
        aria-label="Order summary"
        className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm lg:sticky lg:top-24"
      >
        <h2 className="text-lg font-semibold">Order summary</h2>
        <dl className="mt-4 space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-zinc-600">Subtotal</dt>
            <dd className="font-medium">{formatPrice(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-zinc-600">Estimated shipping</dt>
            <dd className="font-medium">{shipping === 0 ? "Free" : formatPrice(shipping)}</dd>
          </div>
          <div className="flex justify-between border-t border-zinc-200 pt-3 text-base">
            <dt className="font-semibold">Estimated total</dt>
            <dd className="font-bold">{formatPrice(total)}</dd>
          </div>
        </dl>
        {remaining > 0 && (
          <p className="mt-4 flex items-start gap-2 rounded-lg bg-indigo-50 px-3 py-2 text-xs text-indigo-800">
            <Truck className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
            Add {formatPrice(remaining)} more for free shipping.
          </p>
        )}
        <Link
          href="/checkout"
          className="mt-5 inline-flex h-13 w-full items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 text-base font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all hover:-translate-y-0.5"
        >
          Proceed to checkout
        </Link>
        <p className="mt-3 text-center text-xs text-zinc-500">
          Taxes and final prices are confirmed at checkout.
        </p>
      </aside>
    </div>
  );
}

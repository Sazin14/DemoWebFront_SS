"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { ShoppingBag, Trash2 } from "lucide-react";
import Drawer from "@/components/ui/Drawer";
import ProductImage from "@/components/products/ProductImage";
import QuantitySelector from "@/components/products/QuantitySelector";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";

export default function CartDrawer() {
  const { items, itemCount, subtotal, shipping, drawerOpen, closeDrawer, setQuantity, removeItem } =
    useCart();
  const pathname = usePathname();

  // Close when navigating (e.g. to a product from inside the drawer).
  useEffect(() => {
    closeDrawer();
  }, [pathname, closeDrawer]);

  return (
    <Drawer
      open={drawerOpen}
      onClose={closeDrawer}
      title={`Your cart${itemCount > 0 ? ` (${itemCount})` : ""}`}
      titleId="cart-drawer-title"
      footer={
        items.length > 0 ? (
          <div className="space-y-3">
            <dl className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <dt className="text-fg-muted">Subtotal</dt>
                <dd className="font-semibold">{formatPrice(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-fg-muted">Shipping</dt>
                <dd>{shipping === 0 ? "Free" : formatPrice(shipping)}</dd>
              </div>
            </dl>
            <Link href="/checkout" className="btn btn-primary h-12 w-full text-base">
              Checkout
            </Link>
            <Link href="/cart" className="btn btn-secondary h-12 w-full">
              View cart
            </Link>
            <p className="text-center text-[11px] text-fg-subtle">
              Demo cart · stored in this browser only
            </p>
          </div>
        ) : undefined
      }
    >
      {items.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-accent-soft text-accent-ink">
            <ShoppingBag className="size-6" aria-hidden="true" />
          </span>
          <p className="font-semibold">Your cart is empty</p>
          <Link href="/products" className="btn btn-primary">
            Browse products
          </Link>
        </div>
      ) : (
        <ul className="divide-y divide-line">
          {items.map((item) => (
            <li key={item.key} className="flex gap-3 py-4 first:pt-0">
              <Link
                href={`/products/${item.slug}`}
                className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-surface-sunken"
              >
                <ProductImage src={item.image} alt={item.name} sizes="80px" />
              </Link>
              <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                <div className="flex items-start justify-between gap-2">
                  <Link
                    href={`/products/${item.slug}`}
                    className="line-clamp-2 text-sm font-semibold leading-5 hover:text-accent-ink"
                  >
                    {item.name}
                  </Link>
                  <button
                    type="button"
                    onClick={() => removeItem(item.key)}
                    aria-label={`Remove ${item.name} from cart`}
                    className="-mr-1 -mt-1 inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-fg-subtle hover:bg-danger-soft hover:text-danger-ink"
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                  </button>
                </div>
                {Object.keys(item.options).length > 0 && (
                  <p className="text-xs text-fg-subtle">
                    {Object.entries(item.options)
                      .map(([name, value]) => `${name}: ${value}`)
                      .join(" · ")}
                  </p>
                )}
                <div className="mt-auto flex items-center justify-between gap-2">
                  <QuantitySelector
                    compact
                    value={item.quantity}
                    max={item.maxQuantity}
                    label={`Quantity for ${item.name}`}
                    onChange={(next) => setQuantity(item.key, next)}
                  />
                  <span className="text-sm font-bold">
                    {formatPrice(item.unitPrice * item.quantity, item.currency)}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Drawer>
  );
}

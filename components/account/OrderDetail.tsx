"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { ArrowLeft, Check, Circle, PackageCheck } from "lucide-react";
import AuthActions from "@/components/auth/AuthActions";
import AuthGuard from "@/components/auth/AuthGuard";
import DemoBadge from "@/components/feedback/DemoBadge";
import ThemeToggle from "@/components/theme/ThemeToggle";
import ProductImage from "@/components/products/ProductImage";
import { formatPrice } from "@/lib/format";
import {
  getDemoOrderSnapshot,
  getServerDemoOrderSnapshot,
  subscribeToDemoOrders,
} from "@/lib/orders/order-service";
import { formatDate, StatusPill } from "./AccountDashboard";

export default function OrderDetail({ orderId }: { orderId: string }) {
  return <AuthGuard><OrderDetailContent orderId={orderId} /></AuthGuard>;
}

function OrderDetailContent({ orderId }: { orderId: string }) {
  const orderSnapshot = useSyncExternalStore(
    subscribeToDemoOrders,
    getDemoOrderSnapshot,
    getServerDemoOrderSnapshot,
  );
  const order = orderSnapshot.orders.find((candidate) => candidate.id === orderId || candidate.number === orderId) ?? null;
  const error = orderSnapshot.error;

  return (
    <main className="min-h-screen bg-surface-muted px-4 py-6 text-fg sm:px-6 sm:py-8">
      <div className="mx-auto max-w-5xl">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-5">
          <Link href="/account" className="text-lg font-semibold tracking-tight">EcomMS <span className="text-fg-subtle">/ Order details</span></Link>
          <div className="flex items-center gap-2"><ThemeToggle /><AuthActions /></div>
        </header>
        <div className="mt-7">
          <Link href="/account/orders" className="inline-flex items-center gap-1 text-sm font-medium text-accent-ink hover:underline"><ArrowLeft className="size-4" aria-hidden="true" /> Order history</Link>
        </div>
        {error ? (
          <p role="alert" className="mt-6 rounded-xl bg-danger-soft p-4 text-sm text-danger-ink">{error}</p>
        ) : !order ? (
          <div className="mt-6 rounded-2xl border border-line bg-surface p-8 text-center">
            <PackageCheck className="mx-auto size-9 text-fg-subtle" aria-hidden="true" />
            <h1 className="mt-3 text-xl font-bold">Sample order not found</h1>
            <p className="mt-2 text-sm text-fg-muted">It may have been cleared from this browser.</p>
            <Link href="/account/orders" className="btn btn-primary mt-5 h-11 px-5">Back to order history</Link>
          </div>
        ) : (
          <>
            <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
              <div><div className="flex items-center gap-3"><h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{order.number}</h1><DemoBadge label="Demo order" /></div><p className="mt-2 text-sm text-fg-muted">Placed {formatDate(order.date)}</p></div>
              <StatusPill status={order.status} />
            </div>

            <section className="mt-6 rounded-2xl border border-line bg-surface p-5 sm:p-7" aria-labelledby="timeline-heading">
              <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 id="timeline-heading" className="text-lg font-semibold">Order status</h2><p className="mt-1 text-sm text-fg-muted">Sample tracking timeline — not connected to a carrier.</p></div><PackageCheck className="size-6 text-accent-ink" aria-hidden="true" /></div>
              <ol className="mt-6 grid gap-4 sm:grid-cols-5">
                {order.timeline.map((entry, index) => {
                  const done = Boolean(entry.date);
                  return (
                    <li key={entry.status} className="relative flex gap-3 sm:flex-col sm:gap-2">
                      {index < order.timeline.length - 1 && <span aria-hidden="true" className="absolute left-[11px] top-7 h-[calc(100%+4px)] w-px bg-line-strong sm:left-7 sm:top-[11px] sm:h-px sm:w-[calc(100%+1rem)]" />}
                      <span className={`relative z-10 flex size-6 shrink-0 items-center justify-center rounded-full ${done ? "bg-success text-white" : "border border-line-strong bg-surface text-fg-subtle"}`}>{done ? <Check className="size-3.5" aria-hidden="true" /> : <Circle className="size-2 fill-current" aria-hidden="true" />}</span>
                      <div className="pb-3 sm:pb-0"><p className="text-sm font-semibold capitalize">{entry.status}</p><p className="mt-1 text-xs leading-5 text-fg-subtle">{entry.date ? formatDate(entry.date) : entry.note}</p></div>
                    </li>
                  );
                })}
              </ol>
            </section>

            <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_19rem]">
              <section className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
                <h2 className="text-lg font-semibold">Items in this order</h2>
                <ul className="mt-4 divide-y divide-line">
                  {order.items.map((item, index) => (
                    <li key={`${item.productId}-${index}`} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                      <Link href={`/products/${item.slug}`} className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-surface-sunken sm:size-24"><ProductImage src={item.image} alt={item.name} sizes="96px" /></Link>
                      <div className="min-w-0 flex-1"><Link href={`/products/${item.slug}`} className="font-semibold hover:text-accent-ink">{item.name}</Link><p className="mt-1 text-xs text-fg-subtle">Qty {item.quantity}{Object.values(item.options).length ? ` · ${Object.values(item.options).join(" / ")}` : ""}</p><p className="mt-2 text-sm font-medium">{formatPrice(item.unitPrice, item.currency)} each</p></div>
                      <p className="shrink-0 text-sm font-bold">{formatPrice(item.unitPrice * item.quantity, item.currency)}</p>
                    </li>
                  ))}
                </ul>
              </section>

              <aside className="space-y-4">
                <section className="rounded-2xl border border-line bg-surface p-5">
                  <h2 className="font-semibold">Order summary</h2>
                  <dl className="mt-4 space-y-3 text-sm">
                    <Summary label="Subtotal" value={formatPrice(order.subtotal)} />
                    <Summary label="Shipping" value={order.shipping === 0 ? "Free" : formatPrice(order.shipping)} />
                    <div className="flex justify-between border-t border-line pt-3 text-base"><dt className="font-semibold">Total</dt><dd className="font-bold">{formatPrice(order.total)}</dd></div>
                  </dl>
                </section>
                <section className="rounded-2xl border border-line bg-surface p-5">
                  <h2 className="font-semibold">Delivery details</h2>
                  <p className="mt-3 text-sm leading-6">{order.address.fullName}<br />{order.address.address}<br />{order.address.city}, {order.address.region} {order.address.postalCode}<br />{order.address.country}</p>
                  <p className="mt-3 border-t border-line pt-3 text-xs leading-5 text-fg-muted">{order.deliveryMethod}<br />{order.paymentMethod}</p>
                </section>
              </aside>
            </div>
            <p className="mt-5 text-xs leading-5 text-fg-subtle">This order record is demonstration data stored in the browser. It does not represent a real purchase or shipment.</p>
          </>
        )}
      </div>
    </main>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between"><dt className="text-fg-muted">{label}</dt><dd className="font-medium">{value}</dd></div>;
}

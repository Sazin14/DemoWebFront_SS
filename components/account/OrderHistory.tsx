"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { ArrowLeft, ArrowRight, PackageOpen } from "lucide-react";
import AuthActions from "@/components/auth/AuthActions";
import AuthGuard from "@/components/auth/AuthGuard";
import DemoBadge from "@/components/feedback/DemoBadge";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { formatPrice } from "@/lib/format";
import {
  getDemoOrderSnapshot,
  getServerDemoOrderSnapshot,
  subscribeToDemoOrders,
} from "@/lib/orders/order-service";
import { formatDate, StatusPill } from "./AccountDashboard";

export default function OrderHistory() {
  return <AuthGuard><OrderHistoryContent /></AuthGuard>;
}

function OrderHistoryContent() {
  const orderSnapshot = useSyncExternalStore(
    subscribeToDemoOrders,
    getDemoOrderSnapshot,
    getServerDemoOrderSnapshot,
  );
  const orders = orderSnapshot.orders;
  const error = orderSnapshot.error;

  return (
    <main className="min-h-screen bg-surface-muted px-4 py-6 text-fg sm:px-6 sm:py-8">
      <div className="mx-auto max-w-5xl">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-5">
          <Link href="/account" className="text-lg font-semibold tracking-tight">EcomMS <span className="text-fg-subtle">/ Orders</span></Link>
          <div className="flex items-center gap-2"><ThemeToggle /><AuthActions /></div>
        </header>
        <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <Link href="/account" className="mb-3 inline-flex items-center gap-1 text-sm font-medium text-accent-ink hover:underline"><ArrowLeft className="size-4" aria-hidden="true" /> Account overview</Link>
            <div className="flex items-center gap-3"><h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Order history</h1><DemoBadge label="Sample orders" /></div>
            <p className="mt-2 text-sm text-fg-muted">A customer-facing view of orders and their current sample status.</p>
          </div>
          <Link href="/products" className="btn btn-secondary h-11 px-4">Shop products</Link>
        </div>
        {error ? <p role="alert" className="mt-6 rounded-xl bg-danger-soft p-4 text-sm text-danger-ink">{error}</p> : orders.length === 0 ? (
          <div className="mt-7 rounded-2xl border border-dashed border-line-strong bg-surface px-6 py-16 text-center">
            <PackageOpen className="mx-auto size-8 text-fg-subtle" aria-hidden="true" />
            <h2 className="mt-3 text-lg font-semibold">No sample orders yet</h2>
            <p className="mt-1 text-sm text-fg-muted">Demo orders placed in checkout will appear here.</p>
          </div>
        ) : (
          <ul className="mt-7 space-y-4">
            {orders.map((order) => (
              <li key={order.id} className="rounded-2xl border border-line bg-surface p-4 shadow-sm sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div><p className="text-lg font-bold">{order.number}</p><p className="mt-1 text-sm text-fg-muted">Placed {formatDate(order.date)} · {order.items.length} {order.items.length === 1 ? "item" : "items"}</p></div>
                  <StatusPill status={order.status} />
                </div>
                <ul className="mt-5 divide-y divide-line border-y border-line">
                  {order.items.map((item, index) => (
                    <li key={`${item.productId}-${index}`} className="flex flex-wrap items-center justify-between gap-3 py-3">
                      <div className="min-w-0"><Link href={`/products/${item.slug}`} className="font-medium hover:text-accent-ink">{item.name}</Link><p className="mt-1 text-xs text-fg-subtle">Qty {item.quantity}{Object.values(item.options).length ? ` · ${Object.values(item.options).join(" / ")}` : ""}</p></div>
                      <p className="font-semibold">{formatPrice(item.unitPrice * item.quantity, item.currency)}</p>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm text-fg-muted">Order total <strong className="ml-1 text-base text-fg">{formatPrice(order.total)}</strong></p>
                  <Link href={`/account/orders/${order.id}`} className="inline-flex min-h-10 items-center gap-1 text-sm font-semibold text-accent-ink hover:underline">Track order <ArrowRight className="size-4" aria-hidden="true" /></Link>
                </div>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-6 text-xs leading-5 text-fg-subtle">Order details and status are demonstration data, not a live order-management service.</p>
      </div>
    </main>
  );
}

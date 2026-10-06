"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { ArrowRight, Bell, Box, CircleUserRound, PackageCheck, ShoppingBag } from "lucide-react";
import AuthActions from "@/components/auth/AuthActions";
import AuthGuard from "@/components/auth/AuthGuard";
import DemoBadge from "@/components/feedback/DemoBadge";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { useAuth } from "@/context/AuthContext";
import { formatPrice } from "@/lib/format";
import { getNotifications } from "@/lib/notifications/notification-service";
import {
  getDemoOrderSnapshot,
  getServerDemoOrderSnapshot,
  subscribeToDemoOrders,
} from "@/lib/orders/order-service";
import type { DemoOrder } from "@/lib/orders/types";

const notifications = getNotifications();

export default function AccountDashboard() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}

function DashboardContent() {
  const { currentUser } = useAuth();
  const orderSnapshot = useSyncExternalStore(
    subscribeToDemoOrders,
    getDemoOrderSnapshot,
    getServerDemoOrderSnapshot,
  );
  const orders = orderSnapshot.orders;
  const loadError = orderSnapshot.error;

  const pendingOrders = orders.filter((order) => !["delivered"].includes(order.status)).length;

  return (
    <main className="min-h-screen bg-surface-muted px-4 py-6 text-fg sm:px-6 sm:py-8">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-5">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            EcomMS <span className="text-fg-subtle">/ My account</span>
          </Link>
          <div className="flex items-center gap-2"><ThemeToggle /><AuthActions /></div>
        </header>

        <section className="mt-7 overflow-hidden rounded-3xl border border-line bg-surface shadow-card">
          <div className="bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 px-6 py-7 text-white sm:px-9 sm:py-9">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <DemoBadge label="Demo account" />
                <h1 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">Welcome back{currentUser?.name ? `, ${currentUser.name.split(" ")[0]}` : ""}</h1>
                <p className="mt-2 text-sm text-white/80">Your orders and customer activity, together in one place.</p>
              </div>
              <CircleUserRound className="size-11 text-white/80" aria-hidden="true" />
            </div>
          </div>

          <div className="grid gap-4 p-5 sm:grid-cols-3 sm:p-7">
            <Metric icon={<Box className="size-5" aria-hidden="true" />} label="Sample orders" value={String(orders.length)} />
            <Metric icon={<PackageCheck className="size-5" aria-hidden="true" />} label="In progress" value={String(pendingOrders)} />
            <Metric icon={<Bell className="size-5" aria-hidden="true" />} label="Demo notifications" value={String(notifications.filter((notification) => !notification.read).length)} />
          </div>
        </section>

        <div className="mt-7 grid gap-7 lg:grid-cols-[minmax(0,1.45fr)_minmax(18rem,.75fr)]">
          <section aria-labelledby="recent-orders-heading">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div><h2 id="recent-orders-heading" className="text-xl font-bold tracking-tight">Recent orders</h2><p className="mt-1 text-sm text-fg-muted">Sample order activity for the customer experience.</p></div>
              <Link href="/account/orders" className="inline-flex items-center gap-1 text-sm font-semibold text-accent-ink hover:underline">View order history <ArrowRight className="size-4" aria-hidden="true" /></Link>
            </div>
            {loadError ? (
              <p role="alert" className="rounded-xl border border-danger/30 bg-danger-soft p-4 text-sm text-danger-ink">{loadError}</p>
            ) : orders.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-line-strong bg-surface p-10 text-center text-sm text-fg-muted">No sample orders are available.</div>
            ) : (
              <ul className="space-y-3">
                {orders.slice(0, 3).map((order) => <OrderSummary key={order.id} order={order} />)}
              </ul>
            )}
          </section>

          <aside className="space-y-7">
            <section aria-labelledby="quick-actions-heading">
              <h2 id="quick-actions-heading" className="mb-3 text-xl font-bold tracking-tight">Quick actions</h2>
              <div className="grid gap-2">
                <QuickAction href="/account/orders" icon={<PackageCheck className="size-4" aria-hidden="true" />} label="My orders" />
                <QuickAction href="/products" icon={<ShoppingBag className="size-4" aria-hidden="true" />} label="Continue shopping" />
                <div className="rounded-xl border border-line bg-surface p-3 text-sm">
                  <p className="font-semibold">Account settings</p>
                  <p className="mt-2 font-medium">{currentUser?.name ?? "Customer"}</p>
                  <p className="mt-1 truncate text-xs text-fg-muted">{currentUser?.email}</p>
                  <p className="mt-3 text-xs leading-5 text-fg-subtle">Profile data comes from the existing temporary frontend authentication demo; no account API is connected.</p>
                </div>
              </div>
            </section>

            <section aria-labelledby="address-heading" className="rounded-xl border border-line bg-surface p-4">
              <div className="flex items-center justify-between gap-2"><h2 id="address-heading" className="font-semibold">Delivery address</h2><DemoBadge label="Sample" /></div>
              {orders[0] ? (
                <p className="mt-3 text-sm leading-6 text-fg-muted">{orders[0].address.fullName}<br />{orders[0].address.address}<br />{orders[0].address.city}, {orders[0].address.region} {orders[0].address.postalCode}<br />{orders[0].address.country}</p>
              ) : (
                <p className="mt-3 text-sm leading-6 text-fg-muted">Addresses entered at demo checkout stay in this browser with the sample order.</p>
              )}
              <p className="mt-3 text-xs leading-5 text-fg-subtle">Address book management is not connected to an account service.</p>
            </section>

            <section aria-labelledby="notifications-heading">
              <div className="mb-3 flex items-center justify-between gap-2">
                <h2 id="notifications-heading" className="text-xl font-bold tracking-tight">Notifications</h2>
                <DemoBadge label="Demo" />
              </div>
              <ul className="space-y-2">
                {notifications.slice(0, 3).map((notification) => (
                  <li key={notification.id}>
                    <Link href={notification.href} className={`block rounded-xl border p-3 transition-colors hover:border-line-strong ${notification.read ? "border-line bg-surface" : "border-accent/30 bg-accent-soft/40"}`}>
                      <span className="flex items-center gap-2 text-sm font-semibold"><Bell className="size-3.5 text-accent-ink" aria-hidden="true" />{notification.title}</span>
                      <span className="mt-1 block text-xs leading-5 text-fg-muted">{notification.message}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-xs leading-5 text-fg-subtle">These sample messages illustrate the future Notification Service experience.</p>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return <div className="rounded-2xl border border-line bg-surface-muted p-4"><div className="flex items-center justify-between text-fg-subtle">{icon}<span className="text-xs">{label}</span></div><p className="mt-3 text-2xl font-bold tracking-tight">{value}</p></div>;
}

function OrderSummary({ order }: { order: DemoOrder }) {
  return (
    <li className="rounded-2xl border border-line bg-surface p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div><p className="font-semibold">{order.number}</p><p className="mt-1 text-xs text-fg-subtle">{formatDate(order.date)} · {order.items.length} {order.items.length === 1 ? "item" : "items"}</p></div>
        <StatusPill status={order.status} />
      </div>
      <div className="mt-4 flex items-end justify-between gap-3 border-t border-line pt-3">
        <p className="text-xs text-fg-muted">{order.items.map((item) => item.name).join(", ")}</p>
        <p className="shrink-0 font-bold">{formatPrice(order.total)}</p>
      </div>
      <Link href={`/account/orders/${order.id}`} className="mt-3 inline-flex min-h-10 items-center text-sm font-semibold text-accent-ink hover:underline">View order details <ArrowRight className="ml-1 size-4" aria-hidden="true" /></Link>
    </li>
  );
}

export function StatusPill({ status }: { status: DemoOrder["status"] }) {
  const label = status.charAt(0).toUpperCase() + status.slice(1);
  const color = status === "delivered" ? "bg-success-soft text-success-ink" : status === "shipped" ? "bg-accent-soft text-accent-ink" : "bg-warn-soft text-warn-ink";
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${color}`}>{label}</span>;
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
}

function QuickAction({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return <Link href={href} className="flex min-h-11 items-center gap-2 rounded-xl border border-line bg-surface px-3 text-sm font-medium hover:border-accent/50 hover:text-accent-ink">{icon}{label}<ArrowRight className="ml-auto size-4" aria-hidden="true" /></Link>;
}

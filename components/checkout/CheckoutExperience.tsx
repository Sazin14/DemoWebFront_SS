"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, LockKeyhole, PackageCheck, ShieldCheck, Truck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { FREE_SHIPPING_THRESHOLD, FLAT_SHIPPING } from "@/lib/cart/cart";
import { formatPrice } from "@/lib/format";
import { writeCart } from "@/lib/cart/storage";
import { createDemoOrder } from "@/lib/orders/order-service";
import type { DemoAddress, DemoOrder } from "@/lib/orders/types";
import DemoBadge from "@/components/feedback/DemoBadge";
import ProductImage from "@/components/products/ProductImage";

type PaymentMethod = "Credit/debit card (demo)" | "Mobile banking (demo)" | "Cash on delivery (demo)";
type DeliveryMethod = "Standard delivery (demo)" | "Express delivery (demo)";

const PAYMENT_METHODS: PaymentMethod[] = [
  "Credit/debit card (demo)",
  "Mobile banking (demo)",
  "Cash on delivery (demo)",
];

const EMPTY_ADDRESS: DemoAddress = {
  fullName: "",
  address: "",
  city: "",
  region: "",
  postalCode: "",
  country: "United States",
};

export default function CheckoutExperience() {
  const { items, isReady, itemCount, subtotal, shipping: standardShipping, total: standardTotal } = useCart();
  const { currentUser } = useAuth();
  const router = useRouter();
  const [address, setAddress] = useState(EMPTY_ADDRESS);
  const [email, setEmail] = useState("");
  const [delivery, setDelivery] = useState<DeliveryMethod>("Standard delivery (demo)");
  const [payment, setPayment] = useState<PaymentMethod>(PAYMENT_METHODS[0]);
  const [order, setOrder] = useState<DemoOrder | null>(null);
  const [error, setError] = useState("");

  const checkoutAddress = { ...address, fullName: address.fullName || currentUser?.name || "" };
  const contactEmail = email || currentUser?.email || "";
  const shipping = delivery === "Express delivery (demo)"
    ? 12.99
    : subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0
      ? 0
      : FLAT_SHIPPING;
  const total = delivery === "Standard delivery (demo)" ? standardTotal : subtotal + shipping;

  function updateAddress(field: keyof DemoAddress, value: string) {
    setAddress((current) => ({ ...current, [field]: value }));
  }

  function placeOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (items.length === 0) {
      setError("Your cart is empty. Add a product before placing a demo order.");
      return;
    }
    try {
      const placed = createDemoOrder({
        customerName: checkoutAddress.fullName,
        customerEmail: contactEmail,
        items,
        subtotal,
        shipping,
        total,
        address: checkoutAddress,
        deliveryMethod: delivery,
        paymentMethod: payment,
      });
      setOrder(placed);
      writeCart([]);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The demo order could not be saved in this browser.");
    }
  }

  if (order) {
    return (
      <div className="mx-auto max-w-3xl py-8">
        <section className="rounded-3xl border border-line bg-surface p-6 text-center shadow-card sm:p-10">
          <span className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-success-soft text-success-ink">
            <CheckCircle2 className="size-8" aria-hidden="true" />
          </span>
          <DemoBadge label="Demo order only" />
          <h1 className="mt-5 text-3xl font-bold tracking-tight">Your sample order is confirmed</h1>
          <p className="mx-auto mt-3 max-w-xl leading-7 text-fg-muted">
            Order <strong className="text-fg">{order.number}</strong> was saved in this browser to demonstrate the customer order flow.
            No payment was taken and no order service was contacted.
          </p>
          <div className="mx-auto mt-7 grid max-w-lg gap-3 rounded-2xl bg-surface-muted p-5 text-left sm:grid-cols-2">
            <div><p className="text-xs text-fg-subtle">Order total</p><p className="mt-1 font-semibold">{formatPrice(order.total)}</p></div>
            <div><p className="text-xs text-fg-subtle">Delivery</p><p className="mt-1 font-semibold">{order.deliveryMethod}</p></div>
            <div className="sm:col-span-2"><p className="text-xs text-fg-subtle">Confirmation contact</p><p className="mt-1 font-semibold">{order.customerEmail}</p></div>
          </div>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href={`/account/orders/${order.id}`} className="btn btn-primary h-12 px-6">View order details</Link>
            <Link href="/products" className="btn btn-secondary h-12 px-6">Continue shopping</Link>
          </div>
        </section>
      </div>
    );
  }

  if (!isReady) {
    return <div className="h-72 animate-pulse rounded-2xl bg-surface-sunken" aria-label="Loading checkout" aria-busy="true" />;
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-lg py-16 text-center">
        <PackageCheck className="mx-auto size-10 text-fg-subtle" aria-hidden="true" />
        <h1 className="mt-4 text-2xl font-bold">Nothing to check out yet</h1>
        <p className="mt-2 text-sm text-fg-muted">Your cart is empty. Find something you like to start a demo checkout.</p>
        <Link href="/products" className="btn btn-primary mt-6 h-12 px-6">Explore products</Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-7">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Checkout</h1>
          <DemoBadge label="Demo checkout" />
        </div>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-fg-muted">
          Complete the sample customer journey. Address and order details stay in this browser; payment options are labels only.
        </p>
      </div>

      <form onSubmit={placeOrder} className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-5">
          <section className="rounded-2xl border border-line bg-surface p-5 sm:p-7">
            <div className="mb-5 flex items-start gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-sm font-bold text-accent-ink">1</span>
              <div><h2 className="text-lg font-semibold">Shipping address</h2><p className="mt-1 text-sm text-fg-muted">Use sample details only; this is not sent anywhere.</p></div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name" value={checkoutAddress.fullName} onChange={(value) => updateAddress("fullName", value)} required />
              <Field label="Email address" type="email" value={contactEmail} onChange={setEmail} required />
              <Field label="Street address" value={address.address} onChange={(value) => updateAddress("address", value)} required className="sm:col-span-2" />
              <Field label="City" value={address.city} onChange={(value) => updateAddress("city", value)} required />
              <Field label="State / region" value={address.region} onChange={(value) => updateAddress("region", value)} required />
              <Field label="Postal code" value={address.postalCode} onChange={(value) => updateAddress("postalCode", value)} required />
              <Field label="Country" value={address.country} onChange={(value) => updateAddress("country", value)} required />
            </div>
          </section>

          <section className="rounded-2xl border border-line bg-surface p-5 sm:p-7">
            <div className="mb-5 flex items-start gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-sm font-bold text-accent-ink">2</span>
              <div><h2 className="text-lg font-semibold">Delivery method</h2><p className="mt-1 text-sm text-fg-muted">Estimated demo delivery choices.</p></div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Choice
                name="delivery"
                value="Standard delivery (demo)"
                checked={delivery === "Standard delivery (demo)"}
                onChange={() => setDelivery("Standard delivery (demo)")}
                title="Standard"
                detail={subtotal >= FREE_SHIPPING_THRESHOLD ? "Free · 3–5 business days" : `${formatPrice(standardShipping)} · 3–5 business days`}
              />
              <Choice
                name="delivery"
                value="Express delivery (demo)"
                checked={delivery === "Express delivery (demo)"}
                onChange={() => setDelivery("Express delivery (demo)")}
                title="Express"
                detail={`${formatPrice(12.99)} · 1–2 business days`}
              />
            </div>
          </section>

          <section className="rounded-2xl border border-line bg-surface p-5 sm:p-7">
            <div className="mb-5 flex items-start gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-sm font-bold text-accent-ink">3</span>
              <div><h2 className="text-lg font-semibold">Payment method</h2><p className="mt-1 text-sm text-fg-muted">No payment details are collected or processed.</p></div>
            </div>
            <div className="grid gap-3">
              {PAYMENT_METHODS.map((method) => (
                <Choice
                  key={method}
                  name="payment"
                  value={method}
                  checked={payment === method}
                  onChange={() => setPayment(method)}
                  title={method.replace(" (demo)", "")}
                  detail="Demo selection only — no credentials or payment"
                />
              ))}
            </div>
          </section>
        </div>

        <aside className="rounded-2xl border border-line bg-surface p-5 shadow-card lg:sticky lg:top-24">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-lg font-semibold">Order review</h2>
            <span className="text-xs text-fg-subtle">{itemCount} {itemCount === 1 ? "item" : "items"}</span>
          </div>
          <ul className="mt-4 max-h-64 space-y-4 overflow-y-auto border-b border-line pb-4">
            {items.map((item) => (
              <li key={item.key} className="flex gap-3">
                <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-surface-sunken">
                  <ProductImage src={item.image} alt="" sizes="56px" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-sm font-medium">{item.name}</p>
                  <p className="mt-1 text-xs text-fg-subtle">Qty {item.quantity}{Object.values(item.options).length ? ` · ${Object.values(item.options).join(" / ")}` : ""}</p>
                </div>
                <p className="shrink-0 text-sm font-semibold">{formatPrice(item.unitPrice * item.quantity, item.currency)}</p>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-3 text-sm">
            <SummaryLine label="Subtotal" value={formatPrice(subtotal)} />
            <SummaryLine label="Shipping estimate" value={shipping === 0 ? "Free" : formatPrice(shipping)} />
            <div className="flex justify-between border-t border-line pt-3 text-base">
              <dt className="font-semibold">Demo total</dt><dd className="font-bold">{formatPrice(total)}</dd>
            </div>
          </dl>
          <div className="mt-4 space-y-2 rounded-xl bg-warn-soft p-3 text-xs leading-5 text-warn-ink">
            <p className="flex gap-2"><LockKeyhole className="mt-0.5 size-4 shrink-0" aria-hidden="true" />This is a front-end demonstration. No payment is processed.</p>
            <p className="flex gap-2"><ShieldCheck className="mt-0.5 size-4 shrink-0" aria-hidden="true" />Prices, stock and shipping estimates are sample data.</p>
          </div>
          {error && <p role="alert" className="mt-4 rounded-lg bg-danger-soft p-3 text-sm text-danger-ink">{error}</p>}
          <button type="submit" className="btn btn-primary mt-5 h-13 w-full text-base">Place demo order</button>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-fg-subtle"><Truck className="size-3.5" aria-hidden="true" /> Your sample order will be saved on this device.</p>
          <button type="button" onClick={() => router.push("/cart")} className="mt-3 w-full text-center text-sm font-medium text-accent-ink hover:underline">Return to cart</button>
        </aside>
      </form>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete="off"
        className="field h-11"
      />
    </label>
  );
}

function Choice({
  name,
  value,
  checked,
  onChange,
  title,
  detail,
}: {
  name: string;
  value: string;
  checked: boolean;
  onChange: () => void;
  title: string;
  detail: string;
}) {
  return (
    <label className={`flex min-h-16 cursor-pointer items-start gap-3 rounded-xl border p-3 transition-colors ${checked ? "border-accent bg-accent-soft/50" : "border-line hover:border-line-strong"}`}>
      <input type="radio" name={name} value={value} checked={checked} onChange={onChange} className="mt-1 size-4 accent-[var(--accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent" />
      <span><span className="block text-sm font-semibold">{title}</span><span className="mt-1 block text-xs leading-5 text-fg-muted">{detail}</span></span>
    </label>
  );
}

function SummaryLine({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between"><dt className="text-fg-muted">{label}</dt><dd className="font-medium">{value}</dd></div>;
}

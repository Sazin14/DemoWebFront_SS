import type { Metadata } from "next";
import Link from "next/link";
import { Construction } from "lucide-react";

export const metadata: Metadata = { title: "Checkout" };

export default function CheckoutPage() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-6 py-24 text-center">
      <span className="flex size-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
        <Construction className="size-7" aria-hidden="true" />
      </span>
      <h1 className="mt-5 text-2xl font-bold tracking-tight">Checkout is coming soon</h1>
      <p className="mt-2 text-zinc-600">
        Payments and order placement will be available once the order service is connected. Your
        cart is saved on this device.
      </p>
      <Link
        href="/cart"
        className="mt-7 inline-flex h-12 items-center rounded-xl border border-zinc-300 bg-white px-6 text-sm font-semibold text-zinc-800 hover:border-indigo-300 hover:text-indigo-600"
      >
        Back to cart
      </Link>
    </div>
  );
}

import Link from "next/link";
import { CreditCard, ShieldCheck, ShoppingBag, Truck } from "lucide-react";

const highlights = [
  {
    icon: Truck,
    title: "Fast, tracked delivery",
    description: "Free shipping over $50 with real-time order tracking.",
  },
  {
    icon: ShieldCheck,
    title: "Buyer protection",
    description: "Every purchase is covered by our secure payment guarantee.",
  },
  {
    icon: CreditCard,
    title: "Flexible payments",
    description: "Cards, wallets, and pay-over-time options at checkout.",
  },
];

/**
 * Shared shell for all /auth/* routes.
 * Desktop: split screen with a brand panel on the left and the form on
 * the right. Mobile: a compact brand header above a single-column form.
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen bg-white text-zinc-900 lg:grid-cols-2">
      {/* Brand panel — desktop only */}
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-zinc-950 p-12 text-white lg:flex xl:p-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:24px_24px]"
        />
        <div className="relative">
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            <span className="flex size-9 items-center justify-center rounded-lg bg-white/10">
              <ShoppingBag className="size-5" aria-hidden="true" />
            </span>
            <span className="text-lg font-semibold tracking-tight">EcomMS</span>
          </Link>
        </div>

        <div className="relative max-w-md">
          <h2 className="text-3xl font-semibold leading-tight tracking-tight xl:text-4xl">
            Everything you love, delivered.
          </h2>
          <p className="mt-4 text-base leading-7 text-zinc-400">
            Shop thousands of products from trusted sellers with secure
            checkout and delivery you can follow door to door.
          </p>

          <ul className="mt-10 space-y-6">
            {highlights.map((highlight) => (
              <li key={highlight.title} className="flex gap-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white/10">
                  <highlight.icon className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-semibold">{highlight.title}</p>
                  <p className="mt-1 text-sm leading-6 text-zinc-400">
                    {highlight.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-zinc-500">
          &copy; {new Date().getFullYear()} EcomMS. All rights reserved.
        </p>
      </aside>

      {/* Form column */}
      <main className="flex flex-col">
        {/* Compact brand header — mobile/tablet only */}
        <div className="border-b border-zinc-100 px-4 py-4 sm:px-8 lg:hidden">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zinc-950"
          >
            <span className="flex size-8 items-center justify-center rounded-lg bg-zinc-950 text-white">
              <ShoppingBag className="size-4" aria-hidden="true" />
            </span>
            <span className="text-base font-semibold tracking-tight">
              EcomMS
            </span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center px-4 py-10 sm:px-8">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </main>
    </div>
  );
}

import Link from "next/link";
import ThemeToggle from "@/components/theme/ThemeToggle";
import {
  CreditCard,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
} from "lucide-react";

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
    <div className="grid min-h-screen bg-surface text-fg lg:grid-cols-2">
      {/* Brand panel — desktop only */}
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-zinc-950 p-12 text-white lg:flex xl:p-16">
        {/* Animated aurora backdrop */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.07)_1px,transparent_1px)] [background-size:24px_24px]" />
          <div className="absolute -left-32 -top-32 size-[28rem] animate-blob rounded-full bg-indigo-600/30 blur-3xl" />
          <div className="absolute -right-32 top-1/3 size-96 animate-blob rounded-full bg-fuchsia-600/25 blur-3xl [animation-delay:4s]" />
          <div className="absolute -bottom-24 left-1/4 size-80 animate-blob rounded-full bg-violet-600/25 blur-3xl [animation-delay:8s]" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-400/60 to-transparent" />
        </div>

        <div className="relative animate-fade-up">
          <Link
            href="/"
            className="group inline-flex items-center gap-2.5 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            <span className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 shadow-lg shadow-indigo-500/40 transition-transform duration-300 group-hover:rotate-3 group-hover:scale-110">
              <ShoppingBag className="size-5" aria-hidden="true" />
            </span>
            <span className="text-lg font-semibold tracking-tight">EcomMS</span>
          </Link>
        </div>

        <div className="relative max-w-md">
          <div className="inline-flex animate-fade-up items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-zinc-300 backdrop-blur [animation-delay:120ms]">
            <Sparkles
              className="size-3.5 animate-pulse-soft text-fuchsia-300"
              aria-hidden="true"
            />
            Demo storefront preview
          </div>

          <h2 className="mt-6 animate-fade-up text-3xl font-semibold leading-tight tracking-tight [animation-delay:220ms] xl:text-4xl">
            Everything you love,{" "}
            <span className="bg-gradient-to-r from-indigo-300 via-violet-300 to-fuchsia-300 bg-clip-text text-transparent">
              delivered.
            </span>
          </h2>
          <p className="mt-4 animate-fade-up text-base leading-7 text-zinc-400 [animation-delay:320ms]">
            Shop thousands of products from trusted sellers with secure
            checkout and delivery you can follow door to door.
          </p>

          <ul className="mt-10 space-y-4">
            {highlights.map((highlight, index) => (
              <li
                key={highlight.title}
                style={{ animationDelay: `${450 + index * 140}ms` }}
                className="group -m-3 flex animate-fade-up gap-4 rounded-2xl p-3 transition-all duration-300 hover:translate-x-1 hover:bg-white/5"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/10 transition-all duration-300 group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-indigo-500 group-hover:to-fuchsia-500 group-hover:shadow-lg group-hover:shadow-indigo-500/40">
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

        <div className="relative flex animate-fade-up items-center justify-between [animation-delay:900ms]">
          <p className="text-xs text-zinc-500">
            &copy; {new Date().getFullYear()} EcomMS. All rights reserved.
          </p>
          <p className="flex items-center gap-1.5 text-xs text-zinc-500">
            <Star
              className="size-3.5 fill-amber-400 text-amber-400"
              aria-hidden="true"
            />
            Demo storefront &middot; sample data
          </p>
        </div>
      </aside>

      {/* Form column */}
      <main className="relative flex flex-col overflow-hidden bg-gradient-to-b from-surface via-accent-soft/50 to-surface">
        {/* Soft drifting blobs */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
          <div className="absolute -top-24 right-0 size-72 animate-float-slow rounded-full bg-indigo-200/40 blur-3xl dark:opacity-20" />
          <div className="absolute -left-16 bottom-0 size-72 animate-float rounded-full bg-fuchsia-200/40 blur-3xl dark:opacity-20" />
        </div>

        {/* Compact brand header — mobile/tablet only */}
        <div className="relative border-b border-line bg-surface/70 py-4 pl-4 pr-16 backdrop-blur sm:px-8 lg:hidden">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          >
            <span className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-500 text-white shadow-md shadow-indigo-500/30 transition-transform duration-300 group-hover:rotate-3 group-hover:scale-110">
              <ShoppingBag className="size-4" aria-hidden="true" />
            </span>
            <span className="text-base font-semibold tracking-tight">
              EcomMS
            </span>
          </Link>
        </div>

        <div className="absolute right-3 top-3 z-10 sm:right-6 lg:top-5">
          <ThemeToggle />
        </div>

        <div className="relative flex flex-1 items-center justify-center px-4 py-10 sm:px-8">
          <div className="w-full max-w-md animate-fade-up [animation-delay:120ms]">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

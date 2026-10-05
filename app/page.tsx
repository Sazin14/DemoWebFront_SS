import Link from "next/link";
import SiteHeader from "@/components/layout/SiteHeader";
import {
  ArrowRight,
  CreditCard,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
} from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Fast, tracked delivery",
    description:
      "Free shipping over $50 with real-time tracking from our door to yours.",
  },
  {
    icon: ShieldCheck,
    title: "Buyer protection",
    description:
      "Every purchase is covered by our secure payment guarantee. Shop worry-free.",
  },
  {
    icon: CreditCard,
    title: "Flexible payments",
    description:
      "Cards, wallets, and pay-over-time options built right into checkout.",
  },
];

export default function Home() {
  return (
    <div className="relative flex flex-1 flex-col overflow-hidden bg-surface text-fg">
      {/* Animated backdrop */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(rgba(99,102,241,0.08)_1px,transparent_1px)] [background-size:28px_28px]" />
        <div className="absolute -left-24 -top-32 size-[26rem] animate-blob rounded-full bg-indigo-300/40 blur-3xl dark:opacity-25" />
        <div className="absolute -right-24 top-1/4 size-96 animate-blob rounded-full bg-fuchsia-300/40 blur-3xl dark:opacity-25 [animation-delay:5s]" />
        <div className="absolute bottom-0 left-1/3 size-80 animate-blob rounded-full bg-violet-300/40 blur-3xl dark:opacity-25 [animation-delay:9s]" />
      </div>

      <SiteHeader />

      {/* Hero */}
      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-6 py-20 text-center">
        <div className="inline-flex animate-fade-up items-center gap-2 rounded-full border border-accent/30 bg-surface/70 px-4 py-1.5 text-xs font-medium text-accent-ink shadow-sm backdrop-blur [animation-delay:100ms]">
          <Sparkles
            className="size-3.5 animate-pulse-soft"
            aria-hidden="true"
          />
          New season drops are live
        </div>

        <h1 className="mt-6 max-w-3xl animate-fade-up text-4xl font-bold leading-tight tracking-tight [animation-delay:200ms] sm:text-5xl lg:text-6xl">
          Everything you love,{" "}
          <span className="animate-gradient-x bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-500 bg-[length:200%_auto] bg-clip-text text-transparent">
            delivered fast.
          </span>
        </h1>

        <p className="mt-5 max-w-xl animate-fade-up text-base leading-7 text-fg-muted [animation-delay:300ms] sm:text-lg">
          Shop thousands of products from trusted sellers with secure checkout
          and delivery you can follow door to door.
        </p>

        <div className="mt-9 flex animate-fade-up flex-col items-center gap-3 [animation-delay:400ms] sm:flex-row">
          <Link
            href="/products"
            className="group relative inline-flex animate-gradient-x items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 bg-[length:200%_auto] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-600/40"
          >
            <span
              aria-hidden="true"
              className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
            />
            <span className="relative flex items-center gap-2">
              Start shopping
              <ArrowRight
                className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </span>
          </Link>
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2 rounded-xl border border-line-strong bg-surface/80 px-6 py-3 text-sm font-semibold text-fg shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/50 hover:text-accent-ink hover:shadow-md"
          >
            Log in
          </Link>
        </div>

        {/* Social proof */}
        <div className="mt-10 flex animate-fade-up items-center gap-2 text-sm text-fg-subtle [animation-delay:500ms]">
          <span className="flex" aria-hidden="true">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star
                key={index}
                className="size-4 fill-amber-400 text-amber-400"
              />
            ))}
          </span>
          <span>
            Sample rating shown for demo purposes only
          </span>
        </div>

        {/* Feature cards */}
        <div className="mt-16 grid w-full gap-4 sm:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              style={{ animationDelay: `${600 + index * 140}ms` }}
              className="group animate-fade-up rounded-2xl border border-line bg-surface/70 p-6 text-left shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-1.5 hover:border-accent/30 hover:shadow-xl hover:shadow-accent/10"
            >
              <span className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 text-white shadow-md shadow-indigo-500/30 transition-transform duration-300 group-hover:rotate-3 group-hover:scale-110">
                <feature.icon className="size-5" aria-hidden="true" />
              </span>
              <h2 className="mt-4 text-base font-semibold tracking-tight">
                {feature.title}
              </h2>
              <p className="mt-1.5 text-sm leading-6 text-fg-muted">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </main>

      <footer className="relative z-10 mx-auto w-full max-w-6xl animate-fade-up px-6 py-6 text-center text-xs text-fg-subtle [animation-delay:900ms]">
        &copy; {new Date().getFullYear()} EcomMS. All rights reserved.
      </footer>
    </div>
  );
}

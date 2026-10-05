"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useSyncExternalStore, type FormEvent } from "react";
import { Menu, Search, ShoppingBag, ShoppingCart, X } from "lucide-react";
import AuthActions from "@/components/auth/AuthActions";
import CartDrawer from "@/components/cart/CartDrawer";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { useCart } from "@/context/CartContext";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
];

type Panel = "menu" | "search";

function subscribeToScroll(callback: () => void) {
  window.addEventListener("scroll", callback, { passive: true });
  return () => window.removeEventListener("scroll", callback);
}
const getScrolled = () => window.scrollY > 8;
const getServerScrolled = () => false;

export default function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { itemCount, isReady, addedPulse, openDrawer } = useCart();
  const scrolled = useSyncExternalStore(subscribeToScroll, getScrolled, getServerScrolled);
  const [open, setOpen] = useState<{ panel: Panel; path: string } | null>(null);
  const [query, setQuery] = useState("");

  // A panel only counts as open on the route it was opened on, so it closes on navigation.
  const panel = open && open.path === pathname ? open.panel : null;
  const toggle = (next: Panel) => setOpen(panel === next ? null : { panel: next, path: pathname });

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = query.trim();
    setOpen(null);
    router.push(trimmed ? `/products?q=${encodeURIComponent(trimmed)}` : "/products");
  }

  const searchForm = (idSuffix: string, autoFocus = false) => (
    <form onSubmit={handleSearch} role="search" className="relative w-full">
      <label htmlFor={`site-search-${idSuffix}`} className="sr-only">
        Search products
      </label>
      <Search
        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-fg-subtle"
        aria-hidden="true"
      />
      <input
        id={`site-search-${idSuffix}`}
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search products…"
        autoComplete="off"
        autoFocus={autoFocus}
        className="h-10 w-full rounded-xl border border-line bg-surface-muted pl-9 pr-3 text-base text-fg outline-none transition placeholder:text-fg-subtle focus:border-accent focus:bg-surface focus:ring-2 focus:ring-accent/30 sm:text-sm"
      />
    </form>
  );

  const count = isReady ? itemCount : 0;

  return (
    <header
      className={`sticky top-0 z-40 border-b bg-surface/85 backdrop-blur-md transition-shadow duration-300 ${
        scrolled ? "border-line shadow-card" : "border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-2 px-4 sm:gap-3 sm:px-6">
        <Link href="/" className="group inline-flex shrink-0 items-center gap-2.5 rounded-lg">
          <span className="flex size-9 items-center justify-center rounded-xl bg-accent text-on-accent shadow-sm transition-transform duration-300 group-hover:scale-105">
            <ShoppingBag className="size-[18px]" aria-hidden="true" />
          </span>
          <span className="text-lg font-semibold tracking-tight">EcomMS</span>
        </Link>

        <nav aria-label="Main" className="ml-4 hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => {
            const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`relative rounded-lg px-3 py-2 text-sm font-medium transition-colors after:absolute after:inset-x-3 after:-bottom-px after:h-0.5 after:origin-left after:rounded-full after:bg-accent after:transition-transform after:duration-300 ${
                  active
                    ? "text-fg after:scale-x-100"
                    : "text-fg-muted after:scale-x-0 hover:text-fg"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="mx-2 hidden max-w-md flex-1 md:block">{searchForm("desktop")}</div>
        <div className="flex-1 md:hidden" />

        <button
          type="button"
          onClick={() => toggle("search")}
          aria-expanded={panel === "search"}
          aria-controls="mobile-search"
          aria-label={panel === "search" ? "Close search" : "Search products"}
          className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl text-fg-muted transition hover:bg-surface-muted hover:text-fg active:scale-95 md:hidden"
        >
          {panel === "search" ? <X className="size-5" /> : <Search className="size-5" />}
        </button>

        <ThemeToggle />

        <button
          type="button"
          onClick={openDrawer}
          aria-haspopup="dialog"
          aria-label={count > 0 ? `Open cart, ${count} items` : "Open cart"}
          className="relative inline-flex size-10 shrink-0 items-center justify-center rounded-xl text-fg-muted transition hover:bg-surface-muted hover:text-fg active:scale-95"
        >
          <ShoppingCart className="size-5" aria-hidden="true" />
          {count > 0 && (
            <span
              key={addedPulse}
              aria-hidden="true"
              className={`absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[11px] font-bold leading-none text-on-accent ring-2 ring-surface ${
                addedPulse > 0 ? "animate-pop" : ""
              }`}
            >
              {count > 99 ? "99+" : count}
            </span>
          )}
        </button>

        <div className="hidden md:block">
          <AuthActions />
        </div>

        <button
          type="button"
          onClick={() => toggle("menu")}
          aria-expanded={panel === "menu"}
          aria-controls="mobile-menu"
          aria-label={panel === "menu" ? "Close menu" : "Open menu"}
          className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl text-fg-muted transition hover:bg-surface-muted hover:text-fg active:scale-95 md:hidden"
        >
          {panel === "menu" ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Mobile panels slide down using a grid-rows transition (no layout-thrashing height animation). */}
      <div
        id="mobile-search"
        className={`grid transition-[grid-template-rows] duration-300 ease-out md:hidden ${
          panel === "search" ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
        inert={panel !== "search"}
      >
        <div className="overflow-hidden">
          <div className="border-t border-line px-4 py-3">{searchForm("mobile")}</div>
        </div>
      </div>

      <div
        id="mobile-menu"
        className={`grid transition-[grid-template-rows] duration-300 ease-out md:hidden ${
          panel === "menu" ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
        inert={panel !== "menu"}
      >
        <div className="overflow-hidden">
          <div className="space-y-3 border-t border-line px-4 py-4">
            <nav aria-label="Mobile" className="flex flex-col">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-lg px-3 py-3 text-base font-medium text-fg hover:bg-surface-muted"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="border-t border-line pt-4">
              <AuthActions stacked />
            </div>
          </div>
        </div>
      </div>

      <CartDrawer />
    </header>
  );
}

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Menu, Search, ShoppingBag, ShoppingCart, X } from "lucide-react";
import AuthActions from "@/components/auth/AuthActions";
import { useCart } from "@/context/CartContext";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { itemCount, isReady } = useCart();
  const [menuOpenFor, setMenuOpenFor] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  // Menu closes automatically when the route changes.
  const menuOpen = menuOpenFor === pathname;

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = query.trim();
    setMenuOpenFor(null);
    router.push(trimmed ? `/products?q=${encodeURIComponent(trimmed)}` : "/products");
  }

  const searchForm = (idSuffix: string) => (
    <form onSubmit={handleSearch} role="search" className="relative w-full">
      <label htmlFor={`site-search-${idSuffix}`} className="sr-only">
        Search products
      </label>
      <Search
        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400"
        aria-hidden="true"
      />
      <input
        id={`site-search-${idSuffix}`}
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search products…"
        autoComplete="off"
        className="h-10 w-full rounded-xl border border-zinc-300 bg-white pl-9 pr-3 text-base text-zinc-900 placeholder:text-zinc-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 sm:text-sm"
      />
    </form>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/70 bg-white/85 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-3 px-4 sm:px-6">
        <Link href="/" className="group inline-flex shrink-0 items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-500 text-white shadow-lg shadow-indigo-600/30 transition-transform duration-300 group-hover:rotate-3 group-hover:scale-110">
            <ShoppingBag className="size-4.5" aria-hidden="true" />
          </span>
          <span className="text-lg font-semibold tracking-tight">EcomMS</span>
        </Link>

        <nav aria-label="Main" className="ml-4 hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => {
            const active =
              link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active ? "text-indigo-600" : "text-zinc-700 hover:text-indigo-600"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="mx-2 hidden max-w-md flex-1 md:block">{searchForm("desktop")}</div>
        <div className="flex-1 md:hidden" />

        <Link
          href="/cart"
          aria-label={
            isReady && itemCount > 0 ? `Cart, ${itemCount} items` : "Cart"
          }
          className="relative inline-flex size-10 shrink-0 items-center justify-center rounded-xl text-zinc-700 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
        >
          <ShoppingCart className="size-5" aria-hidden="true" />
          {isReady && itemCount > 0 && (
            <span
              aria-hidden="true"
              className="absolute -right-0.5 -top-0.5 flex min-w-5 items-center justify-center rounded-full bg-fuchsia-600 px-1 text-[11px] font-bold leading-5 text-white"
            >
              {itemCount > 99 ? "99+" : itemCount}
            </span>
          )}
        </Link>

        <div className="hidden md:block">
          <AuthActions />
        </div>

        <button
          type="button"
          onClick={() => setMenuOpenFor(menuOpen ? null : pathname)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl text-zinc-700 hover:bg-zinc-100 md:hidden"
        >
          {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {menuOpen && (
        <div
          id="mobile-menu"
          className="animate-fade-in space-y-4 border-t border-zinc-200 bg-white px-4 py-4 md:hidden"
        >
          {searchForm("mobile")}
          <nav aria-label="Mobile" className="flex flex-col">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-3 text-base font-medium text-zinc-800 hover:bg-zinc-50"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/cart"
              className="rounded-lg px-3 py-3 text-base font-medium text-zinc-800 hover:bg-zinc-50"
            >
              Cart{isReady && itemCount > 0 ? ` (${itemCount})` : ""}
            </Link>
          </nav>
          <div className="border-t border-zinc-100 pt-4">
            <AuthActions stacked />
          </div>
        </div>
      )}
    </header>
  );
}

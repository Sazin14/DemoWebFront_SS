"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ArrowRight, Search } from "lucide-react";

export default function HomeSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = query.trim();
    router.push(value ? `/products?q=${encodeURIComponent(value)}` : "/products");
  }

  return (
    <form onSubmit={search} role="search" className="flex items-center gap-2 rounded-2xl border border-line bg-surface p-2 shadow-card sm:gap-3">
      <Search className="ml-2 size-5 shrink-0 text-fg-subtle" aria-hidden="true" />
      <label htmlFor="home-product-search" className="sr-only">Search demo products</label>
      <input
        id="home-product-search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        type="search"
        placeholder="Search products, brands or useful details…"
        className="h-11 min-w-0 flex-1 bg-transparent text-base text-fg outline-none placeholder:text-fg-subtle sm:text-sm"
      />
      <button type="submit" className="btn btn-primary h-11 shrink-0 px-4 sm:px-6">Search <ArrowRight className="ml-1 hidden size-4 sm:block" aria-hidden="true" /></button>
    </form>
  );
}

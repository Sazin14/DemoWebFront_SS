import Link from "next/link";
import { PackageSearch } from "lucide-react";

export default function ProductNotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-6 py-24 text-center">
      <span className="flex size-16 items-center justify-center rounded-2xl bg-accent-soft text-accent-ink">
        <PackageSearch className="size-7" aria-hidden="true" />
      </span>
      <h1 className="mt-5 text-2xl font-bold tracking-tight">Product not found</h1>
      <p className="mt-2 text-fg-muted">
        This product doesn’t exist or is no longer available.
      </p>
      <Link
        href="/products"
        className="mt-7 inline-flex h-12 items-center rounded-xl bg-accent hover:bg-accent-strong px-6 text-sm font-semibold text-white shadow-sm"
      >
        Back to products
      </Link>
    </div>
  );
}

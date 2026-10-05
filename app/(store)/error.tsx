"use client";

import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default function StoreError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto flex w-full max-w-md flex-1 animate-reveal flex-col items-center justify-center px-4 py-20 text-center">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-danger-soft text-danger-ink">
        <AlertTriangle className="size-6" aria-hidden="true" />
      </span>
      <h1 className="mt-4 text-xl font-semibold">Something went wrong</h1>
      <p className="mt-1 text-sm text-fg-muted">
        We couldn’t load this page. Please try again.
      </p>
      <div className="mt-6 flex gap-3">
        <button type="button" onClick={reset} className="btn btn-primary h-11 px-5">
          Try again
        </button>
        <Link href="/products" className="btn btn-secondary h-11 px-5">
          Browse products
        </Link>
      </div>
    </div>
  );
}

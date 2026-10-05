import type { Metadata } from "next";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import AuthActions from "@/components/auth/AuthActions";
import AuthGuard from "@/components/auth/AuthGuard";

export const metadata: Metadata = {
  title: "My account",
  description: "Temporary customer account page.",
};

export default function AccountPage() {
  return (
    <AuthGuard>
      <main className="min-h-screen bg-surface-muted px-6 py-8 text-fg">
        <div className="mx-auto max-w-5xl">
          <header className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-5">
            <Link href="/" className="text-lg font-semibold tracking-tight">
              EcomMS <span className="text-fg-subtle">/ My account</span>
            </Link>
            <AuthActions />
          </header>
          <section className="mt-12 rounded-3xl border border-line bg-surface p-8 shadow-sm sm:p-10">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white">
              <ShoppingBag className="size-6" aria-hidden="true" />
            </span>
            <h1 className="mt-6 text-3xl font-semibold tracking-tight">
              Your account
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-fg-muted">
              You&apos;re signed in. Order history and account management will
              be available when the ecommerce services are connected.
            </p>
            <p className="mt-6 inline-flex rounded-lg bg-warn-soft px-3 py-2 text-xs font-medium text-warn-ink ring-1 ring-warn/30">
              Temporary frontend-only account
            </p>
          </section>
        </div>
      </main>
    </AuthGuard>
  );
}

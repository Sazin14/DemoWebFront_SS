import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import AuthGuard from "@/components/auth/AuthGuard";
import AuthActions from "@/components/auth/AuthActions";

export const metadata: Metadata = {
  title: "Admin dashboard",
  description: "Temporary protected admin dashboard preview.",
};

export default function AdminPage() {
  return (
    <AuthGuard requiredRole="admin">
      <main className="min-h-screen bg-zinc-50 px-6 py-8 text-zinc-900">
        <div className="mx-auto max-w-5xl">
          <header className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-200 pb-5">
            <Link href="/" className="text-lg font-semibold tracking-tight">
              EcomMS <span className="text-zinc-400">/ Admin</span>
            </Link>
            <AuthActions />
          </header>
          <section className="mt-12 rounded-3xl border border-indigo-100 bg-white p-8 shadow-sm sm:p-10">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <ShieldCheck className="size-6" aria-hidden="true" />
            </span>
            <h1 className="mt-6 text-3xl font-semibold tracking-tight">
              Admin dashboard
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600">
              This protected placeholder confirms the temporary admin role.
              Connect the backend authentication service before using role
              checks to protect real data or operations.
            </p>
            <p className="mt-6 inline-flex rounded-lg bg-amber-50 px-3 py-2 text-xs font-medium text-amber-900 ring-1 ring-amber-200">
              Frontend-only preview — not a security boundary
            </p>
          </section>
        </div>
      </main>
    </AuthGuard>
  );
}

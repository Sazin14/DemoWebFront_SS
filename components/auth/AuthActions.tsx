"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function AuthActions() {
  const { currentUser, isReady, logout } = useAuth();
  const router = useRouter();

  if (!isReady) {
    return <div className="h-9 w-36 animate-pulse rounded-lg bg-zinc-200/70" aria-hidden="true" />;
  }

  if (!currentUser) {
    return (
      <nav aria-label="Account" className="flex items-center gap-2 sm:gap-3">
        <Link
          href="/auth/login"
          className="rounded-lg px-3.5 py-2 text-sm font-medium text-zinc-700 transition-colors duration-300 hover:text-indigo-600"
        >
          Sign in
        </Link>
        <Link
          href="/auth/register"
          className="rounded-lg bg-zinc-950 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-600/30"
        >
          Get started
        </Link>
      </nav>
    );
  }

  const destination = currentUser.role === "admin" ? "/admin" : "/account";
  const destinationLabel = currentUser.role === "admin" ? "Dashboard" : "My account";

  function handleLogout() {
    logout();
    router.replace("/auth/login");
  }

  return (
    <nav aria-label="Account" className="flex items-center gap-2 sm:gap-4">
      <span className="hidden text-sm text-zinc-600 sm:inline">
        Hi, <span className="font-semibold text-zinc-900">{currentUser.name}</span>
      </span>
      <Link
        href={destination}
        className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:text-indigo-600"
      >
        {destinationLabel}
      </Link>
      <button
        type="button"
        onClick={handleLogout}
        className="rounded-lg border border-zinc-300 bg-white/80 px-3.5 py-2 text-sm font-semibold text-zinc-800 shadow-sm transition-colors hover:border-indigo-300 hover:text-indigo-600"
      >
        Log out
      </button>
    </nav>
  );
}

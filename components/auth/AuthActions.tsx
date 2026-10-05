"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function AuthActions({ stacked = false }: { stacked?: boolean }) {
  const { currentUser, isReady, logout } = useAuth();
  const router = useRouter();

  const layout = stacked ? "flex flex-col gap-2" : "flex items-center gap-1 sm:gap-2";
  const size = stacked ? "w-full" : "min-h-9 px-3.5";

  if (!isReady) {
    return <div className="h-9 w-40 animate-pulse rounded-lg bg-surface-sunken" aria-hidden="true" />;
  }

  if (!currentUser) {
    return (
      <nav aria-label="Account" className={layout}>
        <Link href="/auth/login" className={`btn btn-ghost ${size}`}>
          Log in
        </Link>
        <Link href="/auth/register" className={`btn btn-primary ${size}`}>
          Create account
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
    <nav aria-label="Account" className={layout}>
      <span className={stacked ? "px-1 text-sm text-fg-muted" : "hidden text-sm text-fg-muted xl:inline"}>
        Hi, <span className="font-semibold text-fg">{currentUser.name}</span>
      </span>
      <Link href={destination} className={`btn btn-ghost ${size}`}>
        {destinationLabel}
      </Link>
      <button type="button" onClick={handleLogout} className={`btn btn-secondary ${size}`}>
        Log out
      </button>
    </nav>
  );
}

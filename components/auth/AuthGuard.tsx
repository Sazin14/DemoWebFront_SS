"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import type { UserRole } from "@/lib/auth/types";

export default function AuthGuard({
  children,
  requiredRole,
}: {
  children: React.ReactNode;
  requiredRole?: UserRole;
}) {
  const { currentUser, initializationError, isReady } = useAuth();
  const router = useRouter();

  // This client-side check is only a prototype UX guard; backend authorization must protect real resources.
  useEffect(() => {
    if (!isReady || initializationError) return;
    if (!currentUser) {
      router.replace("/auth/login");
    } else if (requiredRole && currentUser.role !== requiredRole) {
      router.replace("/account");
    }
  }, [currentUser, initializationError, isReady, requiredRole, router]);

  if (initializationError) {
    return (
      <AuthStatus
        icon={<AlertCircle className="size-5" aria-hidden="true" />}
        message={initializationError}
      />
    );
  }

  if (!isReady || !currentUser || (requiredRole && currentUser.role !== requiredRole)) {
    return (
      <AuthStatus
        icon={<Loader2 className="size-5 animate-spin" aria-hidden="true" />}
        message="Checking your session…"
      />
    );
  }

  return children;
}

function AuthStatus({
  icon,
  message,
}: {
  icon: React.ReactNode;
  message: string;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-surface-muted px-6">
      <div className="flex max-w-lg items-center gap-3 rounded-2xl border border-line bg-surface p-6 text-sm text-fg-muted shadow-sm">
        <span className="shrink-0 text-accent-ink">{icon}</span>
        <p>{message}</p>
      </div>
    </main>
  );
}

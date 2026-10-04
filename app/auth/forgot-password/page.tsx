import type { Metadata } from "next";
import Link from "next/link";
import { KeyRound } from "lucide-react";

export const metadata: Metadata = {
  title: "Forgot password",
  description:
    "Reset the password for your EcomMS account via a secure email link.",
};

export default function ForgotPasswordPage() {
  return (
    <div>
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">
          Reset your password
        </h1>
        <p className="mt-2 text-sm leading-6 text-zinc-600">
          Enter the email linked to your account and we&apos;ll send you a
          secure reset link.
        </p>
      </header>

      <div className="flex items-start gap-3 rounded-lg border border-dashed border-zinc-300 bg-zinc-50 px-4 py-3.5">
        <KeyRound
          className="mt-0.5 size-4 shrink-0 text-zinc-500"
          aria-hidden="true"
        />
        <p className="text-sm leading-6 text-zinc-600">
          Password reset is coming soon. This feature will be enabled once the
          authentication service is connected.
        </p>
      </div>

      <p className="mt-8 text-center text-sm text-zinc-600">
        Remembered your password?{" "}
        <Link
          href="/auth/login"
          className="font-semibold text-zinc-950 underline-offset-4 hover:underline"
        >
          Back to sign in
        </Link>
      </p>
    </div>
  );
}

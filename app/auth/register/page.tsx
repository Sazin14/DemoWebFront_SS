import type { Metadata } from "next";
import Link from "next/link";
import { UserPlus } from "lucide-react";

export const metadata: Metadata = {
  title: "Create account",
  description:
    "Create your EcomMS account to start shopping with secure checkout and order tracking.",
};

export default function RegisterPage() {
  return (
    <div>
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">
          Create your account
        </h1>
        <p className="mt-2 text-sm leading-6 text-zinc-600">
          Join EcomMS to check out faster, save your wishlist, and follow your
          orders door to door.
        </p>
      </header>

      <div className="flex items-start gap-3 rounded-lg border border-dashed border-zinc-300 bg-zinc-50 px-4 py-3.5">
        <UserPlus
          className="mt-0.5 size-4 shrink-0 text-zinc-500"
          aria-hidden="true"
        />
        <p className="text-sm leading-6 text-zinc-600">
          Registration is on the way. The sign-up form will be available once
          the authentication service is connected.
        </p>
      </div>

      <p className="mt-8 text-center text-sm text-zinc-600">
        Already have an account?{" "}
        <Link
          href="/auth/login"
          className="font-semibold text-zinc-950 underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}

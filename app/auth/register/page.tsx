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
      <header className="mb-8 animate-fade-up">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">
          Create your{" "}
          <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-500 bg-clip-text text-transparent">
            account
          </span>
        </h1>
        <p className="mt-2 text-sm leading-6 text-zinc-600">
          Join EcomMS to check out faster, save your wishlist, and follow your
          orders door to door.
        </p>
      </header>

      <div className="group flex animate-fade-up items-start gap-3.5 rounded-xl border border-indigo-200/70 bg-gradient-to-br from-indigo-50/80 via-white to-fuchsia-50/60 px-4 py-4 shadow-sm transition-all duration-300 [animation-delay:150ms] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-100">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white shadow-md shadow-indigo-500/30 transition-transform duration-300 group-hover:rotate-3 group-hover:scale-110">
          <UserPlus className="size-4" aria-hidden="true" />
        </span>
        <p className="text-sm leading-6 text-zinc-600">
          Registration is on the way. The sign-up form will be available once
          the authentication service is connected.
        </p>
      </div>

      <p className="mt-8 animate-fade-up text-center text-sm text-zinc-600 [animation-delay:250ms]">
        Already have an account?{" "}
        <Link
          href="/auth/login"
          className="relative font-semibold text-indigo-600 transition-colors duration-300 after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-0 after:bg-indigo-500 after:transition-all after:duration-300 hover:text-indigo-500 hover:after:w-full"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}

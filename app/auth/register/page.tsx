import type { Metadata } from "next";
import Link from "next/link";
import RegisterForm from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Create account",
  description:
    "Create a temporary frontend demo account to explore the sample customer dashboard.",
};

export default function RegisterPage() {
  return (
    <div>
      <header className="mb-6 animate-fade-up sm:mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-fg">
          Create your{" "}
          <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-500 bg-clip-text text-transparent">
            account
          </span>
        </h1>
        <p className="mt-2 text-sm leading-6 text-fg-muted">
          Create a temporary browser-only account to explore the customer dashboard and sample orders.
        </p>
      </header>

      <div className="animate-fade-up [animation-delay:150ms]">
        <RegisterForm />
      </div>
      <div className="mt-5 rounded-xl border border-amber-200 bg-warn-soft px-4 py-3 text-xs leading-5 text-warn-ink">
        Preview only: accounts and passwords are stored insecurely in this
        browser. Do not use a real password.
      </div>

      <p className="mt-8 animate-fade-up text-center text-sm text-fg-muted [animation-delay:250ms]">
        Already have an account?{" "}
        <Link
          href="/auth/login"
          className="relative font-semibold text-accent-ink transition-colors duration-300 after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-0 after:bg-accent after:transition-all after:duration-300 hover:text-accent-ink hover:after:w-full"
        >
          Log in
        </Link>
      </p>
    </div>
  );
}

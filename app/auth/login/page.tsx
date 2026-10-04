import type { Metadata } from "next";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Sign in",
  description:
    "Sign in to your EcomMS account to track orders, manage your wishlist, and check out faster.",
};

export default function LoginPage() {
  return (
    <>
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">
          Welcome back
        </h1>
        <p className="mt-2 text-sm leading-6 text-zinc-600">
          Sign in to your account to continue shopping, track orders, and
          manage your wishlist.
        </p>
      </header>
      <LoginForm />
    </>
  );
}

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
      <header className="mb-8 animate-fade-up">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">
          Welcome{" "}
          <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-500 bg-clip-text text-transparent">
            back
          </span>
        </h1>
        <p className="mt-2 text-sm leading-6 text-zinc-600">
          Sign in to your account to continue shopping, track orders, and
          manage your wishlist.
        </p>
      </header>
      <div className="animate-fade-up [animation-delay:150ms]">
        <LoginForm />
      </div>
    </>
  );
}

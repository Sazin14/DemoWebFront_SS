import type { Metadata } from "next";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Sign in",
  description:
    "Sign in to the EcomMS frontend demo to view your sample customer account and order history.",
};

export default function LoginPage() {
  return (
    <>
      <header className="mb-8 animate-fade-up">
        <h1 className="text-2xl font-semibold tracking-tight text-fg">
          Welcome{" "}
          <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-500 bg-clip-text text-transparent">
            back
          </span>
        </h1>
        <p className="mt-2 text-sm leading-6 text-fg-muted">
          Sign in to this frontend demo to explore your customer dashboard and sample order history.
        </p>
      </header>
      <div className="animate-fade-up [animation-delay:150ms]">
        <LoginForm />
      </div>
    </>
  );
}

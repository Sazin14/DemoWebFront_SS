"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, Info, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import PasswordInput from "./PasswordInput";
import SocialButtons from "./SocialButtons";

interface FieldErrors {
  email?: string;
  password?: string;
}

interface FormMessage {
  variant: "error" | "info";
  text: string;
}

function validateFields(email: string, password: string): FieldErrors {
  const errors: FieldErrors = {};

  if (!email.trim()) {
    errors.email = "Email address is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (!password) {
    errors.password = "Password is required.";
  }

  return errors;
}

export default function LoginForm() {
  const { initializationError, isReady, login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formMessage, setFormMessage] = useState<FormMessage | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting || !isReady || initializationError) return;

    const errors = validateFields(email, password);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsSubmitting(true);
    setFormMessage(null);

    try {
      const user = await login(email, password);
      router.replace(user.role === "admin" ? "/admin" : "/account");
    } catch (error) {
      setFormMessage({
        variant: "error",
        text:
          error instanceof Error
            ? error.message
            : "Something went wrong while signing you in. Please try again.",
      });
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate aria-busy={isSubmitting}>
      {(formMessage || initializationError) && (
        <div
          role="alert"
          className={`mb-6 flex animate-fade-up items-start gap-2.5 rounded-xl border px-3.5 py-3 text-sm shadow-sm ${
            formMessage?.variant === "error" || initializationError
              ? "border-danger/30 bg-danger-soft text-danger-ink"
              : "border-accent/30 bg-accent-soft/80 text-accent-ink"
          }`}
        >
          {formMessage?.variant === "error" || initializationError ? (
            <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          ) : (
            <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          )}
          <p className="leading-5">
            {initializationError ?? formMessage?.text}
          </p>
        </div>
      )}

      <div className="space-y-5">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-fg"
          >
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            disabled={!isReady || Boolean(initializationError) || isSubmitting}
            onChange={(event) => {
              setEmail(event.target.value);
              if (fieldErrors.email) {
                setFieldErrors((current) => ({ ...current, email: undefined }));
              }
            }}
            aria-invalid={fieldErrors.email ? true : undefined}
            aria-describedby={fieldErrors.email ? "email-error" : undefined}
            className={`mt-1.5 block w-full rounded-xl border bg-surface/80 px-3.5 py-2.5 text-sm text-fg shadow-sm transition-all duration-300 placeholder:text-fg-subtle hover:border-line-strong focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:opacity-60 ${
              fieldErrors.email
                ? "border-danger focus:border-danger focus:ring-danger/15"
                : "border-line-strong focus:border-accent focus:ring-accent/15"
            }`}
          />
          {fieldErrors.email && (
            <p id="email-error" role="alert" className="mt-1.5 animate-shake text-sm text-danger-ink">
              {fieldErrors.email}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-fg"
          >
            Password
          </label>
          <div className="mt-1.5">
            <PasswordInput
              id="password"
              name="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              disabled={!isReady || Boolean(initializationError) || isSubmitting}
              hasError={Boolean(fieldErrors.password)}
              onChange={(event) => {
                setPassword(event.target.value);
                if (fieldErrors.password) {
                  setFieldErrors((current) => ({
                    ...current,
                    password: undefined,
                  }));
                }
              }}
              aria-invalid={fieldErrors.password ? true : undefined}
              aria-describedby={
                fieldErrors.password ? "password-error" : undefined
              }
              className="disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>
          {fieldErrors.password && (
            <p
              id="password-error"
              role="alert"
              className="mt-1.5 animate-shake text-sm text-danger-ink"
            >
              {fieldErrors.password}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between gap-4">
          <span className="text-xs text-fg-subtle">Session saved on this browser</span>
          <Link
            href="/auth/forgot-password"
            className="relative text-sm font-medium text-fg transition-colors duration-300 after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-0 after:bg-accent after:transition-all after:duration-300 hover:text-accent-ink hover:after:w-full"
          >
            Forgot password?
          </Link>
        </div>

        <p className="mt-5 text-center text-xs leading-5 text-fg-subtle">
          Temporary browser-only sign-in. Do not use a real password; this is
          not production authentication.
        </p>

        <button
          type="submit"
          disabled={!isReady || Boolean(initializationError) || isSubmitting}
          className="group relative flex w-full animate-gradient-x items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 bg-[length:200%_auto] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-600/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:-translate-y-0"
        >
          <span
            aria-hidden="true"
            className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
          />
          <span className="relative flex items-center gap-2">
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                Logging in…
              </>
            ) : (
              "Sign in"
            )}
          </span>
        </button>
      </div>

      <div className="my-6 flex items-center gap-3" aria-hidden="true">
        <span className="h-px flex-1 bg-gradient-to-r from-transparent via-zinc-300 to-transparent" />
        <span className="text-xs font-medium uppercase tracking-wide text-fg-subtle">
          or continue with
        </span>
        <span className="h-px flex-1 bg-gradient-to-r from-transparent via-zinc-300 to-transparent" />
      </div>

      <SocialButtons />

      <p className="mt-8 text-center text-sm text-fg-muted">
        New to EcomMS?{" "}
        <Link
          href="/auth/register"
          className="relative font-semibold text-accent-ink transition-colors duration-300 after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-0 after:bg-accent after:transition-all after:duration-300 hover:text-accent-ink hover:after:w-full"
        >
          Create an account
        </Link>
      </p>
    </form>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertCircle, Info, Loader2 } from "lucide-react";
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

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateFields(email: string, password: string): FieldErrors {
  const errors: FieldErrors = {};

  if (!email.trim()) {
    errors.email = "Email address is required.";
  } else if (!EMAIL_PATTERN.test(email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (!password) {
    errors.password = "Password is required.";
  }

  return errors;
}

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formMessage, setFormMessage] = useState<FormMessage | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    const errors = validateFields(email, password);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsSubmitting(true);
    setFormMessage(null);

    try {
      // TODO(task: auth-api-integration): POST { email, password, rememberMe }
      // to the Auth service login endpoint, then persist the returned JWT.
      await new Promise((resolve) => setTimeout(resolve, 1200));

      setFormMessage({
        variant: "info",
        text: "Sign-in is not connected to the authentication service yet. This is a UI preview.",
      });
    } catch {
      setFormMessage({
        variant: "error",
        text: "Something went wrong while signing you in. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate aria-busy={isSubmitting}>
      {formMessage && (
        <div
          role={formMessage.variant === "error" ? "alert" : "status"}
          className={`mb-6 flex items-start gap-2.5 rounded-lg border px-3.5 py-3 text-sm ${
            formMessage.variant === "error"
              ? "border-red-200 bg-red-50 text-red-800"
              : "border-zinc-200 bg-zinc-50 text-zinc-700"
          }`}
        >
          {formMessage.variant === "error" ? (
            <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          ) : (
            <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          )}
          <p className="leading-5">{formMessage.text}</p>
        </div>
      )}

      <div className="space-y-5">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-zinc-900"
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
            disabled={isSubmitting}
            onChange={(event) => {
              setEmail(event.target.value);
              if (fieldErrors.email) {
                setFieldErrors((current) => ({ ...current, email: undefined }));
              }
            }}
            aria-invalid={fieldErrors.email ? true : undefined}
            aria-describedby={fieldErrors.email ? "email-error" : undefined}
            className={`mt-1.5 block w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-zinc-900 transition-shadow placeholder:text-zinc-400 focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 ${
              fieldErrors.email
                ? "border-red-500 focus:border-red-500 focus:ring-red-500/15"
                : "border-zinc-300 focus:border-zinc-950 focus:ring-zinc-950/10"
            }`}
          />
          {fieldErrors.email && (
            <p id="email-error" role="alert" className="mt-1.5 text-sm text-red-600">
              {fieldErrors.email}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-zinc-900"
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
              disabled={isSubmitting}
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
              className="mt-1.5 text-sm text-red-600"
            >
              {fieldErrors.password}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between gap-4">
          <label className="flex select-none items-center gap-2 text-sm text-zinc-600">
            <input
              type="checkbox"
              checked={rememberMe}
              disabled={isSubmitting}
              onChange={(event) => setRememberMe(event.target.checked)}
              className="size-4 rounded border-zinc-300 accent-zinc-950"
            />
            Remember me
          </label>
          <Link
            href="/auth/forgot-password"
            className="text-sm font-medium text-zinc-900 underline-offset-4 hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-950 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Signing in…
            </>
          ) : (
            "Sign in"
          )}
        </button>
      </div>

      <div className="my-6 flex items-center gap-3" aria-hidden="true">
        <span className="h-px flex-1 bg-zinc-200" />
        <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">
          or continue with
        </span>
        <span className="h-px flex-1 bg-zinc-200" />
      </div>

      <SocialButtons />

      <p className="mt-8 text-center text-sm text-zinc-600">
        New to EcomMS?{" "}
        <Link
          href="/auth/register"
          className="font-semibold text-zinc-950 underline-offset-4 hover:underline"
        >
          Create an account
        </Link>
      </p>
    </form>
  );
}

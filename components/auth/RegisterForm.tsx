"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, Check, CheckCircle2, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { AuthError } from "@/lib/auth/types";
import {
  MIN_PASSWORD_LENGTH,
  getPasswordStrength,
  validateConfirmPassword,
  validateEmail,
  validateName,
  validatePassword,
} from "@/lib/auth/validation";
import PasswordInput from "./PasswordInput";

type FieldName = "name" | "email" | "password" | "confirmPassword";
type FieldErrors = Partial<Record<FieldName, string>>;
type Touched = Partial<Record<FieldName, boolean>>;

const FIELD_IDS: Record<FieldName, string> = {
  name: "name",
  email: "email",
  password: "password",
  confirmPassword: "confirm-password",
};

const STRENGTH_BAR = ["", "bg-red-500", "bg-amber-500", "bg-lime-500", "bg-emerald-500"];
const STRENGTH_TEXT = ["", "text-danger-ink", "text-warn-ink", "text-lime-700", "text-success-ink"];

const inputClasses = (hasError: boolean) =>
  `mt-1.5 block w-full rounded-xl border bg-surface/80 px-3.5 py-2.5 text-base text-fg shadow-sm transition-all duration-300 placeholder:text-fg-subtle hover:border-line-strong focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm ${
    hasError
      ? "border-danger focus:border-danger focus:ring-danger/15"
      : "border-line-strong focus:border-accent focus:ring-accent/15"
  }`;

function validateAll(values: Record<FieldName, string>): FieldErrors {
  return {
    name: validateName(values.name),
    email: validateEmail(values.email),
    password: validatePassword(values.password),
    confirmPassword: validateConfirmPassword(
      values.password,
      values.confirmPassword,
    ),
  };
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 animate-shake text-sm text-danger-ink">
      {message}
    </p>
  );
}

export default function RegisterForm() {
  const { initializationError, isReady, register } = useAuth();
  const router = useRouter();
  const [values, setValues] = useState<Record<FieldName, string>>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [touched, setTouched] = useState<Touched>({});
  const [duplicateEmail, setDuplicateEmail] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdName, setCreatedName] = useState<string | null>(null);

  useEffect(() => {
    if (!createdName) return;
    const timer = window.setTimeout(() => router.replace("/account"), 1400);
    return () => window.clearTimeout(timer);
  }, [createdName, router]);

  const errors = validateAll(values);
  const visibleErrors: FieldErrors = {};
  for (const field of Object.keys(errors) as FieldName[]) {
    if (touched[field]) visibleErrors[field] = errors[field];
  }

  const isDisabled = !isReady || Boolean(initializationError) || isSubmitting;
  const strength = getPasswordStrength(values.password);
  const hasMinLength = values.password.length >= MIN_PASSWORD_LENGTH;

  function handleChange(field: FieldName, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    if (field === "email") setDuplicateEmail(null);
    setFormError(null);
  }

  function handleBlur(field: FieldName) {
    setTouched((current) => ({ ...current, [field]: true }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isDisabled) return;

    setTouched({ name: true, email: true, password: true, confirmPassword: true });
    const firstInvalid = (Object.keys(errors) as FieldName[]).find(
      (field) => errors[field],
    );
    if (firstInvalid) {
      document.getElementById(FIELD_IDS[firstInvalid])?.focus();
      return;
    }

    setIsSubmitting(true);
    setFormError(null);
    setDuplicateEmail(null);
    try {
      const user = await register(values.name, values.email, values.password);
      setCreatedName(user.name);
    } catch (error) {
      if (error instanceof AuthError && error.code === "EMAIL_EXISTS") {
        setDuplicateEmail(error.message);
      } else {
        setFormError(
          error instanceof Error
            ? error.message
            : "Your account could not be created. Please try again.",
        );
      }
      setIsSubmitting(false);
    }
  }

  if (createdName) {
    return (
      <div
        role="status"
        className="animate-fade-up rounded-2xl border border-emerald-200 bg-gradient-to-br from-success-soft via-white to-indigo-50/60 px-6 py-10 text-center shadow-sm"
      >
        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-100 text-success-ink">
          <CheckCircle2 className="size-7" aria-hidden="true" />
        </span>
        <h2 className="mt-5 text-xl font-semibold tracking-tight text-fg">
          Welcome to EcomMS, {createdName.split(" ")[0]}!
        </h2>
        <p className="mt-2 text-sm text-fg-muted">
          Your account is ready. Taking you to your account…
        </p>
        <Loader2
          className="mx-auto mt-5 size-5 animate-spin text-accent-ink"
          aria-hidden="true"
        />
        <Link
          href="/account"
          className="mt-4 inline-block text-sm font-semibold text-accent-ink hover:text-accent-ink"
        >
          Go to my account now
        </Link>
      </div>
    );
  }

  const bannerMessage = initializationError ?? formError;

  return (
    <form onSubmit={handleSubmit} noValidate aria-busy={isSubmitting}>
      {bannerMessage && (
        <div
          role="alert"
          className="mb-5 flex animate-fade-up items-start gap-2.5 rounded-xl border border-danger/30 bg-danger-soft px-3.5 py-3 text-sm text-danger-ink shadow-sm"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <p className="leading-5">{bannerMessage}</p>
        </div>
      )}

      <div className="space-y-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-fg">
            Full name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Jane Doe"
            value={values.name}
            disabled={isDisabled}
            onChange={(event) => handleChange("name", event.target.value)}
            onBlur={() => handleBlur("name")}
            aria-invalid={visibleErrors.name ? true : undefined}
            aria-describedby={visibleErrors.name ? "name-error" : undefined}
            className={inputClasses(Boolean(visibleErrors.name))}
          />
          <FieldError id="name-error" message={visibleErrors.name} />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-fg">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
            placeholder="you@example.com"
            value={values.email}
            disabled={isDisabled}
            onChange={(event) => handleChange("email", event.target.value)}
            onBlur={() => handleBlur("email")}
            aria-invalid={visibleErrors.email || duplicateEmail ? true : undefined}
            aria-describedby={
              visibleErrors.email
                ? "email-error"
                : duplicateEmail
                  ? "email-duplicate"
                  : undefined
            }
            className={inputClasses(Boolean(visibleErrors.email || duplicateEmail))}
          />
          <FieldError id="email-error" message={visibleErrors.email} />
          {duplicateEmail && !visibleErrors.email && (
            <p
              id="email-duplicate"
              role="alert"
              className="mt-1.5 animate-shake text-sm text-danger-ink"
            >
              {duplicateEmail}{" "}
              <Link
                href="/auth/login"
                className="font-semibold text-accent-ink underline underline-offset-2 hover:text-accent-ink"
              >
                Log in instead
              </Link>
            </p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-fg">
            Password
          </label>
          <div className="mt-1.5">
            <PasswordInput
              id="password"
              name="password"
              autoComplete="new-password"
              placeholder="Create a password"
              value={values.password}
              disabled={isDisabled}
              hasError={Boolean(visibleErrors.password)}
              onChange={(event) => handleChange("password", event.target.value)}
              onBlur={() => handleBlur("password")}
              aria-invalid={visibleErrors.password ? true : undefined}
              aria-describedby={
                visibleErrors.password
                  ? "password-error password-hint"
                  : "password-hint"
              }
              className="disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>
          <FieldError id="password-error" message={visibleErrors.password} />

          <div id="password-hint" className="mt-2.5 space-y-2">
            <div className="flex items-center gap-3" aria-hidden="true">
              <div className="grid flex-1 grid-cols-4 gap-1.5">
                {[1, 2, 3, 4].map((segment) => (
                  <span
                    key={segment}
                    className={`h-1.5 rounded-full transition-colors duration-300 ${
                      segment <= strength.score
                        ? STRENGTH_BAR[strength.score]
                        : "bg-line"
                    }`}
                  />
                ))}
              </div>
              <span
                className={`w-12 text-right text-xs font-semibold ${STRENGTH_TEXT[strength.score]}`}
              >
                {strength.label ?? ""}
              </span>
            </div>
            <p role="status" className="sr-only">
              {strength.label
                ? `Password strength: ${strength.label}`
                : "Password strength not yet rated"}
            </p>
            <p
              className={`flex items-center gap-1.5 text-xs ${
                hasMinLength ? "text-success-ink" : "text-fg-subtle"
              }`}
            >
              <Check
                className={`size-3.5 ${hasMinLength ? "opacity-100" : "opacity-30"}`}
                aria-hidden="true"
              />
              At least {MIN_PASSWORD_LENGTH} characters
              <span className="sr-only">
                {hasMinLength ? " (met)" : " (not yet met)"}
              </span>
            </p>
            <p className="text-xs text-fg-subtle">
              The strength bar is only a rough guide. Longer passwords that mix
              letters, numbers, and symbols are better.
            </p>
          </div>
        </div>

        <div>
          <label
            htmlFor="confirm-password"
            className="block text-sm font-medium text-fg"
          >
            Confirm password
          </label>
          <div className="mt-1.5">
            <PasswordInput
              id="confirm-password"
              name="confirm-password"
              autoComplete="new-password"
              placeholder="Re-enter your password"
              value={values.confirmPassword}
              disabled={isDisabled}
              hasError={Boolean(visibleErrors.confirmPassword)}
              onChange={(event) =>
                handleChange("confirmPassword", event.target.value)
              }
              onBlur={() => handleBlur("confirmPassword")}
              aria-invalid={visibleErrors.confirmPassword ? true : undefined}
              aria-describedby={
                visibleErrors.confirmPassword ? "confirm-password-error" : undefined
              }
              className="disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>
          <FieldError
            id="confirm-password-error"
            message={visibleErrors.confirmPassword}
          />
        </div>

        <button
          type="submit"
          disabled={isDisabled}
          className="group relative flex w-full animate-gradient-x items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 bg-[length:200%_auto] px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-600/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
        >
          <span
            aria-hidden="true"
            className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
          />
          <span className="relative flex items-center gap-2">
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                Creating account…
              </>
            ) : (
              "Create account"
            )}
          </span>
        </button>
      </div>
    </form>
  );
}

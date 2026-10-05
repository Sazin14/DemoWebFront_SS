"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  hasError?: boolean;
}

/**
 * Password field with an accessible show/hide toggle.
 * The toggle button exposes an explicit aria-label so the
 * control never relies on the icon alone.
 */
export default function PasswordInput({
  hasError = false,
  className = "",
  ...props
}: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative">
      <input
        {...props}
        type={isVisible ? "text" : "password"}
        className={`block w-full rounded-xl border bg-surface/80 py-2.5 pl-3.5 pr-11 text-base text-fg sm:text-sm shadow-sm transition-all duration-300 placeholder:text-fg-subtle hover:border-line-strong focus:outline-none focus:ring-4 ${
          hasError
            ? "border-danger focus:border-danger focus:ring-danger/15"
            : "border-line-strong focus:border-accent focus:ring-accent/15"
        } ${className}`}
      />
      <button
        type="button"
        onClick={() => setIsVisible((current) => !current)}
        aria-label={isVisible ? "Hide password" : "Show password"}
        aria-pressed={isVisible}
        className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-xl text-fg-subtle transition-all duration-200 hover:scale-110 hover:text-accent-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent active:scale-95"
      >
        {isVisible ? (
          <EyeOff className="size-5" aria-hidden="true" />
        ) : (
          <Eye className="size-5" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}

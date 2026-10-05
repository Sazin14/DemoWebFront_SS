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
        className={`block w-full rounded-xl border bg-white/80 py-2.5 pl-3.5 pr-11 text-base text-zinc-900 sm:text-sm shadow-sm transition-all duration-300 placeholder:text-zinc-400 hover:border-zinc-400 focus:outline-none focus:ring-4 ${
          hasError
            ? "border-red-400 focus:border-red-500 focus:ring-red-500/15"
            : "border-zinc-300 focus:border-indigo-500 focus:ring-indigo-500/15"
        } ${className}`}
      />
      <button
        type="button"
        onClick={() => setIsVisible((current) => !current)}
        aria-label={isVisible ? "Hide password" : "Show password"}
        aria-pressed={isVisible}
        className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-xl text-zinc-400 transition-all duration-200 hover:scale-110 hover:text-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 active:scale-95"
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

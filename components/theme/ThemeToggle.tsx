"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import {
  getServerTheme,
  getTheme,
  setTheme,
  subscribeToTheme,
} from "@/lib/theme";

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const theme = useSyncExternalStore(subscribeToTheme, getTheme, getServerTheme);
  const next = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
      className={`relative inline-flex size-10 shrink-0 items-center justify-center rounded-xl text-fg-muted transition duration-200 hover:bg-surface-muted hover:text-fg active:scale-95 ${className}`}
    >
      {/* Both icons are rendered and swapped with CSS so there is no hydration flicker. */}
      <Sun
        aria-hidden="true"
        className="size-5 scale-100 rotate-0 transition duration-300 dark:scale-0 dark:-rotate-90"
      />
      <Moon
        aria-hidden="true"
        className="absolute size-5 scale-0 rotate-90 transition duration-300 dark:scale-100 dark:rotate-0"
      />
    </button>
  );
}

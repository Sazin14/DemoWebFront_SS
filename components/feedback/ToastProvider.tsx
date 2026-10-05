"use client";

import Link from "next/link";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { CheckCircle2, Info, X } from "lucide-react";

interface ToastInput {
  message: string;
  variant?: "success" | "info";
  action?: { label: string; href: string };
}

interface ToastItem extends ToastInput {
  id: number;
  leaving: boolean;
}

interface ToastContextValue {
  toast: (input: ToastInput) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const VISIBLE_MS = 3500;
const EXIT_MS = 200;
const MAX_TOASTS = 3;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(0);
  const timers = useRef(new Map<number, ReturnType<typeof setTimeout>>());

  const remove = useCallback((id: number) => {
    setToasts((current) => current.filter((item) => item.id !== id));
    timers.current.delete(id);
  }, []);

  const dismiss = useCallback(
    (id: number) => {
      setToasts((current) =>
        current.map((item) => (item.id === id ? { ...item, leaving: true } : item)),
      );
      const existing = timers.current.get(id);
      if (existing) clearTimeout(existing);
      timers.current.set(id, setTimeout(() => remove(id), EXIT_MS));
    },
    [remove],
  );

  const toast = useCallback(
    (input: ToastInput) => {
      const id = nextId.current++;
      setToasts((current) => [...current, { ...input, id, leaving: false }].slice(-MAX_TOASTS));
      timers.current.set(id, setTimeout(() => dismiss(id), VISIBLE_MS));
    },
    [dismiss],
  );

  useEffect(() => {
    const active = timers.current;
    return () => active.forEach((timer) => clearTimeout(timer));
  }, []);

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        role="region"
        aria-label="Notifications"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 top-20 z-[80] flex flex-col items-center gap-2 px-4 sm:inset-x-auto sm:right-4 sm:items-end"
      >
        {toasts.map((item) => (
          <div
            key={item.id}
            role="status"
            className={`pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-xl border border-line bg-surface px-4 py-3 text-sm text-fg shadow-pop ${
              item.leaving ? "animate-toast-out" : "animate-toast-in"
            }`}
          >
            {item.variant === "info" ? (
              <Info className="size-5 shrink-0 text-accent-ink" aria-hidden="true" />
            ) : (
              <CheckCircle2 className="size-5 shrink-0 text-success" aria-hidden="true" />
            )}
            <span className="min-w-0 flex-1 break-words">{item.message}</span>
            {item.action && (
              <Link
                href={item.action.href}
                onClick={() => dismiss(item.id)}
                className="shrink-0 font-semibold text-accent-ink hover:underline"
              >
                {item.action.label}
              </Link>
            )}
            <button
              type="button"
              onClick={() => dismiss(item.id)}
              aria-label="Dismiss notification"
              className="-mr-1 inline-flex size-7 shrink-0 items-center justify-center rounded-md text-fg-subtle hover:bg-surface-muted hover:text-fg"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within a ToastProvider");
  return context;
}

export default ToastProvider;

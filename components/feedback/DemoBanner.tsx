import { FlaskConical } from "lucide-react";

/** Global, always-visible notice that all catalog and account data is mock data. */
export default function DemoBanner() {
  return (
    <div
      role="note"
      aria-label="Demo store notice"
      className="border-b border-warn/30 bg-warn-soft text-warn-ink"
    >
      <p className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-1.5 text-center text-xs leading-5 sm:px-6">
        <span className="inline-flex shrink-0 items-center gap-1 rounded bg-warn px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-canvas">
          <FlaskConical className="size-3" aria-hidden="true" />
          Demo
        </span>
        <span>
          <strong className="font-semibold">Demo store</strong> — products, prices, ratings, stock
          and accounts shown here are sample data, not from the backend.
        </span>
      </p>
    </div>
  );
}

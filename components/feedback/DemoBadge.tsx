import { FlaskConical } from "lucide-react";

/** Compact marker for sections that render mock data. */
export default function DemoBadge({
  label = "Demo data",
  className = "",
}: {
  label?: string;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md border border-warn/40 bg-warn-soft px-1.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-warn-ink ${className}`}
    >
      <FlaskConical className="size-3" aria-hidden="true" />
      {label}
    </span>
  );
}

export default function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <ul
      className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4"
      aria-hidden="true"
    >
      {Array.from({ length: count }).map((_, index) => (
        <li key={index} className="overflow-hidden rounded-2xl border border-line bg-surface">
          <div className="aspect-square animate-pulse bg-surface-sunken" />
          <div className="space-y-2 p-4">
            <div className="h-3 w-1/3 animate-pulse rounded bg-surface-sunken" />
            <div className="h-4 w-4/5 animate-pulse rounded bg-surface-sunken" />
            <div className="h-5 w-1/2 animate-pulse rounded bg-surface-sunken" />
            <div className="h-11 animate-pulse rounded-xl bg-surface-sunken" />
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function ProductLoading() {
  return (
    <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-2" aria-busy="true">
      <div className="aspect-square animate-pulse rounded-2xl bg-surface-sunken" />
      <div className="space-y-4">
        <div className="h-4 w-24 animate-pulse rounded bg-surface-sunken" />
        <div className="h-8 w-3/4 animate-pulse rounded bg-surface-sunken" />
        <div className="h-8 w-40 animate-pulse rounded bg-surface-sunken" />
        <div className="h-24 animate-pulse rounded bg-surface-sunken" />
      </div>
    </div>
  );
}

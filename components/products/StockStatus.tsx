import { getStockStatus } from "@/lib/products/product-utils";

export default function StockStatus({ stock }: { stock: number }) {
  const status = getStockStatus(stock);

  if (status === "out-of-stock") {
    return (
      <p className="inline-flex items-center gap-1.5 text-xs font-medium text-fg-subtle">
        <span className="size-1.5 rounded-full bg-fg-subtle" aria-hidden="true" /> Out of stock
      </p>
    );
  }
  if (status === "low-stock") {
    return (
      <p className="inline-flex w-fit items-center gap-1.5 rounded-full bg-warn-soft px-2 py-0.5 text-xs font-semibold text-warn-ink">
        <span className="size-1.5 rounded-full bg-warn" aria-hidden="true" /> Only {stock} left
      </p>
    );
  }
  return (
    <p className="inline-flex items-center gap-1.5 text-xs font-medium text-success-ink">
      <span className="size-1.5 rounded-full bg-success" aria-hidden="true" /> In stock
    </p>
  );
}

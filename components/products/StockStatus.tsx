import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { getStockStatus } from "@/lib/products/product-utils";

export default function StockStatus({ stock }: { stock: number }) {
  const status = getStockStatus(stock);

  if (status === "out-of-stock") {
    return (
      <p className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500">
        <XCircle className="size-3.5" aria-hidden="true" /> Out of stock
      </p>
    );
  }
  if (status === "low-stock") {
    return (
      <p className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700">
        <AlertTriangle className="size-3.5" aria-hidden="true" /> Only {stock} left
      </p>
    );
  }
  return (
    <p className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700">
      <CheckCircle2 className="size-3.5" aria-hidden="true" /> In stock
    </p>
  );
}

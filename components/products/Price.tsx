import { formatPrice } from "@/lib/format";

interface PriceProps {
  price: number;
  originalPrice?: number;
  currency?: string;
  discountPercentage?: number | null;
  prefix?: string;
  size?: "sm" | "lg";
}

export default function Price({
  price,
  originalPrice,
  currency = "USD",
  discountPercentage,
  prefix,
  size = "sm",
}: PriceProps) {
  const discounted = originalPrice !== undefined && originalPrice > price;
  return (
    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
      <span
        className={`font-bold text-fg ${size === "lg" ? "text-3xl" : "text-lg"}`}
      >
        {prefix && <span className="mr-1 text-xs font-medium text-fg-subtle">{prefix}</span>}
        {formatPrice(price, currency)}
      </span>
      {discounted && (
        <>
          <span className={`text-fg-subtle line-through ${size === "lg" ? "text-base" : "text-sm"}`}>
            <span className="sr-only">Original price </span>
            {formatPrice(originalPrice, currency)}
          </span>
          {size === "lg" && discountPercentage ? (
            <span className="rounded-md bg-danger-soft px-2 py-0.5 text-sm font-semibold text-danger-ink">
              Save {discountPercentage}%
            </span>
          ) : null}
        </>
      )}
    </div>
  );
}

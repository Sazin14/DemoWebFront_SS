"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Check, ShoppingCart, ShieldCheck, Truck } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { PRODUCT_CATEGORIES } from "@/lib/products/categories";
import { MAX_LINE_QUANTITY } from "@/lib/cart/cart";
import {
  getSelectionError,
  getSelectedImage,
  getSelectedSku,
  getSelectedStock,
  getStockStatus,
  getUnitPricing,
  hasVariants,
} from "@/lib/products/product-utils";
import type { Product, VariantSelection } from "@/lib/products/types";
import type { ProductReview } from "@/lib/products/reviews";
import DemoBadge from "@/components/feedback/DemoBadge";
import Price from "./Price";
import ProductGallery from "./ProductGallery";
import ProductVariants from "./ProductVariants";
import QuantitySelector from "./QuantitySelector";
import Rating from "./Rating";
import StockStatus from "./StockStatus";

export default function ProductDetail({
  product,
  reviews,
}: {
  product: Product;
  reviews: ProductReview[];
}) {
  const { addToCart } = useCart();
  const router = useRouter();
  const [selection, setSelection] = useState<VariantSelection>({});
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [added, setAdded] = useState(false);

  const selectedStock = getSelectedStock(product, selection);
  const outOfStock = getStockStatus(selectedStock) === "out-of-stock";
  const maxQuantity = Math.max(1, Math.min(selectedStock, MAX_LINE_QUANTITY));
  const pricing = getUnitPricing(product, selection);
  const missingGroup = (product.variants ?? []).find((group) => !selection[group.name]);
  const selectedImage = getSelectedImage(product, selection);
  const selectedSku = getSelectedSku(product, selection);
  const category = PRODUCT_CATEGORIES.find((item) => item.id === product.categoryId);
  const specifications = Object.entries(product.attributes)
    .filter(([key, value]) => key !== "brand" && !(Array.isArray(value) && value.length === 0))
    .map(([key, value]) => {
      const attribute = category?.attributes.find((item) => item.id === key);
      const formattedValue = Array.isArray(value)
        ? value.join(", ")
        : typeof value === "boolean"
          ? value ? "Yes" : "No"
          : String(value);
      return {
        label: attribute?.name ?? key.replace(/([A-Z])/g, " $1").replace(/^./, (letter) => letter.toUpperCase()),
        value: attribute?.unit && typeof value === "number" ? `${formattedValue} ${attribute.unit}` : formattedValue,
      };
    })
    .filter((item) => item.value.length > 0);

  function handleSelect(name: string, value: string) {
    setSelection((current) => ({ ...current, [name]: value }));
    setError(null);
    setAdded(false);
  }

  function handleAdd(): boolean {
    const problem = getSelectionError(product, selection);
    if (problem) {
      setError(problem);
      return false;
    }
    const result = addToCart({ ...product, stock: selectedStock }, { selection, quantity });
    if (result.ok) {
      setError(null);
      setAdded(true);
      return true;
    } else {
      setError(result.error);
      return false;
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
      <ProductGallery
        key={`${product.id}-${selectedImage ?? ""}`}
        images={selectedImage ? [selectedImage, ...product.images.filter((image) => image !== selectedImage)] : product.images}
        name={product.name}
      />

      <div className="flex flex-col gap-5">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium uppercase tracking-wide text-accent-ink">
              {product.brand}
            </p>
            <DemoBadge label="Demo product" />
          </div>
          <h1 className="text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
            {product.name}
          </h1>
          <Rating rating={product.rating} reviewCount={product.reviewCount} />
        </div>

        <Price
          price={pricing.price}
          originalPrice={pricing.originalPrice}
          discountPercentage={pricing.discountPercentage}
          currency={product.currency}
          size="lg"
        />
        <StockStatus stock={selectedStock} />

        <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-fg-subtle">
          <span>Demo SKU: <span className="font-mono text-fg-muted">{selectedSku}</span></span>
          <Link href={`/products?category=${product.categoryId}`} className="font-medium text-accent-ink hover:underline">
            {product.category}
          </Link>
        </div>

        <p className="leading-7 text-fg-muted">{product.description}</p>

        {hasVariants(product) && !outOfStock && (
          <ProductVariants
            variants={product.variants ?? []}
            selection={selection}
            onSelect={handleSelect}
            errorGroup={error ? missingGroup?.name : null}
            errorId="variant-error"
          />
        )}

        {!outOfStock && (
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold text-fg">Quantity</span>
            <QuantitySelector
              value={quantity}
              max={maxQuantity}
              onChange={(next) => {
                setQuantity(next);
                setAdded(false);
              }}
            />
            {selectedStock <= maxQuantity && selectedStock > 0 && (
              <span className="text-xs text-fg-subtle">Max {maxQuantity}</span>
            )}
          </div>
        )}

        <div aria-live="polite">
          {error && (
            <p id="variant-error" role="alert" className="rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger-ink">
              {error}
            </p>
          )}
        </div>

        <div className="sticky bottom-0 z-30 -mx-4 flex flex-col gap-3 border-t border-line bg-surface/95 px-4 py-3 backdrop-blur sm:flex-row lg:static lg:mx-0 lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
          <button
            type="button"
            onClick={handleAdd}
            disabled={outOfStock}
            className="btn btn-primary h-13 flex-1 px-6 text-base disabled:cursor-not-allowed disabled:bg-surface-sunken disabled:text-fg-subtle"
          >
            {outOfStock ? (
              "Out of stock"
            ) : added ? (
              <>
                <Check className="size-5" aria-hidden="true" /> Added to cart
              </>
            ) : (
              <>
                <ShoppingCart className="size-5" aria-hidden="true" /> Add to cart
              </>
            )}
          </button>
          {!outOfStock && (
            <button
              type="button"
              onClick={() => {
                if (handleAdd()) router.push("/checkout");
              }}
              className="btn btn-secondary h-13 px-6 text-base"
            >
              Buy now
            </button>
          )}
          {added && (
            <Link
              href="/cart"
              className="btn btn-secondary h-13 px-6 text-base"
            >
              View cart
            </Link>
          )}
        </div>

        <ul className="grid gap-3 border-t border-line pt-5 text-sm text-fg-muted sm:grid-cols-2">
          <li className="flex items-center gap-2">
            <Truck className="size-4 text-accent-ink" aria-hidden="true" />
            Free shipping over $50
          </li>
          <li className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-accent-ink" aria-hidden="true" />
            Sample prices &amp; stock — demo data
          </li>
        </ul>
      </div>

      <section className="lg:col-span-2">
        <div className="grid gap-8 border-t border-line pt-8 md:grid-cols-[1fr_1.2fr]">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold tracking-tight">Product details</h2>
              <DemoBadge label="Category specifications" />
            </div>
            <p className="mt-3 max-w-xl text-sm leading-7 text-fg-muted">{product.description}</p>
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">Specifications</h2>
            <dl className="mt-4 divide-y divide-line rounded-xl border border-line bg-surface">
              {specifications.map((specification) => (
                <div key={specification.label} className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-4 px-4 py-3 text-sm">
                  <dt className="text-fg-muted">{specification.label}</dt>
                  <dd className="font-medium text-fg">{specification.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <section aria-labelledby="reviews-heading" className="mt-10 border-t border-line pt-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 id="reviews-heading" className="text-xl font-bold tracking-tight">Customer reviews</h2>
              <p className="mt-1 text-sm text-fg-muted">Sample feedback shown for this demonstration product.</p>
            </div>
            <Rating rating={product.rating} reviewCount={product.reviewCount} />
          </div>
          {reviews.length > 0 ? (
            <ul className="mt-5 grid gap-4 md:grid-cols-2">
              {reviews.map((review) => (
                <li key={review.id} className="rounded-2xl border border-line bg-surface p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold">{review.title}</h3>
                      <p className="mt-1 text-xs text-fg-subtle">{review.author} · {review.date}</p>
                    </div>
                    <Rating rating={review.rating} />
                  </div>
                  <p className="mt-3 text-sm leading-6 text-fg-muted">{review.body}</p>
                  {review.verifiedPurchase && <p className="mt-3 text-xs font-medium text-success-ink">Demo verified-purchase label</p>}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 rounded-xl border border-dashed border-line-strong p-5 text-sm text-fg-muted">No sample reviews are available for this product yet.</p>
          )}
        </section>
      </section>
    </div>
  );
}

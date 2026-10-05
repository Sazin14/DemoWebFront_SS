"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Check, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import {
  getDiscountPercentage,
  getPriceFrom,
  getStockStatus,
  hasVariants,
} from "@/lib/products/product-utils";
import type { Product } from "@/lib/products/types";
import Price from "./Price";
import ProductImage from "./ProductImage";
import Rating from "./Rating";
import StockStatus from "./StockStatus";

export default function ProductCard({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const href = `/products/${product.slug}`;
  const outOfStock = getStockStatus(product.stock) === "out-of-stock";
  const needsOptions = hasVariants(product);
  const discount = getDiscountPercentage(product.price, product.originalPrice);
  const showFrom = needsOptions && getPriceFrom(product) !== product.price;

  function handleAdd() {
    const result = addToCart(product);
    if (result.ok) {
      setAdded(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setAdded(false), 1800);
    }
  }

  const ctaClass =
    "inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600";

  return (
    <article className="group relative flex w-full flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-100">
      <div className="relative aspect-square overflow-hidden bg-zinc-100">
        <Link href={href} tabIndex={-1} aria-hidden="true" className="absolute inset-0">
          <ProductImage
            src={product.images[0]}
            alt=""
            priority={priority}
            sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
            className={`transition-transform duration-500 group-hover:scale-105 ${
              outOfStock ? "opacity-60 grayscale" : ""
            }`}
          />
        </Link>
        <div className="pointer-events-none absolute left-2 top-2 flex flex-col items-start gap-1">
          {discount && (
            <span className="rounded-md bg-rose-600 px-2 py-0.5 text-xs font-bold text-white shadow">
              -{discount}%
            </span>
          )}
          {outOfStock && (
            <span className="rounded-md bg-zinc-900 px-2 py-0.5 text-xs font-semibold text-white">
              Sold out
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3 sm:p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
          {product.brand}
        </p>
        <h3 className="line-clamp-2 min-h-10 text-sm font-semibold leading-5 text-zinc-900">
          <Link
            href={href}
            className="after:absolute after:inset-0 after:content-[''] hover:text-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-600"
          >
            {product.name}
          </Link>
        </h3>
        <Rating rating={product.rating} reviewCount={product.reviewCount} />
        <Price
          price={showFrom ? getPriceFrom(product) : product.price}
          originalPrice={showFrom ? undefined : product.originalPrice}
          currency={product.currency}
          prefix={showFrom ? "From" : undefined}
        />
        <StockStatus stock={product.stock} />

        <div className="relative z-10 mt-auto pt-2">
          {outOfStock ? (
            <button type="button" disabled className={`${ctaClass} cursor-not-allowed bg-zinc-100 text-zinc-400`}>
              Out of stock
            </button>
          ) : needsOptions ? (
            <Link
              href={href}
              className={`${ctaClass} border border-zinc-300 bg-white text-zinc-800 hover:border-indigo-300 hover:text-indigo-600`}
            >
              Select options
            </Link>
          ) : (
            <button
              type="button"
              onClick={handleAdd}
              aria-label={`Add ${product.name} to cart`}
              className={`${ctaClass} ${
                added
                  ? "bg-emerald-600 text-white"
                  : "bg-zinc-950 text-white hover:bg-indigo-600"
              }`}
            >
              {added ? (
                <>
                  <Check className="size-4" aria-hidden="true" /> Added
                </>
              ) : (
                <>
                  <ShoppingCart className="size-4" aria-hidden="true" /> Add to cart
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

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

const IMAGE_SIZES = "(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw";

export default function ProductCard({
  product,
  eager = false,
}: {
  product: Product;
  eager?: boolean;
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
  const secondImage = product.images[1];

  function handleAdd() {
    const result = addToCart(product);
    if (result.ok) {
      setAdded(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setAdded(false), 1600);
    }
  }

  return (
    <article className="group relative flex w-full flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-[border-color,box-shadow] duration-300 hover:border-line-strong hover:shadow-card has-[a:focus-visible]:border-accent">
      <div className="relative aspect-square overflow-hidden bg-surface-sunken">
        <Link href={href} tabIndex={-1} aria-hidden="true" className="absolute inset-0">
          <ProductImage
            src={product.images[0]}
            alt=""
            loading={eager ? "eager" : "lazy"}
            sizes={IMAGE_SIZES}
            className={`transition duration-500 ease-out group-hover:scale-[1.04] ${
              outOfStock ? "opacity-60 grayscale" : ""
            }`}
          />
          {secondImage && (
            <span className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <ProductImage
                src={secondImage}
                alt=""
                sizes={IMAGE_SIZES}
                className={`transition duration-500 ease-out group-hover:scale-[1.04] ${
                  outOfStock ? "opacity-60 grayscale" : ""
                }`}
              />
            </span>
          )}
        </Link>
        <div className="pointer-events-none absolute left-2 top-2 flex flex-col items-start gap-1">
          {discount && <span className="badge bg-danger text-canvas shadow-sm">-{discount}%</span>}
          {product.isNew && <span className="badge bg-surface text-fg shadow-sm">New</span>}
          {product.featured && <span className="badge bg-accent text-on-accent shadow-sm">Popular</span>}
          {outOfStock && <span className="badge bg-fg text-canvas">Sold out</span>}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-3 sm:p-4">
        <div className="flex min-w-0 items-center justify-between gap-2">
          <p className="truncate text-xs font-medium uppercase tracking-wide text-fg-subtle">{product.brand}</p>
          <p className="shrink-0 text-[10px] font-medium text-fg-subtle">{product.category}</p>
        </div>
        <h3 className="line-clamp-2 min-h-10 text-sm font-semibold leading-5 text-fg">
          <Link
            href={href}
            className="after:absolute after:inset-0 after:content-[''] hover:text-accent-ink focus-visible:outline-none"
          >
            {product.name}
          </Link>
        </h3>
        <Rating rating={product.rating} reviewCount={product.reviewCount} />
        <div className="mt-0.5">
          <Price
            price={showFrom ? getPriceFrom(product) : product.price}
            originalPrice={showFrom ? undefined : product.originalPrice}
            currency={product.currency}
            prefix={showFrom ? "From" : undefined}
          />
        </div>
        <StockStatus stock={product.stock} />

        <div className="relative z-10 mt-auto pt-2.5">
          {outOfStock ? (
            <button type="button" disabled className="btn h-11 w-full bg-surface-sunken text-fg-subtle">
              Out of stock
            </button>
          ) : needsOptions ? (
            <Link href={href} className="btn btn-secondary h-11 w-full">
              Select options
            </Link>
          ) : (
            <button
              type="button"
              onClick={handleAdd}
              aria-label={`Add ${product.name} to cart`}
              className={`btn h-11 w-full ${
                added ? "bg-success text-canvas" : "btn-primary"
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

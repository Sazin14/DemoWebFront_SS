"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, ShoppingCart, ShieldCheck, Truck } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { MAX_LINE_QUANTITY } from "@/lib/cart/cart";
import {
  getSelectionError,
  getStockStatus,
  getUnitPricing,
  hasVariants,
} from "@/lib/products/product-utils";
import type { Product, VariantSelection } from "@/lib/products/types";
import Price from "./Price";
import ProductGallery from "./ProductGallery";
import ProductVariants from "./ProductVariants";
import QuantitySelector from "./QuantitySelector";
import Rating from "./Rating";
import StockStatus from "./StockStatus";

export default function ProductDetail({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [selection, setSelection] = useState<VariantSelection>({});
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [added, setAdded] = useState(false);

  const outOfStock = getStockStatus(product.stock) === "out-of-stock";
  const maxQuantity = Math.max(1, Math.min(product.stock, MAX_LINE_QUANTITY));
  const pricing = getUnitPricing(product, selection);
  const missingGroup = (product.variants ?? []).find((group) => !selection[group.name]);

  function handleSelect(name: string, value: string) {
    setSelection((current) => ({ ...current, [name]: value }));
    setError(null);
    setAdded(false);
  }

  function handleAdd() {
    const problem = getSelectionError(product, selection);
    if (problem) {
      setError(problem);
      return;
    }
    const result = addToCart(product, { selection, quantity });
    if (result.ok) {
      setError(null);
      setAdded(true);
    } else {
      setError(result.error);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
      <ProductGallery images={product.images} name={product.name} />

      <div className="flex flex-col gap-5">
        <div className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-wide text-indigo-600">
            {product.brand}
          </p>
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
        <StockStatus stock={product.stock} />

        <p className="leading-7 text-zinc-600">{product.description}</p>

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
            <span className="text-sm font-semibold text-zinc-900">Quantity</span>
            <QuantitySelector
              value={quantity}
              max={maxQuantity}
              onChange={(next) => {
                setQuantity(next);
                setAdded(false);
              }}
            />
            {product.stock <= maxQuantity && product.stock > 0 && (
              <span className="text-xs text-zinc-500">Max {maxQuantity}</span>
            )}
          </div>
        )}

        <div aria-live="polite">
          {error && (
            <p id="variant-error" role="alert" className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {error}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={handleAdd}
            disabled={outOfStock}
            className="inline-flex h-13 flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 px-6 text-base font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:translate-y-0 disabled:cursor-not-allowed disabled:bg-none disabled:bg-zinc-200 disabled:text-zinc-500 disabled:shadow-none"
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
          {added && (
            <Link
              href="/cart"
              className="inline-flex h-13 items-center justify-center rounded-xl border border-zinc-300 px-6 text-base font-semibold text-zinc-800 hover:border-indigo-300 hover:text-indigo-600"
            >
              View cart
            </Link>
          )}
        </div>

        <ul className="grid gap-3 border-t border-zinc-200 pt-5 text-sm text-zinc-600 sm:grid-cols-2">
          <li className="flex items-center gap-2">
            <Truck className="size-4 text-indigo-600" aria-hidden="true" />
            Free shipping over $50
          </li>
          <li className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-indigo-600" aria-hidden="true" />
            Prices and stock are confirmed at checkout
          </li>
        </ul>
      </div>
    </div>
  );
}

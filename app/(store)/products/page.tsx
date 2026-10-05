import type { Metadata } from "next";
import { Suspense } from "react";
import ProductCatalog from "@/components/products/ProductCatalog";
import ProductGridSkeleton from "@/components/products/ProductGridSkeleton";
import { getCategories, getProducts } from "@/lib/products/product-service";

export const metadata: Metadata = {
  title: "Products",
  description: "Browse, search and filter products across every category.",
};

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);

  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
          <ProductGridSkeleton />
        </div>
      }
    >
      <ProductCatalog products={products} categories={categories} />
    </Suspense>
  );
}

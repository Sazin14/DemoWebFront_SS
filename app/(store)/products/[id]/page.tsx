import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import ProductDetail from "@/components/products/ProductDetail";
import ProductGrid from "@/components/products/ProductGrid";
import {
  getProductBySlug,
  getProducts,
  getRelatedProducts,
} from "@/lib/products/product-service";

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({ id: product.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/products/[id]">): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductBySlug(id);
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description: product.shortDescription,
    openGraph: { title: product.name, description: product.shortDescription },
  };
}

export default async function ProductPage({ params }: PageProps<"/products/[id]">) {
  const { id } = await params;
  const product = await getProductBySlug(id);
  if (!product) notFound();

  const related = await getRelatedProducts(product);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
      <nav aria-label="Breadcrumb" className="mb-5 text-sm text-fg-subtle">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li><Link href="/" className="hover:text-accent-ink">Home</Link></li>
          <ChevronRight className="size-3.5" aria-hidden="true" />
          <li><Link href="/products" className="hover:text-accent-ink">Products</Link></li>
          <ChevronRight className="size-3.5" aria-hidden="true" />
          <li>
            <Link
              href={`/products?category=${encodeURIComponent(product.category)}`}
              className="hover:text-accent-ink"
            >
              {product.category}
            </Link>
          </li>
          <ChevronRight className="size-3.5" aria-hidden="true" />
          <li aria-current="page" className="max-w-[16rem] truncate font-medium text-fg">
            {product.name}
          </li>
        </ol>
      </nav>

      <ProductDetail product={product} />

      {related.length > 0 && (
        <section aria-labelledby="related-heading" className="mt-14">
          <h2 id="related-heading" className="mb-5 text-xl font-bold tracking-tight">
            You may also like
          </h2>
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
}

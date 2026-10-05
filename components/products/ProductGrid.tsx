import type { Product } from "@/lib/products/types";
import ProductCard from "./ProductCard";

/**
 * Cards fade in with a very short, capped stagger (CSS only). Only the first
 * dozen are staggered so large result sets never feel slow.
 */
export default function ProductGrid({ products }: { products: Product[] }) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product, index) => (
        <li
          key={product.id}
          className="flex min-w-0 animate-reveal"
          style={{ animationDelay: `${Math.min(index, 11) * 25}ms` }}
        >
          <ProductCard product={product} priority={index < 4} />
        </li>
      ))}
    </ul>
  );
}

import type { Product } from "@/lib/products/types";
import ProductCard from "./ProductCard";

export default function ProductGrid({ products }: { products: Product[] }) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product, index) => (
        <li key={product.id} className="flex min-w-0">
          <div className="flex w-full">
            <ProductCard product={product} priority={index < 4} />
          </div>
        </li>
      ))}
    </ul>
  );
}

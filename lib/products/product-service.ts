import { mockProducts } from "./mock-data";
import type { Product, ProductCategory } from "./types";

/**
 * Product data access boundary.
 *
 * Components must only talk to these functions. Today they read mock data;
 * later each body can call the Product microservice without changing callers.
 */

export async function getProducts(): Promise<Product[]> {
  return mockProducts;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  return mockProducts.find((product) => product.slug === slug) ?? null;
}

export async function getProductById(id: string): Promise<Product | null> {
  return mockProducts.find((product) => product.id === id) ?? null;
}

export async function getCategories(): Promise<ProductCategory[]> {
  return Array.from(new Set(mockProducts.map((product) => product.category)));
}

export async function getRelatedProducts(
  product: Product,
  limit = 4,
): Promise<Product[]> {
  const score = (candidate: Product) =>
    (candidate.category === product.category ? 2 : 0) +
    (candidate.brand === product.brand ? 1 : 0) +
    candidate.tags.filter((tag) => product.tags.includes(tag)).length * 0.5;

  return mockProducts
    .filter((candidate) => candidate.id !== product.id)
    .map((candidate) => ({ candidate, value: score(candidate) }))
    .filter(({ value }) => value > 0)
    .sort((a, b) => b.value - a.value || b.candidate.rating - a.candidate.rating)
    .slice(0, limit)
    .map(({ candidate }) => candidate);
}

import { mockProducts } from "./mock-data";
import { PRODUCT_CATEGORIES } from "./categories";
import type { CategoryAttribute, Product, ProductCategory } from "./types";
import { getDemoReviews, type ProductReview } from "./reviews";

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
  return PRODUCT_CATEGORIES;
}

export async function getCategory(idOrSlug: string): Promise<ProductCategory | null> {
  return PRODUCT_CATEGORIES.find(
    (category) => category.id === idOrSlug || category.slug === idOrSlug,
  ) ?? null;
}

export async function getProductsByCategory(categoryId: string): Promise<Product[]> {
  return mockProducts.filter((product) => product.categoryId === categoryId);
}

export async function getProductFilters(categoryId: string): Promise<CategoryAttribute[]> {
  const category = await getCategory(categoryId);
  return category?.attributes.filter((attribute) => attribute.filterable) ?? [];
}

export async function getProductReviews(productId: string): Promise<ProductReview[]> {
  return getDemoReviews(productId);
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

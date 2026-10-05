export type ProductCategory =
  | "Electronics"
  | "Fashion"
  | "Home & Living"
  | "Beauty"
  | "Sports"
  | "Accessories";

export interface ProductVariantOption {
  value: string;
  /** Added to both the price and the original price when selected. */
  priceDelta?: number;
  /** Defaults to true. Unavailable options are shown but cannot be chosen. */
  available?: boolean;
}

/** A selectable option group such as "Size", "Color" or "Storage". */
export interface ProductVariant {
  name: string;
  options: ProductVariantOption[];
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  shortDescription: string;

  price: number;
  originalPrice?: number;
  currency: string;

  category: ProductCategory;
  brand: string;

  images: string[];

  rating: number;
  reviewCount: number;
  /** Units sold; drives the "Most Popular" sort. */
  soldCount: number;

  stock: number;

  tags: string[];

  featured?: boolean;
  variants?: ProductVariant[];

  createdAt: string;
}

/** Option group name -> selected option value. */
export type VariantSelection = Record<string, string>;

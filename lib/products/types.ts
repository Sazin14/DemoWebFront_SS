export type CategoryAttributeType =
  | "text"
  | "number"
  | "boolean"
  | "select"
  | "multi-select";

export type ProductAttributeValue = string | number | boolean | string[];

export interface CategoryAttribute {
  id: string;
  name: string;
  type: CategoryAttributeType;
  required: boolean;
  filterable: boolean;
  options?: string[];
  unit?: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  attributes: CategoryAttribute[];
}

export interface ProductVariantOption {
  value: string;
  /** Added to both the price and the original price when selected. */
  priceDelta?: number;
  /** Defaults to true. Unavailable options are shown but cannot be chosen. */
  available?: boolean;
  sku?: string;
  stock?: number;
  image?: string;
}

/** A selectable option group such as "Size", "Color" or "Storage". */
export interface ProductVariant {
  name: string;
  options: ProductVariantOption[];
}

export interface Product {
  id: string;
  slug: string;
  sku: string;
  name: string;
  description: string;
  shortDescription: string;

  price: number;
  originalPrice?: number;
  currency: string;

  category: string;
  categoryId: string;
  attributes: Record<string, ProductAttributeValue>;
  brand: string;

  images: string[];

  rating: number;
  reviewCount: number;
  /** Units sold; drives the "Most Popular" sort. */
  soldCount: number;

  stock: number;

  tags: string[];

  featured?: boolean;
  isNew?: boolean;
  badges?: string[];
  variants?: ProductVariant[];

  createdAt: string;
}

/** Option group name -> selected option value. */
export type VariantSelection = Record<string, string>;

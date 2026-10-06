import type { CartItem } from "@/lib/cart/types";

export type OrderStatus = "placed" | "confirmed" | "processing" | "shipped" | "delivered";

export interface DemoAddress {
  fullName: string;
  address: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
}

export interface OrderTimelineEntry {
  status: OrderStatus;
  date: string | null;
  note: string;
}

export interface DemoOrder {
  id: string;
  number: string;
  customerName: string;
  customerEmail: string;
  date: string;
  status: OrderStatus;
  items: Pick<CartItem, "productId" | "slug" | "name" | "image" | "unitPrice" | "quantity" | "currency" | "options">[];
  subtotal: number;
  shipping: number;
  total: number;
  address: DemoAddress;
  deliveryMethod: string;
  paymentMethod: string;
  timeline: OrderTimelineEntry[];
}

export interface DemoNotification {
  id: string;
  title: string;
  message: string;
  date: string;
  type: "order" | "promotion" | "account";
  href: string;
  read: boolean;
}

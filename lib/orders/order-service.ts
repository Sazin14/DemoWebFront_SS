import type { CartItem } from "@/lib/cart/types";
import type { DemoAddress, DemoOrder, OrderStatus } from "./types";
import { demoOrders } from "./mock-data";

export const DEMO_ORDERS_STORAGE_KEY = "ecomms_demo_orders";
export const DEMO_ORDERS_CHANGE_EVENT = "ecomms:demo-orders-change";

export interface DemoOrderSnapshot {
  orders: DemoOrder[];
  error: string | null;
}

const SERVER_ORDER_SNAPSHOT: DemoOrderSnapshot = { orders: demoOrders, error: null };
let cachedRaw: string | null | undefined;
let cachedSnapshot = SERVER_ORDER_SNAPSHOT;
let unavailableStorageSnapshot: DemoOrderSnapshot | null = null;

function isDemoOrder(value: unknown): value is DemoOrder {
  return Boolean(
    value
    && typeof value === "object"
    && "id" in value
    && typeof value.id === "string"
    && "number" in value
    && typeof value.number === "string"
    && "items" in value
    && Array.isArray(value.items),
  );
}

export function getDemoOrders(): DemoOrder[] {
  const snapshot = getDemoOrderSnapshot();
  if (snapshot.error) throw new Error(snapshot.error);
  return snapshot.orders;
}

export function getDemoOrder(id: string): DemoOrder | null {
  return getDemoOrders().find((order) => order.id === id || order.number === id) ?? null;
}

export function getDemoOrderSnapshot(): DemoOrderSnapshot {
  if (typeof window === "undefined") return SERVER_ORDER_SNAPSHOT;
  let raw: string | null;
  try {
    raw = window.localStorage.getItem(DEMO_ORDERS_STORAGE_KEY);
  } catch {
    unavailableStorageSnapshot ??= {
      orders: demoOrders,
      error: "Demo order history is unavailable because browser storage could not be read.",
    };
    return unavailableStorageSnapshot;
  }
  unavailableStorageSnapshot = null;
  if (raw === cachedRaw) return cachedSnapshot;
  cachedRaw = raw;
  if (!raw) {
    cachedSnapshot = SERVER_ORDER_SNAPSHOT;
    return cachedSnapshot;
  }
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed) || !parsed.every(isDemoOrder)) {
      throw new Error("Saved demo order data is invalid. Clear the browser's demo order storage to continue.");
    }
    cachedSnapshot = {
      orders: [...parsed, ...demoOrders].sort((a, b) => b.date.localeCompare(a.date)),
      error: null,
    };
  } catch (cause) {
    cachedSnapshot = {
      orders: demoOrders,
      error: cause instanceof Error ? cause.message : "Saved demo order data could not be read.",
    };
  }
  return cachedSnapshot;
}

export function subscribeToDemoOrders(callback: () => void): () => void {
  const onStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === DEMO_ORDERS_STORAGE_KEY) callback();
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener(DEMO_ORDERS_CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(DEMO_ORDERS_CHANGE_EVENT, callback);
  };
}

export function getServerDemoOrderSnapshot(): DemoOrderSnapshot {
  return SERVER_ORDER_SNAPSHOT;
}

export function createDemoOrder(input: {
  customerName: string;
  customerEmail: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  address: DemoAddress;
  deliveryMethod: string;
  paymentMethod: string;
}): DemoOrder {
  if (typeof window === "undefined") {
    throw new Error("Demo orders can only be placed from the browser.");
  }
  const now = new Date().toISOString();
  const id = `demo-order-${crypto.randomUUID()}`;
  const order: DemoOrder = {
    id,
    number: `ORD-${Date.now().toString().slice(-6)}`,
    customerName: input.customerName,
    customerEmail: input.customerEmail,
    date: now,
    status: "confirmed" satisfies OrderStatus,
    items: input.items.map(({ productId, slug, name, image, unitPrice, quantity, currency, options }) => ({
      productId,
      slug,
      name,
      image,
      unitPrice,
      quantity,
      currency,
      options,
    })),
    subtotal: input.subtotal,
    shipping: input.shipping,
    total: input.total,
    address: input.address,
    deliveryMethod: input.deliveryMethod,
    paymentMethod: input.paymentMethod,
    timeline: [
      { status: "placed", date: now, note: "Demo order submitted in this browser" },
      { status: "confirmed", date: now, note: "Demo confirmation — no Order service was contacted" },
      { status: "processing", date: null, note: "Sample status update" },
      { status: "shipped", date: null, note: "Sample status update" },
      { status: "delivered", date: null, note: "Sample status update" },
    ],
  };
  const existing = getDemoOrders().filter((candidate) => !demoOrders.some((sample) => sample.id === candidate.id));
  window.localStorage.setItem(DEMO_ORDERS_STORAGE_KEY, JSON.stringify([order, ...existing]));
  cachedRaw = undefined;
  window.dispatchEvent(new Event(DEMO_ORDERS_CHANGE_EVENT));
  return order;
}

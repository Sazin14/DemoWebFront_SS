import type { DemoNotification } from "@/lib/orders/types";

export const demoNotifications: DemoNotification[] = [
  {
    id: "notice-order-10274",
    title: "Order confirmed",
    message: "Your demo order ORD-10274 is being prepared.",
    date: "2026-10-02T08:00:00.000Z",
    type: "order",
    href: "/account/orders/demo-order-10274",
    read: false,
  },
  {
    id: "notice-order-10263",
    title: "Your order is on the way",
    message: "Sample tracking status updated for ORD-10263.",
    date: "2026-09-27T13:20:00.000Z",
    type: "order",
    href: "/account/orders/demo-order-10263",
    read: false,
  },
  {
    id: "notice-seasonal",
    title: "Seasonal picks are here",
    message: "Explore a few curated finds across the demo catalog.",
    date: "2026-09-20T10:00:00.000Z",
    type: "promotion",
    href: "/products?sort=newest",
    read: true,
  },
  {
    id: "notice-account-demo",
    title: "Demo environment reminder",
    message: "Account and order information is sample data stored in this browser.",
    date: "2026-09-17T10:00:00.000Z",
    type: "account",
    href: "/account",
    read: true,
  },
];

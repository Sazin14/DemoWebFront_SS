import type { Metadata } from "next";
import OrderHistory from "@/components/account/OrderHistory";

export const metadata: Metadata = {
  title: "Order history",
  description: "Review sample customer orders and their demonstration status.",
};

export default function OrderHistoryPage() {
  return <OrderHistory />;
}

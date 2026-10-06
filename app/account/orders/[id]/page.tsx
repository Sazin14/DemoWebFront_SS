import type { Metadata } from "next";
import OrderDetail from "@/components/account/OrderDetail";

export const metadata: Metadata = {
  title: "Order details",
  description: "View a sample order, delivery details and status timeline.",
};

export default async function OrderDetailPage({ params }: PageProps<"/account/orders/[id]">) {
  const { id } = await params;
  return <OrderDetail orderId={id} />;
}

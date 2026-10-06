import type { Metadata } from "next";
import CheckoutExperience from "@/components/checkout/CheckoutExperience";

export const metadata: Metadata = {
  title: "Demo checkout",
  description: "Review a sample order and experience the EcomMS demo checkout.",
};

export default function CheckoutPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-10">
      <CheckoutExperience />
    </div>
  );
}

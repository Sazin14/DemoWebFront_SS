import type { Metadata } from "next";
import AccountDashboard from "@/components/account/AccountDashboard";

export const metadata: Metadata = {
  title: "My account",
  description: "Your customer account, sample orders and demo notifications.",
};

export default function AccountPage() {
  return <AccountDashboard />;
}

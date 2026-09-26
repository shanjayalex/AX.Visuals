import type { Metadata } from "next";
import { PricingPage } from "@/components/pricing/PricingPage";

export const metadata: Metadata = {
  title: "Packages & Pricing",
  description:
    "Content packages from Rs. 25,000 — Reels and photos for businesses in Sri Lanka. Monthly content plans, restaurant and product packages, individual services and booking policies.",
};

export default async function Page(props: PageProps<"/pricing">) {
  const sp = await props.searchParams;
  return <PricingPage tab="" print={sp.print === "1"} />;
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PricingPage } from "@/components/pricing/PricingPage";
import { pricingTabs, type PricingTab } from "@/components/pricing/tabs-config";

const titles: Record<string, { title: string; description: string }> = {
  monthly: {
    title: "Monthly Content Plans",
    description: "Monthly social-media content plans from Rs. 55,000/month — planned, shot, edited and delivered every month. Islandwide, Sri Lanka.",
  },
  restaurants: {
    title: "Food & Restaurant Content",
    description: "Restaurant photography and Reels in Sri Lanka — 4 Reels + 30 food photos for Rs. 45,000.",
  },
  products: {
    title: "Product Photography + Video",
    description: "Product photography and product Reels in Sri Lanka from Rs. 20,000.",
  },
  services: {
    title: "Individual Services",
    description: "Photography, video, Reel editing, drone and add-on rates for AX.Visuals, Sri Lanka.",
  },
};

export const dynamicParams = false;

export function generateStaticParams() {
  return pricingTabs.filter((t) => t.slug).map((t) => ({ tab: t.slug }));
}

export async function generateMetadata(props: PageProps<"/pricing/[tab]">): Promise<Metadata> {
  const { tab } = await props.params;
  return titles[tab] ?? {};
}

export default async function Page(props: PageProps<"/pricing/[tab]">) {
  const { tab } = await props.params;
  if (!pricingTabs.some((t) => t.slug === tab)) notFound();
  return <PricingPage tab={tab as PricingTab} />;
}

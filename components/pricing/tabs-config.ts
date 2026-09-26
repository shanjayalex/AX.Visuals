export const pricingTabs = [
  { slug: "", label: "Content Packages" },
  { slug: "monthly", label: "Monthly Plans" },
  { slug: "restaurants", label: "Food & Restaurant" },
  { slug: "products", label: "Product" },
  { slug: "services", label: "Individual Services" },
] as const;

export type PricingTab = (typeof pricingTabs)[number]["slug"];

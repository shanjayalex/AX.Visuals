export interface Industry {
  id: string;
  name: string;
  typical: string[];
  bestFit: string[];
  /** booking prefill: category + package id */
  prefill: { category: string; pkg?: string };
  /** [EDIT] set to a real photo of your work in this industry, e.g. { src: "/media/cafe.jpg", alt: "..." } */
  preview?: { src: string; alt: string };
}

/**
 * Industries AX.Visuals creates for. Until there's real work to show for an
 * industry, the site shows a designed shot-list frame instead of a photo.
 */
export const industries: Industry[] = [
  {
    id: "restaurants",
    name: "Restaurants & Cafés",
    typical: ["Signature dishes", "Table spreads", "Kitchen BTS", "Atmosphere", "Trending Reels"],
    bestFit: ["Food & Restaurant Content", "Monthly Growth"],
    prefill: { category: "restaurant", pkg: "restaurant" },
  },
  {
    id: "hotels",
    name: "Hotels & Hospitality",
    typical: ["Rooms", "Interiors/exteriors", "Dining", "Staff", "Guest experience", "Hero campaign images"],
    bestFit: ["Premium Brand", "Full Content Day", "Monthly Premium"],
    prefill: { category: "content", pkg: "premium" },
  },
  {
    id: "products",
    name: "Products & E-commerce",
    typical: ["Studio-style product shots", "Close-ups", "Lifestyle compositions", "Product Reels"],
    bestFit: ["Product Mini", "Product Pro", "Product Campaign"],
    prefill: { category: "product", pkg: "p-pro" },
  },
  {
    id: "fashion",
    name: "Fashion & Retail",
    typical: ["Model/staff coverage", "Lifestyle", "Store atmosphere", "Campaign Reels"],
    bestFit: ["Premium Brand", "Monthly Premium"],
    prefill: { category: "content", pkg: "premium" },
  },
  {
    id: "wellness",
    name: "Salons, Gyms & Wellness",
    typical: ["Service shots", "Team content", "Before/after moments", "Social-first hooks"],
    bestFit: ["Starter Content", "Monthly Essential"],
    prefill: { category: "content", pkg: "starter" },
  },
  {
    id: "brands",
    name: "Brands & Campaigns",
    typical: ["Hero brand video", "Cinematic B-roll", "Motion graphics", "Ad-ready content"],
    bestFit: ["Full Content Day", "Product Campaign"],
    prefill: { category: "content", pkg: "fullday" },
  },
];

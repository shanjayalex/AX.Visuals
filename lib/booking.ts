import { z } from "zod";
import {
  bookingAddons,
  contentPackages,
  districts,
  monthlyPlans,
  productPackages,
  rateCard,
  restaurantPackage,
  travelZones,
  type TravelZone,
} from "@/content/pricing";
import { formatLKR } from "./format";

export const categories = [
  { id: "content", label: "Content Package", hint: "Reels + photos from one shoot" },
  { id: "monthly", label: "Monthly Plan", hint: "Fresh content every month" },
  { id: "restaurant", label: "Food & Restaurant", hint: "Dishes, atmosphere, BTS" },
  { id: "product", label: "Product Shoot", hint: "For physical products" },
  { id: "individual", label: "Individual Services", hint: "Book exactly what you need" },
  { id: "custom", label: "Custom / Not sure", hint: "Tell us the brief — we'll plan it" },
] as const;

export type CategoryId = (typeof categories)[number]["id"];

/** Everything selectable in step 2, per category, read from the pricing file. */
export interface PackageOption {
  id: string;
  name: string;
  price: number;
  from?: boolean;
  meta: string[];
  perMonth?: boolean;
  quoteOnly?: boolean;
}

export function packagesFor(category: CategoryId): PackageOption[] {
  switch (category) {
    case "content":
      return contentPackages.map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        meta: [p.shootLabel, p.reelsLabel, p.photosLabel],
      }));
    case "monthly":
      return monthlyPlans.map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        perMonth: true,
        quoteOnly: true,
        meta: [p.shoots, `${p.reels} Reels`, `${p.photos} photos`],
      }));
    case "restaurant":
      return [
        {
          id: restaurantPackage.id,
          name: restaurantPackage.name,
          price: restaurantPackage.price,
          meta: [restaurantPackage.shootLabel, "4 Reels", `${restaurantPackage.photosTotal} photos`],
        },
      ];
    case "product":
      return productPackages.map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        from: p.fromPrice,
        quoteOnly: p.quoteOnly,
        meta: [p.products + " products", p.photos, p.reels],
      }));
    default:
      return [];
  }
}

export const individualServices = rateCard.filter((r) => r.kind === "service" || r.id === "reel-basic" || r.id === "reel-premium");

/* ------------------------------------------------------------------ */
/* Schema                                                              */
/* ------------------------------------------------------------------ */

export const bookingSchema = z.object({
  category: z.enum(["content", "monthly", "restaurant", "product", "individual", "custom"]),
  packageId: z.string().optional(),
  services: z.array(z.string()).default([]),
  addons: z.record(z.string(), z.number().int().min(0).max(99)).default({}),
  district: z.string().min(1, "Choose a district"),
  venue: z.string().min(2, "Venue name please"),
  address: z.string().optional().default(""),
  setting: z.enum(["indoor", "outdoor", "both"]).default("indoor"),
  overnight: z.boolean().default(false),
  date: z.string().optional().default(""),
  time: z.string().optional().default(""),
  startMonth: z.string().optional().default(""),
  shootDays: z.string().optional().default(""),
  businessName: z.string().min(2, "Business name please"),
  industry: z.string().min(1, "Choose an industry"),
  link: z.string().optional().default(""),
  promote: z.string().min(5, "Tell us a little about what to promote"),
  moodboard: z.string().optional().default(""),
  needs: z.array(z.string()).default([]),
  name: z.string().min(2, "Your name please"),
  phone: z.string().regex(/^\+94\s?\d{2}\s?\d{3}\s?\d{4}$/, "Use the +94 format, e.g. +94 77 123 4567"),
  whatsapp: z.boolean().default(true),
  email: z.email("A valid email please"),
  source: z.string().optional().default(""),
  payment: z.enum(["payhere", "bank", "enquiry"]).default("enquiry"),
  agree: z.literal(true, { message: "Please accept the booking terms" }),
});

export type BookingInput = z.input<typeof bookingSchema>;
export type Booking = z.output<typeof bookingSchema>;

/** Fields validated at each step (1-indexed, matching the UI). */
export const stepFields: Record<number, (keyof Booking)[]> = {
  1: ["category"],
  2: ["packageId", "services"],
  3: ["addons"],
  4: ["district", "venue", "address", "setting", "overnight"],
  5: ["date", "time", "startMonth", "shootDays"],
  6: ["businessName", "industry", "link", "promote", "moodboard", "needs"],
  7: ["name", "phone", "whatsapp", "email", "source"],
  8: ["payment", "agree"],
};

/* ------------------------------------------------------------------ */
/* Estimate                                                            */
/* ------------------------------------------------------------------ */

export interface EstimateLine {
  label: string;
  amount: number | null; // null = quoted separately
  display: string;
  from?: boolean;
}

export interface Estimate {
  lines: EstimateLine[];
  total: number;
  from: boolean;
  quoted: boolean; // some part must be quoted separately
  travelZone: TravelZone | null;
  advance: number | null; // 50% for one-off packages
  requiresConsultation: boolean;
  perMonth: boolean;
}

export const zoneFor = (district?: string): TravelZone | null =>
  districts.find((d) => d.name === district)?.zone ?? null;

export function estimate(b: Partial<Booking>): Estimate {
  const lines: EstimateLine[] = [];
  let from = false;
  let quoted = false;
  let perMonth = false;
  let base = 0;
  let requiresConsultation = b.category === "custom" || b.category === "monthly";

  if (b.category && b.category !== "individual" && b.category !== "custom" && b.packageId) {
    const opt = packagesFor(b.category).find((o) => o.id === b.packageId);
    if (opt) {
      perMonth = !!opt.perMonth;
      if (opt.quoteOnly) requiresConsultation = true;
      if (opt.from) from = true;
      base += opt.price;
      lines.push({
        label: opt.name,
        amount: opt.price,
        from: opt.from,
        display: `${opt.from ? "from " : ""}${formatLKR(opt.price)}${opt.perMonth ? " / month" : ""}`,
      });
    }
  }

  if (b.category === "individual") {
    for (const id of b.services ?? []) {
      const r = rateCard.find((x) => x.id === id);
      if (!r) continue;
      if (r.open || r.max) from = true;
      base += r.min;
      lines.push({ label: r.label, amount: r.min, from: !!(r.open || r.max), display: `from ${formatLKR(r.min)}` });
    }
  }

  if (b.category === "custom") {
    quoted = true;
    lines.push({ label: "Custom brief", amount: null, display: "Quoted after consultation" });
  }

  let addonsTotal = 0;
  let expressPct = 0;
  for (const [id, qty] of Object.entries(b.addons ?? {})) {
    if (!qty) continue;
    const r = rateCard.find((x) => x.id === id);
    const a = bookingAddons.find((x) => x.rateId === id);
    if (!r || !a) continue;
    if (r.kind === "percent") {
      expressPct = r.min;
      from = true;
      continue;
    }
    const amt = r.min * qty;
    const isFrom = !!(r.open || r.max);
    if (isFrom) from = true;
    addonsTotal += amt;
    lines.push({
      label: `${a.label}${a.stepper && qty > 1 ? ` × ${qty}` : ""}`,
      amount: amt,
      from: isFrom,
      display: `${isFrom ? "from " : ""}${formatLKR(amt)}`,
    });
  }

  if (expressPct) {
    const amt = Math.round(((base + addonsTotal) * expressPct) / 100);
    lines.push({ label: "Express delivery (+25–40%)", amount: amt, from: true, display: `from ${formatLKR(amt)}` });
    addonsTotal += amt;
  }

  const travelZone = zoneFor(b.district);
  if (travelZone) {
    const z = travelZones[travelZone];
    if (z.quoted) quoted = true;
    if (z.max) from = true;
    lines.push({ label: `Travel — ${z.label}`, amount: z.quoted ? null : z.min, from: !!z.max, display: z.display });
  }
  if (b.overnight) {
    quoted = true;
    lines.push({ label: "Overnight — transport + accommodation", amount: null, display: "Quoted separately" });
  }
  if (b.needs?.length) {
    quoted = true;
    lines.push({ label: `Extras: ${b.needs.join(", ")}`, amount: null, display: "Quoted separately" });
  }

  const travelMin = travelZone ? travelZones[travelZone].min : 0;
  const total = base + addonsTotal + travelMin;
  const oneOff = !requiresConsultation && b.category !== undefined;

  return {
    lines,
    total,
    from,
    quoted,
    travelZone,
    advance: oneOff && total > 0 ? Math.round(total / 2) : null,
    requiresConsultation,
    perMonth,
  };
}

export const money = (n: number, from: boolean) => `${from ? "from " : ""}${formatLKR(n)}`;

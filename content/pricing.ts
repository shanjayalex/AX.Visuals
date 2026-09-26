/**
 * AX.VISUALS — single source of truth for every price, package, add-on,
 * travel zone and policy. The pricing pages AND the booking estimator read
 * from this file. Never hard-code a price in a component.
 */

export type Money = number; // LKR, whole rupees

export interface IncludedGroup {
  group: "Shoot" | "Production" | "Video" | "Photography";
  items: string[];
}

export interface ContentPackage {
  id: "starter" | "social" | "premium" | "fullday";
  number: string;
  name: string;
  price: Money;
  hours: number;
  shootLabel: string;
  reelsLabel: string;
  photosLabel: string;
  /** numbers used by counters (upper bound where a range is given) */
  reelsCount: number;
  photosCount: number;
  tagline: string;
  popular?: boolean;
  included: IncludedGroup[];
}

export const contentPackages: ContentPackage[] = [
  {
    id: "starter",
    number: "01",
    name: "Starter Content",
    price: 25000,
    hours: 2,
    shootLabel: "2 Hour Shoot",
    reelsLabel: "2 Reels",
    photosLabel: "15 Photos",
    reelsCount: 2,
    photosCount: 15,
    tagline: "Best for small businesses that need a quick professional content refresh.",
    included: [
      {
        group: "Shoot",
        items: [
          "Up to 2 hours",
          "1 location",
          "Professional camera setup",
          "Basic lighting setup",
          "Vertical social-media filming",
          "Professional photography",
        ],
      },
      {
        group: "Video",
        items: [
          "2 professionally edited Reels",
          "Up to 30–45 seconds each",
          "Instagram / Facebook / TikTok format",
          "Colour correction & grading",
          "Music",
          "Basic transitions",
          "Basic text/titles",
          "Logo placement if required",
        ],
      },
      {
        group: "Photography",
        items: [
          "15 professionally edited photos",
          "High-resolution delivery",
          "Social-media-ready versions",
          "Colour correction",
          "Basic retouching",
        ],
      },
    ],
  },
  {
    id: "social",
    number: "02",
    name: "Social Content",
    price: 40000,
    hours: 3,
    shootLabel: "3 Hour Shoot",
    reelsLabel: "4 Reels",
    photosLabel: "25 Photos",
    reelsCount: 4,
    photosCount: 25,
    tagline: "Enough content to post consistently for several weeks.",
    popular: true,
    included: [
      {
        group: "Shoot",
        items: [
          "Up to 3 hours",
          "1 location",
          "Professional camera setup",
          "Professional lighting",
          "Creative shot planning",
          "Product/service shots",
          "Lifestyle/atmosphere shots",
          "Staff/team content where applicable",
        ],
      },
      {
        group: "Video",
        items: [
          "4 professionally edited Reels",
          "30–60 seconds each",
          "Combination of cinematic + social-first content",
          "Colour grading",
          "Sound design",
          "Licensed/appropriate music",
          "Smooth transitions",
          "Animated text",
          "Logo/branding",
          "Basic subtitles where required",
        ],
      },
      {
        group: "Photography",
        items: [
          "25 professionally edited photos",
          "Product/service photography",
          "Detail shots",
          "Lifestyle shots",
          "Team/environment photographs",
          "High-resolution + social-media versions",
        ],
      },
    ],
  },
  {
    id: "premium",
    number: "03",
    name: "Premium Brand",
    price: 60000,
    hours: 5,
    shootLabel: "5 Hour Shoot",
    reelsLabel: "6 Reels",
    photosLabel: "40 Photos",
    reelsCount: 6,
    photosCount: 40,
    tagline: "For established businesses that need a larger professional content library.",
    included: [
      {
        group: "Shoot",
        items: [
          "Up to 5 hours",
          "1–2 nearby locations",
          "Pre-shoot content planning",
          "Shot list",
          "Professional camera & lighting",
          "Cinematic B-roll",
          "Product/service coverage",
          "Staff/model coverage",
          "Interior/exterior shots",
          "Brand atmosphere footage",
        ],
      },
      {
        group: "Video",
        items: [
          "6 professionally edited Reels",
          "30–60 seconds each",
          "1 hero brand Reel",
          "Advanced colour grading",
          "Sound design",
          "Creative transitions",
          "Motion text",
          "Logo animations",
          "Subtitles where appropriate",
        ],
      },
      {
        group: "Photography",
        items: [
          "40 professionally edited photographs",
          "Hero images",
          "Product/service images",
          "Lifestyle images",
          "Staff/team photographs",
          "Interior/exterior images",
          "Detail shots",
        ],
      },
    ],
  },
  {
    id: "fullday",
    number: "04",
    name: "Full Content Day",
    price: 85000,
    hours: 8,
    shootLabel: "8 Hour Shoot",
    reelsLabel: "8–10 Reels",
    photosLabel: "Up to 60 Photos",
    reelsCount: 10,
    photosCount: 60,
    tagline: "A large amount of content in one production day.",
    included: [
      {
        group: "Production",
        items: [
          "Up to 8 hours",
          "Pre-production consultation",
          "Content planning",
          "Creative direction",
          "Detailed shot list",
          "Professional camera setup",
          "Professional lighting",
          "Multiple scenes/setups",
          "Up to 2 nearby locations",
        ],
      },
      {
        group: "Video",
        items: [
          "8–10 professionally edited Reels",
          "30–60 seconds each",
          "1 premium hero/brand video",
          "Cinematic B-roll",
          "Social-first hooks",
          "Professional colour grading",
          "Sound design",
          "Music",
          "Motion graphics",
          "Text animations",
          "Logo integration",
          "Subtitles where required",
        ],
      },
      {
        group: "Photography",
        items: [
          "Up to 60 professionally edited images",
          "Product photography",
          "Lifestyle photography",
          "Team/staff photography",
          "Environment/interior photography",
          "Hero campaign images",
          "Detail shots",
          "High-resolution exports",
          "Social-media exports",
        ],
      },
    ],
  },
];

/** Comparison table — every cell is taken from the inclusion lists above. `null` renders as "—". */
export const comparisonRows: { label: string; cells: [string | null, string | null, string | null, string | null] }[] = [
  { label: "Price", cells: ["Rs. 25,000", "Rs. 40,000", "Rs. 60,000", "Rs. 85,000"] },
  { label: "Shoot time", cells: ["Up to 2 hours", "Up to 3 hours", "Up to 5 hours", "Up to 8 hours"] },
  { label: "Locations", cells: ["1", "1", "1–2 nearby", "Up to 2 nearby"] },
  { label: "Reels", cells: ["2 × 30–45s", "4 × 30–60s", "6 × 30–60s", "8–10 × 30–60s"] },
  { label: "Hero brand video", cells: [null, null, "1 hero brand Reel", "1 premium hero/brand video"] },
  { label: "Photos", cells: ["15", "25", "40", "Up to 60"] },
  { label: "Lighting", cells: ["Basic", "Professional", "Professional", "Professional"] },
  { label: "Colour", cells: ["Correction & grading", "Grading", "Advanced grading", "Professional grading"] },
  { label: "Content planning / shot list", cells: [null, "Creative shot planning", "Pre-shoot planning + shot list", "Content planning + detailed shot list"] },
  { label: "Creative direction", cells: [null, null, null, "✓"] },
  { label: "Pre-production consultation", cells: [null, null, null, "✓"] },
  { label: "Sound design", cells: [null, "✓", "✓", "✓"] },
  { label: "Motion text / graphics", cells: ["Basic text/titles", "Animated text", "Motion text", "Motion graphics + text animations"] },
  { label: "Logo", cells: ["Placement if required", "Logo/branding", "Logo animations", "Logo integration"] },
  { label: "Subtitles", cells: [null, "Basic, where required", "Where appropriate", "Where required"] },
  { label: "Retouching", cells: ["Basic", null, null, null] },
];

export interface MonthlyPlan {
  id: "m-essential" | "m-growth" | "m-premium";
  name: string;
  price: Money;
  shoots: string;
  reels: number;
  photos: number;
  includes: string[];
  idealFor: string;
  badge?: string;
}

export const monthlyPlans: MonthlyPlan[] = [
  {
    id: "m-essential",
    name: "Monthly Essential",
    price: 55000,
    shoots: "1 shoot every month (up to 3 hrs)",
    reels: 5,
    photos: 30,
    includes: ["Content planning", "Editing", "Colour grading", "Text/subtitles", "Social-media-ready delivery"],
    idealFor: "Smaller restaurants, salons, gyms, cafés and retail businesses",
  },
  {
    id: "m-growth",
    name: "Monthly Growth",
    price: 85000,
    shoots: "2 shoots every month (around 3 hrs each)",
    reels: 8,
    photos: 50,
    includes: [
      "2 content shoots",
      "Monthly content planning",
      "Creative direction",
      "Professional editing",
      "Colour grading",
      "Sound design",
      "Text/subtitles",
      "Social-ready exports",
    ],
    idealFor: "Restaurants and businesses posting several times a week",
    badge: "Best for restaurants",
  },
  {
    id: "m-premium",
    name: "Monthly Premium",
    price: 125000,
    shoots: "2 larger shoots every month",
    reels: 12,
    photos: 70,
    includes: [
      "2 professional shoots",
      "Hero campaign content",
      "Product/service content",
      "Staff/lifestyle content",
      "Creative concepts",
      "Content planning",
      "Advanced editing",
      "Colour grading",
      "Motion graphics",
      "Sound design",
      "Priority editing",
    ],
    idealFor:
      "Hotels, restaurants, fashion brands, larger retail businesses and businesses running paid advertising",
  },
];

export const restaurantPackage = {
  id: "restaurant" as const,
  name: "Food & Restaurant Content",
  price: 45000 as Money,
  shootLabel: "3–4 hour shoot",
  hours: 4,
  photosTotal: 30,
  photoSplit: [
    { label: "Individual dish photos", count: 15 },
    { label: "Table-spread photos", count: 5 },
    { label: "Atmosphere/interior photos", count: 5 },
    { label: "Staff/lifestyle photos", count: 5 },
  ],
  reels: [
    { n: "01", name: "Signature Dish", steps: ["Ingredient", "Cooking", "Plating", "Finished dish"] },
    { n: "02", name: "Restaurant Experience", steps: ["Entrance", "Atmosphere", "Drinks", "Food", "Customers"] },
    { n: "03", name: "Behind the Scenes", steps: ["Chef", "Kitchen", "Preparation"] },
    { n: "04", name: "Social / Trending Reel", steps: ["Fast-paced", "Entertaining", "Made for IG/TikTok"] },
  ],
  included: ["Professional editing", "Colour grading", "Sound design", "Music", "Text", "Logo"],
};

export interface ProductPackage {
  id: "p-mini" | "p-pro" | "p-campaign";
  name: string;
  price: Money;
  fromPrice?: boolean;
  products: string;
  photos: string;
  reels: string;
  includes: string[];
  quoteOnly?: boolean;
}

export const productPackages: ProductPackage[] = [
  {
    id: "p-mini",
    name: "Product Mini",
    price: 20000,
    products: "Up to 5",
    photos: "15 edited product photographs",
    reels: "2 product Reels",
    includes: ["Studio-style lighting", "Simple background/setup", "Basic retouching"],
  },
  {
    id: "p-pro",
    name: "Product Pro",
    price: 35000,
    products: "Up to 10",
    photos: "30 edited photographs",
    reels: "4 Reels",
    includes: ["Product close-ups", "Lifestyle compositions", "Creative lighting", "Advanced retouching", "Colour grading"],
  },
  {
    id: "p-campaign",
    name: "Product Campaign",
    price: 60000,
    fromPrice: true,
    quoteOnly: true,
    products: "Custom creative production",
    photos: "Hero + lifestyle photography",
    reels: "5–6 videos",
    includes: [
      "Campaign concept",
      "Art direction",
      "Multiple setups",
      "Hero photography",
      "Lifestyle photography",
      "Advanced editing",
      "Motion graphics where required",
    ],
  },
];

/** Individual services / rate card. `min`/`max` in LKR. `open` = the "+" (starting rate). */
export interface RateItem {
  id: string;
  label: string;
  min: Money;
  max?: Money;
  open?: boolean;
  unit?: string;
  /** "service" rows can be booked on their own in step 2; "addon" rows appear in step 3 */
  kind: "service" | "addon" | "percent";
  display: string;
}

export const rateCard: RateItem[] = [
  { id: "photo-1h", label: "Photography only – 1 hour", min: 12000, open: true, kind: "service", display: "Rs. 12,000+" },
  { id: "photo-2h", label: "Photography only – 2 hours", min: 20000, open: true, kind: "service", display: "Rs. 20,000+" },
  { id: "video-2h", label: "Video shoot only – 2 hours", min: 20000, open: true, kind: "service", display: "Rs. 20,000+" },
  { id: "vp-2h", label: "Video + Photo – 2 hours", min: 25000, open: true, kind: "service", display: "Rs. 25,000+" },
  { id: "extra-hour", label: "Additional shooting hour", min: 5000, unit: "hr", kind: "addon", display: "Rs. 5,000" },
  { id: "reel-basic", label: "Basic Reel editing", min: 4000, open: true, unit: "Reel", kind: "addon", display: "Rs. 4,000+" },
  { id: "reel-premium", label: "Premium Reel editing", min: 6000, max: 8000, open: true, unit: "Reel", kind: "addon", display: "Rs. 6,000–8,000+" },
  { id: "extra-photo", label: "Additional edited photo", min: 500, open: true, unit: "photo", kind: "addon", display: "Rs. 500+" },
  { id: "drone", label: "Drone add-on", min: 10000, max: 20000, open: true, kind: "addon", display: "Rs. 10,000–20,000+" },
  { id: "motion", label: "Motion graphics", min: 5000, open: true, kind: "addon", display: "Rs. 5,000+" },
  { id: "extra-location", label: "Additional location", min: 5000, open: true, unit: "location", kind: "addon", display: "Rs. 5,000+" },
  { id: "raw", label: "Raw footage handover", min: 5000, max: 10000, open: true, kind: "addon", display: "Rs. 5,000–10,000+" },
  { id: "express", label: "Express delivery", min: 25, max: 40, kind: "percent", display: "+25–40%" },
];

/** Add-ons shown in the booking flow (step 3), each pointing at a rate-card row. */
export const bookingAddons: { rateId: string; label: string; stepper: boolean; hint: string }[] = [
  { rateId: "extra-hour", label: "Additional shooting hour", stepper: true, hint: "Rs. 5,000 / hr" },
  { rateId: "extra-location", label: "Additional location", stepper: true, hint: "Rs. 5,000+ each" },
  { rateId: "drone", label: "Drone", stepper: false, hint: "from Rs. 10,000" },
  { rateId: "motion", label: "Motion graphics", stepper: false, hint: "from Rs. 5,000" },
  { rateId: "extra-photo", label: "Additional edited photos", stepper: true, hint: "Rs. 500+ each" },
  { rateId: "reel-basic", label: "Extra Reel edit — Basic", stepper: true, hint: "Rs. 4,000+ each" },
  { rateId: "reel-premium", label: "Extra Reel edit — Premium", stepper: true, hint: "Rs. 6,000+ each" },
  { rateId: "raw", label: "Raw footage handover", stepper: false, hint: "from Rs. 5,000" },
  { rateId: "express", label: "Express delivery", stepper: false, hint: "from +25%" },
];

/* ------------------------------------------------------------------ */
/* Travel                                                              */
/* ------------------------------------------------------------------ */

export type TravelZone = "local" | "nearby" | "long";

export const travelZones: Record<TravelZone, { label: string; display: string; min: Money; max?: Money; quoted?: boolean }> = {
  local: { label: "Local area", display: "Included", min: 0 },
  nearby: { label: "Nearby districts", display: "Rs. 3,000–5,000", min: 3000, max: 5000 },
  long: { label: "Long-distance", display: "Quoted based on location", min: 0, quoted: true },
};

/**
 * [EDIT] Assign every district to a zone. The studio's work (Nallur, Tamil
 * ceremonies) suggests a Jaffna base — change `local` if that's wrong.
 * `x`/`y` place each district on the tile map (rough geography, north at top).
 */
export const districts: { name: string; province: string; zone: TravelZone; x: number; y: number }[] = [
  { name: "Jaffna", province: "Northern", zone: "local", x: 2, y: 0 },
  { name: "Kilinochchi", province: "Northern", zone: "nearby", x: 3, y: 1 },
  { name: "Mullaitivu", province: "Northern", zone: "nearby", x: 4, y: 2 },
  { name: "Mannar", province: "Northern", zone: "nearby", x: 2, y: 2 },
  { name: "Vavuniya", province: "Northern", zone: "nearby", x: 3, y: 3 },
  { name: "Trincomalee", province: "Eastern", zone: "long", x: 5, y: 4 },
  { name: "Anuradhapura", province: "North Central", zone: "long", x: 3, y: 4 },
  { name: "Puttalam", province: "North Western", zone: "long", x: 2, y: 5 },
  { name: "Polonnaruwa", province: "North Central", zone: "long", x: 4, y: 5 },
  { name: "Batticaloa", province: "Eastern", zone: "long", x: 5, y: 6 },
  { name: "Kurunegala", province: "North Western", zone: "long", x: 2, y: 6 },
  { name: "Matale", province: "Central", zone: "long", x: 3, y: 6 },
  { name: "Ampara", province: "Eastern", zone: "long", x: 5, y: 7 },
  { name: "Gampaha", province: "Western", zone: "long", x: 1, y: 7 },
  { name: "Kandy", province: "Central", zone: "long", x: 3, y: 7 },
  { name: "Kegalle", province: "Sabaragamuwa", zone: "long", x: 2, y: 7 },
  { name: "Badulla", province: "Uva", zone: "long", x: 4, y: 7 },
  { name: "Colombo", province: "Western", zone: "long", x: 1, y: 8 },
  { name: "Nuwara Eliya", province: "Central", zone: "long", x: 3, y: 8 },
  { name: "Monaragala", province: "Uva", zone: "long", x: 4, y: 8 },
  { name: "Kalutara", province: "Western", zone: "long", x: 1, y: 9 },
  { name: "Ratnapura", province: "Sabaragamuwa", zone: "long", x: 2, y: 9 },
  { name: "Galle", province: "Southern", zone: "long", x: 2, y: 10 },
  { name: "Matara", province: "Southern", zone: "long", x: 3, y: 10 },
  { name: "Hambantota", province: "Southern", zone: "long", x: 4, y: 9 },
];

/* ------------------------------------------------------------------ */
/* Policies                                                            */
/* ------------------------------------------------------------------ */

export interface Policy {
  id: string;
  icon: "travel" | "exclude" | "revise" | "clock" | "wallet" | "shield";
  title: string;
  summary: string;
  details: string[];
}

export const policies: Policy[] = [
  {
    id: "travel",
    icon: "travel",
    title: "Travel charges",
    summary: "Available islandwide. Travel charges may apply depending on location.",
    details: [
      "Local area: Included [EDIT: define your local area, e.g. \"within X km of <city>\"]",
      "Nearby districts: Rs. 3,000–5,000",
      "Long-distance: Quoted based on location",
      "Overnight shoots: Transport + accommodation charged separately",
    ],
  },
  {
    id: "exclusions",
    icon: "exclude",
    title: "Not included unless specified",
    summary: "Talent, stylists, props, studio/location hire and permits are quoted separately.",
    details: [
      "Model/talent fees, makeup artists, food stylists, specialised props, studio hire, location hire, permits, accommodation and significant transportation costs.",
      "These are quoted separately.",
    ],
  },
  {
    id: "revisions",
    icon: "revise",
    title: "Revisions",
    summary: "2 rounds of reasonable revisions per video.",
    details: ["2 rounds of reasonable revisions per video.", "Additional revisions cost Rs. 1,500–3,000 each, depending on the work."],
  },
  {
    id: "delivery",
    icon: "clock",
    title: "Delivery time",
    summary: "Photos 3–5 working days · Reels 5–7 · Large productions 7–14.",
    details: [
      "Photos: 3–5 working days",
      "Reels: 5–7 working days",
      "Large productions: 7–14 working days",
      "Express delivery is available at an additional cost (+25–40%).",
    ],
  },
  {
    id: "payment",
    icon: "wallet",
    title: "Payment terms",
    summary: "50% advance confirms your booking.",
    details: [
      "One-off shoots: 50% advance to confirm the booking, and 50% before final delivery.",
      "Larger productions: 50% booking deposit → 25% after the shoot → 25% before final delivery.",
      "Monthly plans: payment at the beginning of each monthly content cycle.",
    ],
  },
  {
    id: "usage",
    icon: "shield",
    title: "Usage rights",
    summary: "Organic use on your own social media and website is included.",
    details: [
      "Package prices include organic use on the client's own social media and website.",
      "Content for major paid advertising campaigns, TV, billboards, third-party licensing or large commercial campaigns is quoted separately.",
    ],
  },
];

export const deliveryTimes = [
  { label: "Photos", min: 3, max: 5 },
  { label: "Reels", min: 5, max: 7 },
  { label: "Large productions", min: 7, max: 14 },
];

export const serviceStrip = ["Professional Video", "Photography", "Editing", "Colour Grading", "Creative Direction"];

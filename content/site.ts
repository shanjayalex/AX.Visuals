/**
 * Studio details. Everything marked [EDIT] must be replaced with real
 * information before launch — search this file for "EDIT".
 */
/**
 * Public base URL. Uses NEXT_PUBLIC_SITE_URL when it's a valid URL; otherwise
 * Vercel's production domain; otherwise a local fallback. An empty or malformed
 * value never breaks the build.
 */
function siteUrl() {
  const candidates = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`,
    process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`,
  ];
  for (const c of candidates) {
    const v = c?.trim();
    if (!v) continue;
    try {
      return new URL(v.startsWith("http") ? v : `https://${v}`).origin;
    } catch {}
  }
  return "http://localhost:3000";
}

export const site = {
  name: "AX.Visuals",
  tagline: "We create content for businesses.",
  url: siteUrl(),
  description:
    "AX.Visuals is a video and photography studio in Sri Lanka creating ready-to-post Reels, photos and brand films for restaurants, hotels, products and brands. Available islandwide.",
  city: "Jaffna", // [EDIT] home city — inferred from the Nallur work, please confirm
  whatsapp: "94764015423", // digits only, country code first (used for wa.me links)
  phoneDisplay: "+94 76 401 5423",
  email: "shanjayalex19@gmail.com",
  hours: "Mon – Sat · 9:00 – 19:00", // [EDIT]
  responseTime: "We reply within a few hours on WhatsApp.", // [EDIT]
  address: "Jaffna, Sri Lanka", // [EDIT] studio base
  mapQuery: "Jaffna, Sri Lanka", // [EDIT] used for the embedded map
  socials: [
    { label: "Instagram", href: "https://instagram.com/" }, // [EDIT]
    { label: "TikTok", href: "https://tiktok.com/" }, // [EDIT]
    { label: "Facebook", href: "https://facebook.com/" }, // [EDIT]
    { label: "YouTube", href: "https://www.youtube.com/@Views_kodounka_bro" }, // [EDIT] confirm this is the studio channel
  ],
  bank: {
    // [EDIT] shown on the booking review step when "bank transfer" is chosen
    accountName: "AX Visuals",
    bank: "[EDIT] Bank name",
    branch: "[EDIT] Branch",
    accountNumber: "[EDIT] 0000 0000 0000",
  },
  showreelYouTubeId: "qznZf6IQ1pM",
};

/** Credibility stats. Only true, verifiable numbers. [EDIT] add client counts once you have them. */
export const stats: { value: number; suffix?: string; label: string }[] = [
  { value: 25, label: "Districts we travel to" },
  { value: 4, label: "Content packages" },
  { value: 30, label: "Photos in the restaurant package" },
  { value: 2, label: "Revision rounds per video" },
  // { value: 0, suffix: "+", label: "Businesses served" },  // [EDIT]
  // { value: 0, suffix: "+", label: "Reels delivered" },    // [EDIT]
];

/** Real client reviews only — with the client's permission. Leave empty until you have them. */
export const testimonials: { quote: string; name: string; business: string; timecode: string }[] = [];

export const faqs: { q: string; a: string }[] = [
  {
    q: "What am I actually getting?",
    a: "A ready-to-post content library: professionally edited Reels plus edited photos, sized for Instagram, Facebook and TikTok, with high-resolution versions for your website.",
  },
  {
    q: "How much is the advance?",
    a: "50% confirms your booking, and the remaining 50% is due before final delivery. Larger productions pay 50% / 25% / 25%. Monthly plans are paid at the start of each cycle.",
  },
  {
    q: "Do you travel?",
    a: "Yes, islandwide. The local area is included, nearby districts cost Rs. 3,000–5,000, long-distance shoots are quoted by location, and overnight shoots add transport and accommodation.",
  },
  {
    q: "How long does delivery take?",
    a: "Photos take 3–5 working days, Reels 5–7 working days, and large productions 7–14 working days. Express delivery is available (+25–40%).",
  },
  {
    q: "How many revisions are included?",
    a: "2 rounds of reasonable revisions per video. Extra revisions cost Rs. 1,500–3,000 each.",
  },
  {
    q: "Are models, props or locations included?",
    a: "No, unless specified. Talent, makeup, food stylists, specialised props, studio/location hire and permits are quoted separately.",
  },
  {
    q: "Can I use the content in paid ads?",
    a: "Package prices cover organic use on your own social media and website. Major paid campaigns, TV, billboards and licensing are quoted separately.",
  },
  { q: "Can I get the raw footage?", a: "Yes. Raw footage handover starts from Rs. 5,000." },
  {
    q: "One-off shoot or monthly plan?",
    a: "If you post several times a week, a monthly plan gives you a steady flow of fresh content and planned shoots every month.",
  },
  // [EDIT] Can I reschedule? What happens if it rains on an outdoor shoot?
];

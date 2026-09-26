import type { Metadata, Viewport } from "next";
import { Syne, Manrope, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { MotionProvider } from "@/components/providers/MotionProvider";
import { Grain } from "@/components/motion/Grain";
import { Cursor } from "@/components/motion/Cursor";
import { Preloader } from "@/components/motion/Preloader";
import { PageTransition } from "@/components/motion/PageTransition";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFab } from "@/components/layout/WhatsAppFab";
import { site } from "@/content/site";
import { contentPackages, monthlyPlans, productPackages, restaurantPackage } from "@/content/pricing";

const syne = Syne({ variable: "--font-syne", subsets: ["latin"], weight: ["600", "700", "800"] });
const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"] });
const jetbrains = JetBrains_Mono({ variable: "--font-jetbrains", subsets: ["latin"], weight: ["400", "500"] });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "AX.Visuals — We create content for businesses · Sri Lanka",
    template: "%s · AX.Visuals",
  },
  description: site.description,
  keywords: [
    "social media content creation Sri Lanka",
    "restaurant photography Sri Lanka",
    "product photography Sri Lanka",
    `videographer ${site.city}`,
    `content creator for businesses ${site.city}`,
    "Reels production Sri Lanka",
  ],
  openGraph: {
    type: "website",
    locale: "en_LK",
    siteName: "AX.Visuals",
    title: "AX.Visuals — We create content for businesses",
    description: site.description,
  },
  twitter: { card: "summary_large_image" },
  icons: { icon: "/brand/ax-logo.png" },
};

export const viewport: Viewport = {
  themeColor: "#0A0A0B",
  colorScheme: "dark",
};

const offers = [
  ...contentPackages.map((p) => ({ name: p.name, price: p.price, desc: `${p.shootLabel} · ${p.reelsLabel} · ${p.photosLabel}` })),
  ...monthlyPlans.map((p) => ({ name: p.name, price: p.price, desc: `${p.reels} Reels + ${p.photos} photos per month` })),
  { name: restaurantPackage.name, price: restaurantPackage.price, desc: "4 Reels + 30 food photos" },
  ...productPackages.map((p) => ({ name: p.name, price: p.price, desc: `${p.photos} · ${p.reels}` })),
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LocalBusiness",
      "@id": `${site.url}/#business`,
      name: "AX.Visuals",
      description: site.description,
      url: site.url,
      telephone: site.phoneDisplay,
      email: site.email,
      image: `${site.url}/brand/ax-logo.png`,
      address: { "@type": "PostalAddress", addressLocality: site.city, addressCountry: "LK" },
      areaServed: { "@type": "Country", name: "Sri Lanka" },
      priceRange: "Rs. 12,000 – Rs. 125,000",
      sameAs: site.socials.map((s) => s.href),
    },
    {
      "@type": "Service",
      serviceType: "Social media video and photography content",
      provider: { "@id": `${site.url}/#business` },
      areaServed: { "@type": "Country", name: "Sri Lanka" },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Content packages",
        itemListElement: offers.map((o) => ({
          "@type": "Offer",
          name: o.name,
          description: o.desc,
          price: o.price,
          priceCurrency: "LKR",
        })),
      },
    },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${syne.variable} ${manrope.variable} ${jetbrains.variable}`}>
      <body className="min-h-dvh bg-ink text-paper antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[300] focus:rounded focus:bg-paper focus:px-4 focus:py-2 focus:text-ink">
          Skip to content
        </a>
        <MotionProvider>
          <Preloader />
          <Nav />
          <main id="main">{children}</main>
          <Footer />
          <WhatsAppFab />
          <PageTransition />
          <Cursor />
          <Grain />
        </MotionProvider>
      </body>
    </html>
  );
}

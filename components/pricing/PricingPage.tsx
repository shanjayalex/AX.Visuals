import Link from "next/link";
import { contentPackages } from "@/content/pricing";
import { SectionLabel } from "@/components/motion/primitives";
import { ContentTab, MonthlyTab, PricingPanel, PricingTabBar, ProductTab, RestaurantTab, ServicesTab } from "./Tabs";
import type { PricingTab } from "./tabs-config";
import { FAQSection, PoliciesSection } from "./Policies";
import { PrintButton } from "./PrintButton";

export function PricingPage({ tab, print = false }: { tab: PricingTab; print?: boolean }) {
  if (print) return <Brochure />;
  return (
    <div className="wrap pb-28 pt-36">
      <SectionLabel n="$">Packages &amp; pricing</SectionLabel>
      <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
        <h1 className="display text-[clamp(2.05rem,8vw,8rem)]">
          Content, <span className="text-mute">priced</span>
          <br /> like a product.
        </h1>
        <div className="flex flex-col items-start gap-3 sm:items-end">
          <p className="max-w-sm text-paper/80 sm:text-right">
            Every package is a ready-to-post content library — Reels and photos your business can market with for weeks.
          </p>
          <Link href="/pricing?print=1" data-no-transition className="hud text-mute underline-offset-4 hover:text-paper hover:underline">
            ⎙ Printable brochure (PDF)
          </Link>
        </div>
      </div>
      <div className="mt-12">
        <PricingTabBar active={tab} />
        <PricingPanel tab={tab} />
      </div>
      <PoliciesSection />
      <FAQSection />
    </div>
  );
}

function Brochure() {
  return (
    <div className="theme-print min-h-screen bg-ink text-paper">
      <div className="wrap max-w-[1200px] pb-20 pt-28">
        <div className="flex items-center justify-between gap-4 no-print">
          <Link href="/pricing" className="btn-ghost">
            ← Back to pricing
          </Link>
          <PrintButton />
        </div>
        {/* Page 1 — simple 4-card overview */}
        <header className="mt-10 border-b border-line pb-8">
          <p className="hud text-mute">AX.VISUALS · CONTENT PACKAGES · SRI LANKA</p>
          <h1 className="display mt-4 text-[clamp(2.05rem,6vw,5rem)]">We create content for businesses.</h1>
        </header>
        <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4 print:grid-cols-4">
          {contentPackages.map((p) => (
            <div key={p.id} className="rounded-2xl border border-line p-5">
              <p className="hud text-mute">
                {p.number} {p.popular && "· ⭐ MOST POPULAR"}
              </p>
              <p className="display mt-3 text-2xl">{p.name}</p>
              <p className="mt-3 font-display text-2xl font-extrabold">Rs. {p.price.toLocaleString("en-US")}</p>
              <ul className="mt-3 space-y-1 text-sm">
                <li>{p.shootLabel}</li>
                <li>{p.reelsLabel}</li>
                <li>{p.photosLabel}</li>
              </ul>
              <p className="mt-3 text-xs text-mute">{p.tagline}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-center text-sm">Professional Video • Photography • Editing • Colour Grading • Creative Direction</p>
        <p className="hud mt-1 text-center text-mute">Available Islandwide 🇱🇰 · Travel charges may apply.</p>

        {/* Full details */}
        <section className="print-break mt-16">
          <h2 className="display text-3xl">Everything included</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {contentPackages.map((p) => (
              <div key={p.id} className="rounded-2xl border border-line p-5">
                <p className="font-display text-xl font-extrabold uppercase">
                  {p.number} — {p.name} — Rs. {p.price.toLocaleString("en-US")}
                </p>
                {p.included.map((g) => (
                  <p key={g.group} className="mt-3 text-sm">
                    <strong>{g.group}:</strong> {g.items.join(" · ")}
                  </p>
                ))}
              </div>
            ))}
          </div>
          <ContentTab print />
        </section>
        <section className="print-break mt-16">
          <h2 className="display text-3xl">Monthly content plans</h2>
          <MonthlyTab />
        </section>
        <section className="print-break mt-16">
          <h2 className="display text-3xl">Food &amp; restaurant</h2>
          <RestaurantTab />
        </section>
        <section className="print-break mt-16">
          <h2 className="display text-3xl">Product photography + video</h2>
          <ProductTab />
        </section>
        <section className="print-break mt-16">
          <h2 className="display text-3xl">Individual services</h2>
          <ServicesTab />
        </section>
        <div className="print-break">
          <PoliciesSection print />
        </div>
      </div>
    </div>
  );
}

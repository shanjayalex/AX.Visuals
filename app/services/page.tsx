import type { Metadata } from "next";
import Link from "next/link";
import { industries } from "@/content/industries";
import { rateCard } from "@/content/pricing";
import { SectionLabel, SplitReveal } from "@/components/motion/primitives";
import { IndustryFrame } from "@/components/work/IndustryFrame";

export const metadata: Metadata = {
  title: "Services — What we create",
  description:
    "Content for restaurants, hotels, products, fashion, salons, gyms and brands in Sri Lanka — Reels, photography, brand films and drone. Find the package that fits your business.",
};

export default function ServicesPage() {
  const drone = rateCard.find((r) => r.id === "drone")!;
  return (
    <div className="pb-28 pt-36">
      <div className="wrap">
        <SectionLabel n="◉">Services</SectionLabel>
        <SplitReveal as="h1" immediate by="words" className="display mt-6 text-[clamp(2.05rem,9vw,9rem)]">
          What we create.
        </SplitReveal>
        <p className="mt-4 max-w-xl text-paper/80">Every industry posts differently. Here&apos;s what we typically shoot for each — and the package that fits best.</p>
      </div>

      <div className="mt-14 space-y-20 md:mt-20 md:space-y-28">
        {industries.map((ind, i) => (
          <section key={ind.id} id={ind.id} className="wrap scroll-mt-28" aria-labelledby={`${ind.id}-h`}>
            <div className={`grid items-center gap-10 lg:grid-cols-2 ${i % 2 ? "lg:[&>*:first-child]:order-2" : ""}`}>
              <IndustryFrame industry={ind} className="aspect-[4/3] rounded-2xl sm:aspect-[4/5] lg:aspect-[5/6]" />
              <div>
                <p className="hud text-mute">{String(i + 1).padStart(2, "0")} / {String(industries.length).padStart(2, "0")}</p>
                <h2 id={`${ind.id}-h`} className="display mt-4 text-[clamp(2.05rem,5vw,4.8rem)]">
                  {ind.name}
                </h2>
                <p className="hud mt-8 text-paper">Typical content</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {ind.typical.map((t) => (
                    <li key={t} className="rounded-full border border-line px-3 py-1.5 text-sm">
                      {t}
                    </li>
                  ))}
                </ul>
                <p className="hud mt-8 text-paper">Best-fit packages</p>
                <ul className="mt-3 space-y-1">
                  {ind.bestFit.map((b) => (
                    <li key={b} className="font-display text-base font-bold uppercase sm:text-xl">
                      → {b}
                    </li>
                  ))}
                </ul>
                <div className="mt-10 flex flex-wrap gap-3">
                  <Link href={`/booking?category=${ind.prefill.category}${ind.prefill.pkg ? `&package=${ind.prefill.pkg}` : ""}`} className="btn-rec" data-cursor="book">
                    Book this
                  </Link>
                  <Link href="/pricing" className="btn-ghost">
                    See pricing
                  </Link>
                </div>
              </div>
            </div>
          </section>
        ))}

        <section id="drone" className="wrap" aria-labelledby="drone-h">
          <div className="rounded-[22px] border border-line bg-ink-2 p-8 md:p-14">
            <p className="hud text-mute">Add-on</p>
            <h2 id="drone-h" className="display mt-4 text-[clamp(2.05rem,5vw,4.8rem)]">
              Drone / aerial
            </h2>
            <p className="mt-4 max-w-xl text-paper/80">
              Establishing shots of your venue, hotel grounds or event from above. Add to any package. Flights are subject to location, weather and permissions.
              {/* [EDIT] confirm drone licensing and permits */}
            </p>
            <p className="mt-6 font-display text-4xl font-extrabold">{drone.display}</p>
            <Link href="/booking" className="btn-ghost mt-8">
              Add drone to a booking →
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

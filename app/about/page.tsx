import type { Metadata } from "next";
import { SectionLabel, SplitReveal } from "@/components/motion/primitives";
import { AboutTimeline, CrewCards, GearLocker } from "@/components/about/About";
import { AxelClay } from "@/components/clay/Axel";

export const metadata: Metadata = {
  title: "About",
  description: "AX.Visuals is a Sri Lankan video and photography studio. We create content for businesses — planned, shot, edited and delivered.",
};

export default function AboutPage() {
  return (
    <div className="pb-28 pt-36">
      <div className="wrap">
        <SectionLabel n="AX">About the studio</SectionLabel>
        <SplitReveal as="h1" immediate by="words" className="display mt-6 max-w-[16ch] text-[clamp(2.05rem,9vw,9rem)]">
          We create content for businesses.
        </SplitReveal>
        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-paper/85">
          We don&apos;t sell hours of camera time. We sell a ready-to-post content library — professionally edited Reels and photos a business can market with for weeks.
          Everything is planned, shot, cut and graded in-house, and we travel islandwide.
        </p>
      </div>

      <AboutTimeline />
      <CrewCards />
      <GearLocker />

      <section className="wrap mt-28" aria-labelledby="bts-h">
        <SectionLabel n="◍">Claymation BTS</SectionLabel>
        <h2 id="bts-h" className="display mt-5 text-[clamp(2rem,4vw,3.6rem)]">
          Meet Axel.
        </h2>
        <p className="mt-3 max-w-lg text-mute">Our very small cinematographer. Focus-puller, light-meter enthusiast, occasionally defeated by a single reel of film.</p>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {(["focus", "thumbs", "tangled"] as const).map((p, i) => (
            <figure key={p} className="overflow-hidden rounded-2xl border border-line">
              <div className="aspect-[4/3]">
                <AxelClay pose={p} />
              </div>
              <figcaption className="hud p-4 text-mute">
                BTS 0{i + 1} · {["Pulling focus", "Booking confirmed", "Delivery week"][i]}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
    </div>
  );
}

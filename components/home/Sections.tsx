"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Reveal, SectionLabel, ShutterImage, SplitReveal, RollingNumber } from "@/components/motion/primitives";
import { useMotion } from "@/components/providers/MotionProvider";
import { ContentPackageCard, MonthlyPlanCard, ServiceStrip } from "@/components/pricing/cards";
import { contentPackages, monthlyPlans, restaurantPackage } from "@/content/pricing";
import { featuredSlugs, projects, workCategories, ytThumb } from "@/content/work";
import { cn } from "@/lib/format";

/* ------------------------------------------------------------------ */
/* F. Featured work                                                    */
/* ------------------------------------------------------------------ */
const layout = [
  "md:col-span-7 aspect-[4/5] md:aspect-[5/6]",
  "md:col-span-5 aspect-[4/5] md:mt-40",
  "md:col-span-5 aspect-[4/5]",
  "md:col-span-7 aspect-[16/11] md:mt-24",
  "md:col-span-6 aspect-[4/5]",
  "md:col-span-6 aspect-[4/5] md:mt-32",
];

export function FeaturedWork() {
  const list = featuredSlugs.map((s) => projects.find((p) => p.slug === s)!).filter(Boolean);
  return (
    <section className="bg-ink py-20 md:py-28" aria-labelledby="work-title">
      <div className="wrap">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <SectionLabel n="04">Selected work</SectionLabel>
            <SplitReveal id="work-title" className="display mt-5 text-[clamp(2.05rem,6vw,6rem)]">
              Frames we&apos;re proud of.
            </SplitReveal>
          </div>
          <Link href="/work" className="btn-ghost">
            All work →
          </Link>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-x-3 gap-y-8 md:mt-16 md:grid-cols-12 md:gap-8">
          {list.map((p, i) => {
            const isReel = p.format === "reels";
            const cat = workCategories.find((c) => c.id === p.category)?.label;
            return (
              <Link key={p.slug} href={`/work/${p.slug}`} data-cursor={isReel ? "play" : "view"} className={cn("group block", layout[i % layout.length].split(" ").filter((c) => c.startsWith("md:col") || c.startsWith("md:mt")).join(" "))}>
                <ShutterImage
                  src={isReel ? ytThumb(p.reels[0].youtubeId) : p.cover.src}
                  alt={p.cover.alt}
                  className={cn("rounded-[10px]", layout[i % layout.length].split(" ").filter((c) => c.includes("aspect")).join(" "))}
                />
                <div className="mt-4 flex items-start justify-between gap-4">
                  <div>
                    <p className="font-display text-sm font-extrabold uppercase tracking-tight transition-colors group-hover:text-rec sm:text-xl">{p.title}</p>
                    <p className="hud mt-1 hidden text-mute sm:block">
                      {cat} · {p.deliverables}
                    </p>
                    <p className="hud mt-1 text-mute sm:hidden">{cat}</p>
                  </div>
                  <span className="hud hidden shrink-0 text-mute sm:inline">{p.year}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* G. Packages teaser                                                  */
/* ------------------------------------------------------------------ */
export function PackagesTeaser() {
  return (
    <section className="bg-ink py-20 md:py-28" aria-labelledby="pkg-title">
      <div className="wrap">
        <SectionLabel n="05">Packages</SectionLabel>
        <div className="mt-5 flex flex-wrap items-end justify-between gap-6">
          <h2 id="pkg-title" className="display text-[clamp(2.05rem,6vw,6rem)]">
            Content packages <br />
            <span className="text-mute">from</span> Rs. 25,000.
          </h2>
          <Link href="/pricing" className="btn-ghost">
            Compare everything →
          </Link>
        </div>
        <div className="no-scrollbar -mx-[var(--gutter)] mt-14 flex snap-x snap-mandatory gap-4 overflow-x-auto px-[var(--gutter)] pb-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 xl:grid-cols-4">
          {contentPackages.map((p) => (
            <div key={p.id} className="w-[82vw] max-w-[360px] shrink-0 snap-center sm:w-auto sm:max-w-none">
              <ContentPackageCard pkg={p} expandable={false} />
            </div>
          ))}
        </div>
        <ServiceStrip className="mt-12" />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* H. Restaurant spotlight                                             */
/* ------------------------------------------------------------------ */
export function RestaurantSpotlight() {
  return (
    <section className="relative overflow-hidden py-20 md:py-28" style={{ background: "linear-gradient(180deg, #0A0A0B 0%, #1a110c 30%, #1a110c 70%, #0A0A0B 100%)" }} aria-labelledby="food-title">
      <div className="wrap">
        <SectionLabel n="06">Restaurant spotlight</SectionLabel>
        <div className="mt-5 grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <h2 id="food-title" className="display text-[clamp(2.05rem,6vw,6rem)]">
            Food &amp; restaurant <br />
            <span className="text-clay">content.</span>
          </h2>
          <div className="lg:text-right">
            <p className="font-display text-[clamp(2.2rem,9vw,3rem)] font-extrabold">
              <RollingNumber value={restaurantPackage.price} format="lkr" />
            </p>
            <p className="hud mt-2 text-mute">
              {restaurantPackage.shootLabel} · 4 Reels · {restaurantPackage.photosTotal} photos
            </p>
          </div>
        </div>
        <div className="mt-14 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {restaurantPackage.reels.map((r, i) => (
            <StoryboardCard key={r.n} n={r.n} name={r.name} steps={r.steps} delay={i * 0.12} />
          ))}
        </div>
        <div className="mt-12 flex flex-wrap items-center justify-between gap-6">
          <p className="max-w-lg text-paper/80">
            Plus 30 edited photos: 15 dishes, 5 table spreads, 5 atmosphere and 5 staff/lifestyle. Editing, grading, sound design, music, text and logo included.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/booking?category=restaurant&package=restaurant" className="btn-rec" data-cursor="book">
              Book a Restaurant Shoot
            </Link>
            <Link href="/pricing/restaurants" className="btn-ghost">
              Details
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function StoryboardCard({ n, name, steps, delay = 0 }: { n: string; name: string; steps: string[]; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { reduced } = useMotion();
  useGSAP(
    () => {
      if (reduced) return;
      const items = ref.current!.querySelectorAll("[data-step]");
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.8, delay, scrollTrigger: { trigger: ref.current, start: "top 85%", toggleActions: "play pause resume pause" } });
      items.forEach((it) => {
        tl.fromTo(it, { opacity: 0.25, color: "#8A8A90" }, { opacity: 1, color: "#F4F2EE", duration: 0.25 }).to(it, { opacity: 0.55, color: "#E8A87C", duration: 0.25 }, "+=0.45");
      });
    },
    { dependencies: [reduced], scope: ref },
  );
  return (
    <div ref={ref} className="relative flex aspect-[9/16] flex-col justify-between overflow-hidden rounded-[14px] border border-clay/25 bg-[#120c09] p-3 sm:p-4 lg:aspect-[3/4]">
      <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "repeating-linear-gradient(0deg, #E8A87C 0 1px, transparent 1px 22px)" }} aria-hidden />
      <div className="relative flex items-center justify-between hud text-clay">
        <span>REEL {n}</span>
        <span>9:16</span>
      </div>
      <span className="pointer-events-none absolute right-3 top-8 font-display text-[clamp(4rem,9vw,8rem)] font-extrabold leading-none text-transparent [-webkit-text-stroke:1px_rgba(232,168,124,.25)]" aria-hidden>
        {n}
      </span>
      <div className="relative">
        <p className="font-display text-[clamp(0.82rem,3.6vw,1.45rem)] font-extrabold uppercase leading-[1] sm:text-[clamp(1.05rem,1.6vw,1.45rem)]">{name}</p>
        <ol className="mt-4 space-y-1.5">
          {steps.map((s, i) => (
            <li key={s} data-step className="flex items-start gap-1.5 font-mono text-[9px] uppercase tracking-wider text-mute sm:gap-2 sm:text-[11px]">
              <span className="text-clay/60">{String(i + 1).padStart(2, "0")}</span>
              {i > 0 && <span aria-hidden>→</span>}
              {s}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* I. Monthly upsell                                                   */
/* ------------------------------------------------------------------ */
export function MonthlyUpsell() {
  const root = useRef<HTMLElement>(null);
  const { reduced } = useMotion();
  const months = useMonths(3);
  useGSAP(
    () => {
      if (reduced) return;
      gsap.from("[data-flip-card]", {
        rotateX: -95,
        opacity: 0,
        transformPerspective: 1200,
        duration: 1.1,
        stagger: 0.18,
        ease: "expo.out",
        scrollTrigger: { trigger: "[data-flip-grid]", start: "top 80%", once: true },
      });
      gsap.to("[data-page]", {
        rotateX: -180,
        stagger: 0.35,
        ease: "power2.in",
        transformPerspective: 800,
        scrollTrigger: { trigger: root.current, start: "top 70%", end: "top 10%", scrub: true },
      });
    },
    { dependencies: [reduced], scope: root },
  );
  return (
    <section ref={root} className="bg-ink py-20 md:py-28" aria-labelledby="monthly-title">
      <div className="wrap">
        <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <SectionLabel n="07">Monthly plans</SectionLabel>
            <h2 id="monthly-title" className="display mt-5 text-[clamp(2.05rem,6vw,6rem)]">
              Stop booking shoots. <br />
              <span className="text-rec">Start a content plan.</span>
            </h2>
          </div>
          {/* flipping calendar */}
          <div className="relative mx-auto h-40 w-36 lg:mx-0" aria-hidden>
            {[...months].reverse().map((m, i) => (
              <div
                key={m}
                data-page={i < months.length - 1 ? "" : undefined}
                className="absolute inset-0 flex origin-top flex-col overflow-hidden rounded-lg border border-line bg-paper text-ink shadow-xl [backface-visibility:hidden]"
                style={{ zIndex: i }}
              >
                <div className="bg-rec py-1.5 text-center hud text-paper">{m}</div>
                <div className="grid flex-1 grid-cols-7 gap-0.5 p-2">
                  {Array.from({ length: 28 }, (_, d) => (
                    <span key={d} className={cn("rounded-[2px]", d % 4 === 0 ? "bg-rec" : d % 2 ? "bg-ink/70" : "bg-ink/15")} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div data-flip-grid className="mt-14 grid gap-5 [perspective:1400px] md:grid-cols-3">
          {monthlyPlans.map((p, i) => (
            <MonthlyPlanCard key={p.id} plan={p} index={i} month={months[i]} />
          ))}
        </div>
        <p className="hud mt-6 text-center text-mute">Payment is made at the start of each monthly content cycle.</p>
        <div className="mt-8 flex justify-center">
          <Link href="/booking?category=monthly&package=m-growth" className="btn-rec" data-cursor="book">
            Start a Monthly Plan
          </Link>
        </div>
      </div>
    </section>
  );
}

/** Upcoming month labels, computed on the client so static HTML never goes stale. */
export function useMonths(n: number) {
  const [m, setM] = useState(() => Array.from({ length: n }, (_, i) => `MONTH ${String(i + 1).padStart(2, "0")}`));
  useEffect(() => setM(nextMonths(n)), [n]);
  return m;
}

export function nextMonths(n: number) {
  const d = new Date();
  return Array.from({ length: n }, (_, i) =>
    new Date(d.getFullYear(), d.getMonth() + i, 1).toLocaleString("en-GB", { month: "short", year: "numeric", timeZone: "Asia/Colombo" }).toUpperCase(),
  );
}

/* ------------------------------------------------------------------ */
/* Portfolio thumb helper for the 9:16 feed                            */
/* ------------------------------------------------------------------ */
export function PhotoTile({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Image src={src} alt={alt} fill sizes="(max-width:768px) 50vw, 20vw" className="object-cover transition-transform duration-700 hover:scale-105" />
    </div>
  );
}

export { Reveal };

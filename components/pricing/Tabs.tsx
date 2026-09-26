"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  comparisonRows,
  contentPackages,
  monthlyPlans,
  productPackages,
  rateCard,
  restaurantPackage,
} from "@/content/pricing";
import { photos } from "@/content/work";
import { ContentPackageCard, MonthlyPlanCard, ServiceStrip } from "./cards";
import { StoryboardCard, useMonths } from "@/components/home/Sections";
import { RollingNumber } from "@/components/motion/primitives";
import { cn, formatLKR } from "@/lib/format";

import { pricingTabs, type PricingTab } from "./tabs-config";

export function PricingTabBar({ active }: { active: PricingTab }) {
  return (
    <div className="sticky top-0 z-40 -mx-[var(--gutter)] border-b border-line bg-ink/85 px-[var(--gutter)] backdrop-blur-md no-print">
      <div role="tablist" aria-label="Pricing categories" className="no-scrollbar flex gap-1 overflow-x-auto py-3">
        {pricingTabs.map((t) => {
          const on = t.slug === active;
          return (
            <Link
              key={t.slug}
              role="tab"
              aria-selected={on}
              href={`/pricing${t.slug ? `/${t.slug}` : ""}`}
              scroll={false}
              data-no-transition
              className={cn(
                "relative shrink-0 rounded-full px-4 py-2 text-sm transition-colors",
                on ? "text-ink" : "text-paper/70 hover:text-paper",
              )}
            >
              {on && <motion.span layoutId="tab-pill" className="absolute inset-0 rounded-full bg-paper" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
              <span className="relative">{t.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export function PricingPanel({ tab }: { tab: PricingTab }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={tab}
        role="tabpanel"
        initial={{ x: 80, opacity: 0, filter: "blur(6px)" }}
        animate={{ x: 0, opacity: 1, filter: "blur(0px)" }}
        exit={{ x: -80, opacity: 0, filter: "blur(6px)" }}
        transition={{ duration: 0.45, ease: [0.7, 0, 0.2, 1] }}
      >
        {tab === "" && <ContentTab />}
        {tab === "monthly" && <MonthlyTab />}
        {tab === "restaurants" && <RestaurantTab />}
        {tab === "products" && <ProductTab />}
        {tab === "services" && <ServicesTab />}
      </motion.div>
    </AnimatePresence>
  );
}

/* ------------------------------------------------------------------ */
export function ContentTab({ print = false }: { print?: boolean }) {
  return (
    <div className="pt-12">
      <div className="no-scrollbar -mx-[var(--gutter)] flex snap-x snap-mandatory gap-4 overflow-x-auto px-[var(--gutter)] pb-4 md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 xl:grid-cols-4">
        {contentPackages.map((p) => (
          <div key={p.id} className="w-[84vw] max-w-[380px] shrink-0 snap-center md:w-auto md:max-w-none">
            <ContentPackageCard pkg={p} expandable={!print} />
          </div>
        ))}
      </div>
      <ServiceStrip className="mt-10" />
      <ComparisonTable />
      <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-[18px] border border-rec/40 bg-rec/5 p-6 text-center sm:flex-row sm:text-left no-print">
        <p className="text-lg">Posting every week? A monthly plan gives you more content for less per Reel.</p>
        <Link href="/pricing/monthly" scroll={false} data-no-transition className="btn-rec shrink-0">
          See Monthly Plans →
        </Link>
      </div>
    </div>
  );
}

function ComparisonTable() {
  const [col, setCol] = useState<number | null>(null);
  return (
    <div className="mt-20">
      <h3 className="display text-[clamp(1.8rem,3.5vw,3rem)]">Compare packages</h3>
      <div className="mt-8 overflow-x-auto rounded-[18px] border border-line" data-cursor="drag">
        <table className="w-full min-w-[760px] border-collapse text-left text-sm" onMouseLeave={() => setCol(null)}>
          <caption className="sr-only">Content package comparison</caption>
          <thead className="sticky top-0 z-10 bg-ink-2">
            <tr>
              <th scope="col" className="w-[22%] p-4 hud text-mute">
                Feature
              </th>
              {contentPackages.map((p, i) => (
                <th
                  key={p.id}
                  scope="col"
                  onMouseEnter={() => setCol(i)}
                  className={cn("p-4 transition-colors", col === i && "bg-paper/[0.06]", p.popular && "text-rec")}
                >
                  <span className="hud block text-mute">{p.number}</span>
                  <span className="font-display text-base font-extrabold uppercase">{p.name}</span>
                  {p.popular && <span className="hud mt-1 block">⭐ Most popular</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {comparisonRows.map((r) => (
              <tr key={r.label} className="border-t border-line">
                <th scope="row" className="p-4 font-medium text-paper/80">
                  {r.label}
                </th>
                {r.cells.map((c, i) => (
                  <td key={i} onMouseEnter={() => setCol(i)} className={cn("p-4 transition-colors", col === i && "bg-paper/[0.06]", r.label === "Price" && "font-display text-base font-extrabold")}>
                    {c === null ? <span className="text-mute">—</span> : c === "✓" ? <span className="text-rec">✓</span> : c}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
export function MonthlyTab() {
  const months = useMonths(3);
  return (
    <div className="pt-12">
      <p className="max-w-2xl text-lg text-paper/85">
        A month&apos;s worth of professional social-media content — planned, shot, edited and delivered, every month.
      </p>
      <div className="mt-10 grid gap-5 [perspective:1400px] md:grid-cols-3">
        {monthlyPlans.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ rotateX: -90, opacity: 0 }}
            animate={{ rotateX: 0, opacity: 1 }}
            transition={{ delay: 0.1 + i * 0.15, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: "top center" }}
          >
            <MonthlyPlanCard plan={p} index={i} month={months[i]} />
          </motion.div>
        ))}
      </div>
      <p className="hud mt-6 text-center text-mute">Payment is made at the start of each monthly content cycle.</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
export function RestaurantTab() {
  const r = restaurantPackage;
  return (
    <div className="pt-12">
      <article className="overflow-hidden rounded-[22px] border border-clay/30" style={{ background: "linear-gradient(135deg,#1c120c,#0f0a08 60%)" }}>
        <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
          <div className="p-6 sm:p-10">
            <p className="hud text-clay">Food & Restaurant Content</p>
            <h3 className="display mt-4 text-[clamp(2.2rem,5vw,4.5rem)]">{r.name}</h3>
            <p className="mt-5 font-display text-[clamp(2.2rem,9vw,3rem)] font-extrabold">
              <RollingNumber value={r.price} format="lkr" />
            </p>
            <p className="hud mt-2 text-mute">{r.shootLabel}</p>

            <div className="mt-10">
              <p className="hud mb-3 flex justify-between text-paper">
                <span>◉ Food photography</span>
                <span>{r.photosTotal} edited photos total</span>
              </p>
              <div className="flex h-10 overflow-hidden rounded-md" role="img" aria-label="Photo split: 15 dishes, 5 table spreads, 5 atmosphere, 5 staff">
                {r.photoSplit.map((s, i) => (
                  <motion.div
                    key={s.label}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.3 + i * 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="flex origin-left items-center justify-center font-mono text-xs font-semibold text-ink"
                    style={{ width: `${(s.count / r.photosTotal) * 100}%`, background: ["#E8A87C", "#f0c29f", "#d98a57", "#f6dcc6"][i] }}
                  >
                    {s.count}
                  </motion.div>
                ))}
              </div>
              <ul className="mt-3 grid grid-cols-2 gap-2 text-sm text-paper/80">
                {r.photoSplit.map((s, i) => (
                  <li key={s.label} className="flex items-center gap-2">
                    <span className="size-2.5 rounded-sm" style={{ background: ["#E8A87C", "#f0c29f", "#d98a57", "#f6dcc6"][i] }} />
                    {s.count} {s.label.toLowerCase()}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-8">
              <p className="hud mb-3 text-paper">Included</p>
              <ul className="flex flex-wrap gap-2">
                {r.included.map((i) => (
                  <li key={i} className="rounded-full border border-clay/30 px-3 py-1 text-sm">
                    {i}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-10 flex flex-wrap gap-3 no-print">
              <Link href="/booking?category=restaurant&package=restaurant" className="btn-rec" data-cursor="book">
                Book a Restaurant Shoot
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 p-6 sm:p-10 lg:border-l lg:border-clay/20">
            <p className="hud col-span-2 text-paper">▶ Video: 4 Reels</p>
            {r.reels.map((x, i) => (
              <StoryboardCard key={x.n} n={x.n} name={x.name} steps={x.steps} delay={i * 0.12} />
            ))}
          </div>
        </div>
      </article>
      <Link href="/pricing/monthly" scroll={false} data-no-transition className="mt-6 flex items-center justify-between gap-4 rounded-[18px] border border-line p-6 transition-colors hover:border-rec no-print">
        <span className="text-lg">
          Want this every month? → <strong>Monthly Growth</strong>, {formatLKR(85000)}/month.
        </span>
        <span className="hud text-rec">Best for restaurants →</span>
      </Link>
    </div>
  );
}

/* ------------------------------------------------------------------ */
export function ProductTab() {
  const imgs = [photos.tubeLandscape, photos.tubeHands, photos.postTubeDark];
  return (
    <div className="pt-12">
      <p className="max-w-2xl text-lg text-paper/85">For businesses selling physical products.</p>
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {productPackages.map((p, i) => (
          <article key={p.id} className="group flex flex-col overflow-hidden rounded-[18px] border border-line bg-ink-2" data-cursor={p.quoteOnly ? "quote" : "book"}>
            <div className="relative aspect-[4/3] overflow-hidden bg-black [perspective:900px]">
              <div className="absolute inset-[12%] transition-transform duration-[1.2s] ease-[var(--ease-expo)] [transform-style:preserve-3d] group-hover:[transform:rotateY(28deg)_rotateX(4deg)]">
                <Image src={imgs[i].src} alt={imgs[i].alt} fill sizes="(max-width:768px) 90vw, 30vw" className="rounded-md object-cover shadow-2xl" />
              </div>
              <div className="absolute bottom-3 left-1/2 h-3 w-2/3 -translate-x-1/2 rounded-[50%] bg-paper/10 blur-md" aria-hidden />
              <span className="hud absolute left-3 top-3 text-mute">TURNTABLE · 0{i + 1}</span>
            </div>
            <div className="flex flex-1 flex-col p-6">
              <h3 className="display text-3xl">{p.name}</h3>
              <p className="mt-3 font-display text-3xl font-extrabold">
                {p.fromPrice && <span className="mr-1 font-body text-base font-medium text-mute">From</span>}
                <RollingNumber value={p.price} format="lkr" />
              </p>
              <dl className="mt-5 space-y-2 text-sm">
                {[
                  ["Products", p.products],
                  ["Photos", p.photos],
                  ["Reels / videos", p.reels],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4 border-b border-line pb-2">
                    <dt className="hud text-mute">{k}</dt>
                    <dd className="text-right">{v}</dd>
                  </div>
                ))}
              </dl>
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {p.includes.map((x) => (
                  <li key={x} className="rounded-full border border-line px-2.5 py-1 text-xs text-paper/80">
                    {x}
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-6 no-print">
                <Link href={`/booking?category=product&package=${p.id}`} className={cn("w-full", p.quoteOnly ? "btn-ghost" : "btn-rec")}>
                  {p.quoteOnly ? "Request a Quote" : "Book this package"} →
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
      <p className="hud mt-6 text-center text-mute">Props, models and studio costs are quoted separately.</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
export function ServicesTab() {
  return (
    <div className="pt-12">
      <p className="max-w-2xl text-lg text-paper/85">
        Don&apos;t need a full package? Book exactly what you need. These are starting rates; final quotes depend on the brief.
      </p>
      <div className="mt-10 overflow-hidden rounded-[18px] border border-line bg-black/40 font-mono text-sm">
        <div className="hud grid grid-cols-[70px_1fr_auto] gap-4 border-b border-line bg-ink-2 px-4 py-3 text-mute sm:grid-cols-[120px_1fr_auto]">
          <span>EVENT</span>
          <span>REEL NAME · SERVICE</span>
          <span>RATE</span>
        </div>
        {rateCard.map((r, i) => (
          <div
            key={r.id}
            className="group grid grid-cols-[70px_1fr_auto] items-center gap-4 border-b border-line/60 px-4 py-3.5 transition-colors last:border-0 hover:bg-rec/10 sm:grid-cols-[120px_1fr_auto]"
          >
            <span className="text-mute group-hover:text-rec">
              {String(i + 1).padStart(3, "0")}
              <span className="hidden sm:inline"> · 01:{String(i * 4).padStart(2, "0")}:00</span>
            </span>
            <span className="font-body text-[15px] text-paper">{r.label}</span>
            <span className="whitespace-nowrap text-right text-paper">{r.display}</span>
          </div>
        ))}
      </div>
      <div className="mt-8 flex justify-center no-print">
        <Link href="/booking?category=individual" className="btn-rec" data-cursor="book">
          Build a custom booking →
        </Link>
      </div>
    </div>
  );
}

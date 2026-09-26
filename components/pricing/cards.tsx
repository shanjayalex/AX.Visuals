"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { ContentPackage, MonthlyPlan } from "@/content/pricing";
import { serviceStrip } from "@/content/pricing";
import { RollingNumber } from "@/components/motion/primitives";
import { cn } from "@/lib/format";

/* ------------------------------------------------------------------ */
/* Content package — "film can / slate" card                           */
/* ------------------------------------------------------------------ */
export function ContentPackageCard({ pkg, expandable = true }: { pkg: ContentPackage; expandable?: boolean }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const pct = (pkg.hours / 8) * 100;

  return (
    <article
      data-cursor="book"
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-[18px] p-6 transition-transform duration-500 ease-[var(--ease-expo)] hover:-translate-y-2",
        pkg.popular ? "shimmer-border" : "border border-line bg-ink-2",
      )}
    >
      {/* light sweep */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/[0.07] to-transparent opacity-0 transition-all duration-1000 group-hover:left-[120%] group-hover:opacity-100"
      />

      <header className="flex items-start justify-between">
        <span className="hud text-mute">
          PKG <span className="text-paper">{pkg.number}</span>
        </span>
        {pkg.popular && (
          <span className="hud flex items-center gap-1.5 rounded-full bg-rec px-2.5 py-1 font-semibold text-paper">⭐ MOST POPULAR</span>
        )}
      </header>

      <h3 className="display mt-6 text-[clamp(1.6rem,1.9vw,2.2rem)] [overflow-wrap:anywhere]">{pkg.name}</h3>

      <p className="mt-5 font-display text-[clamp(1.8rem,2.4vw,2.4rem)] font-extrabold tracking-tight">
        <RollingNumber value={pkg.price} format="lkr" />
      </p>

      {/* timecode bar on an 8-hour scale */}
      <div className="mt-5">
        <div className="hud mb-1.5 flex justify-between text-mute">
          <span className="text-paper">{pkg.shootLabel}</span>
          <span>0{pkg.hours}:00:00:00</span>
        </div>
        <div className="relative h-2 overflow-hidden rounded-sm bg-line">
          <motion.div
            className="absolute inset-y-0 left-0 bg-paper"
            initial={{ width: "0%" }}
            whileInView={{ width: `${pct}%` }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          />
          {Array.from({ length: 7 }, (_, i) => (
            <span key={i} className="absolute inset-y-0 w-px bg-ink" style={{ left: `${((i + 1) / 8) * 100}%` }} />
          ))}
        </div>
      </div>

      <dl className="mt-6 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-line p-3">
          <dt className="hud text-mute">▶ Reels</dt>
          <dd className="mt-1 font-display text-2xl font-extrabold">{pkg.reelsLabel.replace(" Reels", "")}</dd>
        </div>
        <div className="rounded-xl border border-line p-3">
          <dt className="hud text-mute">◉ Photos</dt>
          <dd className="mt-1 font-display text-2xl font-extrabold">
            {pkg.photosLabel.startsWith("Up to") && <span className="mr-1 font-body text-xs font-medium text-mute">up to</span>}
            {pkg.photosLabel.replace(" Photos", "").replace("Up to ", "")}
          </dd>
        </div>
      </dl>

      <p className="mt-5 text-sm leading-relaxed text-mute">{pkg.tagline}</p>

      {expandable && (
        <>
          <button
            type="button"
            className="hud mt-5 flex items-center gap-2 text-left text-paper/80 hover:text-paper"
            aria-expanded={open}
            aria-controls={id}
            onClick={() => setOpen((o) => !o)}
          >
            <span className={cn("inline-block transition-transform duration-300", open && "rotate-45")}>+</span>
            {open ? "Hide details" : "See everything included"}
          </button>
          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                id={id}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <div className="mt-4 space-y-4 border-t border-line pt-4">
                  {pkg.included.map((g) => (
                    <div key={g.group}>
                      <p className="hud mb-2 text-rec">{g.group}</p>
                      <ul className="space-y-1">
                        {g.items.map((it, i) => (
                          <motion.li
                            key={it}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.05 + i * 0.03 }}
                            className="flex gap-2 text-sm text-paper/85"
                          >
                            <span className="text-mute">—</span>
                            {it}
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      <div className="mt-auto pt-6">
        <Link href={`/booking?category=content&package=${pkg.id}`} className={cn("w-full", pkg.popular ? "btn-rec" : "btn-ghost")}>
          Book this package →
        </Link>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/* Monthly plan — calendar page                                        */
/* ------------------------------------------------------------------ */
export function MonthlyPlanCard({ plan, index, month }: { plan: MonthlyPlan; index: number; month: string }) {
  const hi = !!plan.badge;
  return (
    <article
      className={cn(
        "relative flex h-full flex-col overflow-hidden rounded-[18px]",
        hi ? "shimmer-border" : "border border-line bg-ink-2",
      )}
      style={{ transformOrigin: "top center" }}
      data-flip-card
    >
      {/* calendar header with binder rings */}
      <div className={cn("relative flex items-center justify-between px-6 pb-4 pt-7", hi ? "bg-rec text-paper" : "bg-paper text-ink")}>
        <div className="absolute inset-x-0 top-2 flex justify-center gap-10" aria-hidden>
          {[0, 1, 2].map((i) => (
            <span key={i} className="h-3 w-1.5 rounded-full bg-ink/60" />
          ))}
        </div>
        <span className="hud font-semibold">{month}</span>
        <span className="hud">PLAN 0{index + 1}</span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        {plan.badge && <span className="hud mb-3 w-fit rounded-full border border-rec px-2.5 py-1 text-rec">⭐ {plan.badge}</span>}
        <h3 className="display text-[clamp(1.7rem,2.4vw,2.3rem)]">{plan.name}</h3>
        <p className="mt-4 font-display text-3xl font-extrabold">
          <RollingNumber value={plan.price} format="lkr" />
          <span className="ml-1 font-body text-sm font-medium text-mute">/ month</span>
        </p>
        <p className="mt-2 text-sm text-paper/80">{plan.shoots}</p>

        {/* mini month grid: filled days = content */}
        <MiniMonth reels={plan.reels} photos={plan.photos} />

        <ul className="mt-5 flex flex-wrap gap-1.5">
          {plan.includes.map((i) => (
            <li key={i} className="rounded-full border border-line px-2.5 py-1 text-xs text-paper/80">
              {i}
            </li>
          ))}
        </ul>
        <p className="mt-5 text-sm text-mute">
          <span className="hud text-paper/70">Ideal for · </span>
          {plan.idealFor}
        </p>
        <div className="mt-auto pt-6">
          <Link href={`/booking?category=monthly&package=${plan.id}`} className={cn("w-full", hi ? "btn-rec" : "btn-ghost")}>
            Start this plan →
          </Link>
        </div>
      </div>
    </article>
  );
}

function MiniMonth({ reels, photos }: { reels: number; photos: number }) {
  // Spread reels and photos over 28 days as a visual "posting calendar"
  const cells = Array.from({ length: 28 }, () => "" as "" | "r" | "p");
  const place = (n: number, kind: "r" | "p") => {
    let placed = 0;
    for (let k = 0; placed < n && k < 200; k++) {
      const idx = Math.floor(((k * 28) / n + (kind === "r" ? 0 : 1)) % 28);
      if (!cells[idx]) {
        cells[idx] = kind;
        placed++;
      } else if (k > 60) break;
    }
  };
  place(reels, "r");
  place(Math.min(photos, 28 - reels), "p");
  return (
    <div className="mt-5">
      <div className="grid grid-cols-7 gap-1" aria-hidden>
        {cells.map((c, i) => (
          <span key={i} className={cn("aspect-square rounded-[3px]", c === "r" ? "bg-rec" : c === "p" ? "bg-paper/70" : "bg-line")} />
        ))}
      </div>
      <p className="hud mt-2 flex gap-4 text-mute">
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-sm bg-rec" /> {reels} Reels
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-sm bg-paper/70" /> {photos} photos
        </span>
      </p>
    </div>
  );
}

export function ServiceStrip({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col items-center gap-2 text-center", className)}>
      <p className="text-sm text-paper/80">{serviceStrip.join(" • ")}</p>
      <p className="hud text-mute">Available Islandwide 🇱🇰 · Travel charges may apply.</p>
    </div>
  );
}

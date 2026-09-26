"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { deliveryTimes, districts, policies, travelZones, type Policy, type TravelZone } from "@/content/pricing";
import { faqs } from "@/content/site";
import { cn } from "@/lib/format";

const icons: Record<Policy["icon"], React.ReactNode> = {
  travel: <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Zm0-9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />,
  exclude: <path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm-6 9a6 6 0 0 1 9.6-4.8l-8.4 8.4A6 6 0 0 1 6 12Zm6 6a6 6 0 0 1-3.6-1.2l8.4-8.4A6 6 0 0 1 12 18Z" />,
  revise: <path d="M4 12a8 8 0 0 1 13.7-5.6L20 4v6h-6l2.3-2.3A6 6 0 1 0 18 12h2a8 8 0 1 1-16 0Z" />,
  clock: <path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm1 9.4 3.3 2-1 1.7L11 13V7h2v5.4Z" />,
  wallet: <path d="M3 7a2 2 0 0 1 2-2h13v3h1a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Zm13 6.5a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0Z" />,
  shield: <path d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5l-8-3Zm-1.2 13.6-3.5-3.5 1.4-1.4 2.1 2.1 4.8-4.8 1.4 1.4-6.2 6.2Z" />,
};

export function Accordion({
  items,
  forceOpen = false,
}: {
  items: { id: string; title: string; summary?: string; icon?: React.ReactNode; body: React.ReactNode }[];
  forceOpen?: boolean;
}) {
  const [open, setOpen] = useState<string | null>(null);
  const base = useId();
  return (
    <div className="divide-y divide-line overflow-hidden rounded-[18px] border border-line">
      {items.map((it) => {
        const isOpen = forceOpen || open === it.id;
        return (
          <div key={it.id} className="bg-ink-2/50">
            <h3>
              <button
                type="button"
                className="flex w-full items-start gap-4 p-5 text-left transition-colors hover:bg-paper/[0.03] sm:p-6"
                aria-expanded={isOpen}
                aria-controls={`${base}-${it.id}`}
                onClick={() => setOpen(isOpen ? null : it.id)}
              >
                {it.icon && (
                  <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full border border-line text-rec">
                    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
                      {it.icon}
                    </svg>
                  </span>
                )}
                <span className="flex-1">
                  <span className="block font-display text-lg font-bold uppercase tracking-tight">{it.title}</span>
                  {it.summary && <span className="mt-1 block text-sm text-mute">{it.summary}</span>}
                </span>
                <span className={cn("mt-1 font-mono text-xl text-mute transition-transform duration-300", isOpen && "rotate-45 text-rec")} aria-hidden>
                  +
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`${base}-${it.id}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className={cn("px-5 pb-6 text-paper/85 sm:px-6", !!it.icon && "sm:pl-[4.75rem]")}>{it.body}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

export function PoliciesSection({ print = false }: { print?: boolean }) {
  return (
    <section aria-labelledby="policies-title" className="mt-24">
      <p className="eyebrow">Read before booking</p>
      <h2 id="policies-title" className="display mt-4 text-[clamp(2rem,4vw,3.5rem)]">
        Policies
      </h2>
      <div className="mt-8">
        <Accordion
          forceOpen={print}
          items={policies.map((p) => ({
            id: p.id,
            title: p.title,
            summary: p.summary,
            icon: icons[p.icon],
            body: (
              <>
                <ul className="space-y-1.5">
                  {p.details.map((d) => (
                    <li key={d} className="flex gap-2">
                      <span className="text-mute">—</span>
                      {d}
                    </li>
                  ))}
                </ul>
                {p.id === "travel" && !print && <ZoneMap />}
                {p.id === "delivery" && <DeliveryBars />}
              </>
            ),
          }))}
        />
      </div>
    </section>
  );
}

function DeliveryBars() {
  return (
    <div className="mt-6 space-y-3" aria-hidden>
      {deliveryTimes.map((d, i) => (
        <div key={d.label} className="hud grid grid-cols-[130px_1fr_110px] items-center gap-3 text-mute">
          <span className="text-paper">{d.label}</span>
          <span className="relative h-2 overflow-hidden rounded bg-line">
            <motion.span
              className="absolute inset-y-0 bg-paper/25"
              style={{ left: 0 }}
              initial={{ width: 0 }}
              animate={{ width: `${(d.max / 14) * 100}%` }}
              transition={{ delay: 0.1 + i * 0.15, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            />
            <motion.span
              className="absolute inset-y-0 bg-rec"
              initial={{ width: 0 }}
              animate={{ width: `${(d.min / 14) * 100}%` }}
              transition={{ delay: 0.2 + i * 0.15, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            />
          </span>
          <span className="text-right">
            {d.min}–{d.max} days
          </span>
        </div>
      ))}
    </div>
  );
}

/** Sri Lanka district tile map. Hover the legend (or a tile) to light up a zone. */
export function ZoneMap({ compact = false, selected }: { compact?: boolean; selected?: string }) {
  const [zone, setZone] = useState<TravelZone | null>(null);
  const colors: Record<TravelZone, string> = { local: "#FF3B2F", nearby: "#E8A87C", long: "#8A8A90" };
  return (
    <div className={cn("mt-6 grid items-start gap-6", !compact && "sm:grid-cols-[auto_1fr]")}>
      <div className="relative mx-auto grid w-fit grid-cols-6 gap-1" style={{ gridTemplateRows: "repeat(11, minmax(0,1fr))" }} role="img" aria-label="Map of Sri Lanka's districts coloured by travel zone">
        {districts.map((d) => {
          const lit = zone === null || zone === d.zone || selected === d.name;
          return (
            <span
              key={d.name}
              title={`${d.name} — ${travelZones[d.zone].label}`}
              onMouseEnter={() => setZone(d.zone)}
              onMouseLeave={() => setZone(null)}
              className={cn(
                "flex size-9 items-center justify-center rounded-[5px] font-mono text-[8px] uppercase transition-all duration-300 sm:size-10",
                selected === d.name && "ring-2 ring-paper",
              )}
              style={{
                gridColumn: d.x + 1,
                gridRow: d.y + 1,
                background: lit ? colors[d.zone] : "#26262A",
                color: lit && d.zone !== "long" ? "#0A0A0B" : "#F4F2EE",
                opacity: lit ? 1 : 0.35,
              }}
            >
              {d.name.slice(0, 3)}
            </span>
          );
        })}
      </div>
      {!compact && (
        <ul className="space-y-2">
          {(Object.keys(travelZones) as TravelZone[]).map((z) => (
            <li key={z}>
              <button
                type="button"
                onMouseEnter={() => setZone(z)}
                onMouseLeave={() => setZone(null)}
                onFocus={() => setZone(z)}
                onBlur={() => setZone(null)}
                className={cn("flex w-full items-center gap-3 rounded-lg border border-line p-3 text-left transition-colors", zone === z && "border-paper")}
              >
                <span className="size-3 rounded-sm" style={{ background: colors[z] }} />
                <span className="flex-1 text-sm">{travelZones[z].label}</span>
                <span className="hud text-mute">{travelZones[z].display}</span>
              </button>
            </li>
          ))}
          <li className="hud pt-2 text-mute">Overnight shoots: transport + accommodation charged separately.</li>
        </ul>
      )}
    </div>
  );
}

export function FAQSection() {
  return (
    <section aria-labelledby="faq-title" className="mt-24">
      <p className="eyebrow">Questions</p>
      <h2 id="faq-title" className="display mt-4 text-[clamp(2rem,4vw,3.5rem)]">
        FAQ
      </h2>
      <div className="mt-8">
        <Accordion items={faqs.map((f, i) => ({ id: `faq-${i}`, title: f.q, body: <p className="max-w-2xl leading-relaxed">{f.a}</p> }))} />
      </div>
    </section>
  );
}

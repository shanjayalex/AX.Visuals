"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { RollingNumber } from "@/components/motion/primitives";
import { useMotion } from "@/components/providers/MotionProvider";
import { stats } from "@/content/site";
import { cn } from "@/lib/format";

export function Stats() {
  return (
    <section className="border-y border-line bg-ink py-20" aria-label="Studio at a glance">
      <div className="wrap grid grid-cols-2 gap-y-12 md:grid-cols-4">
        {stats.map((s, i) => (
          <div key={s.label} className={cn("px-2 md:px-6", i > 0 && "md:border-l md:border-line")}>
            <p className="font-display text-[clamp(2.05rem,6vw,5.5rem)] font-extrabold leading-none">
              <RollingNumber value={s.value} format="pad2" />
              {s.suffix}
            </p>
            <p className="hud mt-3 text-mute">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="mt-20">
        <Marquee items={["Reels", "Photography", "Brand films", "Colour grading", "Creative direction", "Sound design", "Motion graphics", "Content plans"]} />
      </div>
    </section>
  );
}

/** Marquee that speeds up and flips direction with scroll velocity. */
export function Marquee({ items, className }: { items: string[]; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { reduced, lenis } = useMotion();
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    let x = 0;
    let dir = -1;
    const half = () => el.scrollWidth / 2;
    const tick = () => {
      const v = lenis?.velocity ?? 0;
      if (Math.abs(v) > 0.5) dir = v > 0 ? -1 : 1;
      x += dir * (0.6 + Math.min(Math.abs(v) * 0.25, 12));
      const h = half();
      if (x <= -h) x += h;
      if (x > 0) x -= h;
      gsap.set(el, { x });
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, [reduced, lenis]);
  const row = [...items, ...items];
  return (
    <div className={cn("overflow-hidden", className)} aria-hidden>
      <div ref={ref} className="flex w-max items-center will-change-transform">
        {[...row, ...row].map((t, i) => (
          <span key={i} className="flex items-center">
            <span className="display px-8 text-[clamp(2.05rem,6vw,5.5rem)] text-transparent [-webkit-text-stroke:1px_var(--color-paper)] hover:text-paper">
              {t}
            </span>
            <span className="rec-dot size-3" />
          </span>
        ))}
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { SectionLabel } from "@/components/motion/primitives";
import { useMotion } from "@/components/providers/MotionProvider";
import { industries } from "@/content/industries";
import { IndustryFrame } from "@/components/work/IndustryFrame";
import { cn } from "@/lib/format";

/** Big interactive list; a floating preview follows the cursor with inertia and an RGB split driven by velocity. */
export function Industries() {
  const root = useRef<HTMLElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const { reduced } = useMotion();

  useEffect(() => {
    const el = root.current;
    const p = preview.current;
    if (!el || !p || reduced || !window.matchMedia("(pointer: fine)").matches) return;
    const xTo = gsap.quickTo(p, "x", { duration: 0.7, ease: "power3" });
    const yTo = gsap.quickTo(p, "y", { duration: 0.7, ease: "power3" });
    let lx = 0;
    let vx = 0;
    const move = (e: PointerEvent) => {
      vx = e.clientX - lx;
      lx = e.clientX;
      const r = el.getBoundingClientRect();
      xTo(e.clientX - r.left);
      yTo(e.clientY - r.top);
      const s = gsap.utils.clamp(-14, 14, vx * 0.8);
      p.style.setProperty("--split", `${s}px`);
      p.style.setProperty("--skew", `${gsap.utils.clamp(-8, 8, vx * 0.3)}deg`);
    };
    el.addEventListener("pointermove", move);
    return () => el.removeEventListener("pointermove", move);
  }, [reduced]);

  return (
    <section ref={root} className="relative overflow-hidden bg-ink py-20 md:py-28" aria-labelledby="industries-title">
      <div className="wrap">
        <SectionLabel n="03">Who we create for</SectionLabel>
        <h2 id="industries-title" className="sr-only">
          Industries we create content for
        </h2>
        <ul className="relative z-10 mt-10 border-t border-line mix-blend-difference">
          {industries.map((ind, i) => (
            <li key={ind.id} onMouseEnter={() => setActive(i)} onMouseLeave={() => setActive(null)}>
              <Link
                href={`/services#${ind.id}`}
                data-cursor="view"
                className="group flex items-baseline justify-between gap-6 border-b border-line py-5 md:py-7"
              >
                <span className="flex min-w-0 items-baseline gap-3 md:gap-8">
                  <span className="font-mono text-xs text-mute">{String(i + 1).padStart(2, "0")}</span>
                  <span className="display text-[clamp(1.45rem,6vw,5.6rem)] text-paper [overflow-wrap:anywhere] transition-transform duration-500 ease-[var(--ease-expo)] group-hover:translate-x-4">
                    {ind.name}
                  </span>
                </span>
                <span className="hud hidden text-mute md:block">{ind.bestFit[0]} →</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div
        ref={preview}
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 z-0 hidden md:block"
        style={{ ["--split" as string]: "0px", ["--skew" as string]: "0deg" }}
      >
        <div
          className={cn(
            "relative -ml-[140px] -mt-[180px] h-[360px] w-[280px] overflow-hidden rounded-lg transition-[opacity,transform] duration-500 ease-[var(--ease-expo)]",
            active === null ? "scale-75 opacity-0" : "scale-100 opacity-100",
          )}
        >
          <div className="absolute inset-0" style={{ transform: "skewX(var(--skew))" }}>
            {industries.map((ind, i) => (
              <div key={ind.id} className={cn("absolute inset-0 transition-opacity duration-300", active === i ? "opacity-100" : "opacity-0")}>
                <IndustryFrame industry={ind} className="size-full" sizes="280px" />
                {/* RGB split fringe driven by cursor velocity */}
                <div className="absolute inset-0 mix-blend-screen" style={{ boxShadow: "inset 0 0 0 1px rgba(255,59,47,.6)", transform: "translateX(var(--split))" }} />
                <div className="absolute inset-0 mix-blend-screen" style={{ boxShadow: "inset 0 0 0 1px rgba(0,220,255,.6)", transform: "translateX(calc(var(--split) * -1))" }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

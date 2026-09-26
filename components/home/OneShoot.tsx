"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useMotion } from "@/components/providers/MotionProvider";
import { SectionLabel } from "@/components/motion/primitives";
import { photos } from "@/content/work";
import { cn } from "@/lib/format";

const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const REEL_DAYS = [0, 9, 15, 24];
const pool = Object.values(photos);

/** 4 Reels + 25 photos = 29 posts spread over a 4-week calendar. Day 27 carries two posts. */
const schedule = Array.from({ length: 28 }, (_, d) => {
  if (REEL_DAYS.includes(d)) return [{ kind: "reel" as const }];
  return d === 27 ? [{ kind: "photo" as const }, { kind: "photo" as const }] : [{ kind: "photo" as const }];
});

export function OneShoot() {
  const root = useRef<HTMLElement>(null);
  const [count, setCount] = useState(0);
  const { reduced } = useMotion();

  useGSAP(
    () => {
      const el = root.current!;
      const clap = el.querySelector<HTMLElement>("[data-clap]")!;
      const tiles = gsap.utils.toArray<HTMLElement>("[data-tile]", el);
      if (reduced) {
        setCount(29);
        return;
      }
      const mm = gsap.matchMedia();
      mm.add("(min-width: 0px)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "+=180%",
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            onUpdate: (st) => setCount(Math.round(gsap.utils.clamp(0, 1, (st.progress - 0.15) / 0.75) * 29)),
          },
        });
        tl.from(clap, { scale: 1.4, duration: 0.15 })
          .to(clap.querySelector("[data-clap-top]"), { rotate: 0, duration: 0.05 })
          .from(
            tiles,
            {
              x: (_: number, t: HTMLElement) => {
                const a = clap.getBoundingClientRect();
                const b = t.getBoundingClientRect();
                return a.left + a.width / 2 - (b.left + b.width / 2);
              },
              y: (_: number, t: HTMLElement) => {
                const a = clap.getBoundingClientRect();
                const b = t.getBoundingClientRect();
                return a.top + a.height / 2 - (b.top + b.height / 2);
              },
              scale: 0.2,
              opacity: 0,
              rotate: () => gsap.utils.random(-40, 40),
              duration: 0.7,
              stagger: { each: 0.02, from: "start" },
              ease: "power3.out",
            },
            ">",
          )
          .to(clap, { opacity: 0.08, scale: 0.8, duration: 0.3 }, "<0.2");
      });
      return () => mm.revert();
    },
    { dependencies: [reduced], scope: root },
  );

  let photoIdx = 0;
  let reelIdx = 0;

  return (
    <section ref={root} className="relative flex min-h-[100svh] items-center overflow-hidden bg-ink py-20" aria-labelledby="one-shoot-title">
      <div className="wrap grid w-full items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative z-10">
          <SectionLabel n="01">The value</SectionLabel>
          <h2 id="one-shoot-title" className="display mt-6 text-[clamp(2.05rem,6vw,6rem)]">
            One shoot. <br />
            <span className="text-mute">Weeks of</span> content.
          </h2>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-paper/80">
            You&apos;re not buying camera time. You&apos;re buying a month of professional content.
          </p>
          <div className="mt-10 inline-flex items-center gap-4 rounded-full border border-line px-5 py-3">
            <span className="rec-dot" />
            <span className="hud text-mute">Posts scheduled</span>
            <span className="font-mono text-2xl tabular-nums text-paper">{String(count).padStart(2, "0")}</span>
          </div>
          <p className="hud mt-4 text-mute">Social Content · 3-hour shoot → 4 Reels + 25 photos</p>
        </div>

        <div className="relative">
          {/* clapperboard */}
          <div data-clap className="pointer-events-none absolute left-1/2 top-1/2 z-20 w-[min(62%,320px)] -translate-x-1/2 -translate-y-1/2" aria-hidden>
            <Clapperboard label="3-HOUR SHOOT" />
          </div>

          {/* calendar */}
          <div className="card relative p-3 sm:p-5">
            <div className="hud mb-3 flex justify-between text-mute">
              <span>CONTENT CALENDAR · 4 WEEKS</span>
              <span className="flex gap-3">
                <span className="flex items-center gap-1">
                  <span className="size-2 rounded-sm bg-rec" /> REEL
                </span>
                <span className="flex items-center gap-1">
                  <span className="size-2 rounded-sm bg-paper/70" /> PHOTO
                </span>
              </span>
            </div>
            <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
              {DAYS.map((d) => (
                <div key={d} className="hud pb-1 text-center text-mute">
                  {d}
                </div>
              ))}
              {schedule.map((items, d) => (
                <div key={d} className="relative aspect-[4/5] rounded-md border border-line bg-ink/60 p-0.5 sm:p-1">
                  <span className="absolute left-1 top-0.5 z-10 font-mono text-[8px] text-mute sm:text-[9px]">{String(d + 1).padStart(2, "0")}</span>
                  <div className={cn("grid size-full gap-0.5", items.length > 1 && "grid-rows-2")}>
                    {items.map((it, k) => {
                      if (it.kind === "reel") {
                        const n = ++reelIdx;
                        return (
                          <div key={k} data-tile className="relative flex items-center justify-center overflow-hidden rounded-[3px] bg-rec">
                            <span className="font-mono text-[9px] font-semibold text-paper sm:text-[10px]">▶ R{n}</span>
                          </div>
                        );
                      }
                      const ph = pool[photoIdx++ % pool.length];
                      return (
                        <div key={k} data-tile className="relative overflow-hidden rounded-[3px] bg-line">
                          <Image src={ph.src} alt="" fill sizes="60px" className="object-cover" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Clapperboard({ label, sub = "SCENE 01 · TAKE 01", className, open = true }: { label: string; sub?: string; className?: string; open?: boolean }) {
  const stripes = (
    <div className="flex h-full overflow-hidden rounded-t-[4px]">
      {Array.from({ length: 8 }, (_, i) => (
        <span key={i} className={cn("h-full flex-1 -skew-x-[30deg]", i % 2 ? "bg-paper" : "bg-ink")} />
      ))}
    </div>
  );
  return (
    <div className={cn("relative", className)}>
      <div
        data-clap-top
        className="relative h-7 origin-[0%_100%] border border-paper/80 bg-ink sm:h-9"
        style={{ transform: open ? "rotate(-18deg)" : "rotate(0deg)", transition: "transform .25s cubic-bezier(.7,0,.2,1)" }}
      >
        {stripes}
      </div>
      <div className="h-7 border-x border-paper/80 bg-ink sm:h-9">{stripes}</div>
      <div className="rounded-b-[6px] border border-paper/80 bg-ink-2 p-3 sm:p-4">
        <p className="display text-[clamp(1.2rem,3vw,2rem)] leading-none">{label}</p>
        <div className="mt-3 grid grid-cols-3 gap-2 border-t border-paper/30 pt-2 hud text-mute">
          <span>AX.VISUALS</span>
          <span className="text-center">{sub}</span>
          <span className="text-right">24FPS</span>
        </div>
      </div>
    </div>
  );
}

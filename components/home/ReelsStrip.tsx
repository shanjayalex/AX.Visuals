"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ReelCard } from "@/components/media/YouTube";
import { SectionLabel } from "@/components/motion/primitives";
import { useMotion } from "@/components/providers/MotionProvider";
import { reels } from "@/content/work";
import { cn } from "@/lib/format";

function Sprockets() {
  return (
    <div
      className="h-7"
      aria-hidden
      style={{
        backgroundImage: "linear-gradient(90deg, var(--color-ink) 20px, transparent 20px)",
        backgroundSize: "34px 14px",
        backgroundRepeat: "repeat-x",
        backgroundPosition: "8px center",
      }}
    />
  );
}

/** Pinned horizontal 35mm film strip; each frame is a 9:16 Reel that plays on hover. */
export function ReelsStrip() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const { reduced } = useMotion();

  useGSAP(
    () => {
      if (reduced) return;
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        const t = track.current!;
        gsap.to(t, {
          x: () => -(t.scrollWidth - window.innerWidth + 64),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${t.scrollWidth - window.innerWidth}`,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });
      });
      return () => mm.revert();
    },
    { dependencies: [reduced], scope: root },
  );

  return (
    <section ref={root} className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden bg-ink py-20" aria-labelledby="reels-title">
      <div className="wrap mb-10 flex flex-wrap items-end justify-between gap-6">
        <div>
          <SectionLabel n="02">Reels</SectionLabel>
          <h2 id="reels-title" className="display mt-5 text-[clamp(2.05rem,5vw,5rem)]">
            Cut for <span className="text-rec">the scroll.</span>
          </h2>
        </div>
        <p className="hud max-w-xs text-mute">Hover a frame to play · Click for sound · Drag or scroll →</p>
      </div>

      <div className={cn("md:overflow-visible", reduced ? "overflow-x-auto" : "overflow-x-auto md:overflow-x-visible")} data-cursor="drag">
        <div ref={track} className="flex w-max gap-0 pl-[var(--gutter)] will-change-transform">
          <div className="rounded-md bg-[#1a1714] shadow-[inset_0_0_40px_rgba(0,0,0,.6)]">
            <Sprockets />
            <div className="flex gap-3 px-3">
              {reels.map((r, i) => (
                <div key={r.youtubeId} className="w-[62vw] max-w-[300px] shrink-0 sm:w-[260px]">
                  <ReelCard id={r.youtubeId} title={r.title} aspect={r.aspect} className="aspect-[9/16] rounded-[3px]">
                    <p className="font-display text-lg font-extrabold uppercase leading-tight">{r.title}</p>
                  </ReelCard>
                  <p className="mt-1.5 flex justify-between font-mono text-[10px] tracking-widest text-clay/80">
                    <span>AX {String(i + 1).padStart(2, "0")} ▸ {i + 24}A</span>
                    <span>KODAK 5219</span>
                  </p>
                </div>
              ))}
            </div>
            <Sprockets />
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { YouTubeBackground, ShowreelLink } from "@/components/media/YouTube";
import { Magnetic, SplitReveal, Timecode } from "@/components/motion/primitives";
import { useMotion } from "@/components/providers/MotionProvider";
import { site } from "@/content/site";

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const focus = useRef<HTMLDivElement>(null);
  const { reduced } = useMotion();

  // Rack focus: everything is slightly soft except a sharp circle that follows the cursor
  useEffect(() => {
    const el = root.current;
    const f = focus.current;
    if (!el || !f || reduced || !window.matchMedia("(pointer: fine)").matches) return;
    const state = { x: 50, y: 45 };
    const apply = () => {
      const m = `radial-gradient(circle at ${state.x}% ${state.y}%, transparent 0, transparent 14vmax, #000 30vmax)`;
      f.style.maskImage = m;
      f.style.webkitMaskImage = m;
    };
    apply();
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      gsap.to(state, { x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100, duration: 0.9, ease: "power3.out", onUpdate: apply });
    };
    el.addEventListener("pointermove", move);
    return () => el.removeEventListener("pointermove", move);
  }, [reduced]);

  return (
    <section ref={root} data-cursor="focus" className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-ink" aria-label="Showreel">
      <YouTubeBackground id={site.showreelYouTubeId} poster="/media/grad-profile.jpg" className="scale-105" />
      {/* depth-of-field layer */}
      <div ref={focus} aria-hidden className="pointer-events-none absolute inset-0 hidden backdrop-blur-[5px] md:block" />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/20 to-ink" />
      {/* letterbox */}
      <div aria-hidden className="absolute inset-x-0 top-0 h-[5vh] bg-ink" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-[5vh] bg-ink" />

      <ViewfinderHUD />

      <div className="wrap relative z-10 flex h-full flex-col justify-end pb-[13vh] pt-28">
        <SplitReveal as="h1" by="words" immediate delay={0.2} className="display text-[clamp(1.9rem,8.4vw,9.2rem)]">
          We create <br />
          content for <br />
          <span className="text-rec">businesses.</span>
        </SplitReveal>

        <div className="mt-8 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <p className="max-w-md text-[15px] leading-relaxed text-paper/85 md:text-base">
            Reels, photos and brand films that keep your business posting for weeks — from a single shoot. Available islandwide 🇱🇰
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Magnetic>
              <Link href="/booking" className="btn-rec focus-pull" data-cursor="book">
                <span className="rec-dot !bg-paper" /> Book a Shoot
              </Link>
            </Magnetic>
            <Magnetic>
              <Link href="/pricing" className="btn-ghost focus-pull backdrop-blur-sm">
                See Packages
              </Link>
            </Magnetic>
            <ShowreelLink id={site.showreelYouTubeId} className="hud ml-2 flex items-center gap-2 text-paper/80 hover:text-paper">
              <span className="flex size-7 items-center justify-center rounded-full border border-paper/40">▶</span> Watch Showreel
            </ShowreelLink>
          </div>
        </div>
      </div>

      <ScrollCue />
    </section>
  );
}

function ViewfinderHUD() {
  const corner = "absolute size-8 border-paper/80";
  return (
    <div aria-hidden className="pointer-events-none absolute inset-[7vh_var(--gutter)] z-[5] hud text-paper/85">
      <span className={`${corner} left-0 top-0 border-l border-t`} />
      <span className={`${corner} right-0 top-0 border-r border-t`} />
      <span className={`${corner} bottom-0 left-0 border-b border-l`} />
      <span className={`${corner} bottom-0 right-0 border-b border-r`} />

      <div className="absolute left-4 top-4 flex items-center gap-2 md:left-6 md:top-5">
        <span className="rec-dot" /> <span className="text-paper">REC</span>
        <Timecode className="ml-3 text-paper" />
      </div>
      <div className="absolute right-4 top-4 flex items-center gap-3 md:right-6 md:top-5">
        <span className="hidden sm:inline">4K · 24FPS · ISO 800 · f/1.8</span>
        <span className="flex items-center gap-1">
          <span className="relative flex h-2.5 w-5 items-center rounded-[2px] border border-paper/80 p-[1px]">
            <span className="h-full w-3/4 bg-paper/80" />
          </span>
          <span className="h-1 w-[2px] bg-paper/80" />
        </span>
      </div>
      {/* crosshair */}
      <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 md:block">
        <span className="absolute left-1/2 top-1/2 h-6 w-px -translate-x-1/2 -translate-y-1/2 bg-paper/60" />
        <span className="absolute left-1/2 top-1/2 h-px w-6 -translate-x-1/2 -translate-y-1/2 bg-paper/60" />
        <span className="absolute left-1/2 top-1/2 size-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-paper/20" />
      </div>
      <div className="absolute bottom-4 left-4 hidden md:left-6 md:bottom-5 md:block">A-CAM · 35MM · 1/50</div>
      <div className="absolute bottom-4 right-4 hidden md:right-6 md:bottom-5 md:block">WB 5600K · LUT AX-01</div>
    </div>
  );
}

function ScrollCue() {
  return (
    <div aria-hidden className="absolute bottom-[calc(5vh+0.75rem)] left-1/2 z-10 hidden h-16 w-5 -translate-x-1/2 overflow-hidden border-x border-paper/40 md:block">
      <div className="flex flex-col items-center gap-2 py-1" style={{ animation: "sprocket 2.4s linear infinite" }}>
        {Array.from({ length: 16 }, (_, i) => (
          <span key={i} className="h-2 w-2.5 shrink-0 rounded-[1px] bg-paper/60" />
        ))}
      </div>
    </div>
  );
}

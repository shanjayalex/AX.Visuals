"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { AxelClay } from "@/components/clay/Axel";
import { Clapperboard } from "@/components/home/OneShoot";
import { ReelCard } from "@/components/media/YouTube";
import { SectionLabel, SplitReveal } from "@/components/motion/primitives";
import { useMotion } from "@/components/providers/MotionProvider";
import { WhatsAppIcon } from "@/components/layout/WhatsAppFab";
import { photos, reels } from "@/content/work";
import { site, testimonials } from "@/content/site";
import { cn, waLink } from "@/lib/format";
import { sound } from "@/lib/sound";
import Image from "next/image";

/* ------------------------------------------------------------------ */
/* J. Claymation behind-the-scenes band                                */
/* ------------------------------------------------------------------ */
export function ClayBand() {
  const root = useRef<HTMLElement>(null);
  const { reduced } = useMotion();
  useGSAP(
    () => {
      if (reduced) return;
      gsap
        .timeline({ scrollTrigger: { trigger: root.current, start: "top 80%", end: "bottom 20%", scrub: true } })
        .fromTo(root.current, { backgroundColor: "#0A0A0B", color: "#F4F2EE" }, { backgroundColor: "#E8A87C", color: "#1a110c", duration: 1 })
        .to(root.current, { backgroundColor: "#0A0A0B", color: "#F4F2EE", duration: 1 }, "+=0.6");
    },
    { dependencies: [reduced], scope: root },
  );
  return (
    <section ref={root} className="relative overflow-hidden bg-ink py-20 md:py-28" aria-labelledby="clay-title">
      <div className="wrap grid items-center gap-12 lg:grid-cols-2">
        <div>
          <SectionLabel n="08" className="!text-current opacity-70">
            Behind the scenes
          </SectionLabel>
          <h2 id="clay-title" className="display mt-6 text-[clamp(2.2rem,5vw,4.6rem)]">
            Every frame is hand-crafted — <span className="opacity-60">even the ones we make out of clay.</span>
          </h2>
          <p className="mt-6 max-w-md opacity-80">Meet Axel, our very small cinematographer. He takes focus pulls extremely seriously.</p>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-[18px] shadow-2xl ring-1 ring-black/20">
          <AxelClay pose="focus" />
          <div className="pointer-events-none absolute inset-3 hud flex items-start justify-between text-[#f4efe6]/80">
            <span className="flex items-center gap-2">
              <span className="rec-dot" /> STOP-MOTION · 12FPS
            </span>
            <span>BTS · SET 01</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* K. Process                                                          */
/* ------------------------------------------------------------------ */
const steps = [
  { t: "Enquire", d: "WhatsApp, call or book online. Tell us what you sell and where you post." },
  { t: "Content Plan & Shot List", d: "We plan the Reels, hooks and photo list before anyone picks up a camera." },
  { t: "Shoot Day", d: "Professional camera, lighting and direction — efficient, on schedule, on brand." },
  { t: "Edit & Colour Grade", d: "Cut for the scroll: pacing, sound design, text, subtitles and a signature grade." },
  { t: "Delivery", d: "Photos in 3–5 working days, Reels in 5–7. Ready to post." },
];

export function Process() {
  const root = useRef<HTMLElement>(null);
  const { reduced } = useMotion();
  const [shut, setShut] = useState<boolean[]>(steps.map(() => reduced));
  useGSAP(
    () => {
      if (reduced) {
        setShut(steps.map(() => true));
        return;
      }
      gsap.fromTo("[data-line]", { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: "[data-steps]", start: "top 70%", end: "bottom 60%", scrub: true } });
      gsap.utils.toArray<HTMLElement>("[data-step-item]").forEach((el, i) => {
        gsap.from(el, {
          y: 40,
          opacity: 0,
          duration: 0.9,
          ease: "expo.out",
          scrollTrigger: {
            trigger: el,
            start: "top 75%",
            once: true,
            onEnter: () => {
              window.setTimeout(() => {
                setShut((s) => s.map((v, k) => (k === i ? true : v)));
                sound.clap();
              }, 350);
            },
          },
        });
      });
    },
    { dependencies: [reduced], scope: root },
  );
  return (
    <section ref={root} className="bg-ink py-20 md:py-28" aria-labelledby="process-title">
      <div className="wrap grid gap-16 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionLabel n="09">Process</SectionLabel>
          <SplitReveal id="process-title" className="display mt-5 text-[clamp(2.05rem,5vw,5rem)]">
            From call sheet to content library.
          </SplitReveal>
        </div>
        <ol data-steps className="relative min-w-0 space-y-10 pl-10">
          <span className="absolute bottom-0 left-3 top-0 w-px bg-line" aria-hidden />
          <span data-line className="absolute bottom-0 left-3 top-0 w-px origin-top bg-rec" aria-hidden />
          {steps.map((s, i) => (
            <li key={s.t} data-step-item className="relative grid items-center gap-6 sm:grid-cols-[200px_1fr]">
              <span className="absolute -left-[34px] top-6 size-3 rounded-full border-2 border-rec bg-ink" aria-hidden />
              <Clapperboard label={`0${i + 1}`} sub={`SCENE 0${i + 1}`} open={!shut[i]} className="w-[180px]" />
              <div>
                <h3 className="font-display text-2xl font-extrabold uppercase">{s.t}</h3>
                <p className="mt-2 max-w-md text-paper/75">{s.d}</p>
                {i === steps.length - 1 && (
                  <div className="mt-5 space-y-2" aria-label="Delivery times">
                    {[
                      ["Photos", "3–5 working days", 36],
                      ["Reels", "5–7 working days", 50],
                      ["Large productions", "7–14 working days", 100],
                    ].map(([l, d, w]) => (
                      <div key={l as string} className="hud flex items-center gap-3 text-mute">
                        <span className="w-24 shrink-0 text-paper sm:w-32">{l}</span>
                        <span className="h-1.5 flex-1 overflow-hidden rounded bg-line">
                          <span className="block h-full bg-paper/80" style={{ width: `${w}%` }} />
                        </span>
                        <span className="w-24 shrink-0 text-right sm:w-32">{d}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* L. Testimonials — film subtitles                                    */
/* ------------------------------------------------------------------ */
export function Testimonials() {
  return (
    <section className="bg-black py-20 md:py-28" aria-labelledby="t-title">
      <div className="wrap">
        <SectionLabel n="10">Clients</SectionLabel>
        <h2 id="t-title" className="sr-only">
          Client reviews
        </h2>
        {testimonials.length === 0 ? (
          <div className="mx-auto mt-16 max-w-3xl text-center">
            <p className="hud text-mute">00:00:00:00 → 00:00:04:12</p>
            <p className="mt-4 font-body text-[clamp(1.3rem,2.6vw,2rem)] font-semibold leading-snug text-[#fff6c8] [text-shadow:0_2px_0_#000]">
              [ Reviews from our business clients will play here. ]
            </p>
            <p className="mt-6 text-sm text-mute">Worked with us? We&apos;d love to feature your words.</p>
          </div>
        ) : (
          <div className="no-scrollbar mt-12 flex snap-x gap-6 overflow-x-auto pb-4" data-cursor="drag">
            {testimonials.map((t) => (
              <figure key={t.name} className="w-[85vw] max-w-2xl shrink-0 snap-center rounded-lg bg-ink-2 p-8 text-center">
                <p className="hud text-mute">{t.timecode}</p>
                <blockquote className="mt-4 text-xl font-semibold text-[#fff6c8] [text-shadow:0_2px_0_#000]">{t.quote}</blockquote>
                <figcaption className="hud mt-6 text-mute">
                  — {t.name}, {t.business}
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* M. Reels / Instagram-style feed                                     */
/* ------------------------------------------------------------------ */
export function ReelFeed() {
  const tiles = [photos.postGraduated, photos.cerDeiva, photos.postChapter, photos.cerSirakattum, photos.postDreams, photos.cerAnbin];
  return (
    <section className="bg-ink py-20 md:py-28" aria-labelledby="feed-title">
      <div className="wrap">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <SectionLabel n="11">On the feed</SectionLabel>
            <h2 id="feed-title" className="display mt-5 text-[clamp(2.2rem,5vw,4.6rem)]">
              Made to be posted.
            </h2>
          </div>
          <a href={site.socials[0].href} target="_blank" rel="noopener" className="btn-ghost">
            Follow on Instagram ↗
          </a>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3">
          {reels.slice(1, 3).map((r) => (
            <ReelCard key={r.youtubeId} id={r.youtubeId} title={r.title} aspect={r.aspect} className="aspect-[9/16] rounded-md" />
          ))}
          {tiles.map((p, i) => (
            <div key={p.src} className={cn("relative aspect-[4/5] overflow-hidden rounded-md", i < 2 && "md:aspect-[9/16]")}>
              <Image src={p.src} alt={p.alt} fill sizes="(max-width:768px) 50vw, 25vw" className="object-cover transition-transform duration-700 hover:scale-105" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* N. Final CTA — letters scatter & reassemble                         */
/* ------------------------------------------------------------------ */
export function FinalCTA() {
  const btn = useRef<HTMLAnchorElement>(null);
  const { reduced } = useMotion();
  const scatter = () => {
    if (reduced || !btn.current) return;
    const chars = btn.current.querySelectorAll("[data-ch]");
    gsap
      .timeline()
      .to(chars, { x: () => gsap.utils.random(-60, 60), y: () => gsap.utils.random(-50, 50), rotate: () => gsap.utils.random(-45, 45), duration: 0.25, ease: "power2.out" })
      .to(chars, { x: 0, y: 0, rotate: 0, duration: 0.8, ease: "elastic.out(1,0.5)", stagger: 0.015 });
  };
  const label = "BOOK A SHOOT";
  return (
    <section className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-ink py-20 md:py-28 text-center" aria-labelledby="cta-title">
      <Image src={photos.lowAngle.src} alt="" fill sizes="100vw" className="object-cover opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/60 to-ink" aria-hidden />
      <div className="wrap relative">
        <p className="eyebrow">Final scene</p>
        <SplitReveal id="cta-title" by="words" className="display mt-6 text-[clamp(2.05rem,7vw,7rem)]">
          Your business. <span className="text-rec">Our lens.</span>
        </SplitReveal>
        <Link
          ref={btn}
          href="/booking"
          onMouseEnter={scatter}
          onFocus={scatter}
          data-cursor="book"
          className="mt-12 inline-flex rounded-full bg-rec max-w-full whitespace-nowrap px-[clamp(1.4rem,5vw,4rem)] py-[clamp(1rem,3vw,2rem)] font-display text-[clamp(1.3rem,6vw,4.5rem)] font-extrabold tracking-tight text-paper transition-colors hover:bg-[#ff5247]"
          aria-label="Book a shoot"
        >
          {label.split("").map((c, i) => (
            <span key={i} data-ch className="inline-block whitespace-pre" aria-hidden>
              {c}
            </span>
          ))}
        </Link>
        <div className="mt-6">
          <a href={waLink(site.whatsapp, "Hi AX.Visuals! I'd like to book a shoot.")} target="_blank" rel="noopener" className="btn-ghost">
            <WhatsAppIcon className="size-4" /> Chat on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}

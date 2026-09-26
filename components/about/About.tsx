"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { SectionLabel } from "@/components/motion/primitives";
import { useMotion } from "@/components/providers/MotionProvider";
import { photos } from "@/content/work";
import { cn } from "@/lib/format";

/* [EDIT] Replace with your real studio story, dates and crew. */
const timeline = [
  { year: "Start", title: "Behind the camera", text: "It started with portraits, celebrations and cinematic Reels for friends and family.", img: photos.profile },
  { year: "Craft", title: "Colour & cut", text: "Grading and editing became the signature — cinematic, warm and made for the scroll.", img: photos.postTubeDark },
  { year: "Culture", title: "Nallur & beyond", text: "Cinematic films of festivals and ceremonies taught us to work fast in real light.", img: photos.cerSirakattum },
  { year: "Now", title: "Content for businesses", text: "Today we build ready-to-post content libraries for restaurants, hotels, products and brands.", img: photos.redWall },
];

export function AboutTimeline() {
  const root = useRef<HTMLElement>(null);
  const { reduced } = useMotion();
  useGSAP(
    () => {
      if (reduced) return;
      gsap.utils.toArray<HTMLElement>("[data-polaroid]").forEach((el, i) => {
        gsap.from(el, {
          y: -160,
          rotate: i % 2 ? 14 : -14,
          opacity: 0,
          duration: 1.2,
          ease: "bounce.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
      });
    },
    { dependencies: [reduced], scope: root },
  );
  return (
    <section ref={root} className="wrap mt-28" aria-labelledby="story-h">
      <SectionLabel n="01">Story</SectionLabel>
      <h2 id="story-h" className="sr-only">
        Studio story
      </h2>
      <ol className="relative mt-12 space-y-16 md:space-y-24 before:absolute before:bottom-0 before:left-4 before:top-0 before:w-px before:bg-line md:before:left-1/2">
        {timeline.map((t, i) => (
          <li key={t.title} className={cn("relative grid items-center gap-8 pl-12 md:grid-cols-2 md:pl-0", i % 2 && "md:[&>*:first-child]:order-2")}>
            <span className="absolute left-[11px] top-3 size-3 rounded-full bg-rec md:left-1/2 md:-ml-1.5" aria-hidden />
            <div className={cn("md:px-14", i % 2 ? "md:text-left" : "md:text-right")}>
              <p className="hud text-rec">{t.year}</p>
              <h3 className="display mt-3 text-[clamp(1.7rem,7vw,2.25rem)]">{t.title}</h3>
              <p className="mt-3 text-paper/80">{t.text}</p>
            </div>
            <div className={cn("flex md:px-14", i % 2 ? "md:justify-end" : "md:justify-start")}>
              <figure data-polaroid className="w-[min(100%,300px)] bg-[#f4f2ee] p-3 pb-10 shadow-2xl" style={{ rotate: `${i % 2 ? 3 : -3}deg` }}>
                <div className="relative aspect-square overflow-hidden">
                  <Image src={t.img.src} alt={t.img.alt} fill sizes="300px" className="object-cover" />
                </div>
                <figcaption className="mt-3 text-center font-mono text-xs text-ink/70">{t.title.toLowerCase()}</figcaption>
              </figure>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* [EDIT] real crew */
const crew = [
  { name: "[EDIT] Founder name", role: "Director · DOP · Colourist", gear: ["A-cam body [EDIT]", "35mm prime", "Gimbal"] },
  { name: "[EDIT] Crew name", role: "Editor · Motion", gear: ["Editing suite [EDIT]", "Reference monitor", "Coffee"] },
];

export function CrewCards() {
  return (
    <section className="wrap mt-32" aria-labelledby="crew-h">
      <SectionLabel n="02">Crew</SectionLabel>
      <h2 id="crew-h" className="display mt-5 text-[clamp(2rem,4vw,3.6rem)]">
        The people behind the lens.
      </h2>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {crew.map((c, i) => (
          <div key={c.name} className="group aspect-[4/5] [perspective:1200px]">
            <div className="relative size-full transition-transform duration-700 ease-[var(--ease-expo)] [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] group-focus-within:[transform:rotateY(180deg)]">
              <div className="absolute inset-0 overflow-hidden rounded-2xl border border-line bg-ink-2 [backface-visibility:hidden]">
                <Image src={[photos.tubeForward, photos.lowAngle][i % 2].src} alt="" fill sizes="33vw" className="object-cover opacity-60 grayscale" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black p-6 pt-20">
                  <p className="font-display text-2xl font-extrabold uppercase">{c.name}</p>
                  <p className="hud mt-1 text-mute">{c.role}</p>
                </div>
                <button type="button" className="hud absolute right-4 top-4 rounded-full border border-line px-3 py-1.5 text-paper/80">
                  Flip ↻
                </button>
              </div>
              <div className="absolute inset-0 flex flex-col justify-center rounded-2xl border border-rec/50 bg-ink-2 p-8 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                <p className="hud text-rec">Gear I can&apos;t live without</p>
                <ul className="mt-6 space-y-3">
                  {c.gear.map((g) => (
                    <li key={g} className="font-display text-2xl font-bold uppercase">
                      {g}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* [EDIT] your real kit */
const gear = [
  { name: "Cinema camera", type: "Camera", spec: "4K · 24/60fps · 10-bit · [EDIT model]", w: 2 },
  { name: "35mm f/1.8", type: "Lens", spec: "Everyday storyteller · [EDIT]", w: 1 },
  { name: "85mm f/1.8", type: "Lens", spec: "Portraits & product detail · [EDIT]", w: 1 },
  { name: "Gimbal", type: "Support", spec: "Smooth walk-throughs · [EDIT]", w: 1 },
  { name: "Drone", type: "Aerial", spec: "4K aerials · [EDIT model / licence]", w: 2 },
  { name: "LED panels ×2", type: "Light", spec: "Bi-colour · softboxes · [EDIT]", w: 2 },
  { name: "Wireless mics", type: "Audio", spec: "Dual-channel lav · [EDIT]", w: 1 },
];

export function GearLocker() {
  const [hover, setHover] = useState<number | null>(null);
  return (
    <section className="wrap mt-32" aria-labelledby="gear-h">
      <SectionLabel n="03">Gear locker</SectionLabel>
      <h2 id="gear-h" className="display mt-5 text-[clamp(2rem,4vw,3.6rem)]">
        The kit.
      </h2>
      <div className="mt-10 rounded-2xl border border-line bg-[linear-gradient(#141416,#0e0e10)] p-4 sm:p-6">
        {[0, 1].map((shelf) => (
          <div key={shelf} className="relative grid grid-cols-2 gap-3 border-b-8 border-[#2a2420] pb-3 pt-6 sm:grid-cols-4">
            {gear
              .map((g, i) => ({ g, i }))
              .filter(({ i }) => (shelf === 0 ? i < 4 : i >= 4))
              .map(({ g, i }) => (
                <button
                  key={g.name}
                  type="button"
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                  onFocus={() => setHover(i)}
                  onBlur={() => setHover(null)}
                  className={cn("relative flex h-28 flex-col justify-end rounded-lg border border-line bg-black/40 p-3 text-left transition-all hover:-translate-y-1 hover:border-paper/50", g.w === 2 && "sm:col-span-2")}
                >
                  <span className="hud text-mute">{g.type}</span>
                  <span className="font-display text-lg font-extrabold uppercase">{g.name}</span>
                  {hover === i && (
                    <span role="tooltip" className="hud absolute -top-3 left-3 z-10 -translate-y-full whitespace-nowrap rounded border border-rec bg-ink px-3 py-2 text-paper">
                      <span className="text-rec">●</span> {g.spec}
                    </span>
                  )}
                </button>
              ))}
          </div>
        ))}
      </div>
    </section>
  );
}

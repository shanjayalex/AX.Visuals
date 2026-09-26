"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { Photo, Project } from "@/content/work";
import { useMotion } from "@/components/providers/MotionProvider";
import { cn } from "@/lib/format";

/* ------------------------------------------------------------------ */
/* Gallery + lightbox (swipe, keyboard, pinch/zoom, EXIF panel)        */
/* ------------------------------------------------------------------ */
export function Gallery({ photos, camera }: { photos: Photo[]; camera: string }) {
  const [idx, setIdx] = useState<number | null>(null);
  const pattern = ["md:col-span-7", "md:col-span-5", "md:col-span-5", "md:col-span-7", "md:col-span-12"];
  return (
    <>
      <div className="grid gap-4 md:grid-cols-12">
        {photos.map((p, i) => (
          <button
            key={p.src}
            type="button"
            onClick={() => setIdx(i)}
            data-cursor="view"
            className={cn("group relative overflow-hidden rounded-lg bg-ink-2", pattern[i % pattern.length], p.w > p.h ? "aspect-[3/2]" : "aspect-[4/5]")}
            aria-label={`Open image ${i + 1}: ${p.alt}`}
          >
            <Image src={p.src} alt={p.alt} fill sizes="(max-width:768px) 100vw, 60vw" className="object-cover transition-transform duration-[1.2s] ease-[var(--ease-expo)] group-hover:scale-[1.04]" />
          </button>
        ))}
      </div>
      <Lightbox photos={photos} index={idx} setIndex={setIdx} camera={camera} />
    </>
  );
}

function Lightbox({ photos, index, setIndex, camera }: { photos: Photo[]; index: number | null; setIndex: (i: number | null) => void; camera: string }) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [exif, setExif] = useState(false);
  const touch = useRef<{ x: number; y: number; d?: number; z?: number } | null>(null);
  const { lenis } = useMotion();
  const open = index !== null;
  const go = useCallback(
    (d: number) => {
      if (index === null) return;
      setZoom(1);
      setPan({ x: 0, y: 0 });
      setIndex((index + d + photos.length) % photos.length);
    },
    [index, photos.length, setIndex],
  );

  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    const k = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIndex(null);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "+" || e.key === "=") setZoom((z) => Math.min(z + 0.5, 4));
      if (e.key === "-") setZoom((z) => Math.max(z - 0.5, 1));
      if (e.key.toLowerCase() === "i") setExif((x) => !x);
    };
    window.addEventListener("keydown", k);
    return () => {
      lenis?.start();
      window.removeEventListener("keydown", k);
    };
  }, [open, go, setIndex, lenis]);

  if (typeof document === "undefined") return null;
  const p = index !== null ? photos[index] : null;
  return createPortal(
    <AnimatePresence>
      {p && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
          className="fixed inset-0 z-[160] bg-black/95"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onWheel={(e) => setZoom((z) => Math.min(4, Math.max(1, z - e.deltaY * 0.002)))}
          onTouchStart={(e) => {
            const t = e.touches;
            touch.current = t.length === 2 ? { x: 0, y: 0, d: Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY), z: zoom } : { x: t[0].clientX, y: t[0].clientY };
          }}
          onTouchMove={(e) => {
            const t = e.touches;
            if (t.length === 2 && touch.current?.d) {
              const d = Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);
              setZoom(Math.min(4, Math.max(1, (touch.current.z ?? 1) * (d / touch.current.d))));
            }
          }}
          onTouchEnd={(e) => {
            const s = touch.current;
            touch.current = null;
            if (!s || s.d || zoom > 1) return;
            const dx = e.changedTouches[0].clientX - s.x;
            if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
          }}
        >
          <motion.div
            key={p.src}
            className="absolute inset-0 m-auto h-[82vh] w-[92vw] cursor-grab active:cursor-grabbing"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: zoom, x: pan.x, y: pan.y }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            drag={zoom > 1}
            dragMomentum={false}
            onDragEnd={(_, info) => setPan((q) => ({ x: q.x + info.offset.x, y: q.y + info.offset.y }))}
            onDoubleClick={() => {
              setZoom((z) => (z > 1 ? 1 : 2.2));
              setPan({ x: 0, y: 0 });
            }}
          >
            <Image src={p.src} alt={p.alt} fill sizes="92vw" quality={85} className="object-contain" priority />
          </motion.div>

          <div className="hud absolute inset-x-0 top-0 flex items-center justify-between p-5 text-paper/80">
            <span>
              {String((index ?? 0) + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}
            </span>
            <span className="flex gap-2">
              <button type="button" onClick={() => setExif((x) => !x)} className="rounded-full border border-line px-3 py-1.5 hover:border-paper" aria-pressed={exif}>
                ⓘ EXIF
              </button>
              <button type="button" onClick={() => setZoom((z) => (z > 1 ? 1 : 2.2))} className="rounded-full border border-line px-3 py-1.5 hover:border-paper">
                {zoom > 1 ? "− ZOOM" : "+ ZOOM"}
              </button>
              <button type="button" onClick={() => setIndex(null)} className="rounded-full border border-line px-3 py-1.5 hover:border-paper" autoFocus>
                ✕ CLOSE
              </button>
            </span>
          </div>
          <button type="button" onClick={() => go(-1)} className="absolute left-3 top-1/2 size-12 -translate-y-1/2 rounded-full border border-line bg-black/40 text-paper hover:border-paper" aria-label="Previous image">
            ←
          </button>
          <button type="button" onClick={() => go(1)} className="absolute right-3 top-1/2 size-12 -translate-y-1/2 rounded-full border border-line bg-black/40 text-paper hover:border-paper" aria-label="Next image">
            →
          </button>
          <AnimatePresence>
            {exif && (
              <motion.dl
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                className="hud absolute bottom-5 left-5 grid grid-cols-[auto_auto] gap-x-4 gap-y-1 rounded-lg border border-line bg-black/70 p-4 text-paper/85"
              >
                <dt className="text-mute">SETTINGS</dt>
                <dd>{camera}</dd>
                <dt className="text-mute">SIZE</dt>
                <dd>
                  {p.w} × {p.h}
                </dd>
                <dt className="text-mute">GRADE</dt>
                <dd>AX FILM LUT</dd>
              </motion.dl>
            )}
          </AnimatePresence>
          <p className="hud absolute bottom-5 right-5 hidden text-mute sm:block">← → navigate · + − zoom · I exif · esc close</p>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

/* ------------------------------------------------------------------ */
/* Before / After colour-grade slider                                  */
/* ------------------------------------------------------------------ */
export function GradeSlider({ photo, before }: { photo: Photo; before?: string }) {
  const [pos, setPos] = useState(50);
  const box = useRef<HTMLDivElement>(null);
  const drag = (clientX: number) => {
    const r = box.current!.getBoundingClientRect();
    setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  };
  return (
    <div>
      <div
        ref={box}
        className="relative aspect-[3/2] touch-none select-none overflow-hidden rounded-xl bg-ink-2"
        data-cursor="drag"
        onPointerDown={(e) => {
          (e.target as HTMLElement).setPointerCapture(e.pointerId);
          drag(e.clientX);
        }}
        onPointerMove={(e) => e.buttons && drag(e.clientX)}
      >
        <Image src={photo.src} alt={`${photo.alt} — graded`} fill sizes="(max-width:768px) 100vw, 80vw" className="object-cover" />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <Image
            src={before ?? photo.src}
            alt={`${photo.alt} — ungraded`}
            fill
            sizes="(max-width:768px) 100vw, 80vw"
            className="object-cover"
            style={before ? undefined : { filter: "saturate(0.45) contrast(0.72) brightness(1.12) sepia(0.08)" }}
          />
        </div>
        <div className="absolute inset-y-0 w-px bg-paper" style={{ left: `${pos}%` }}>
          <span className="absolute left-1/2 top-1/2 flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-paper bg-ink/70 text-xs backdrop-blur">⟷</span>
        </div>
        <span className="hud absolute left-3 top-3 rounded bg-black/60 px-2 py-1">{before ? "UNGRADED" : "LOG (SIMULATED)"}</span>
        <span className="hud absolute right-3 top-3 rounded bg-black/60 px-2 py-1">GRADED</span>
      </div>
      <label className="sr-only" htmlFor="grade-range">
        Compare ungraded and graded
      </label>
      <input id="grade-range" type="range" min={0} max={100} value={pos} onChange={(e) => setPos(Number(e.target.value))} className="mt-4 w-full accent-[#FF3B2F]" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Credits roll                                                        */
/* ------------------------------------------------------------------ */
export function CreditsRoll({ project }: { project: Project }) {
  const ref = useRef<HTMLDivElement>(null);
  const { reduced } = useMotion();
  useGSAP(
    () => {
      if (reduced) return;
      gsap.fromTo(
        "[data-roll]",
        { yPercent: 60 },
        { yPercent: -60, ease: "none", scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true } },
      );
    },
    { dependencies: [reduced], scope: ref },
  );
  return (
    <div ref={ref} className="relative h-[70vh] overflow-hidden bg-black [mask-image:linear-gradient(transparent,#000_25%,#000_75%,transparent)]">
      <div data-roll className="absolute inset-x-0 top-0 flex flex-col items-center gap-8 py-[20vh] text-center">
        <p className="hud text-mute">A film by</p>
        <p className="display text-4xl">AX.Visuals</p>
        {project.credits.map((c) => (
          <div key={c.role}>
            <p className="hud text-mute">{c.role}</p>
            <p className="mt-1 text-xl">{c.name}</p>
          </div>
        ))}
        <div>
          <p className="hud text-mute">Client</p>
          <p className="mt-1 text-xl">{project.client}</p>
        </div>
        <div>
          <p className="hud text-mute">Location</p>
          <p className="mt-1 text-xl">{project.location}</p>
        </div>
        <p className="hud mt-6 text-mute">Shot in Sri Lanka 🇱🇰 · {project.year}</p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Next project — hero expands to full screen before navigating        */
/* ------------------------------------------------------------------ */
export function NextProject({ project, image }: { project: Project; image: string }) {
  const box = useRef<HTMLAnchorElement>(null);
  const [expanding, setExpanding] = useState(false);
  const router = useRouter();
  return (
    <Link
      ref={box}
      href={`/work/${project.slug}`}
      data-no-transition
      data-cursor="view"
      onClick={(e) => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        e.preventDefault();
        setExpanding(true);
        const r = box.current!.getBoundingClientRect();
        const clone = box.current!.querySelector("[data-hero]")!.cloneNode(true) as HTMLElement;
        Object.assign(clone.style, { position: "fixed", left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, height: `${r.height}px`, zIndex: "140", borderRadius: "16px", overflow: "hidden" });
        document.body.appendChild(clone);
        gsap.to(clone, {
          left: 0,
          top: 0,
          width: "100vw",
          height: "100vh",
          borderRadius: 0,
          duration: 0.8,
          ease: "expo.inOut",
          onComplete: () => {
            router.push(`/work/${project.slug}`);
            gsap.to(clone, { opacity: 0, delay: 0.7, duration: 0.5, onComplete: () => clone.remove() });
          },
        });
      }}
      className="group relative block"
    >
      <p className="hud mb-4 text-mute">Next project →</p>
      <div data-hero className="relative aspect-[21/9] overflow-hidden rounded-2xl bg-ink-2">
        <Image src={image} alt="" fill sizes="100vw" className={cn("object-cover transition-transform duration-[1.2s] group-hover:scale-105", expanding && "opacity-0")} />
        <div className="absolute inset-0 bg-black/40" />
        <p className="display absolute bottom-6 left-6 text-[clamp(2.05rem,7vw,7rem)]">{project.title}</p>
      </div>
    </Link>
  );
}

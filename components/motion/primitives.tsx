"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode, type ComponentPropsWithoutRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { useMotion } from "@/components/providers/MotionProvider";
import { cn, formatLKR } from "@/lib/format";
import { sound } from "@/lib/sound";

/* ------------------------------------------------------------------ */
/* SplitReveal — lines rise from behind a mask                         */
/* ------------------------------------------------------------------ */
export function SplitReveal<T extends ElementType = "h2">({
  as,
  children,
  className,
  delay = 0,
  immediate = false,
  by = "lines",
  id,
}: {
  id?: string;
  as?: T;
  children: ReactNode;
  className?: string;
  delay?: number;
  immediate?: boolean;
  by?: "lines" | "words" | "chars";
}) {
  const Tag = (as ?? "h2") as ElementType;
  const ref = useRef<HTMLElement>(null);
  const { reduced } = useMotion();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || reduced) return;
      let split: SplitText | null = null;
      const run = () => {
        split = SplitText.create(el, {
          type: by === "chars" ? "words,chars" : by === "words" ? "words" : "lines",
          mask: by === "chars" ? "words" : by,
          autoSplit: by === "lines",
          onSplit(self) {
            const targets = by === "chars" ? self.chars : by === "words" ? self.words : self.lines;
            return gsap.from(targets, {
              yPercent: 110,
              duration: 1.1,
              stagger: by === "chars" ? 0.02 : 0.06,
              ease: "expo.out",
              delay,
              scrollTrigger: immediate ? undefined : { trigger: el, start: "top 88%", once: true },
            });
          },
        });
      };
      if (document.fonts?.status === "loaded") run();
      else document.fonts?.ready.then(run);
      return () => split?.revert();
    },
    { dependencies: [reduced], scope: ref },
  );

  return (
    <Tag ref={ref} id={id} className={className}>
      {children}
    </Tag>
  );
}

/* ------------------------------------------------------------------ */
/* Reveal — simple fade/rise for blocks                                */
/* ------------------------------------------------------------------ */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 40,
  stagger = 0,
  as = "div",
  ...rest
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  stagger?: number;
  as?: ElementType;
} & Omit<ComponentPropsWithoutRef<"div">, "children">) {
  const Tag = as as ElementType;
  const ref = useRef<HTMLElement>(null);
  const { reduced } = useMotion();
  useGSAP(
    () => {
      if (!ref.current) return;
      const targets = stagger ? ref.current.children : ref.current;
      if (reduced) {
        gsap.from(targets, { opacity: 0, duration: 0.4 });
        return;
      }
      gsap.from(targets, {
        y,
        opacity: 0,
        duration: 1,
        ease: "expo.out",
        delay,
        stagger,
        scrollTrigger: { trigger: ref.current, start: "top 90%", once: true },
      });
    },
    { dependencies: [reduced], scope: ref },
  );
  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  );
}

/* ------------------------------------------------------------------ */
/* RollingNumber — mechanical digit roll; always settles on exact value */
/* ------------------------------------------------------------------ */
export function RollingNumber({
  value,
  format = "plain",
  className,
  duration = 1.4,
}: {
  value: number;
  format?: "plain" | "lkr" | "pad2";
  className?: string;
  duration?: number;
}) {
  const text = format === "lkr" ? formatLKR(value) : format === "pad2" ? String(value).padStart(2, "0") : value.toLocaleString("en-US");
  const ref = useRef<HTMLSpanElement>(null);
  const { reduced } = useMotion();
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setArmed(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  let digitIndex = 0;
  return (
    <span ref={ref} className={cn("inline-flex items-end whitespace-nowrap leading-[1.1] tabular-nums", className)} aria-label={text}>
      {text.split("").map((ch, i) => {
        if (!/\d/.test(ch)) return <span key={i} aria-hidden className="inline-block h-[1.1em] whitespace-pre leading-[1.1]">{ch}</span>;
        const d = Number(ch);
        const idx = digitIndex++;
        return (
          <span key={i} aria-hidden className="relative inline-block h-[1.1em] overflow-hidden text-center leading-[1.1]">
            <span className="invisible">{d}</span>
            <span
              className="absolute inset-x-0 top-0 flex flex-col"
              style={{
                transform: `translateY(${reduced || armed ? -(d + 10) * 1.1 : 0}em)`,
                transition: reduced ? "none" : `transform ${duration + idx * 0.08}s cubic-bezier(0.16,1,0.3,1) ${idx * 0.04}s`,
              }}
            >
              {Array.from({ length: 20 }, (_, n) => (
                <span key={n} className="block h-[1.1em] leading-[1.1]">
                  {n % 10}
                </span>
              ))}
            </span>
          </span>
        );
      })}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* ShutterImage — clip-path shutter wipe + slow Ken Burns              */
/* ------------------------------------------------------------------ */
export function ShutterImage({
  src,
  alt,
  className,
  sizes = "(max-width: 768px) 100vw, 50vw",
  priority,
  imgClassName,
  style,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  imgClassName?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { reduced } = useMotion();
  useGSAP(
    () => {
      const el = ref.current;
      if (!el || reduced) return;
      const img = el.querySelector("img");
      gsap.fromTo(
        el,
        { clipPath: "inset(0% 0% 100% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.3,
          ease: "expo.inOut",
          scrollTrigger: { trigger: el, start: "top 88%", once: true, onEnter: () => sound.shutter() },
        },
      );
      if (img)
        gsap.fromTo(
          img,
          { scale: 1.25 },
          { scale: 1.05, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } },
        );
    },
    { dependencies: [reduced], scope: ref },
  );
  return (
    <div ref={ref} className={cn("relative overflow-hidden bg-ink-2", className)} style={style}>
      <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className={cn("object-cover will-change-transform", imgClassName)} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Magnetic — element drifts towards the pointer                       */
/* ------------------------------------------------------------------ */
export function Magnetic({ children, strength = 0.35, className }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { reduced } = useMotion();
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced || !window.matchMedia("(pointer: fine)").matches) return;
    const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "elastic.out(1,0.4)" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "elastic.out(1,0.4)" });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * strength);
      yTo((e.clientY - (r.top + r.height / 2)) * strength);
    };
    const leave = () => {
      xTo(0);
      yTo(0);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [reduced, strength]);
  return (
    <div ref={ref} data-magnetic className={cn("inline-block", className)}>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Timecode                                                            */
/* ------------------------------------------------------------------ */
export function useTimecode(running = true, fps = 24) {
  const [tc, setTc] = useState("00:00:00:00");
  useEffect(() => {
    if (!running) return;
    const start = performance.now();
    let raf = 0;
    const tick = () => {
      const ms = performance.now() - start;
      const f = Math.floor((ms / 1000) * fps);
      const ff = f % fps;
      const s = Math.floor(f / fps);
      const p = (n: number) => String(n).padStart(2, "0");
      setTc(`${p(Math.floor(s / 3600))}:${p(Math.floor(s / 60) % 60)}:${p(s % 60)}:${p(ff)}`);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running, fps]);
  return tc;
}

export function Timecode({ className }: { className?: string }) {
  const tc = useTimecode();
  return <span className={cn("font-mono tabular-nums", className)}>{tc}</span>;
}

/* ------------------------------------------------------------------ */
/* SectionLabel — "● 02 / SECTION NAME" header strip                   */
/* ------------------------------------------------------------------ */
export function SectionLabel({ n, children, className }: { n: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn("eyebrow flex items-center gap-3", className)}>
      <span className="text-paper">{n}</span>
      <span className="h-px w-10 bg-line" />
      <span>{children}</span>
    </div>
  );
}

export { ScrollTrigger };

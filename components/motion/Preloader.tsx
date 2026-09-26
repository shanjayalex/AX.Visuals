"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ApertureSVG } from "./Aperture";
import { Logo } from "@/components/brand/Logo";
import { sound } from "@/lib/sound";

/** "Aperture open" — full 000→100 counter once per session, a quick 0.6s iris afterwards. */
export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(0);
  const [done, setDone] = useState(false);
  const [quick, setQuick] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let seen = false;
    try {
      seen = sessionStorage.getItem("ax-loaded") === "1";
      sessionStorage.setItem("ax-loaded", "1");
    } catch {}
    const isQuick = seen || reduced;
    setQuick(isQuick);
    document.documentElement.style.overflow = "hidden";

    const el = root.current!;
    const counter = { v: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        document.documentElement.style.overflow = "";
        setDone(true);
      },
    });
    if (!isQuick) {
      tl.to(counter, {
        v: 100,
        duration: 2.2,
        ease: "power2.inOut",
        onUpdate: () => setCount(Math.round(counter.v)),
      });
    }
    tl.add(() => {
      setOpen(1);
      sound.shutter();
    })
      .fromTo(
        el,
        { "--r": "0vmax" },
        { "--r": "150vmax", duration: isQuick ? 0.6 : 1.1, ease: "expo.in", delay: isQuick ? 0 : 0.25 },
      )
      .to(el, { autoAlpha: 0, duration: 0.2 });
    return () => {
      tl.kill();
      document.documentElement.style.overflow = "";
    };
  }, []);

  if (done) return null;

  const frames = String(count).padStart(3, "0");
  const tcFrames = Math.floor((count / 100) * 72);
  const tc = `00:00:${String(Math.floor(tcFrames / 24)).padStart(2, "0")}:${String(tcFrames % 24).padStart(2, "0")}`;

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-ink text-paper no-print"
      style={{
        WebkitMaskImage: "radial-gradient(circle at 50% 50%, transparent var(--r, 0vmax), #000 calc(var(--r, 0vmax) + 1px))",
        maskImage: "radial-gradient(circle at 50% 50%, transparent var(--r, 0vmax), #000 calc(var(--r, 0vmax) + 1px))",
      }}
      aria-live="polite"
      aria-label="Loading AX.Visuals"
    >
      <div className="relative flex flex-col items-center gap-8">
        <div className="relative size-[min(52vw,260px)]">
          <ApertureSVG className="absolute inset-0 size-full text-paper/70" open={open} />
          {!quick && <Logo animate="mount" wordmark={false} delay={0.2} className="absolute left-1/2 top-1/2 w-[34%] -translate-x-1/2 -translate-y-1/2 text-paper" />}
        </div>
        {!quick && (
          <div className="flex items-center gap-6 hud text-mute">
            <span className="flex items-center gap-2 text-paper">
              <span className="rec-dot" /> REC
            </span>
            <span className="tabular-nums text-paper">FRAME {frames}</span>
            <span className="tabular-nums">{tc}</span>
          </div>
        )}
      </div>
    </div>
  );
}

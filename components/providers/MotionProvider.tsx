"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Flip } from "gsap/Flip";
import { useGSAP } from "@gsap/react";
import { usePathname } from "next/navigation";
import { sound } from "@/lib/sound";

gsap.registerPlugin(ScrollTrigger, SplitText, Flip, useGSAP);

interface MotionCtx {
  reduced: boolean;
  lenis: Lenis | null;
}

const Ctx = createContext<MotionCtx>({ reduced: false, lenis: null });
export const useMotion = () => useContext(Ctx);

export function MotionProvider({ children }: { children: ReactNode }) {
  const [reduced, setReduced] = useState(false);
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    sound.init();
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const l = new Lenis({ lerp: 0.08, smoothWheel: true });
    l.on("scroll", ScrollTrigger.update);
    const raf = (t: number) => l.raf(t * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    setLenis(l);
    return () => {
      gsap.ticker.remove(raf);
      l.destroy();
      setLenis(null);
    };
  }, [reduced]);

  // New route: jump to top and let triggers re-measure once the page has laid out
  useEffect(() => {
    lenis?.scrollTo(0, { immediate: true });
    if (!lenis) window.scrollTo(0, 0);
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 250);
    return () => window.clearTimeout(id);
  }, [pathname, lenis]);

  return <Ctx.Provider value={{ reduced, lenis }}>{children}</Ctx.Provider>;
}

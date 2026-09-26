"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { gsap } from "gsap";
import { sound } from "@/lib/sound";

/**
 * Iris wipe between routes: closes on the old page, opens on the new one.
 * Intercepts clicks on internal <a> links (Next <Link> renders <a>).
 */
export function PageTransition() {
  const overlay = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const closed = useRef(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement).closest("a");
      if (!a || a.target === "_blank" || a.hasAttribute("download") || a.dataset.noTransition !== undefined) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin) return;
      if (url.pathname === location.pathname) return; // same page (tabs / hashes / query)
      e.preventDefault();
      const el = overlay.current!;
      closed.current = true;
      sound.shutter();
      gsap.set(el, { autoAlpha: 1 });
      gsap.fromTo(
        el,
        { "--r": "150vmax" },
        {
          "--r": "0vmax",
          duration: 0.55,
          ease: "expo.in",
          onComplete: () => router.push(url.pathname + url.search + url.hash),
        },
      );
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [router]);

  useEffect(() => {
    if (!closed.current) return;
    closed.current = false;
    const el = overlay.current!;
    gsap.fromTo(
      el,
      { "--r": "0vmax" },
      { "--r": "150vmax", duration: 0.8, ease: "expo.out", delay: 0.1, onComplete: () => gsap.set(el, { autoAlpha: 0 }) },
    );
  }, [pathname]);

  return (
    <div
      ref={overlay}
      aria-hidden
      className="pointer-events-none invisible fixed inset-0 z-[150] bg-ink opacity-0 no-print"
      style={{
        WebkitMaskImage: "radial-gradient(circle at 50% 50%, transparent var(--r, 150vmax), #000 calc(var(--r, 150vmax) + 1px))",
        maskImage: "radial-gradient(circle at 50% 50%, transparent var(--r, 150vmax), #000 calc(var(--r, 150vmax) + 1px))",
      }}
    />
  );
}

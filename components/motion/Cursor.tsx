"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useMotion } from "@/components/providers/MotionProvider";

/**
 * Dot + lagging ring. Any element with data-cursor="view|play|drag|book|focus"
 * changes the ring's label. Elements with data-magnetic pull the ring in.
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);
  const [active, setActive] = useState(false);
  const { reduced } = useMotion();

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine || reduced || !dot.current || !ring.current) return;

    const dx = gsap.quickTo(dot.current, "x", { duration: 0.08, ease: "power3" });
    const dy = gsap.quickTo(dot.current, "y", { duration: 0.08, ease: "power3" });
    const rx = gsap.quickTo(ring.current, "x", { duration: 0.45, ease: "power3" });
    const ry = gsap.quickTo(ring.current, "y", { duration: 0.45, ease: "power3" });

    // The native pointer is only hidden once the custom one is actually tracking the mouse
    let started = false;
    let current: string | null = null;
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      if (!started) {
        started = true;
        gsap.set([dot.current, ring.current], { x: e.clientX, y: e.clientY });
        document.documentElement.classList.add("has-cursor");
        setActive(true);
      }
      dx(e.clientX);
      dy(e.clientY);
      const t = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-cursor],a,button,[role=tab],input,textarea,select,label");
      const mag = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-magnetic]");
      if (mag) {
        const r = mag.getBoundingClientRect();
        rx(r.left + r.width / 2 + (e.clientX - (r.left + r.width / 2)) * 0.25);
        ry(r.top + r.height / 2 + (e.clientY - (r.top + r.height / 2)) * 0.25);
      } else {
        rx(e.clientX);
        ry(e.clientY);
      }
      const next = t?.dataset.cursor ?? (t ? "link" : null);
      if (next !== current) {
        current = next;
        setLabel(next);
      }
    };
    const leave = () => gsap.to([dot.current, ring.current], { opacity: 0, duration: 0.2 });
    const enter = () => gsap.to([dot.current, ring.current], { opacity: 1, duration: 0.2 });
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    document.addEventListener("pointerenter", enter);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
      document.removeEventListener("pointerenter", enter);
      document.documentElement.classList.remove("has-cursor");
    };
  }, [reduced]);


  const text = label && !["link", "focus"].includes(label) ? label.toUpperCase() : null;
  const big = !!text;
  const focus = label === "focus";

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[250] no-print" style={{ opacity: active ? 1 : 0, transition: "opacity .3s" }}>
      <div ref={dot} className="absolute left-0 top-0 -ml-1 -mt-1 size-2 rounded-full bg-rec" />
      <div ref={ring} className="absolute left-0 top-0">
        <div
          className="flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border transition-[width,height,background,border-color] duration-300 ease-[var(--ease-expo)]"
          style={{
            width: big ? 84 : focus ? 64 : label === "link" ? 46 : 32,
            height: big ? 84 : focus ? 64 : label === "link" ? 46 : 32,
            borderColor: big ? "transparent" : "rgba(244,242,238,.55)",
            background: big ? "var(--color-paper)" : "transparent",
            borderRadius: focus ? 4 : 999,
          }}
        >
          {text && <span className="hud font-semibold text-ink">{text}</span>}
          {focus && (
            <>
              <span className="absolute left-1/2 top-1/2 h-3 w-px -translate-x-1/2 -translate-y-1/2 bg-paper" />
              <span className="absolute left-1/2 top-1/2 h-px w-3 -translate-x-1/2 -translate-y-1/2 bg-paper" />
            </>
          )}
        </div>
      </div>
    </div>
  );
}


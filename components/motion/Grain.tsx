"use client";

import { useEffect, useRef } from "react";
import { useMotion } from "@/components/providers/MotionProvider";

/** Animated film grain + vignette. Grain strength rises slightly with scroll velocity. */
export function Grain() {
  const ref = useRef<HTMLCanvasElement>(null);
  const { reduced, lenis } = useMotion();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const c = canvas.getContext("2d", { alpha: true });
    if (!c) return;
    const size = 160;
    canvas.width = size;
    canvas.height = size;
    const frames: ImageData[] = [];
    for (let f = 0; f < 6; f++) {
      const img = c.createImageData(size, size);
      for (let i = 0; i < img.data.length; i += 4) {
        const v = Math.random() * 255;
        img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
        img.data[i + 3] = 255;
      }
      frames.push(img);
    }
    let i = 0;
    let raf = 0;
    let last = 0;
    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      if (t - last < 1000 / 24) return; // 24fps grain
      last = t;
      c.putImageData(frames[i++ % frames.length], 0, 0);
      const v = Math.min(Math.abs(lenis?.velocity ?? 0) / 60, 1);
      canvas.style.opacity = String(0.045 + v * 0.035);
    };
    if (reduced) c.putImageData(frames[0], 0, 0);
    else raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [reduced, lenis]);

  return (
    <>
      <canvas
        ref={ref}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[90] h-full w-full opacity-[0.05] mix-blend-overlay [image-rendering:pixelated] no-print"
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[89] no-print"
        style={{ background: "radial-gradient(120% 90% at 50% 45%, transparent 55%, rgba(0,0,0,.45) 100%)" }}
      />
    </>
  );
}

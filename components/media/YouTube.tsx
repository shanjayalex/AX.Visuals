"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ytThumb } from "@/content/work";
import { cn } from "@/lib/format";
import { useMotion } from "@/components/providers/MotionProvider";

const embed = (id: string, opts: Record<string, string | number> = {}) => {
  const q = new URLSearchParams({
    autoplay: "1",
    mute: "1",
    controls: "0",
    loop: "1",
    playlist: id,
    playsinline: "1",
    modestbranding: "1",
    rel: "0",
    iv_load_policy: "3",
    disablekb: "1",
    ...Object.fromEntries(Object.entries(opts).map(([k, v]) => [k, String(v)])),
  });
  return `https://www.youtube-nocookie.com/embed/${id}?${q}`;
};

/**
 * An iframe scaled to *cover* its container (like object-fit: cover),
 * whatever the container's aspect ratio. `aspect` is the video's w/h.
 */
function CoverFrame({ id, aspect, title, className }: { id: string; aspect: number; title: string; className?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ w: 0, h: 0 });
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => {
      const { width, height } = e.contentRect;
      const w = Math.max(width, height * aspect);
      setDims({ w: w * 1.02, h: (w / aspect) * 1.02 });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [aspect]);
  return (
    <div ref={box} className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      {dims.w > 0 && (
        <iframe
          src={embed(id)}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture"
          tabIndex={-1}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border-0"
          style={{ width: dims.w, height: dims.h }}
        />
      )}
    </div>
  );
}

/** Muted autoplay background (hero, bands). Shows the poster until the player has had time to start. */
export function YouTubeBackground({
  id,
  aspect = 16 / 9,
  poster,
  className,
  title = "AX.Visuals showreel",
}: {
  id: string;
  aspect?: number;
  poster: string;
  className?: string;
  title?: string;
}) {
  const [load, setLoad] = useState(false);
  const [visible, setVisible] = useState(false);
  const { reduced } = useMotion();
  useEffect(() => {
    if (reduced) return;
    // Poster first for LCP; bring the video in after idle, desktop & mobile alike
    const idle = (window as Window & { requestIdleCallback?: (cb: () => void) => number }).requestIdleCallback;
    const start = () => setLoad(true);
    const h = idle ? idle(start) : window.setTimeout(start, 1200);
    return () => {
      if (!idle) window.clearTimeout(h as number);
    };
  }, [reduced]);
  useEffect(() => {
    if (!load) return;
    const t = window.setTimeout(() => setVisible(true), 2200);
    return () => window.clearTimeout(t);
  }, [load]);
  return (
    <div className={cn("absolute inset-0 overflow-hidden bg-ink", className)}>
      <Image src={poster} alt="" fill priority sizes="100vw" className="object-cover" />
      {load && <CoverFrame id={id} aspect={aspect} title={title} className={cn("transition-opacity duration-1000", visible ? "opacity-100" : "opacity-0")} />}
    </div>
  );
}

/** Thumbnail that plays the (muted) video on hover / focus. */
export function ReelCard({
  id,
  title,
  aspect = 16 / 9,
  className,
  children,
  label,
  quality = "maxresdefault",
}: {
  id: string;
  title: string;
  aspect?: number;
  className?: string;
  children?: ReactNode;
  label?: string;
  quality?: "hqdefault" | "maxresdefault" | "sddefault";
}) {
  const [hover, setHover] = useState(false);
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onFocus={() => setHover(true)}
        onBlur={() => setHover(false)}
        onClick={() => setOpen(true)}
        data-cursor="play"
        aria-label={`Play ${title}`}
        className={cn("group relative block w-full overflow-hidden bg-ink-2 text-left", className)}
      >
        <Image
          src={ytThumb(id, quality)}
          alt={title}
          fill
          sizes="(max-width: 768px) 60vw, 25vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {hover && <CoverFrame id={id} aspect={aspect} title={title} />}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
        <div className="pointer-events-none absolute inset-x-3 top-3 flex items-center justify-between hud text-paper/80">
          <span className="flex items-center gap-1.5">
            <span className={cn("size-1.5 rounded-full", hover ? "bg-rec" : "bg-paper/50")} /> {hover ? "PLAYING" : "REEL"}
          </span>
          {label && <span>{label}</span>}
        </div>
        <div className="pointer-events-none absolute inset-x-3 bottom-3">{children ?? <p className="text-sm font-semibold">{title}</p>}</div>
      </button>
      <VideoModal id={id} title={title} open={open} onClose={() => setOpen(false)} />
    </>
  );
}

export function VideoModal({ id, title, open, onClose }: { id: string; title: string; open: boolean; onClose: () => void }) {
  const { lenis } = useMotion();
  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, lenis]);
  if (typeof document === "undefined") return null;
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={title}
          className="fixed inset-0 z-[160] flex items-center justify-center bg-black/90 p-4 backdrop-blur"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="relative aspect-video w-full max-w-6xl overflow-hidden rounded-lg bg-black"
            initial={{ scale: 0.92, clipPath: "inset(40% 0 40% 0)" }}
            animate={{ scale: 1, clipPath: "inset(0% 0 0% 0)" }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              src={embed(id, { mute: 0, controls: 1, loop: 0, disablekb: 0 })}
              title={title}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              className="absolute inset-0 size-full border-0"
            />
          </motion.div>
          <button onClick={onClose} className="hud absolute right-5 top-5 rounded-full border border-line px-4 py-2 text-paper hover:border-paper" autoFocus>
            ✕ CLOSE
          </button>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

export function ShowreelLink({ id, className, children }: { id: string; className?: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className={className} onClick={() => setOpen(true)} data-cursor="play">
        {children}
      </button>
      <VideoModal id={id} title="AX.Visuals showreel" open={open} onClose={() => setOpen(false)} />
    </>
  );
}

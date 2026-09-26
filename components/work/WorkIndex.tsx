"use client";

import Image from "next/image";
import Link from "next/link";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { Flip } from "gsap/Flip";
import { projects, reels, workCategories, ytThumb, type Project, type WorkCategory } from "@/content/work";
import { ReelCard } from "@/components/media/YouTube";
import { useMotion } from "@/components/providers/MotionProvider";
import { cn } from "@/lib/format";

type Format = "all" | "reels" | "photos";
type Layout = "grid" | "list" | "reel";

const cover = (p: Project) => (p.format === "reels" ? ytThumb(p.reels[0].youtubeId) : p.cover.src);

export function WorkIndex() {
  const [cat, setCat] = useState<WorkCategory | "all">("all");
  const [format, setFormat] = useState<Format>("all");
  const [layout, setLayout] = useState<Layout>("grid");
  const [hover, setHover] = useState<Project | null>(null);
  const grid = useRef<HTMLDivElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);
  const { reduced } = useMotion();

  const shown = useMemo(
    () =>
      projects.filter(
        (p) =>
          (cat === "all" || p.category === cat) &&
          (format === "all" || (format === "reels" ? p.reels.length > 0 : p.photos.length > 0)),
      ),
    [cat, format],
  );

  const capture = () => {
    if (grid.current && !reduced) flipState.current = Flip.getState(grid.current.querySelectorAll("[data-flip-id]"));
  };

  useLayoutEffect(() => {
    if (!flipState.current) return;
    Flip.from(flipState.current, {
      duration: 0.7,
      ease: "expo.inOut",
      absolute: true,
      stagger: 0.03,
      onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.6 }),
      onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.9, duration: 0.4 }),
    });
    flipState.current = null;
  }, [shown]);

  const counts = (c: WorkCategory | "all") => (c === "all" ? projects.length : projects.filter((p) => p.category === c).length);

  return (
    <div>
      {/* Controls */}
      <div className="sticky top-0 z-30 -mx-[var(--gutter)] flex flex-col gap-3 border-b border-line bg-ink/85 px-[var(--gutter)] py-3 backdrop-blur-md lg:flex-row lg:items-center lg:justify-between">
        <div className="no-scrollbar flex gap-1.5 overflow-x-auto" role="group" aria-label="Filter by category">
          {([{ id: "all", label: "All" }, ...workCategories] as { id: WorkCategory | "all"; label: string }[]).map((c) => (
            <button
              key={c.id}
              type="button"
              aria-pressed={cat === c.id}
              onClick={() => {
                capture();
                setCat(c.id);
              }}
              className={cn("shrink-0 rounded-full border px-4 py-2 text-sm transition-colors", cat === c.id ? "border-paper bg-paper text-ink" : "border-line text-paper/75 hover:text-paper")}
            >
              {c.label} <sup className="font-mono text-[9px] opacity-60">{counts(c.id)}</sup>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Segmented
            label="Format"
            value={format}
            onChange={(v) => {
              capture();
              setFormat(v);
            }}
            options={[
              ["all", "All"],
              ["reels", "Reels"],
              ["photos", "Photos"],
            ]}
          />
          <Segmented
            label="Layout"
            value={layout}
            onChange={setLayout}
            options={[
              ["grid", "Grid"],
              ["list", "List"],
              ["reel", "Reel"],
            ]}
          />
        </div>
      </div>

      {shown.length === 0 && <p className="py-20 text-center text-mute">Nothing here yet — try another filter.</p>}

      {layout === "grid" && (
        <div ref={grid} className="mt-8 columns-2 gap-3 sm:gap-6 lg:columns-3">
          {shown.map((p) => (
            <Link
              key={p.slug}
              data-flip-id={p.slug}
              href={`/work/${p.slug}`}
              data-cursor={p.format === "reels" ? "play" : "view"}
              className="group mb-6 block break-inside-avoid"
            >
              <div className={cn("relative overflow-hidden rounded-[10px] bg-ink-2", p.format === "reels" ? "aspect-[9/16]" : p.cover.h > p.cover.w ? "aspect-[4/5]" : "aspect-[4/3]")}>
                <Image
                  src={cover(p)}
                  alt={p.cover.alt}
                  fill
                  sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                  className={cn("object-cover transition-transform duration-[1.2s] ease-[var(--ease-expo)] group-hover:scale-105")}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
                <p className="hud absolute bottom-3 left-3 right-3 hidden text-paper/80 sm:block">{p.camera}</p>
              </div>
              <Meta p={p} />
            </Link>
          ))}
        </div>
      )}

      {layout === "list" && (
        <div ref={grid} className="relative mt-6" onMouseLeave={() => setHover(null)}>
          {shown.map((p, i) => (
            <Link
              key={p.slug}
              data-flip-id={p.slug}
              href={`/work/${p.slug}`}
              onMouseEnter={() => setHover(p)}
              data-cursor="view"
              className="group grid grid-cols-[40px_1fr] items-baseline gap-4 border-b border-line py-6 md:grid-cols-[60px_1.5fr_1fr_1fr_80px]"
            >
              <span className="font-mono text-xs text-mute">{String(i + 1).padStart(2, "0")}</span>
              <span className="display text-[clamp(1.8rem,5vw,4.2rem)] transition-colors group-hover:text-rec">{p.title}</span>
              <span className="hud hidden text-mute md:block">{workCategories.find((c) => c.id === p.category)?.label}</span>
              <span className="hud hidden text-mute md:block">{p.deliverables}</span>
              <span className="hud hidden text-right text-mute md:block">{p.year}</span>
            </Link>
          ))}
          {hover && (
            <div className="pointer-events-none fixed right-[8vw] top-1/2 z-20 hidden aspect-[4/5] w-[22vw] max-w-[320px] -translate-y-1/2 overflow-hidden rounded-lg lg:block">
              <Image src={cover(hover)} alt="" fill sizes="320px" className="object-cover" />
            </div>
          )}
        </div>
      )}

      {layout === "reel" && (
        <div className="mx-auto mt-8 h-[calc(100svh-200px)] max-w-[min(100%,calc((100svh-200px)*9/16))] snap-y snap-mandatory overflow-y-auto rounded-2xl no-scrollbar" data-lenis-prevent>
          {(format === "photos" ? [] : reels.filter((r) => cat === "all" || projects.some((p) => p.category === cat && p.reels.includes(r)))).map((r) => (
            <div key={r.youtubeId} className="h-full snap-start p-1">
              <ReelCard id={r.youtubeId} title={r.title} aspect={r.aspect} className="h-full rounded-xl">
                <p className="font-display text-2xl font-extrabold uppercase">{r.title}</p>
                <p className="hud mt-1 text-paper/70">Tap to play with sound</p>
              </ReelCard>
            </div>
          ))}
          {shown
            .filter((p) => format !== "reels" && p.photos.length)
            .flatMap((p) => p.photos.map((ph) => ({ p, ph })))
            .map(({ p, ph }) => (
              <Link key={ph.src + p.slug} href={`/work/${p.slug}`} className="relative block h-full snap-start overflow-hidden rounded-xl">
                <Image src={ph.src} alt={ph.alt} fill sizes="(max-width:768px) 100vw, 40vw" className="object-cover" />
                <span className="hud absolute bottom-4 left-4 text-paper">{p.title}</span>
              </Link>
            ))}
        </div>
      )}
    </div>
  );
}

function Meta({ p }: { p: Project }) {
  return (
    <div className="mt-3 flex items-start justify-between gap-3">
      <div>
        <p className="font-display text-sm font-extrabold uppercase leading-tight transition-colors group-hover:text-rec sm:text-lg">{p.title}</p>
        <p className="hud mt-1 text-mute">
          {p.client} · {workCategories.find((c) => c.id === p.category)?.label}
        </p>
        <p className="hud mt-0.5 hidden text-mute sm:block">
          {p.package} · {p.deliverables}
        </p>
      </div>
      <span className="hud hidden text-mute sm:inline">{p.year}</span>
    </div>
  );
}

function Segmented<T extends string>({ label, value, onChange, options }: { label: string; value: T; onChange: (v: T) => void; options: [T, string][] }) {
  return (
    <div role="group" aria-label={label} className="flex rounded-full border border-line p-1">
      {options.map(([v, l]) => (
        <button
          key={v}
          type="button"
          aria-pressed={value === v}
          onClick={() => onChange(v)}
          className={cn("rounded-full px-3 py-1.5 text-xs transition-colors", value === v ? "bg-paper text-ink" : "text-paper/70 hover:text-paper")}
        >
          {l}
        </button>
      ))}
    </div>
  );
}

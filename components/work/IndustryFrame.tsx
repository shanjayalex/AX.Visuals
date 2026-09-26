import Image from "next/image";
import type { Industry } from "@/content/industries";
import { cn } from "@/lib/format";

/**
 * Shows real work for an industry when `preview` is set; otherwise a designed
 * viewfinder "shot list" frame, so no unrelated photo is passed off as industry work.
 */
export function IndustryFrame({ industry, className, sizes = "(max-width:1024px) 100vw, 50vw" }: { industry: Industry; className?: string; sizes?: string }) {
  if (industry.preview)
    return (
      <div className={cn("relative overflow-hidden bg-ink-2", className)}>
        <Image src={industry.preview.src} alt={industry.preview.alt} fill sizes={sizes} className="object-cover" />
      </div>
    );
  const corner = "absolute size-6 border-paper/70";
  return (
    <div className={cn("relative overflow-hidden bg-[radial-gradient(120%_90%_at_30%_20%,#1f1a17,#0c0c0d)]", className)} aria-hidden>
      <div className="absolute inset-[6%]">
        <span className={`${corner} left-0 top-0 border-l border-t`} />
        <span className={`${corner} right-0 top-0 border-r border-t`} />
        <span className={`${corner} bottom-0 left-0 border-b border-l`} />
        <span className={`${corner} bottom-0 right-0 border-b border-r`} />
        <div className="hud absolute left-4 top-4 flex items-center gap-2 text-paper/80">
          <span className="rec-dot" /> SHOT LIST
        </div>
        <div className="hud absolute right-4 top-4 text-paper/60">9:16 · 4K</div>
        <ol className="absolute inset-x-6 bottom-8 space-y-1">
          {industry.typical.map((t, i) => (
            <li key={t} className="flex items-baseline gap-3">
              <span className="font-mono text-[10px] text-clay">{String(i + 1).padStart(2, "0")}</span>
              <span className="font-display text-[clamp(0.95rem,4vw,1.9rem)] font-extrabold uppercase leading-[1.05] text-paper/90 [overflow-wrap:anywhere] lg:text-[clamp(1.1rem,2.2vw,1.9rem)]">{t}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

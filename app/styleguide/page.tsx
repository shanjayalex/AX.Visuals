import type { Metadata } from "next";
import { Logo } from "@/components/brand/Logo";
import { RollingNumber } from "@/components/motion/primitives";

export const metadata: Metadata = { title: "Style guide", robots: { index: false } };

const colors = [
  ["--ink", "#0A0A0B", "Main background"],
  ["--ink-2", "#141416", "Cards, panels"],
  ["--line", "#26262A", "Borders, grid lines"],
  ["--paper", "#F4F2EE", "Primary text, logo"],
  ["--mute", "#8A8A90", "Secondary text"],
  ["--rec", "#FF3B2F", "Accent — REC, CTAs (sparingly)"],
  ["--clay", "#E8A87C", "Claymation sections only"],
];

const motion = [
  ["Text reveal", "SplitText lines · y 110% → 0 · stagger 0.06 · expo.out · 1.1s"],
  ["Smooth scroll", "Lenis · lerp 0.08 · synced to the GSAP ticker"],
  ["Page transition", "Iris wipe · close 0.55s expo.in · open 0.8s expo.out"],
  ["Shutter image", "clip-path inset(0 0 100% 0) → 0 · 1.3s expo.inOut + Ken Burns scrub"],
  ["Price roll", "Per-digit roll · 1.4s + 0.08s per digit · settles on exact value"],
  ["Reduced motion", "No Lenis, pinning, parallax or WebGL — simple fades; prices render instantly"],
];

export default function StyleGuide() {
  return (
    <div className="wrap pb-28 pt-36">
      <p className="eyebrow">/styleguide</p>
      <h1 className="display mt-4 text-[clamp(2.05rem,8vw,7rem)]">Style guide</h1>

      <section className="mt-16">
        <h2 className="hud text-mute">Logo</h2>
        <div className="mt-4 flex flex-wrap items-end gap-10 rounded-2xl border border-line p-10">
          <Logo className="h-40 w-auto text-paper" animate="hover" />
          <Logo className="h-16 w-auto text-paper" wordmark={false} animate="hover" />
          <p className="hud text-mute">Hover to redraw · white on dark only</p>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="hud text-mute">Colour</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-7">
          {colors.map(([t, hex, use]) => (
            <div key={t} className="overflow-hidden rounded-xl border border-line">
              <div className="h-24" style={{ background: hex }} />
              <div className="p-3">
                <p className="font-mono text-sm">{t}</p>
                <p className="font-mono text-xs text-mute">{hex}</p>
                <p className="mt-1 text-xs text-mute">{use}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 space-y-6">
        <h2 className="hud text-mute">Type</h2>
        <p className="display text-7xl">Syne ExtraBold</p>
        <p className="text-xl">Manrope — body copy. We create content for businesses.</p>
        <p className="hud">JetBrains Mono — ISO 800 · 1/50 · f/1.8 · 24FPS</p>
        <p className="font-display text-5xl font-extrabold">
          <RollingNumber value={40000} format="lkr" />
        </p>
      </section>

      <section className="mt-16">
        <h2 className="hud text-mute">Buttons</h2>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <button className="btn-rec focus-pull">
            <span className="rec-dot !bg-paper" /> Book a Shoot
          </button>
          <button className="btn-ghost focus-pull">See Packages</button>
          <span className="hud flex items-center gap-2 rounded-full bg-rec px-2.5 py-1 font-semibold">⭐ MOST POPULAR</span>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="hud text-mute">Motion tokens</h2>
        <dl className="mt-4 divide-y divide-line rounded-2xl border border-line">
          {motion.map(([k, v]) => (
            <div key={k} className="grid gap-2 p-4 sm:grid-cols-[200px_1fr]">
              <dt className="font-semibold">{k}</dt>
              <dd className="font-mono text-sm text-mute">{v}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}

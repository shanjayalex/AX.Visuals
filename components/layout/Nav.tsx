"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Logo } from "@/components/brand/Logo";
import { Magnetic } from "@/components/motion/primitives";
import { useMotion } from "@/components/providers/MotionProvider";
import { sound } from "@/lib/sound";
import { cn } from "@/lib/format";
import { photos } from "@/content/work";

const links = [
  { href: "/work", label: "Work", img: photos.redWall.src },
  { href: "/services", label: "Services", img: photos.cerMangalyam.src },
  { href: "/pricing", label: "Packages", img: photos.tubeLandscape.src },
  { href: "/pricing/monthly", label: "Monthly", img: photos.postChapter.src },
  { href: "/about", label: "About", img: photos.profile.src },
  { href: "/contact", label: "Contact", img: photos.tubeForward.src },
];

export function Nav() {
  const pathname = usePathname();
  const { lenis } = useMotion();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(false);

  useEffect(() => sound.subscribe(setSoundOn), []);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      if (Math.abs(y - last) > 6) setHidden(y > last && y > 200);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (open) lenis?.stop();
    else lenis?.start();
  }, [open, lenis]);

  const isActive = (href: string) => (href === "/pricing" ? pathname === "/pricing" : pathname.startsWith(href));

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-[80] transition-transform duration-500 ease-[var(--ease-expo)] no-print",
          hidden && !open ? "-translate-y-full" : "translate-y-0",
        )}
      >
        <div
          className={cn(
            "wrap flex h-[72px] items-center justify-between gap-6 transition-colors duration-500",
            scrolled && !open && "bg-ink/70 backdrop-blur-md",
          )}
        >
          <Link href="/" aria-label="AX.Visuals — home" className="flex items-center gap-3 text-paper">
            <Logo animate="hover" wordmark={false} className="h-8 w-auto" />
            <span className="hidden font-display text-sm font-extrabold tracking-[0.3em] sm:inline">VISUALS</span>
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={cn("group relative text-sm text-paper/75 transition-colors hover:text-paper", isActive(l.href) && "text-paper")}
              >
                {l.label}
                <span
                  className={cn(
                    "absolute -bottom-1.5 left-0 h-px w-full origin-left scale-x-0 bg-rec transition-transform duration-500 ease-[var(--ease-expo)] group-hover:scale-x-100",
                    isActive(l.href) && "scale-x-100",
                  )}
                />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => sound.set(!soundOn)}
              className="hud hidden items-center gap-2 rounded-full border border-line px-3 py-2 text-mute transition-colors hover:text-paper sm:flex"
              aria-pressed={soundOn}
              aria-label={soundOn ? "Turn sound off" : "Turn sound on"}
            >
              <SoundBars on={soundOn} /> {soundOn ? "SOUND ON" : "SOUND OFF"}
            </button>
            <Magnetic className="hidden sm:inline-block">
              <Link href="/booking" className="btn-rec !px-5 !py-2.5" data-cursor="book">
                <span className="rec-dot !bg-paper" /> Book a Shoot
              </Link>
            </Magnetic>
            <button
              className="relative flex size-11 items-center justify-center rounded-full border border-line lg:hidden"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
            >
              <span className={cn("absolute h-px w-5 bg-paper transition-transform duration-300", open ? "rotate-45" : "-translate-y-1")} />
              <span className={cn("absolute h-px w-5 bg-paper transition-transform duration-300", open ? "-rotate-45" : "translate-y-1")} />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-[79] flex flex-col bg-ink pt-[88px] lg:hidden"
            initial={{ clipPath: "circle(0% at 92% 36px)" }}
            animate={{ clipPath: "circle(150% at 92% 36px)" }}
            exit={{ clipPath: "circle(0% at 92% 36px)" }}
            transition={{ duration: 0.7, ease: [0.7, 0, 0.2, 1] }}
          >
            <nav aria-label="Mobile" className="wrap flex flex-1 flex-col justify-center gap-1">
              {links.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ y: 60, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.15 + i * 0.05, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link href={l.href} className="flex items-center justify-between border-b border-line py-3">
                    <span className="display text-[clamp(2.05rem,11vw,4rem)]">{l.label}</span>
                    <span className="relative h-14 w-10 overflow-hidden rounded-md">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={l.img} alt="" className="size-full object-cover" />
                    </span>
                  </Link>
                </motion.div>
              ))}
            </nav>
            <div className="wrap flex flex-wrap items-center justify-between gap-4 pb-8 pt-6">
              <Link href="/booking" className="btn-rec">
                <span className="rec-dot !bg-paper" /> Book a Shoot
              </Link>
              <button onClick={() => sound.set(!soundOn)} className="hud flex items-center gap-2 text-mute" aria-pressed={soundOn}>
                <SoundBars on={soundOn} /> {soundOn ? "SOUND ON" : "SOUND OFF"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function SoundBars({ on }: { on: boolean }) {
  return (
    <span className="flex h-3 items-end gap-[2px]" aria-hidden>
      {[0.5, 1, 0.7, 0.9].map((h, i) => (
        <span
          key={i}
          className="w-[2px] bg-current"
          style={{
            height: on ? `${h * 100}%` : "20%",
            transition: "height .3s",
            animation: on ? `flicker ${0.6 + i * 0.15}s ease-in-out infinite` : undefined,
          }}
        />
      ))}
    </span>
  );
}

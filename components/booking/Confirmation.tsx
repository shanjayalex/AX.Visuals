"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Clapperboard } from "@/components/home/OneShoot";
import { AxelClay } from "@/components/clay/Axel";
import { WhatsAppIcon } from "@/components/layout/WhatsAppFab";
import { site } from "@/content/site";
import { waLink } from "@/lib/format";
import { sound } from "@/lib/sound";

/** Clapperboard slam + film-frame confetti + Axel thumbs-up. */
export function Confirmation({ refCode, kind, payment, payhereUnavailable }: { refCode: string; kind: string; payment: string; payhereUnavailable?: boolean }) {
  const [open, setOpen] = useState(true);
  const confetti = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = window.setTimeout(() => {
      setOpen(false);
      sound.clap();
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !confetti.current) return;
      const frames = confetti.current.children;
      gsap.fromTo(
        frames,
        { y: -80, x: () => gsap.utils.random(-40, 40), rotate: () => gsap.utils.random(-180, 180), opacity: 1 },
        {
          y: () => window.innerHeight + 100,
          x: () => `+=${gsap.utils.random(-160, 160)}`,
          rotate: () => `+=${gsap.utils.random(-360, 360)}`,
          duration: () => gsap.utils.random(2.2, 3.6),
          ease: "power1.in",
          stagger: 0.015,
        },
      );
    }, 450);
    window.scrollTo({ top: 0 });
    return () => window.clearTimeout(t);
  }, []);

  const booked = kind === "BOOKED";
  return (
    <div className="relative mx-auto max-w-3xl py-10 text-center">
      <div ref={confetti} className="pointer-events-none fixed inset-x-0 top-0 z-[120] h-0" aria-hidden>
        {Array.from({ length: 60 }, (_, i) => (
          <span
            key={i}
            className="absolute top-0 h-6 w-4 rounded-[2px] border-y-[3px] border-dashed border-ink opacity-0"
            style={{ left: `${(i * 37) % 100}%`, background: ["#FF3B2F", "#F4F2EE", "#E8A87C", "#8A8A90"][i % 4] }}
          />
        ))}
      </div>

      <div className="mx-auto w-[min(90%,420px)]">
        <Clapperboard label={booked ? "BOOKED" : "REQUEST RECEIVED"} sub="SCENE 01 · TAKE 01" open={open} />
      </div>
      <h2 className="display mt-10 text-[clamp(2rem,5vw,4rem)]">
        {booked ? "That's a wrap on step one." : "Request received."}
      </h2>
      <p className="mx-auto mt-4 max-w-xl text-paper/80">
        Your reference is <span className="font-mono text-paper">{refCode}</span>. A copy of your call sheet is on its way to your inbox, and we&apos;ll confirm on WhatsApp.
        {payment === "bank" && " We'll verify your transfer slip and lock in the date."}
      </p>
      {payhereUnavailable && (
        <p className="mx-auto mt-4 max-w-xl rounded-lg border border-clay/40 bg-clay/5 p-4 text-sm">
          Online payment isn&apos;t switched on yet, so we&apos;ve saved this as a booking request — we&apos;ll send a secure payment link on WhatsApp.
        </p>
      )}
      <div className="mx-auto mt-10 aspect-[4/3] w-[min(100%,420px)] overflow-hidden rounded-2xl">
        <AxelClay pose="thumbs" />
      </div>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <a href={waLink(site.whatsapp, `Hi AX.Visuals! My booking reference is ${refCode}.`)} target="_blank" rel="noopener" className="btn-rec">
          <WhatsAppIcon className="size-4" /> Chat on WhatsApp
        </a>
        <Link href="/work" className="btn-ghost">
          Browse the work
        </Link>
      </div>
    </div>
  );
}

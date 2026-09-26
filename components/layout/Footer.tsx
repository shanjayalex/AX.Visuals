"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { site } from "@/content/site";
import { waLink } from "@/lib/format";

function ColomboClock() {
  const [t, setT] = useState<string>("--:--:--");
  useEffect(() => {
    const f = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Colombo", hour: "2-digit", minute: "2-digit", second: "2-digit" });
    const id = setInterval(() => setT(f.format(new Date())), 1000);
    setT(f.format(new Date()));
    return () => clearInterval(id);
  }, []);
  return <span className="tabular-nums">{t}</span>;
}

export function Footer() {
  const [sent, setSent] = useState(false);
  return (
    <footer className="relative overflow-hidden border-t border-line bg-ink pt-20 no-print">
      <div className="wrap grid gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="display text-[clamp(2rem,4vw,3.4rem)]">
            We create content
            <br /> for businesses.
          </p>
          <p className="mt-4 text-mute">Available islandwide 🇱🇰</p>
          <form
            className="mt-8 flex max-w-md items-center gap-2 rounded-full border border-line p-1.5 pl-5"
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
          >
            <label htmlFor="nl" className="sr-only">
              Email for the newsletter
            </label>
            <input id="nl" type="email" required placeholder="Monthly content tips — your email" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-mute" />
            <button className="btn-rec !px-4 !py-2 text-xs">{sent ? "Thanks ✓" : "Subscribe"}</button>
          </form>
        </div>

        <div className="grid grid-cols-2 gap-8 md:col-span-7 md:grid-cols-3">
          <div>
            <p className="eyebrow mb-4">Studio</p>
            <ul className="space-y-2 text-sm">
              {[
                ["/work", "Work"],
                ["/services", "Services"],
                ["/pricing", "Packages"],
                ["/pricing/monthly", "Monthly plans"],
                ["/about", "About"],
                ["/booking", "Book a shoot"],
              ].map(([h, l]) => (
                <li key={h}>
                  <Link href={h} className="text-paper/80 hover:text-paper">
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow mb-4">Contact</p>
            <ul className="space-y-2 text-sm">
              <li>
                <a href={waLink(site.whatsapp, "Hi AX.Visuals!")} target="_blank" rel="noopener" className="text-paper/80 hover:text-paper">
                  WhatsApp
                </a>
              </li>
              <li className="text-paper/80">{site.phoneDisplay}</li>
              <li className="break-all text-paper/80">{site.email}</li>
              {site.socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener" className="text-paper/80 hover:text-paper">
                    {s.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-2 md:col-span-1">
            <p className="eyebrow mb-4">Local time · Colombo</p>
            <p className="font-mono text-2xl text-paper">
              <ColomboClock />
            </p>
            <p className="mt-2 hud text-mute">Asia/Colombo · GMT+5:30</p>
          </div>
        </div>
      </div>

      {/* Giant AX filled with footage (video-masked text effect via background-clip) */}
      <div className="relative mt-16 select-none" aria-hidden>
        <p
          className="display wrap text-center text-[10.4vw] whitespace-nowrap leading-[0.8] text-transparent"
          style={{
            backgroundImage: "url(/media/grad-profile.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center 30%",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            animation: "footer-pan 24s ease-in-out infinite alternate",
          }}
        >
          AX.VISUALS
        </p>
        <style>{`@keyframes footer-pan{to{background-position:center 70%}}`}</style>
      </div>

      <div className="wrap flex flex-wrap items-center justify-between gap-4 border-t border-line py-6 hud text-mute">
        <span>© {new Date().getFullYear()} AX.Visuals · Sri Lanka</span>
        <span className="flex gap-6">
          <Link href="/terms" className="hover:text-paper">
            Booking terms
          </Link>
          <Link href="/styleguide" className="hover:text-paper">
            Style guide
          </Link>
        </span>
      </div>
    </footer>
  );
}

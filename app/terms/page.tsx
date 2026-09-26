import type { Metadata } from "next";
import { policies } from "@/content/pricing";
import { site } from "@/content/site";
import { SectionLabel } from "@/components/motion/primitives";

export const metadata: Metadata = {
  title: "Booking Terms",
  description: "AX.Visuals booking terms: payment, travel, revisions, delivery times, exclusions and usage rights.",
};

export default function TermsPage() {
  return (
    <div className="wrap max-w-4xl pb-28 pt-36">
      <SectionLabel n="§">Terms</SectionLabel>
      <h1 className="display mt-6 text-[clamp(2.05rem,7vw,6rem)]">Booking terms</h1>
      <p className="mt-6 text-paper/80">
        These terms apply to every AX.Visuals booking, package and monthly plan. By confirming a booking or paying an advance you agree to them. Questions? WhatsApp{" "}
        {site.phoneDisplay} or email {site.email}.
      </p>
      <div className="mt-14 space-y-12">
        {policies.map((p, i) => (
          <section key={p.id} aria-labelledby={`t-${p.id}`}>
            <h2 id={`t-${p.id}`} className="font-display text-2xl font-extrabold uppercase">
              <span className="mr-3 font-mono text-sm text-rec">{String(i + 1).padStart(2, "0")}</span>
              {p.title}
            </h2>
            <p className="mt-2 text-mute">{p.summary}</p>
            <ul className="mt-4 space-y-2">
              {p.details.map((d) => (
                <li key={d} className="flex gap-3 text-paper/85">
                  <span className="text-mute">—</span>
                  {d}
                </li>
              ))}
            </ul>
          </section>
        ))}
        <section aria-labelledby="t-general">
          <h2 id="t-general" className="font-display text-2xl font-extrabold uppercase">
            <span className="mr-3 font-mono text-sm text-rec">{String(policies.length + 1).padStart(2, "0")}</span>
            Rescheduling &amp; weather
          </h2>
          <p className="mt-4 text-paper/85">[EDIT] Add your rescheduling window, what happens if it rains on an outdoor shoot, and cancellation terms for the advance.</p>
        </section>
      </div>
      <p className="hud mt-16 text-mute">Prices in Sri Lankan Rupees. Rates marked “+” or “from” are starting rates; final quotes depend on the brief.</p>
    </div>
  );
}

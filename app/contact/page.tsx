import type { Metadata } from "next";
import { site } from "@/content/site";
import { waLink } from "@/lib/format";
import { SectionLabel, SplitReveal } from "@/components/motion/primitives";
import { WhatsAppIcon } from "@/components/layout/WhatsAppFab";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: `Talk to AX.Visuals on WhatsApp, phone or email. Based in ${site.city}, available islandwide in Sri Lanka.`,
};

export default function ContactPage() {
  return (
    <div className="wrap pb-28 pt-36">
      <SectionLabel n="✉">Contact</SectionLabel>
      <SplitReveal as="h1" immediate by="words" className="display mt-6 text-[clamp(2.05rem,9vw,9rem)]">
        Let&apos;s make something.
      </SplitReveal>

      <div className="mt-16 grid gap-16 lg:grid-cols-2">
        <div>
          <ul className="divide-y divide-line border-y border-line">
            <li>
              <a href={waLink(site.whatsapp, "Hi AX.Visuals!")} target="_blank" rel="noopener" className="group flex items-center justify-between py-6">
                <span>
                  <span className="hud block text-rec">Fastest · WhatsApp</span>
                  <span className="display mt-2 block text-[clamp(1.8rem,4vw,3.2rem)] transition-colors group-hover:text-rec">{site.phoneDisplay}</span>
                </span>
                <WhatsAppIcon className="size-8" />
              </a>
            </li>
            <li>
              <a href={`tel:+${site.whatsapp}`} className="group block py-6">
                <span className="hud block text-mute">Phone</span>
                <span className="display mt-2 block text-[clamp(1.6rem,3vw,2.4rem)] group-hover:text-rec">{site.phoneDisplay}</span>
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="group block py-6">
                <span className="hud block text-mute">Email</span>
                <span className="display mt-2 block break-all text-[clamp(1.4rem,3vw,2.4rem)] normal-case group-hover:text-rec">{site.email}</span>
              </a>
            </li>
            <li className="flex flex-wrap gap-2 py-6">
              {site.socials.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener" className="btn-ghost !py-2.5">
                  {s.label} ↗
                </a>
              ))}
            </li>
          </ul>
          <dl className="mt-8 grid grid-cols-2 gap-6">
            <div>
              <dt className="hud text-mute">Hours</dt>
              <dd className="mt-1">{site.hours}</dd>
            </div>
            <div>
              <dt className="hud text-mute">Response</dt>
              <dd className="mt-1">{site.responseTime}</dd>
            </div>
          </dl>
        </div>
        <div>
          <p className="hud text-mute">Quick enquiry</p>
          <p className="mt-2 text-paper/80">Not ready for the full booking flow? Drop us a line.</p>
          <ContactForm />
        </div>
      </div>

      <section className="mt-24" aria-labelledby="base-h">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="hud text-mute">Studio base</p>
            <h2 id="base-h" className="display mt-2 text-[clamp(2rem,4vw,3.4rem)]">
              {site.address}
            </h2>
          </div>
          <p className="text-paper/80">Available islandwide 🇱🇰 — travel charges may apply.</p>
        </div>
        <div className="mt-8 aspect-[16/9] overflow-hidden rounded-2xl border border-line md:aspect-[21/9]">
          <iframe
            title="Map of the AX.Visuals studio base"
            src={`https://maps.google.com/maps?q=${encodeURIComponent(site.mapQuery)}&z=12&output=embed`}
            className="size-full border-0 [filter:invert(0.92)_hue-rotate(180deg)_saturate(0.4)_contrast(0.9)]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </div>
  );
}

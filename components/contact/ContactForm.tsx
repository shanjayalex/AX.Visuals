"use client";

import { useState } from "react";
import { z } from "zod";
import { site } from "@/content/site";
import { waLink } from "@/lib/format";

const schema = z.object({
  name: z.string().min(2, "Your name please"),
  contact: z.string().min(5, "A phone number or email so we can reply"),
  message: z.string().min(10, "A little more detail please"),
});

const input = "w-full rounded-xl border border-line bg-ink-2 px-4 py-3.5 outline-none placeholder:text-mute/70 focus:border-paper";

/** Short enquiry — opens WhatsApp with the message pre-filled (no backend needed). */
export function ContactForm() {
  const [v, setV] = useState({ name: "", contact: "", message: "" });
  const [err, setErr] = useState<Record<string, string>>({});
  return (
    <form
      className="mt-6 space-y-4"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        const r = schema.safeParse(v);
        if (!r.success) {
          setErr(Object.fromEntries(r.error.issues.map((i) => [String(i.path[0]), i.message])));
          return;
        }
        setErr({});
        window.open(waLink(site.whatsapp, `Hi AX.Visuals! I'm ${v.name} (${v.contact}).\n\n${v.message}`), "_blank", "noopener");
      }}
    >
      {(
        [
          ["name", "Name", "input"],
          ["contact", "Phone (+94…) or email", "input"],
          ["message", "What do you need?", "textarea"],
        ] as const
      ).map(([k, l, t]) => (
        <div key={k}>
          <label htmlFor={`c-${k}`} className="mb-2 block text-sm text-paper/85">
            {l}
          </label>
          {t === "textarea" ? (
            <textarea id={`c-${k}`} rows={5} className={input} value={v[k]} onChange={(e) => setV({ ...v, [k]: e.target.value })} />
          ) : (
            <input id={`c-${k}`} className={input} value={v[k]} onChange={(e) => setV({ ...v, [k]: e.target.value })} />
          )}
          {err[k] && (
            <p role="alert" className="mt-1.5 text-sm text-rec">
              {err[k]}
            </p>
          )}
        </div>
      ))}
      <button className="btn-rec">Send via WhatsApp →</button>
    </form>
  );
}

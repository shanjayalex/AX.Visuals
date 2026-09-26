"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  bookingSchema,
  categories,
  estimate,
  individualServices,
  money,
  packagesFor,
  stepFields,
  zoneFor,
  type BookingInput,
  type CategoryId,
} from "@/lib/booking";
import { bookingAddons, districts, rateCard, travelZones } from "@/content/pricing";
import { industries } from "@/content/industries";
import { site } from "@/content/site";
import { cn, formatLKR, waLink } from "@/lib/format";
import { useMotion } from "@/components/providers/MotionProvider";
import { Calendar, TIME_SLOTS } from "./Calendar";
import { Confirmation } from "./Confirmation";
import { ZoneMap } from "@/components/pricing/Policies";

const STEP_NAMES = ["What", "Package", "Add-ons", "Location", "Date", "Brief", "Details", "Review"];
const STORAGE = "ax-booking-v1";

type Form = Partial<BookingInput> & { services: string[]; addons: Record<string, number>; needs: string[] };

const empty: Form = { services: [], addons: {}, needs: [], setting: "indoor", overnight: false, whatsapp: true, payment: "enquiry", phone: "+94 " };

export function BookingFlow() {
  const params = useSearchParams();
  const [form, setForm] = useState<Form>(empty);
  const [step, setStep] = useState(1);
  const [dir, setDir] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [files, setFiles] = useState<{ slip?: File; moodboardFile?: File }>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [done, setDone] = useState<{ ref: string; kind: string; payment: string; payhereUnavailable?: boolean } | null>(null);
  const [drawer, setDrawer] = useState(false);
  const top = useRef<HTMLDivElement>(null);
  const { lenis } = useMotion();
  const hydrated = useRef(false);

  // Restore progress, then apply ?category=&package= prefill (prefill wins)
  useEffect(() => {
    let saved: { form: Form; step: number } | null = null;
    try {
      saved = JSON.parse(localStorage.getItem(STORAGE) ?? "null");
    } catch {}
    const cat = params.get("category") as CategoryId | null;
    const pkg = params.get("package");
    const validCat = cat && categories.some((c) => c.id === cat) ? cat : null;
    let next: Form = saved?.form ? { ...empty, ...saved.form, agree: undefined } : empty;
    let nextStep = saved?.step ?? 1;
    if (validCat) {
      const changed = next.category !== validCat || (pkg && next.packageId !== pkg);
      next = { ...next, category: validCat, packageId: pkg ?? (next.category === validCat ? next.packageId : undefined) };
      if (changed) nextStep = pkg && packagesFor(validCat).some((p) => p.id === pkg) ? 3 : 2;
    }
    setForm(next);
    setStep(Math.min(Math.max(nextStep, 1), 8));
    hydrated.current = true;
  }, [params]);

  useEffect(() => {
    if (!hydrated.current || done) return;
    try {
      localStorage.setItem(STORAGE, JSON.stringify({ form: { ...form, agree: undefined }, step }));
    } catch {}
  }, [form, step, done]);

  const set = useCallback(<K extends keyof Form>(k: K, v: Form[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => {
      const rest = { ...e };
      delete rest[k as string];
      return rest;
    });
  }, []);

  const est = useMemo(() => estimate(form as never), [form]);
  const isMonthly = form.category === "monthly";

  function validate(s: number): boolean {
    const errs: Record<string, string> = {};
    const fields = stepFields[s];
    const shape = bookingSchema.pick(Object.fromEntries(fields.map((f) => [f, true])) as never);
    const r = shape.safeParse(form);
    if (!r.success) for (const i of r.error.issues) errs[String(i.path[0])] ??= i.message;
    if (s === 2) {
      if (form.category === "individual" && form.services.length === 0) errs.services = "Pick at least one service";
      if (form.category && !["individual", "custom"].includes(form.category) && !form.packageId) errs.packageId = "Choose a package";
    }
    if (s === 5 && form.category !== "custom") {
      if (isMonthly) {
        if (!form.startMonth) errs.startMonth = "Choose a start month";
      } else {
        if (!form.date) errs.date = "Pick a shoot date";
        if (!form.time) errs.time = "Pick a start time";
      }
    }
    if (s === 8 && form.payment === "bank" && !files.slip) errs.slip = "Upload your transfer slip (or choose another option)";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function go(to: number) {
    if (to > step) {
      for (let s = step; s < to; s++) if (!validate(s)) return;
    }
    setDir(to > step ? 1 : -1);
    setStep(to);
    const y = top.current ? top.current.getBoundingClientRect().top + window.scrollY - 90 : 0;
    if (lenis) lenis.scrollTo(y, { duration: 0.8 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  }

  async function submit() {
    for (let s = 1; s <= 8; s++)
      if (!validate(s)) {
        setDir(s > step ? 1 : -1);
        setStep(s);
        return;
      }
    setSubmitting(true);
    setServerError(null);
    const fd = new FormData();
    fd.set("data", JSON.stringify({ ...form, payment: est.requiresConsultation || !est.advance ? "enquiry" : form.payment }));
    if (files.slip && form.payment === "bank") fd.set("slip", files.slip);
    if (files.moodboardFile) fd.set("moodboardFile", files.moodboardFile);
    try {
      const res = await fetch("/api/booking", { method: "POST", body: fd });
      const j = await res.json();
      if (!res.ok) throw new Error(j.issues?.[0]?.message ?? j.error ?? "Something went wrong");
      localStorage.removeItem(STORAGE);
      if (j.payhere) {
        // Hand over to PayHere's hosted checkout
        const f = document.createElement("form");
        f.method = "POST";
        f.action = j.payhere.action;
        for (const [k, v] of Object.entries(j.payhere.fields as Record<string, string>)) {
          const i = document.createElement("input");
          i.type = "hidden";
          i.name = k;
          i.value = v;
          f.appendChild(i);
        }
        document.body.appendChild(f);
        f.submit();
        return;
      }
      setDone(j);
    } catch (e) {
      setServerError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) return <Confirmation refCode={done.ref} kind={done.kind} payment={done.payment} payhereUnavailable={done.payhereUnavailable} />;

  return (
    <div ref={top} className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px]">
      <div className="min-w-0">
        <FilmProgress step={step} onJump={(s) => s < step && go(s)} />
        <div className="relative mt-10 min-h-[420px]">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={step}
              custom={dir}
              initial={{ x: dir * 90, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: dir * -90, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.7, 0, 0.2, 1] }}
            >
              {step === 1 && <StepWhat form={form} set={set} error={errors.category} onPick={() => setTimeout(() => go(2), 250)} />}
              {step === 2 && <StepPackage form={form} set={set} errors={errors} />}
              {step === 3 && <StepAddons form={form} set={set} />}
              {step === 4 && <StepLocation form={form} set={set} errors={errors} />}
              {step === 5 && <StepDate form={form} set={set} errors={errors} />}
              {step === 6 && <StepBrief form={form} set={set} errors={errors} setFile={(f) => setFiles((x) => ({ ...x, moodboardFile: f }))} file={files.moodboardFile} />}
              {step === 7 && <StepDetails form={form} set={set} errors={errors} />}
              {step === 8 && (
                <StepReview
                  form={form}
                  set={set}
                  errors={errors}
                  est={est}
                  slip={files.slip}
                  setSlip={(f) => setFiles((x) => ({ ...x, slip: f }))}
                  onEdit={(s) => go(s)}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {serverError && (
          <p role="alert" className="mt-6 rounded-lg border border-rec/50 bg-rec/10 p-4 text-sm">
            {serverError}
          </p>
        )}

        <div className="mt-10 flex items-center justify-between gap-4 border-t border-line pt-6">
          <button type="button" onClick={() => go(step - 1)} disabled={step === 1} className="btn-ghost disabled:opacity-30">
            ← Back
          </button>
          <span className="hud hidden text-mute sm:block">
            FRAME {String(step).padStart(2, "0")} / 08 · {STEP_NAMES[step - 1].toUpperCase()}
          </span>
          {step < 8 ? (
            <button type="button" onClick={() => go(step + 1)} className="btn-rec">
              Next →
            </button>
          ) : (
            <button type="button" onClick={submit} disabled={submitting} className="btn-rec disabled:opacity-60">
              {submitting
                ? "Rolling…"
                : est.requiresConsultation || !est.advance || form.payment === "enquiry"
                  ? "Send request"
                  : form.payment === "payhere"
                    ? `Pay ${money(est.advance, false)} advance`
                    : "Confirm booking"}
            </button>
          )}
        </div>
      </div>

      {/* Call sheet — sticky on desktop, bottom drawer on mobile */}
      <aside className="hidden lg:block">
        <div className="sticky top-24">
          <CallSheet form={form} est={est} />
        </div>
      </aside>
      <div className="fixed inset-x-0 bottom-0 z-[70] lg:hidden">
        <button
          type="button"
          onClick={() => setDrawer((d) => !d)}
          aria-expanded={drawer}
          className="flex w-full items-center justify-between border-t border-line bg-ink-2/95 px-5 py-4 backdrop-blur"
        >
          <span className="hud text-mute">CALL SHEET {drawer ? "▼" : "▲"}</span>
          <span className="font-display text-lg font-extrabold">
            {est.lines.length ? `${money(est.total, est.from)}${est.perMonth ? "/mo" : ""}` : "—"}
          </span>
        </button>
        <AnimatePresence>
          {drawer && (
            <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden bg-ink-2">
              <div className="max-h-[60vh] overflow-y-auto p-4">
                <CallSheet form={form} est={est} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
function FilmProgress({ step, onJump }: { step: number; onJump: (s: number) => void }) {
  return (
    <nav aria-label="Booking progress" className="overflow-x-auto no-scrollbar">
      <ol className="flex min-w-[560px] rounded-md bg-[#1a1714] p-1.5">
        {STEP_NAMES.map((n, i) => {
          const s = i + 1;
          const state = s === step ? "current" : s < step ? "done" : "todo";
          return (
            <li key={n} className="flex-1">
              <button
                type="button"
                onClick={() => onJump(s)}
                disabled={s >= step}
                aria-current={state === "current" ? "step" : undefined}
                className={cn(
                  "relative flex w-full flex-col items-center gap-1 border-x-[3px] border-[#1a1714] py-2.5 transition-colors",
                  state === "current" && "bg-paper text-ink",
                  state === "done" && "bg-paper/15 text-paper hover:bg-paper/25",
                  state === "todo" && "bg-ink text-mute",
                )}
              >
                <span className="font-mono text-[10px]">{String(s).padStart(2, "0")}</span>
                <span className="text-[11px] font-semibold">{n}</span>
                {state === "current" && <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-rec" />}
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

type StepProps = { form: Form; set: <K extends keyof Form>(k: K, v: Form[K]) => void; errors?: Record<string, string> };

function StepTitle({ n, children, sub }: { n: number; children: React.ReactNode; sub?: string }) {
  return (
    <div className="mb-8">
      <p className="hud text-rec">FRAME {String(n).padStart(2, "0")}</p>
      <h2 className="display mt-2 text-[clamp(1.7rem,4.5vw,3.6rem)]">{children}</h2>
      {sub && <p className="mt-3 max-w-xl text-mute">{sub}</p>}
    </div>
  );
}

function Err({ msg }: { msg?: string }) {
  return msg ? (
    <p role="alert" className="mt-2 text-sm text-rec">
      {msg}
    </p>
  ) : null;
}

const input = "w-full rounded-xl border border-line bg-ink-2 px-4 py-3.5 text-paper outline-none transition-colors placeholder:text-mute/70 focus:border-paper";
const labelCls = "mb-2 block text-sm font-medium text-paper/85";

function StepWhat({ form, set, error, onPick }: StepProps & { error?: string; onPick: () => void }) {
  return (
    <fieldset>
      <legend className="contents">
        <StepTitle n={1}>What do you need?</StepTitle>
      </legend>
      <div className="grid gap-3 sm:grid-cols-2">
        {categories.map((c, i) => {
          const on = form.category === c.id;
          return (
            <label key={c.id} className={cn("group relative flex cursor-pointer flex-col rounded-2xl border p-5 transition-all", on ? "border-rec bg-rec/10" : "border-line bg-ink-2 hover:border-paper/50")}>
              <input
                type="radio"
                name="category"
                className="sr-only"
                checked={on}
                onChange={() => {
                  set("category", c.id);
                  if (form.category !== c.id) {
                    set("packageId", undefined);
                    set("services", []);
                  }
                  onPick();
                }}
              />
              <span className="hud text-mute">0{i + 1}</span>
              <span className="mt-3 font-display text-xl font-extrabold uppercase leading-tight [overflow-wrap:anywhere] sm:text-2xl">{c.label}</span>
              <span className="mt-1 text-sm text-mute">{c.hint}</span>
              <span className={cn("absolute right-5 top-5 size-3 rounded-full border", on ? "border-rec bg-rec" : "border-line")} />
            </label>
          );
        })}
      </div>
      <Err msg={error} />
    </fieldset>
  );
}

function StepPackage({ form, set, errors }: StepProps) {
  if (!form.category) return <p>Choose a category first.</p>;
  if (form.category === "custom")
    return (
      <div>
        <StepTitle n={2} sub="No problem — tell us the brief in a few steps and we'll recommend the right package or quote.">
          Custom / not sure
        </StepTitle>
        <p className="card p-6 text-paper/80">Continue to add-ons, location and your brief. We&apos;ll come back with a plan and a quote — nothing is charged at this stage.</p>
      </div>
    );
  if (form.category === "individual")
    return (
      <fieldset>
        <legend className="contents">
          <StepTitle n={2} sub="Starting rates — final quotes depend on the brief.">
            Choose services
          </StepTitle>
        </legend>
        <div className="space-y-2">
          {individualServices.map((r) => {
            const on = form.services.includes(r.id);
            return (
              <label key={r.id} className={cn("flex cursor-pointer items-center justify-between gap-4 rounded-xl border px-5 py-4 font-mono text-sm transition-colors", on ? "border-rec bg-rec/10" : "border-line bg-ink-2 hover:border-paper/40")}>
                <span className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={on}
                    onChange={() => set("services", on ? form.services.filter((s) => s !== r.id) : [...form.services, r.id])}
                    className="size-4 accent-[#FF3B2F]"
                  />
                  <span className="font-body text-[15px]">{r.label}</span>
                </span>
                <span>{r.display}</span>
              </label>
            );
          })}
        </div>
        <Err msg={errors?.services} />
      </fieldset>
    );
  const opts = packagesFor(form.category);
  return (
    <fieldset>
      <legend className="contents">
        <StepTitle n={2}>Choose your package</StepTitle>
      </legend>
      <div className="grid gap-3 sm:grid-cols-2">
        {opts.map((o) => {
          const on = form.packageId === o.id;
          return (
            <label key={o.id} className={cn("flex cursor-pointer flex-col rounded-2xl border p-5 transition-all", on ? "border-rec bg-rec/10" : "border-line bg-ink-2 hover:border-paper/50")}>
              <input type="radio" name="pkg" className="sr-only" checked={on} onChange={() => set("packageId", o.id)} />
              <span className="font-display text-lg font-extrabold uppercase leading-tight [overflow-wrap:anywhere] sm:text-xl">{o.name}</span>
              <span className="mt-2 font-display text-2xl font-extrabold">
                {o.from && <span className="font-body text-sm font-medium text-mute">From </span>}
                {formatLKR(o.price)}
                {o.perMonth && <span className="font-body text-sm font-medium text-mute"> / month</span>}
              </span>
              <span className="hud mt-3 flex flex-wrap gap-x-3 gap-y-1 text-mute">
                {o.meta.map((m) => (
                  <span key={m}>{m}</span>
                ))}
              </span>
              {o.quoteOnly && <span className="hud mt-3 text-clay">Consultation first · no payment now</span>}
            </label>
          );
        })}
      </div>
      <Err msg={errors?.packageId} />
      <Link href="/pricing" className="hud mt-5 inline-block text-mute underline-offset-4 hover:text-paper hover:underline" target="_blank">
        Compare what&apos;s included ↗
      </Link>
    </fieldset>
  );
}

function StepAddons({ form, set }: StepProps) {
  const qty = (id: string) => form.addons[id] ?? 0;
  const setQty = (id: string, n: number) => set("addons", { ...form.addons, [id]: Math.max(0, Math.min(99, n)) });
  return (
    <div>
      <StepTitle n={3} sub="Optional. Anything with a “+” is a starting rate.">
        Add-ons
      </StepTitle>
      <div className="grid gap-3 sm:grid-cols-2">
        {bookingAddons.map((a) => {
          const n = qty(a.rateId);
          const on = n > 0;
          return (
            <div key={a.rateId} className={cn("flex items-center justify-between gap-3 rounded-xl border p-4 transition-colors", on ? "border-rec bg-rec/10" : "border-line bg-ink-2")}>
              <button type="button" className="flex-1 text-left" onClick={() => setQty(a.rateId, on ? 0 : 1)} aria-pressed={on}>
                <span className="block font-semibold">{a.label}</span>
                <span className="hud text-mute">{a.hint}</span>
              </button>
              {a.stepper && on ? (
                <div className="flex items-center gap-1 rounded-full border border-line">
                  <button type="button" className="size-8 rounded-full hover:bg-paper/10" onClick={() => setQty(a.rateId, n - 1)} aria-label={`Fewer ${a.label}`}>
                    −
                  </button>
                  <span className="w-6 text-center font-mono text-sm" aria-live="polite">
                    {n}
                  </span>
                  <button type="button" className="size-8 rounded-full hover:bg-paper/10" onClick={() => setQty(a.rateId, n + 1)} aria-label={`More ${a.label}`}>
                    +
                  </button>
                </div>
              ) : (
                <span className={cn("flex size-6 items-center justify-center rounded-full border text-xs", on ? "border-rec bg-rec" : "border-line")} aria-hidden>
                  {on ? "✓" : ""}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StepLocation({ form, set, errors }: StepProps) {
  const zone = zoneFor(form.district);
  return (
    <div>
      <StepTitle n={4} sub="Available islandwide. Your district sets the travel zone automatically.">
        Location &amp; travel
      </StepTitle>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="district" className={labelCls}>
            District
          </label>
          <select id="district" className={input} value={form.district ?? ""} onChange={(e) => set("district", e.target.value)}>
            <option value="">Select a district…</option>
            {[...districts]
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((d) => (
                <option key={d.name} value={d.name}>
                  {d.name} — {d.province}
                </option>
              ))}
          </select>
          <Err msg={errors?.district} />
          {zone && (
            <p className="hud mt-3 flex items-center gap-2 text-paper">
              <span className="rec-dot" /> {travelZones[zone].label}: {travelZones[zone].display}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="venue" className={labelCls}>
            Venue name
          </label>
          <input id="venue" className={input} value={form.venue ?? ""} onChange={(e) => set("venue", e.target.value)} placeholder="e.g. The Harbour Café" />
          <Err msg={errors?.venue} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="address" className={labelCls}>
            Address
          </label>
          <input id="address" className={input} value={form.address ?? ""} onChange={(e) => set("address", e.target.value)} placeholder="Street, town" />
        </div>
        <fieldset>
          <legend className={labelCls}>Setting</legend>
          <div className="flex gap-2">
            {(["indoor", "outdoor", "both"] as const).map((s) => (
              <button key={s} type="button" onClick={() => set("setting", s)} aria-pressed={form.setting === s} className={cn("flex-1 rounded-xl border px-3 py-3 text-sm capitalize", form.setting === s ? "border-rec bg-rec/10" : "border-line bg-ink-2")}>
                {s}
              </button>
            ))}
          </div>
        </fieldset>
        <div>
          <span className={labelCls}>Overnight shoot?</span>
          <button
            type="button"
            role="switch"
            aria-checked={!!form.overnight}
            onClick={() => set("overnight", !form.overnight)}
            className={cn("flex w-full items-center justify-between rounded-xl border px-4 py-3 text-sm", form.overnight ? "border-rec bg-rec/10" : "border-line bg-ink-2")}
          >
            {form.overnight ? "Yes — transport + accommodation quoted" : "No"}
            <span className={cn("relative h-5 w-9 rounded-full transition-colors", form.overnight ? "bg-rec" : "bg-line")}>
              <span className={cn("absolute top-0.5 size-4 rounded-full bg-paper transition-all", form.overnight ? "left-[18px]" : "left-0.5")} />
            </span>
          </button>
        </div>
      </div>
      <details className="mt-8">
        <summary className="hud cursor-pointer text-mute hover:text-paper">View travel zone map</summary>
        <ZoneMap selected={form.district} />
      </details>
    </div>
  );
}

function StepDate({ form, set, errors }: StepProps) {
  if (form.category === "monthly") {
    const months = Array.from({ length: 6 }, (_, i) => {
      const d = new Date();
      const m = new Date(d.getFullYear(), d.getMonth() + i + 1, 1);
      return { v: `${m.getFullYear()}-${String(m.getMonth() + 1).padStart(2, "0")}`, l: m.toLocaleString("en-GB", { month: "long", year: "numeric" }) };
    });
    return (
      <div>
        <StepTitle n={5} sub="We'll plan the month's shoot days together on the consultation call.">
          Start month
        </StepTitle>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {months.map((m) => (
            <button key={m.v} type="button" onClick={() => set("startMonth", m.v)} aria-pressed={form.startMonth === m.v} className={cn("rounded-xl border p-4 text-left", form.startMonth === m.v ? "border-rec bg-rec/10" : "border-line bg-ink-2")}>
              <span className="hud text-mute">{m.v}</span>
              <span className="mt-1 block font-semibold">{m.l}</span>
            </button>
          ))}
        </div>
        <Err msg={errors?.startMonth} />
        <label htmlFor="days" className={cn(labelCls, "mt-8")}>
          Preferred shoot days
        </label>
        <input id="days" className={input} value={form.shootDays ?? ""} onChange={(e) => set("shootDays", e.target.value)} placeholder="e.g. First & third Tuesday, mornings" />
      </div>
    );
  }
  return (
    <div>
      <StepTitle n={5} sub={form.category === "custom" ? "Optional — pick a date if you already have one in mind." : "Available days are live from our calendar. Your slot is held as tentative until confirmed."}>
        Date &amp; time
      </StepTitle>
      <div className="grid gap-8 md:grid-cols-[1fr_200px]">
        <div>
          <Calendar value={form.date ?? ""} onChange={(d) => set("date", d)} />
          <Err msg={errors?.date} />
        </div>
        <fieldset>
          <legend className={labelCls}>Start time</legend>
          <div className="grid grid-cols-3 gap-2 md:grid-cols-1">
            {TIME_SLOTS.map((t) => (
              <button key={t.v} type="button" onClick={() => set("time", t.v)} aria-pressed={form.time === t.v} className={cn("rounded-xl border px-3 py-3 text-left font-mono text-sm", form.time === t.v ? "border-rec bg-rec/10" : "border-line bg-ink-2 hover:border-paper/40")}>
                {t.v}
                <span className="block font-body text-[11px] text-mute">{t.l}</span>
              </button>
            ))}
          </div>
          <Err msg={errors?.time} />
        </fieldset>
      </div>
    </div>
  );
}

const NEEDS = ["Models / talent", "Props", "Food stylist", "Makeup artist", "Location hire", "Studio hire"];

function StepBrief({ form, set, errors, setFile, file }: StepProps & { setFile: (f?: File) => void; file?: File }) {
  return (
    <div>
      <StepTitle n={6}>Your brief</StepTitle>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="biz" className={labelCls}>
            Business name
          </label>
          <input id="biz" className={input} value={form.businessName ?? ""} onChange={(e) => set("businessName", e.target.value)} />
          <Err msg={errors?.businessName} />
        </div>
        <div>
          <label htmlFor="industry" className={labelCls}>
            Industry
          </label>
          <select id="industry" className={input} value={form.industry ?? ""} onChange={(e) => set("industry", e.target.value)}>
            <option value="">Select…</option>
            {industries.map((i) => (
              <option key={i.id}>{i.name}</option>
            ))}
            <option>Other</option>
          </select>
          <Err msg={errors?.industry} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="link" className={labelCls}>
            Instagram / website link
          </label>
          <input id="link" className={input} value={form.link ?? ""} onChange={(e) => set("link", e.target.value)} placeholder="instagram.com/yourbusiness" />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="promote" className={labelCls}>
            What do you want to promote?
          </label>
          <textarea id="promote" rows={4} className={input} value={form.promote ?? ""} onChange={(e) => set("promote", e.target.value)} placeholder="New menu launch, rooms, a product line, the team…" />
          <Err msg={errors?.promote} />
        </div>
        <div>
          <label htmlFor="mood" className={labelCls}>
            Moodboard link
          </label>
          <input id="mood" className={input} value={form.moodboard ?? ""} onChange={(e) => set("moodboard", e.target.value)} placeholder="Pinterest, Drive, Instagram saves…" />
        </div>
        <div>
          <label htmlFor="moodfile" className={labelCls}>
            …or upload a file (max 5 MB)
          </label>
          <input id="moodfile" type="file" accept="image/*,application/pdf" onChange={(e) => setFile(e.target.files?.[0])} className={cn(input, "file:mr-3 file:rounded-full file:border-0 file:bg-paper file:px-3 file:py-1 file:text-ink")} />
          {file && <p className="hud mt-2 text-mute">{file.name}</p>}
        </div>
        <fieldset className="sm:col-span-2">
          <legend className={labelCls}>Do you need any of these?</legend>
          <div className="flex flex-wrap gap-2">
            {NEEDS.map((n) => {
              const on = form.needs.includes(n);
              return (
                <button key={n} type="button" aria-pressed={on} onClick={() => set("needs", on ? form.needs.filter((x) => x !== n) : [...form.needs, n])} className={cn("rounded-full border px-4 py-2 text-sm", on ? "border-rec bg-rec/10" : "border-line")}>
                  {n}
                </button>
              );
            })}
          </div>
          {form.needs.length > 0 && <p className="hud mt-3 text-clay">These are quoted separately.</p>}
        </fieldset>
      </div>
    </div>
  );
}

function StepDetails({ form, set, errors }: StepProps) {
  return (
    <div>
      <StepTitle n={7}>Your details</StepTitle>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelCls}>
            Name
          </label>
          <input id="name" autoComplete="name" className={input} value={form.name ?? ""} onChange={(e) => set("name", e.target.value)} />
          <Err msg={errors?.name} />
        </div>
        <div>
          <label htmlFor="phone" className={labelCls}>
            Phone
          </label>
          <input id="phone" type="tel" autoComplete="tel" inputMode="tel" className={input} value={form.phone ?? ""} onChange={(e) => set("phone", e.target.value)} placeholder="+94 77 123 4567" />
          <Err msg={errors?.phone} />
          <label className="mt-3 flex items-center gap-2 text-sm text-paper/80">
            <input type="checkbox" checked={!!form.whatsapp} onChange={(e) => set("whatsapp", e.target.checked)} className="size-4 accent-[#FF3B2F]" />
            Reach me on WhatsApp
          </label>
        </div>
        <div>
          <label htmlFor="email" className={labelCls}>
            Email
          </label>
          <input id="email" type="email" autoComplete="email" className={input} value={form.email ?? ""} onChange={(e) => set("email", e.target.value)} />
          <Err msg={errors?.email} />
        </div>
        <div>
          <label htmlFor="source" className={labelCls}>
            How did you find us?
          </label>
          <select id="source" className={input} value={form.source ?? ""} onChange={(e) => set("source", e.target.value)}>
            <option value="">Select…</option>
            {["Instagram", "TikTok", "Facebook", "Google", "Referral / word of mouth", "Saw your work", "Other"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

function StepReview({
  form,
  set,
  errors,
  est,
  slip,
  setSlip,
  onEdit,
}: StepProps & { est: ReturnType<typeof estimate>; slip?: File; setSlip: (f?: File) => void; onEdit: (s: number) => void }) {
  const payable = !est.requiresConsultation && !!est.advance;
  useEffect(() => {
    if (!payable && form.payment !== "enquiry") set("payment", "enquiry");
  }, [payable, form.payment, set]);
  return (
    <div>
      <StepTitle n={8}>Review &amp; confirm</StepTitle>
      <CallSheet form={form} est={est} full onEdit={onEdit} />

      {payable ? (
        <fieldset className="mt-8">
          <legend className={labelCls}>How would you like to confirm?</legend>
          <p className="mb-4 font-display text-2xl font-extrabold">
            50% advance to confirm: <span className="text-rec">{money(est.advance!, est.from)}</span>
          </p>
          <div className="grid gap-2">
            {(
              [
                ["payhere", "Pay advance with PayHere", "Card, eZ Cash, mCash, bank — secure checkout"],
                ["bank", "Pay by bank transfer", "Transfer and upload the slip"],
                ["enquiry", "Send as enquiry", "We'll confirm the quote first — nothing to pay now"],
              ] as const
            ).map(([v, l, h]) => (
              <label key={v} className={cn("flex cursor-pointer items-start gap-3 rounded-xl border p-4", form.payment === v ? "border-rec bg-rec/10" : "border-line bg-ink-2")}>
                <input type="radio" name="payment" checked={form.payment === v} onChange={() => set("payment", v)} className="mt-1 accent-[#FF3B2F]" />
                <span>
                  <span className="block font-semibold">{l}</span>
                  <span className="text-sm text-mute">{h}</span>
                </span>
              </label>
            ))}
          </div>
          {form.payment === "bank" && (
            <div className="mt-4 rounded-xl border border-line bg-black/30 p-5 font-mono text-sm">
              <p className="hud mb-3 text-mute">BANK DETAILS</p>
              <p>{site.bank.accountName}</p>
              <p>
                {site.bank.bank} · {site.bank.branch}
              </p>
              <p className="text-lg">{site.bank.accountNumber}</p>
              <p className="mt-2 text-mute">Use your business name as the reference.</p>
              <label htmlFor="slip" className="mt-5 block font-body text-sm font-medium text-paper/85">
                Upload transfer slip (image or PDF, max 5 MB)
              </label>
              <input
                id="slip"
                type="file"
                accept="image/*,application/pdf"
                onChange={(e) => setSlip(e.target.files?.[0])}
                className={cn(input, "mt-2 font-body file:mr-3 file:rounded-full file:border-0 file:bg-paper file:px-3 file:py-1 file:text-ink")}
              />
              {slip && <p className="hud mt-2 text-mute">{slip.name}</p>}
              <Err msg={errors?.slip} />
            </div>
          )}
        </fieldset>
      ) : (
        <p className="mt-8 rounded-xl border border-clay/40 bg-clay/5 p-5 text-paper/85">
          {form.category === "monthly"
            ? "Monthly plans start with a short consultation. No payment now — payment is made at the start of each monthly content cycle."
            : "This is a consultation request. No payment now — we'll confirm the quote first."}
        </p>
      )}

      <label className="mt-8 flex items-start gap-3 text-sm">
        <input type="checkbox" checked={form.agree === true} onChange={(e) => set("agree", e.target.checked ? true : (undefined as never))} className="mt-0.5 size-4 accent-[#FF3B2F]" />
        <span>
          I agree to the{" "}
          <Link href="/terms" target="_blank" className="underline underline-offset-4">
            booking terms
          </Link>{" "}
          (payment, travel, revisions and usage).
        </span>
      </label>
      <Err msg={errors?.agree} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
function CallSheet({ form, est, full = false, onEdit }: { form: Form; est: ReturnType<typeof estimate>; full?: boolean; onEdit?: (s: number) => void }) {
  const cat = categories.find((c) => c.id === form.category);
  const pkg = form.category && form.packageId ? packagesFor(form.category).find((p) => p.id === form.packageId) : undefined;
  const row = (label: string, value: React.ReactNode, s?: number) => (
    <div className="flex items-start justify-between gap-4 border-b border-dashed border-line py-2.5 text-sm">
      <span className="hud shrink-0 pt-0.5 text-mute">{label}</span>
      <span className="text-right">
        {value || <span className="text-mute">—</span>}
        {full && onEdit && s && (
          <button type="button" onClick={() => onEdit(s)} className="hud ml-3 text-rec hover:underline">
            Edit
          </button>
        )}
      </span>
    </div>
  );
  return (
    <div className="rounded-[18px] border border-line bg-ink-2 p-5">
      <div className="flex items-center justify-between border-b border-line pb-3">
        <span className="font-display text-lg font-extrabold uppercase">Call sheet</span>
        <span className="hud flex items-center gap-1.5 text-mute">
          <span className="rec-dot" /> LIVE ESTIMATE
        </span>
      </div>
      {row("Type", cat?.label, 1)}
      {row("Package", pkg?.name ?? (form.category === "individual" ? `${form.services.length} service(s)` : undefined), 2)}
      {full && row("Where", form.district ? `${form.venue ?? ""}${form.venue ? " · " : ""}${form.district}` : undefined, 4)}
      {full && row("When", form.category === "monthly" ? form.startMonth : form.date ? `${form.date} · ${form.time ?? ""}` : undefined, 5)}
      {full && row("Business", form.businessName, 6)}
      {full && row("Contact", form.name ? `${form.name} · ${form.phone}` : undefined, 7)}

      <div className="mt-4 space-y-1.5">
        {est.lines.length === 0 && <p className="text-sm text-mute">Pick a package to see your estimate.</p>}
        {est.lines.map((l, i) => (
          <div key={i} className="flex justify-between gap-4 text-sm">
            <span className="text-paper/80">{l.label}</span>
            <span className="whitespace-nowrap font-mono text-[13px]">{l.display}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-end justify-between border-t border-line pt-4">
        <span className="hud text-mute">Estimated total</span>
        <span className="font-display text-2xl font-extrabold">
          {est.lines.length ? money(est.total, est.from) : "—"}
          {est.perMonth && <span className="font-body text-sm font-medium text-mute"> / month</span>}
        </span>
      </div>
      {est.quoted && <p className="hud mt-2 text-right text-clay">+ items quoted separately</p>}
      {est.advance && (
        <p className="hud mt-2 text-right text-paper">
          50% advance: {money(est.advance, est.from)}
        </p>
      )}
      <p className="mt-4 text-xs leading-relaxed text-mute">
        Estimates use the published rates. Final price confirmed by AX.Visuals.{" "}
        <a href={waLink(site.whatsapp, "Hi! I have a question about my booking.")} target="_blank" rel="noopener" className="underline">
          Questions? WhatsApp us
        </a>
      </p>
      {rateCard.length === 0 && null}
    </div>
  );
}


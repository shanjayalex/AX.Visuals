import { NextResponse } from "next/server";
import { Resend } from "resend";
import { bookingSchema, categories, estimate, money, packagesFor } from "@/lib/booking";
import { formatLKR } from "@/lib/format";
import { calendarConfigured, createHold } from "@/lib/server/google";
import { checkoutFields, payhereAction, payhereConfigured } from "@/lib/server/payhere";
import { contentPackages, policies, rateCard, restaurantPackage } from "@/content/pricing";
import { site } from "@/content/site";

const MAX_FILE = 5 * 1024 * 1024;

function reference() {
  const d = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Colombo" }).format(new Date()).replace(/-/g, "").slice(2);
  return `AX-${d}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

export async function POST(req: Request) {
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  let raw: unknown;
  try {
    raw = JSON.parse(String(form.get("data") ?? "{}"));
  } catch {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
  const parsed = bookingSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", issues: parsed.error.issues.map((i) => ({ path: i.path.join("."), message: i.message })) }, { status: 422 });
  }
  const b = parsed.data;
  const est = estimate(b);
  const ref = reference();

  // Payment is only possible for one-off, priced bookings
  const canPay = !est.requiresConsultation && !!est.advance;
  // PayHere chosen but not set up yet → record as a request; the studio sends a payment link
  const payhereUnavailable = canPay && b.payment === "payhere" && !payhereConfigured();
  const payment = canPay && !payhereUnavailable ? b.payment : "enquiry";
  const kind = payment === "enquiry" ? "REQUEST RECEIVED" : "BOOKED";

  const attachments: { filename: string; content: Buffer }[] = [];
  for (const key of ["slip", "moodboardFile"] as const) {
    const f = form.get(key);
    if (f instanceof File && f.size > 0) {
      if (f.size > MAX_FILE) return NextResponse.json({ error: `${f.name} is larger than 5 MB` }, { status: 413 });
      attachments.push({ filename: `${key}-${f.name}`, content: Buffer.from(await f.arrayBuffer()) });
    }
  }

  const categoryLabel = categories.find((c) => c.id === b.category)?.label ?? b.category;
  const pkgName = b.packageId ? packagesFor(b.category).find((p) => p.id === b.packageId)?.name : undefined;
  const lines = est.lines.map((l) => `  • ${l.label}: ${l.display}`).join("\n");
  const paymentTerms = policies.find((p) => p.id === "payment")!.details.join("\n  ");
  const when = b.category === "monthly" ? `Start month: ${b.startMonth || "TBC"} · Preferred shoot days: ${b.shootDays || "TBC"}` : `${b.date || "Date TBC"} ${b.time}`;

  const summary = `Reference: ${ref}
Status: ${kind}
Category: ${categoryLabel}${pkgName ? `\nPackage: ${pkgName}` : ""}${b.services.length ? `\nServices: ${b.services.map((s) => rateCard.find((r) => r.id === s)?.label).join(", ")}` : ""}
When: ${when}
Where: ${b.venue}${b.address ? `, ${b.address}` : ""} · ${b.district} (${b.setting})${b.overnight ? " · OVERNIGHT" : ""}

Estimate:
${lines}
Total: ${money(est.total, est.from)}${est.perMonth ? " / month" : ""}${est.quoted ? " + items quoted separately" : ""}
${est.advance ? `50% advance to confirm: ${money(est.advance, est.from)}` : "No payment taken — consultation request"}
Payment method: ${payment}

Business: ${b.businessName} (${b.industry}) ${b.link}
Promote: ${b.promote}
Moodboard: ${b.moodboard || "—"}
Needs (quoted separately): ${b.needs.join(", ") || "—"}

Client: ${b.name} · ${b.phone}${b.whatsapp ? " (WhatsApp OK)" : ""} · ${b.email}
Found us via: ${b.source || "—"}`;

  // Emails
  if (process.env.RESEND_API_KEY) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const from = process.env.EMAIL_FROM ?? "AX.Visuals <bookings@axvisuals.lk>";
    const jobs = [];
    if (process.env.STUDIO_EMAIL)
      jobs.push(resend.emails.send({ from, to: process.env.STUDIO_EMAIL, replyTo: b.email, subject: `New ${kind === "BOOKED" ? "booking" : "enquiry"} ${ref} — ${b.businessName}`, text: summary, attachments }));
    jobs.push(
      resend.emails.send({
        from,
        to: b.email,
        subject: `AX.Visuals — ${kind === "BOOKED" ? "booking" : "request"} ${ref}`,
        text: `Hi ${b.name},\n\nThanks — SCENE 01 · TAKE 01 · ${kind}.\nHere is your call sheet:\n\n${summary}\n\nPayment terms:\n  ${paymentTerms}\n\n${
          payment === "bank" ? `Bank transfer details:\n  ${site.bank.accountName}\n  ${site.bank.bank} · ${site.bank.branch}\n  ${site.bank.accountNumber}\n  Reference: ${ref}\n\n` : ""
        }We'll confirm everything on WhatsApp shortly (${site.phoneDisplay}).\n\n— AX.Visuals\nWe create content for businesses.`,
      }),
    );
    const results = await Promise.allSettled(jobs);
    results.forEach((r) => r.status === "rejected" && console.error("resend", r.reason));
  } else {
    console.log(`[booking] (RESEND_API_KEY not set — email skipped)\n${summary}`);
  }

  // Tentative calendar hold
  if (calendarConfigured() && b.date) {
    const hours =
      contentPackages.find((p) => p.id === b.packageId)?.hours ?? (b.packageId === restaurantPackage.id ? restaurantPackage.hours : 3);
    await createHold({ summary: `${b.businessName} — ${pkgName ?? categoryLabel} (${ref})`, description: summary, date: b.date, time: b.time, hours: hours + (b.addons["extra-hour"] ?? 0) }).catch((e) =>
      console.error("calendar hold", e),
    );
  }

  // PayHere checkout
  let payhere: { action: string; fields: Record<string, string> } | undefined;
  if (payment === "payhere" && payhereConfigured() && est.advance) {
    const base = new URL(req.url).origin;
    const [firstName, ...rest] = b.name.split(" ");
    payhere = {
      action: payhereAction(),
      fields: checkoutFields({
        orderId: ref,
        amount: est.advance,
        item: `50% advance — ${pkgName ?? categoryLabel}`,
        firstName,
        lastName: rest.join(" "),
        email: b.email,
        phone: b.phone.replace(/\s/g, ""),
        address: b.address,
        city: b.district,
        baseUrl: base,
      }),
    };
  }

  return NextResponse.json({
    ref,
    kind,
    payment,
    payhere,
    payhereUnavailable,
    advance: est.advance ? formatLKR(est.advance) : null,
  });
}

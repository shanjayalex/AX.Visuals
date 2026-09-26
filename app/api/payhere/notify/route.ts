import { NextResponse } from "next/server";
import { Resend } from "resend";
import { payhereConfigured, verifyNotify } from "@/lib/server/payhere";

/** PayHere server-to-server notification. status_code 2 = success. */
export async function POST(req: Request) {
  if (!payhereConfigured()) return NextResponse.json({ ok: false }, { status: 404 });
  const form = await req.formData();
  const p = Object.fromEntries([...form.entries()].map(([k, v]) => [k, String(v)]));
  if (!verifyNotify(p)) return NextResponse.json({ ok: false }, { status: 400 });

  const status = { "2": "SUCCESS", "0": "PENDING", "-1": "CANCELED", "-2": "FAILED", "-3": "CHARGEDBACK" }[p.status_code] ?? p.status_code;
  console.log(`[payhere] ${p.order_id} ${status} ${p.payhere_amount} ${p.payhere_currency}`);

  if (process.env.RESEND_API_KEY && process.env.STUDIO_EMAIL) {
    await new Resend(process.env.RESEND_API_KEY).emails
      .send({
        from: process.env.EMAIL_FROM ?? "AX.Visuals <bookings@axvisuals.lk>",
        to: process.env.STUDIO_EMAIL,
        subject: `PayHere ${status} — ${p.order_id} — Rs. ${p.payhere_amount}`,
        text: `Order ${p.order_id}\nStatus: ${status}\nAmount: ${p.payhere_currency} ${p.payhere_amount}\nPayment ID: ${p.payment_id}\nMethod: ${p.method}`,
      })
      .catch((e) => console.error("payhere email", e));
  }
  return NextResponse.json({ ok: true });
}

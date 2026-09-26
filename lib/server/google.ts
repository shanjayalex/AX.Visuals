import "server-only";
import { createSign } from "node:crypto";

/**
 * Minimal Google Calendar client using a service account (no SDK needed).
 * Share the studio calendar with the service-account email ("Make changes to events").
 */
export const calendarConfigured = () =>
  !!(process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_PRIVATE_KEY && process.env.GOOGLE_CALENDAR_ID);

let cached: { token: string; exp: number } | null = null;

async function accessToken() {
  if (cached && cached.exp > Date.now() + 60_000) return cached.token;
  const now = Math.floor(Date.now() / 1000);
  const b64 = (o: object) => Buffer.from(JSON.stringify(o)).toString("base64url");
  const unsigned = `${b64({ alg: "RS256", typ: "JWT" })}.${b64({
    iss: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    scope: "https://www.googleapis.com/auth/calendar",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  })}`;
  const key = process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, "\n");
  const sig = createSign("RSA-SHA256").update(unsigned).sign(key, "base64url");
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: `${unsigned}.${sig}` }),
  });
  if (!res.ok) throw new Error(`Google token error ${res.status}`);
  const j = (await res.json()) as { access_token: string; expires_in: number };
  cached = { token: j.access_token, exp: Date.now() + j.expires_in * 1000 };
  return j.access_token;
}

/** Returns YYYY-MM-DD dates (Asia/Colombo) that already have busy time in the given range. */
export async function busyDays(fromISO: string, toISO: string): Promise<string[]> {
  const token = await accessToken();
  const res = await fetch("https://www.googleapis.com/calendar/v3/freeBusy", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ timeMin: fromISO, timeMax: toISO, timeZone: "Asia/Colombo", items: [{ id: process.env.GOOGLE_CALENDAR_ID }] }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`freeBusy ${res.status}`);
  const j = (await res.json()) as { calendars: Record<string, { busy: { start: string; end: string }[] }> };
  const busy = j.calendars[process.env.GOOGLE_CALENDAR_ID!]?.busy ?? [];
  const fmt = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Colombo" });
  const days = new Set<string>();
  for (const b of busy) {
    for (let t = new Date(b.start).getTime(); t < new Date(b.end).getTime(); t += 3_600_000 * 6) days.add(fmt.format(new Date(t)));
  }
  return [...days];
}

export async function createHold(opts: { summary: string; description: string; date: string; time: string; hours: number }) {
  const token = await accessToken();
  const start = `${opts.date}T${opts.time || "09:00"}:00+05:30`;
  const end = new Date(new Date(start).getTime() + opts.hours * 3_600_000).toISOString();
  const res = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(process.env.GOOGLE_CALENDAR_ID!)}/events`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      summary: `[TENTATIVE] ${opts.summary}`,
      description: opts.description,
      start: { dateTime: start, timeZone: "Asia/Colombo" },
      end: { dateTime: end, timeZone: "Asia/Colombo" },
      status: "tentative",
      colorId: "11",
    }),
  });
  if (!res.ok) throw new Error(`events.insert ${res.status}`);
}

import { NextResponse } from "next/server";
import { busyDays, calendarConfigured } from "@/lib/server/google";

/** GET /api/availability?month=2026-10 → { busy: ["2026-10-03", ...], live: boolean } */
export async function GET(req: Request) {
  const month = new URL(req.url).searchParams.get("month") ?? "";
  if (!/^\d{4}-\d{2}$/.test(month)) return NextResponse.json({ error: "month=YYYY-MM required" }, { status: 400 });
  if (!calendarConfigured()) return NextResponse.json({ busy: [], live: false });
  const [y, m] = month.split("-").map(Number);
  const from = new Date(Date.UTC(y, m - 1, 1) - 5.5 * 3_600_000).toISOString();
  const to = new Date(Date.UTC(y, m, 1) - 5.5 * 3_600_000).toISOString();
  try {
    return NextResponse.json({ busy: await busyDays(from, to), live: true }, { headers: { "Cache-Control": "s-maxage=300" } });
  } catch (e) {
    console.error("availability", e);
    return NextResponse.json({ busy: [], live: false });
  }
}

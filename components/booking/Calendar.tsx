"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/format";

export const TIME_SLOTS = [
  { v: "07:00", l: "Morning light" },
  { v: "09:00", l: "Morning" },
  { v: "11:00", l: "Late morning" },
  { v: "14:00", l: "Afternoon" },
  { v: "16:00", l: "Golden hour" },
  { v: "18:30", l: "Evening / dinner" },
];

const colomboToday = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Colombo" }).format(new Date());
const pad = (n: number) => String(n).padStart(2, "0");

export function Calendar({ value, onChange }: { value: string; onChange: (d: string) => void }) {
  const today = useMemo(() => colomboToday(), []);
  const [cursor, setCursor] = useState(() => {
    const [y, m] = (value || today).split("-").map(Number);
    return { y, m };
  });
  const [busy, setBusy] = useState<string[]>([]);
  const [live, setLive] = useState<boolean | null>(null);
  const key = `${cursor.y}-${pad(cursor.m)}`;

  useEffect(() => {
    let alive = true;
    fetch(`/api/availability?month=${key}`)
      .then((r) => r.json())
      .then((j) => {
        if (!alive) return;
        setBusy(j.busy ?? []);
        setLive(!!j.live);
      })
      .catch(() => alive && setLive(false));
    return () => {
      alive = false;
    };
  }, [key]);

  const first = new Date(Date.UTC(cursor.y, cursor.m - 1, 1));
  const days = new Date(Date.UTC(cursor.y, cursor.m, 0)).getUTCDate();
  const lead = (first.getUTCDay() + 6) % 7; // Monday first
  const label = first.toLocaleString("en-GB", { month: "long", year: "numeric", timeZone: "UTC" });
  const [ty, tm] = today.split("-").map(Number);
  const canPrev = cursor.y > ty || (cursor.y === ty && cursor.m > tm);

  const shift = (d: number) =>
    setCursor((c) => {
      const t = new Date(Date.UTC(c.y, c.m - 1 + d, 1));
      return { y: t.getUTCFullYear(), m: t.getUTCMonth() + 1 };
    });

  return (
    <div className="rounded-2xl border border-line bg-ink-2 p-4">
      <div className="mb-4 flex items-center justify-between">
        <button type="button" onClick={() => shift(-1)} disabled={!canPrev} className="size-9 rounded-full border border-line disabled:opacity-30" aria-label="Previous month">
          ←
        </button>
        <p className="font-display font-bold uppercase" aria-live="polite">
          {label}
        </p>
        <button type="button" onClick={() => shift(1)} className="size-9 rounded-full border border-line" aria-label="Next month">
          →
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center" role="grid" aria-label={label}>
        {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
          <span key={i} className="hud py-1 text-mute" aria-hidden>
            {d}
          </span>
        ))}
        {Array.from({ length: lead }, (_, i) => (
          <span key={`l${i}`} />
        ))}
        {Array.from({ length: days }, (_, i) => {
          const d = `${key}-${pad(i + 1)}`;
          const past = d <= today;
          const isBusy = busy.includes(d);
          const on = value === d;
          return (
            <button
              key={d}
              type="button"
              disabled={past || isBusy}
              onClick={() => onChange(d)}
              aria-pressed={on}
              aria-label={`${d}${isBusy ? " — booked" : ""}`}
              className={cn(
                "relative aspect-square rounded-lg font-mono text-sm transition-colors",
                on ? "bg-rec text-paper" : "hover:bg-paper/10",
                past && "text-mute/40",
                isBusy && "text-mute/50 line-through",
              )}
            >
              {i + 1}
            </button>
          );
        })}
      </div>
      <p className="hud mt-4 flex flex-wrap gap-4 text-mute">
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-rec" /> Selected
        </span>
        <span className="line-through">12</span> Booked
        {live === false && <span>· Availability confirmed by the studio after you submit</span>}
      </p>
    </div>
  );
}

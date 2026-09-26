"use client";

import { usePathname } from "next/navigation";
import { site } from "@/content/site";
import { waLink } from "@/lib/format";

export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35M12.05 21.8h-.01a9.8 9.8 0 0 1-5-1.37l-.36-.21-3.72.98 1-3.63-.24-.37a9.8 9.8 0 0 1-1.5-5.23c0-5.42 4.41-9.83 9.84-9.83a9.8 9.8 0 0 1 9.83 9.84c0 5.42-4.41 9.83-9.84 9.83m8.37-18.2A11.76 11.76 0 0 0 12.05.13C5.5.13.17 5.46.17 12.01c0 2.1.55 4.14 1.59 5.94L.07 24.1l6.3-1.65a11.87 11.87 0 0 0 5.68 1.45h.01c6.55 0 11.88-5.33 11.88-11.88 0-3.17-1.24-6.16-3.48-8.4" />
    </svg>
  );
}

export function WhatsAppFab() {
  // On phones the booking page has its own bottom bar (with a WhatsApp link in the call sheet) — keep the flow buttons clear
  const onBooking = usePathname().startsWith("/booking");
  return (
    <a
      href={waLink(site.whatsapp, "Hi AX.Visuals! I'd like to talk about a shoot.")}
      target="_blank"
      rel="noopener"
      aria-label="Chat with AX.Visuals on WhatsApp"
      className={`group fixed ${onBooking ? "hidden lg:flex" : "flex"} bottom-5 right-4 z-[85] sm:right-5 size-14 items-center justify-center rounded-full bg-[#1f1f22] text-paper shadow-2xl ring-1 ring-line transition-transform hover:scale-105 no-print`}
      data-cursor="chat"
    >
      <span className="absolute inset-0 rounded-full border-2 border-rec" style={{ animation: "pulse-ring 2s ease-out infinite" }} />
      <WhatsAppIcon className="size-6" />
    </a>
  );
}

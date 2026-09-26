import type { Metadata } from "next";
import { Suspense } from "react";
import { BookingFlow } from "@/components/booking/BookingFlow";
import { FAQSection } from "@/components/pricing/Policies";
import { SectionLabel } from "@/components/motion/primitives";

export const metadata: Metadata = {
  title: "Book a Shoot",
  description: "Book a content shoot with AX.Visuals — choose a package, add-ons, travel zone and date, and see a live estimate. 50% advance confirms your booking.",
};

export default function BookingPage() {
  return (
    <div className="wrap pb-40 pt-36 lg:pb-28">
      <SectionLabel n="●">Booking</SectionLabel>
      <h1 className="display mt-6 text-[clamp(2.05rem,8vw,7.5rem)]">
        Roll camera<span className="text-rec">.</span>
      </h1>
      <p className="mt-4 max-w-xl text-paper/80">Eight quick frames. Your estimate updates live on the call sheet as you go, and your progress is saved on this device.</p>
      <div className="mt-14">
        <Suspense fallback={<div className="h-[600px] animate-pulse rounded-2xl bg-ink-2" />}>
          <BookingFlow />
        </Suspense>
      </div>
      <FAQSection />
    </div>
  );
}

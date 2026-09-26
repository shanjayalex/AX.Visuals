import type { Metadata } from "next";
import { Confirmation } from "@/components/booking/Confirmation";

export const metadata: Metadata = { title: "Booking confirmed", robots: { index: false } };

/** PayHere return_url lands here after checkout. The notify webhook is the source of truth for payment status. */
export default async function Confirmed(props: PageProps<"/booking/confirmed">) {
  const { ref } = await props.searchParams;
  return (
    <div className="wrap pb-28 pt-32">
      <Confirmation refCode={typeof ref === "string" ? ref : "—"} kind="BOOKED" payment="payhere" />
    </div>
  );
}

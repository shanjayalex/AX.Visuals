import Link from "next/link";
import { AxelClay } from "@/components/clay/Axel";

export default function NotFound() {
  return (
    <div className="wrap flex min-h-[100svh] flex-col items-center justify-center pb-20 pt-32 text-center">
      <p className="hud text-rec">ERR 404 · LOST FOOTAGE</p>
      <div className="mt-8 aspect-[4/3] w-[min(100%,520px)] overflow-hidden rounded-2xl border border-line">
        <AxelClay pose="tangled" />
      </div>
      <h1 className="display mt-10 text-[clamp(2.2rem,6vw,5rem)]">This scene didn&apos;t make the final cut.</h1>
      <Link href="/" className="btn-rec mt-10">
        Back to set
      </Link>
    </div>
  );
}

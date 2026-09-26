import type { Metadata } from "next";
import { WorkIndex } from "@/components/work/WorkIndex";
import { SectionLabel, SplitReveal } from "@/components/motion/primitives";

export const metadata: Metadata = {
  title: "Work",
  description: "Reels, photography and designed social content by AX.Visuals — portraits, ceremonies, celebrations and cinematic films from Sri Lanka.",
};

export default function WorkPage() {
  return (
    <div className="wrap pb-28 pt-36">
      <SectionLabel n="▶">Portfolio</SectionLabel>
      <SplitReveal as="h1" immediate by="words" className="display mt-6 text-[clamp(2.05rem,10vw,10rem)]">
        The work.
      </SplitReveal>
      <p className="mt-4 max-w-xl text-paper/80">Reels, photographs and designed carousels — every frame shot, cut and graded in-house.</p>
      <div className="mt-12">
        <WorkIndex />
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects, workCategories, ytThumb } from "@/content/work";
import { SectionLabel, SplitReveal } from "@/components/motion/primitives";
import { ReelCard } from "@/components/media/YouTube";
import { CreditsRoll, Gallery, GradeSlider, NextProject } from "@/components/work/CaseStudy";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const p = projects.find((x) => x.slug === slug);
  if (!p) return {};
  const img = p.format === "reels" ? ytThumb(p.reels[0].youtubeId) : p.cover.src;
  return {
    title: p.title,
    description: `${p.brief} ${p.deliverables} by AX.Visuals.`,
    openGraph: { images: [{ url: img, alt: p.cover.alt }] },
  };
}

export default async function CaseStudyPage(props: PageProps<"/work/[slug]">) {
  const { slug } = await props.params;
  const i = projects.findIndex((p) => p.slug === slug);
  if (i < 0) notFound();
  const p = projects[i];
  const next = projects[(i + 1) % projects.length];
  const nextImg = next.format === "reels" ? ytThumb(next.reels[0].youtubeId) : next.cover.src;
  const cat = workCategories.find((c) => c.id === p.category)?.label;
  const gradePhoto = p.photos.find((ph) => ph.w > ph.h) ?? p.photos[0];

  return (
    <article>
      {/* Hero */}
      <header className="relative h-[92svh] min-h-[560px] overflow-hidden">
        {p.format === "reels" ? (
          <Image src={ytThumb(p.reels[0].youtubeId)} alt={p.cover.alt} fill priority sizes="100vw" className="object-cover" />
        ) : (
          <Image src={p.cover.src} alt={p.cover.alt} fill priority sizes="100vw" className="object-cover object-[center_30%]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-ink/50" />
        <div className="wrap relative flex h-full flex-col justify-end pb-14">
          <Link href="/work" className="hud mb-6 w-fit text-paper/70 hover:text-paper">
            ← All work
          </Link>
          <SplitReveal as="h1" immediate by="chars" className="display text-[clamp(2.05rem,11vw,11rem)]">
            {p.title}
          </SplitReveal>
          <p className="hud mt-4 text-paper/80">{p.camera}</p>
        </div>
      </header>

      {/* Meta */}
      <div className="wrap">
        <dl className="grid grid-cols-2 gap-6 border-y border-line py-8 md:grid-cols-5">
          {[
            ["Client", p.client],
            ["Industry", cat],
            ["Location", p.location],
            ["Package", p.package],
            ["Deliverables", p.deliverables],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="hud text-mute">{k}</dt>
              <dd className="mt-1.5">{v}</dd>
            </div>
          ))}
        </dl>

        {/* Story */}
        <section className="grid gap-10 py-24 md:grid-cols-3" aria-label="Story">
          {[
            ["01 · Brief", p.brief],
            ["02 · Approach", p.approach],
            ["03 · Result", p.result],
          ].map(([k, v]) => (
            <div key={k}>
              <SectionLabel n={k.slice(0, 2)}>{k.slice(5)}</SectionLabel>
              <p className="mt-5 text-lg leading-relaxed text-paper/85">{v}</p>
            </div>
          ))}
        </section>

        {p.reels.length > 0 && (
          <section className="pb-24" aria-label="Reels">
            <div className={`grid gap-4 ${p.reels.length > 1 ? "sm:grid-cols-2 lg:grid-cols-3" : "max-w-5xl"}`}>
              {p.reels.map((r) => (
                <ReelCard key={r.youtubeId} id={r.youtubeId} title={r.title} aspect={r.aspect} className={p.reels.length > 1 ? "aspect-[9/16] rounded-xl" : "aspect-video rounded-xl"}>
                  <p className="font-display text-xl font-extrabold uppercase">{r.title}</p>
                  <p className="hud text-paper/70">Click for sound</p>
                </ReelCard>
              ))}
            </div>
          </section>
        )}

        {p.photos.length > 0 && (
          <section className="pb-24" aria-label="Gallery">
            <Gallery photos={p.photos} camera={p.camera} />
          </section>
        )}

        {gradePhoto && (
          <section className="pb-24" aria-labelledby="grade-title">
            <SectionLabel n="◐">Colour grade</SectionLabel>
            <h2 id="grade-title" className="display mt-5 text-[clamp(2rem,4vw,3.4rem)]">
              Before / after
            </h2>
            <p className="mb-8 mt-3 max-w-lg text-mute">Drag to compare. The “before” side is a simulated flat log profile until the original ungraded file is added.</p>
            <GradeSlider photo={gradePhoto} />
          </section>
        )}
      </div>

      <CreditsRoll project={p} />

      <div className="wrap py-24">
        <div className="mb-20 flex flex-col items-center gap-4 text-center">
          <p className="display text-[clamp(2rem,4vw,3.4rem)]">Want content like this?</p>
          <Link href="/booking" className="btn-rec" data-cursor="book">
            Book a shoot →
          </Link>
        </div>
        <NextProject project={next} image={nextImg} />
      </div>
    </article>
  );
}

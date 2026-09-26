import { Hero } from "@/components/home/Hero";
import { OneShoot } from "@/components/home/OneShoot";
import { ReelsStrip } from "@/components/home/ReelsStrip";
import { Stats } from "@/components/home/Stats";
import { Industries } from "@/components/home/Industries";
import { FeaturedWork, MonthlyUpsell, PackagesTeaser, RestaurantSpotlight } from "@/components/home/Sections";
import { ClayBand, FinalCTA, Process, ReelFeed, Testimonials } from "@/components/home/Closing";

export default function Home() {
  return (
    <>
      <Hero />
      <OneShoot />
      <ReelsStrip />
      <Stats />
      <Industries />
      <FeaturedWork />
      <PackagesTeaser />
      <RestaurantSpotlight />
      <MonthlyUpsell />
      <ClayBand />
      <Process />
      <Testimonials />
      <ReelFeed />
      <FinalCTA />
    </>
  );
}

import { Hero } from "@/components/sections/hero";
import { AdAnalyzer } from "@/components/sections/ad-analyzer";
import { Audits } from "@/components/sections/audits";
import { SocialProof } from "@/components/sections/social-proof";
import { Masterclass } from "@/components/sections/masterclass";
import { Faq } from "@/components/sections/faq";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <AdAnalyzer />
      <Audits />
      <SocialProof />
      <Masterclass />
      <Faq />
    </main>
  );
}

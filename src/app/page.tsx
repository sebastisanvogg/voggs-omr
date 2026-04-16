import { Hero } from "@/components/sections/hero";
import { AdAnalyzer } from "@/components/sections/ad-analyzer";
import { Audits } from "@/components/sections/audits";
import { SocialProof } from "@/components/sections/social-proof";
import { Masterclass } from "@/components/sections/masterclass";
import { Faq } from "@/components/sections/faq";
import { Reveal } from "@/components/reveal";

export default function HomePage() {
  return (
    <main>
      <Reveal>
        <Hero />
      </Reveal>
      <Reveal>
        <AdAnalyzer />
      </Reveal>
      <Reveal delay={0.1}>
        <Audits />
      </Reveal>
      <Reveal delay={0.1}>
        <SocialProof />
      </Reveal>
      <Reveal delay={0.1}>
        <Masterclass />
      </Reveal>
      <Reveal delay={0.1}>
        <Faq />
      </Reveal>
    </main>
  );
}

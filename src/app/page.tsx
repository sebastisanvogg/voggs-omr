import { Hero } from "@/components/sections/hero";
import { AdAnalyzer } from "@/components/sections/ad-analyzer";
import { AuditCta } from "@/components/sections/audit-cta";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <AdAnalyzer />
      <AuditCta />
    </main>
  );
}

import type { Metadata, Viewport } from "next";
import { ConsentBanner } from "@/components/consent-banner";
import { Footer } from "@/components/sections/footer";
import { MarqueeBanner } from "@/components/marquee-banner";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://omr.voggs.net"
  ),
  title: {
    default: "VOGGSMEDIA — TikTok Ad Analyzer · OMR Masterclass 2026",
    template: "%s · VOGGSMEDIA",
  },
  description:
    "Teste deine TikTok-Ad in 30 Sekunden. KI-Analyse nach dem Hook-Trust-CTA Framework — begleitend zur OMR Masterclass von Sebastian Vogg (VOGGSMEDIA).",
  openGraph: {
    type: "website",
    locale: "de_DE",
    siteName: "VOGGSMEDIA",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#080808",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body className="flex min-h-screen flex-col">
        <a href="#analyzer" className="skip-link">
          Zum Ad Analyzer springen
        </a>
        <MarqueeBanner />
        <SiteHeader />
        <div className="flex-1">{children}</div>
        <Footer />
        <ConsentBanner />
      </body>
    </html>
  );
}

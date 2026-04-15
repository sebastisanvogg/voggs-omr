import type { Metadata, Viewport } from "next";
import { ConsentBanner } from "@/components/consent-banner";
import { Footer } from "@/components/sections/footer";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://voggs.net"),
  title: {
    default: "VOGGSMEDIA — TikTok Ad Analyzer",
    template: "%s · VOGGSMEDIA",
  },
  description:
    "Findest du in 30 Sekunden raus, ob deine Ad auf TikTok funktioniert. Kostenloser Analyzer + Account- und Creative-Audit von VOGGSMEDIA.",
  openGraph: {
    type: "website",
    locale: "de_DE",
    siteName: "VOGGSMEDIA",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
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
        <div className="flex-1">{children}</div>
        <Footer />
        <ConsentBanner />
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import "./globals.css";
import { RecaptchaProvider } from "@/components/RecaptchaProvider";
import { LoadingScreen } from "@/components/LoadingScreen";
import { CookieConsent } from "@/components/CookieConsent";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { TopBar, Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { localBusinessJsonLd } from "@/lib/schema";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.baseUrl),
  title: {
    default: `${site.name} — Vet Clinic Nairobi | Pets, Livestock & Wildlife`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [
    "veterinarian Nairobi",
    "vet clinic Kenya",
    "mobile vet Nairobi",
    "livestock vet Kenya",
    "rabies vaccination Nairobi",
    "pet care Kenya",
  ],
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    url: site.baseUrl,
    images: [{ url: "/images/hero-vet.jpg", width: 1200, height: 1200, alt: "Caleb Animal Care veterinarian treating a puppy from the mobile unit" }],
    locale: "en_KE",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    images: ["/images/hero-vet.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#00bd56",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <JsonLd data={localBusinessJsonLd()} />
        <LoadingScreen />
        <RecaptchaProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[300] focus:rounded-brand focus:bg-pine focus:px-4 focus:py-2 focus:text-white"
          >
            Skip to content
          </a>
          <TopBar />
          <Navbar />
          <main id="main">{children}</main>
          <Footer />
          <WhatsAppFloat />
          <CookieConsent />
        </RecaptchaProvider>
      </body>
    </html>
  );
}

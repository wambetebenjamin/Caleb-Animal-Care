import { Hero } from "@/components/Hero";
import { ServicesSection } from "@/components/ServicesSection";
import { StatsBand } from "@/components/StatsBand";
import { AboutSection } from "@/components/AboutSection";
import { VetsSection } from "@/components/VetsSection";
import { LivestockSection } from "@/components/LivestockSection";
import { Testimonials } from "@/components/Testimonials";
import { LibraryTeaser } from "@/components/LibraryTeaser";
import { NewsletterBand } from "@/components/NewsletterBand";
import { ContactSection } from "@/components/ContactSection";

export const revalidate = 600;

export default function HomePage() {
  return (
    <>
      <Hero />
      <ServicesSection />
      <StatsBand />
      <AboutSection />
      <VetsSection />
      <LivestockSection />
      <Testimonials />
      <LibraryTeaser />
      <NewsletterBand />
      <ContactSection />
    </>
  );
}

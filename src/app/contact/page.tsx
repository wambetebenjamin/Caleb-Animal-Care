import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { ContactSection } from "@/components/ContactSection";
import { SectionHeading } from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Reach Caleb Animal Care — clinic address, hours, 24-hour emergency line, general enquiry form and WhatsApp.",
};

export default function ContactPage() {
  return (
    <div className="bg-mist">
      <div className="mx-auto max-w-shell px-5 pb-4 pt-14">
        <SectionHeading
          subheading="Talk to us"
          title="Contact Caleb Animal Care"
          intro="Emergencies: call the 24-hour line. Everything else: the form below, WhatsApp, or drop by the clinic."
        />
      </div>
      <div className="mx-auto grid max-w-shell gap-8 px-5 pb-14 lg:grid-cols-[520px_1fr]">
        <ContactForm />
        <div className="lg:pt-0">
          <ContactSection />
        </div>
      </div>
    </div>
  );
}

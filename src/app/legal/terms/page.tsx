import type { Metadata } from "next";
import { site } from "@/lib/site";
import { LegalShell } from "@/components/LegalShell";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Website use, appointment terms, veterinary advice disclaimer and governing law for Caleb Animal Care.",
};

const SECTIONS: { title: string; body: string[] }[] = [
  {
    title: "1. Use of Website",
    body: [
      "This website provides information about Caleb Animal Care's services, a pet care library, an online shop and booking tools for Nairobi and the surrounding counties. By using the site you agree to use it lawfully and not to interfere with its operation or other users.",
      "Content on this site is provided for general information. Product availability and prices are shown in Kenya Shillings and may change without notice.",
    ],
  },
  {
    title: "2. Appointment Terms",
    body: [
      "Bookings made through the site or WhatsApp are confirmed only when you receive our confirmation message. Please arrive 10 minutes early. If you need to cancel or reschedule, give us at least 3 hours' notice where possible.",
      "Home and farm visit fees are confirmed before dispatch. Emergency call-outs outside routine hours attract an emergency surcharge which we will always state up front.",
      "Payments may be made by M-Pesa, card or cash. Estimates are inclusive of VAT where applicable; serious deviations from an estimate are always discussed with you first.",
    ],
  },
  {
    title: "3. Veterinary Advice Disclaimer",
    body: [
      "Articles in the Pet Care Library are educational guides written by our veterinarians. They are not a substitute for a physical examination of your animal and do not create a veterinarian–client–patient relationship on their own.",
      "If your animal is ill or injured, do not rely on website content — book a consultation or call our 24-hour emergency line on " + site.phoneDisplay + ".",
    ],
  },
  {
    title: "4. Governing Law (Kenya)",
    body: [
      "These terms are governed by the laws of the Republic of Kenya. Any dispute arising from use of this website or our services shall be subject to the exclusive jurisdiction of the Kenyan courts, without prejudice to your rights under the Consumer Protection Act, 2012 and the Data Protection Act, 2019.",
      `Caleb Animal Care • ${site.address} • ${site.phoneDisplay}`,
    ],
  },
];

export default function TermsPage() {
  return <LegalShell heading="Terms & Conditions" intro="The ground rules for using this website and our services." sections={SECTIONS} />;
}

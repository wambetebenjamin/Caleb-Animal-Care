import type { Metadata } from "next";
import { site } from "@/lib/site";
import { LegalShell } from "@/components/LegalShell";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Caleb Animal Care collects, uses and protects your personal and animal health data — Kenya Data Protection Act 2019.",
};

const SECTIONS: { title: string; body: string[] }[] = [
  {
    title: "1. Information We Collect",
    body: [
      "When you book appointments, request home visits, register for the pet portal, shop with us, subscribe to the newsletter or contact us, we collect the information you give us directly: your name, phone number, email address, home or farm location, and M-Pesa payment details used at checkout.",
      "We also collect limited technical information automatically — pages visited and approximate device/browser details — only if you accept analytics cookies.",
    ],
  },
  {
    title: "2. Appointment Data",
    body: [
      "Booking forms record your chosen service, preferred veterinarian, date and time slot, and any notes you provide about your animal. This data is used to run the clinic diary, send confirmations and reminders, and prepare for your visit.",
      "Appointment records are stored in our encrypted clinic datastore (Vercel KV) and are accessible only to authorised clinic staff.",
    ],
  },
  {
    title: "3. Pet Health Records",
    body: [
      "Medical histories, uploaded records, vaccination schedules, visit history, medication reminders, photos and weight logs entered in the pet portal are treated with the same confidentiality a human clinic gives patient files.",
      "Files you upload (previous vet records, pet photos) are stored in encrypted object storage (Vercel Blob). We never sell or share animal health records with third parties for marketing.",
    ],
  },
  {
    title: "4. Analytics",
    body: [
      "With your consent, we use privacy-respecting analytics to understand which pages help pet owners most. Analytics cookies are off by default and load only after you opt in via the cookie banner.",
      "We use Google reCAPTCHA on all forms to prevent abuse; reCAPTCHA is subject to Google's own privacy policy.",
    ],
  },
  {
    title: "5. Your Rights (Kenya Data Protection Act, 2019)",
    body: [
      "You have the right to: be informed of how we use your data; access the personal data we hold about you; request correction or deletion; object to or restrict processing; data portability; and to withdraw consent at any time without affecting the lawfulness of processing already done.",
      "To exercise any right, email privacy@calebanimalcare.co.ke or call our office. You may also lodge a complaint with the Office of the Data Protection Commissioner (ODPC) Kenya.",
    ],
  },
  {
    title: "6. Data Retention",
    body: [
      "Appointment and visit records are kept for 5 years to support continuity of veterinary care and statutory requirements. Marketing preferences persist until you unsubscribe. Pet portal data is kept while your account is active and deleted within 90 days of account deletion requests.",
      "M-Pesa transaction references are kept for accounting for 7 years as required by Kenyan tax law.",
    ],
  },
  {
    title: "7. Contact",
    body: [
      `Data controller: Caleb Animal Care, ${site.address}. Phone: ${site.phoneDisplay}. Email: ${site.email} (mark it "Privacy").`,
      "This policy was last reviewed in January 2026. Changes will be posted on this page.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return <LegalShell heading="Privacy Policy" intro="How we collect, use and protect your and your animals' information — in line with the Kenya Data Protection Act, 2019." sections={SECTIONS} />;
}

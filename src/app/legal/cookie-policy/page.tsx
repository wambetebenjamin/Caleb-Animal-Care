import type { Metadata } from "next";
import { LegalShell } from "@/components/LegalShell";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "What cookies Caleb Animal Care uses, why, and how to manage preferences — Kenya Data Protection Act 2019 compliant.",
};

const SECTIONS: { title: string; body: string[] }[] = [
  {
    title: "What we use cookies for",
    body: [
      "Caleb Animal Care uses cookies and local storage to keep the site working and, with your consent, to understand how it is used. The consent you give in the banner is stored on your device (localStorage) — no repeat prompts once you decide.",
    ],
  },
  {
    title: "Categories",
    body: [
      "Necessary (always on): session for the pet portal sign-in, your shopping cart, form security tokens and your saved cookie preferences. The site cannot function without these.",
      "Analytics (opt-in): anonymous page-view statistics that help us improve services. Loaded only after you accept.",
      "Marketing (opt-in): helps us show relevant vaccination-drive and offer reminders.",
    ],
  },
  {
    title: "Managing consent",
    body: [
      "Use 'Manage Preferences' in the cookie banner to toggle Analytics and Marketing at any time. To withdraw consent, clear your browser's local storage for this site or contact us and we will guide you.",
      "Under the Kenya Data Protection Act, 2019, non-essential cookies require your opt-in consent; we honour that by design.",
    ],
  },
  {
    title: "Third-party cookies",
    body: [
      "Google reCAPTCHA (security) and the Google Maps embed may set their own cookies governed by Google's privacy policy. These load only on pages that need them.",
    ],
  },
];

export default function CookiePolicyPage() {
  return <LegalShell heading="Cookie Policy" intro="Clear information about the cookies we set and the choices you have." sections={SECTIONS} />;
}

export const site = {
  name: "Caleb Animal Care",
  tagline: "Caring for Every Animal, Big and Small.",
  description:
    "Nairobi's trusted veterinary clinic. Pets, livestock, and wildlife care — with a mobile unit serving homes and farms across the region.",
  phoneDisplay: "+254 112 272 061",
  phoneHref: "tel:+254112272061",
  whatsappUrl:
    "https://wa.me/254112272061?text=Hello!%20I%20would%20like%20to%20book%20an%20appointment%20at%20Caleb%20Animal%20Care.",
  email: "info@calebanimalcare.co.ke",
  address: "Kabarnet Gardens, off Ngong Road, Kilimani, Nairobi, Kenya",
  mapQuery: "Kilimani, Nairobi, Kenya",
  baseUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  hours: [
    { day: "Monday – Friday", time: "8:00 AM – 6:00 PM" },
    { day: "Saturday", time: "9:00 AM – 4:00 PM" },
    { day: "Sunday & Holidays", time: "Emergencies only" },
    { day: "Emergency Line", time: "Open 24 hours" },
  ],
  socials: [
    { label: "Facebook", href: "https://facebook.com/calebanimalcare" },
    { label: "Instagram", href: "https://instagram.com/calebanimalcare" },
    { label: "X (Twitter)", href: "https://x.com/calebanimalcare" },
    { label: "TikTok", href: "https://tiktok.com/@calebanimalcare" },
  ],
};

export const KES = new Intl.NumberFormat("en-KE", {
  style: "currency",
  currency: "KES",
  maximumFractionDigits: 0,
});

export function kes(amount: number): string {
  return `KES ${amount.toLocaleString("en-KE")}`;
}

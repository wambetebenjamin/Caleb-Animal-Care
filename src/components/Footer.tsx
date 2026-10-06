import Link from "next/link";
import { Facebook, Instagram, MessageCircle, Music2, PawPrint, Twitter } from "lucide-react";
import { services } from "@/lib/data";
import { site } from "@/lib/site";
import { NewsletterForm } from "./NewsletterForm";

/** Zip footer: #1a1a1a, 7em padding, brand-green links, round social buttons. */
export function Footer() {
  return (
    <footer className="bg-footer text-[13px] leading-relaxed text-white/70">
      <div className="mx-auto grid max-w-shell gap-10 px-5 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link href="/" className="flex items-center gap-2 text-white">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-brand text-white">
              <PawPrint size={20} aria-hidden />
            </span>
            <span className="text-[18px] font-extrabold">
              Caleb <span className="text-pine">Animal Care</span>
            </span>
          </Link>
          <p className="mt-4">
            Nairobi&apos;s trusted veterinary clinic — pets, livestock and wildlife, at the clinic,
            on your farm, or at your door via our mobile unit.
          </p>
          <div className="mt-5 flex gap-2" aria-label="Social media">
            {[
              { Icon: Facebook, href: site.socials[0].href, label: "Facebook" },
              { Icon: Instagram, href: site.socials[1].href, label: "Instagram" },
              { Icon: Twitter, href: site.socials[2].href, label: "X (Twitter)" },
              { Icon: Music2, href: site.socials[3].href, label: "TikTok" },
            ].map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="grid h-10 w-10 place-items-center rounded-full bg-white/5 text-pine transition-colors duration-300 hover:bg-pine hover:text-white"
              >
                <Icon size={16} aria-hidden />
              </a>
            ))}
          </div>
        </div>

        <nav aria-label="Services">
          <h3 className="mb-4 text-[14px] font-bold uppercase tracking-[2px] text-white">Services</h3>
          <ul className="space-y-2">
            {services.slice(0, 6).map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className="hover:text-pine">
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Explore">
          <h3 className="mb-4 text-[14px] font-bold uppercase tracking-[2px] text-white">Explore</h3>
          <ul className="space-y-2">
            <li><Link href="/library" className="hover:text-pine">Pet Care Library</Link></li>
            <li><Link href="/shop" className="hover:text-pine">Shop</Link></li>
            <li><Link href="/my-pets" className="hover:text-pine">Pet Owner Portal</Link></li>
            <li><Link href="/book" className="hover:text-pine">Book an Appointment</Link></li>
            <li><Link href="/home-visit" className="hover:text-pine">Request a Home Visit</Link></li>
            <li><Link href="/contact" className="hover:text-pine">Contact Us</Link></li>
          </ul>
          <h3 className="mb-4 mt-8 text-[14px] font-bold uppercase tracking-[2px] text-white">Legal</h3>
          <ul className="space-y-2">
            <li><Link href="/legal/privacy-policy" className="hover:text-pine">Privacy Policy</Link></li>
            <li><Link href="/legal/terms" className="hover:text-pine">Terms &amp; Conditions</Link></li>
            <li><Link href="/legal/cookie-policy" className="hover:text-pine">Cookie Policy</Link></li>
          </ul>
        </nav>

        <div>
          <h3 className="mb-4 text-[14px] font-bold uppercase tracking-[2px] text-white">Stay in the loop</h3>
          <p className="mb-4">Monthly pet care tips and vaccination reminders.</p>
          <NewsletterForm compact dark />
          <a
            href={site.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex min-h-[48px] items-center gap-2 rounded-brand bg-wa px-4 py-2 text-[12px] font-bold uppercase tracking-[1.5px] text-white transition-colors duration-300 hover:brightness-95"
          >
            <MessageCircle size={16} aria-hidden /> WhatsApp us
          </a>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-shell flex-col items-center justify-between gap-3 px-5 py-5 text-[12px] md:flex-row">
          <p>© {new Date().getFullYear()} Caleb Animal Care. All rights reserved. Rabies vaccinations per the Rabies Control Act — ask our team.</p>
          <ul className="flex flex-wrap gap-4">
            <li><Link href="/legal/privacy-policy" className="hover:text-pine">Privacy</Link></li>
            <li><Link href="/legal/terms" className="hover:text-pine">Terms</Link></li>
            <li><Link href="/legal/cookie-policy" className="hover:text-pine">Cookies</Link></li>
            <li><a href={site.phoneHref} className="hover:text-pine">Emergency 24h</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

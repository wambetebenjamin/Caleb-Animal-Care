import { Clock, MapPin, MessageCircle, Phone } from "lucide-react";
import { site } from "@/lib/site";
import { SectionHeading } from "./SectionHeading";

/** Home contact summary: address, hours, emergency line, map embed, WhatsApp. */
export function ContactSection() {
  return (
    <section id="contact" className="scroll-mt-24 bg-white pb-16 lg:pb-20">
      <div className="mx-auto max-w-shell px-5">
        <SectionHeading
          subheading="Find us"
          title="Visit the clinic — or we'll come to you"
        />
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="card-service flex items-start gap-4 border border-line p-5">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-fog text-pine">
                <MapPin size={20} aria-hidden />
              </span>
              <div>
                <h3 className="text-[15px] font-bold">Clinic address</h3>
                <p className="text-[14px] text-body">{site.address}</p>
                <p className="text-[14px] text-body">
                  <a href={`mailto:${site.email}`} className="text-pine hover:underline">{site.email}</a>
                </p>
              </div>
            </div>
            <div className="card-service flex items-start gap-4 border border-line p-5">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-fog text-pine">
                <Clock size={20} aria-hidden />
              </span>
              <div className="w-full">
                <h3 className="text-[15px] font-bold">Opening hours</h3>
                <table className="mt-1 w-full text-[14px]">
                  <tbody>
                    {site.hours.map((h) => (
                      <tr key={h.day} className="border-b border-mist last:border-0">
                        <td className="py-1.5 text-body">{h.day}</td>
                        <td className="py-1.5 text-right font-bold text-heading">{h.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-brand border border-emergency/40 bg-emergency/5 p-5">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-emergency text-white">
                <Phone size={20} aria-hidden />
              </span>
              <div>
                <h3 className="text-[15px] font-bold">Emergency line — open 24 hours</h3>
                <a href={site.phoneHref} className="text-[18px] font-extrabold text-emergency hover:underline">
                  {site.phoneDisplay}
                </a>
                <p className="text-[13px] text-body">Road traffic injuries, bloat, poisoning, difficult births — call first, we&apos;ll guide you in.</p>
              </div>
            </div>
            <a href={site.whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-primary w-full justify-center">
              <MessageCircle size={15} aria-hidden /> Chat on WhatsApp instead
            </a>
          </div>
          <div className="overflow-hidden rounded-brand border border-line shadow-card">
            <iframe
              title="Caleb Animal Care on Google Maps — Kilimani, Nairobi"
              src={`https://www.google.com/maps?q=${encodeURIComponent(site.mapQuery)}&output=embed`}
              className="h-full min-h-[380px] w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </section>
  );
}

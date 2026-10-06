import Image from "next/image";
import Link from "next/link";
import { MessageCircle, ScanSearch, Syringe, Tractor, Wheat } from "lucide-react";
import { site } from "@/lib/site";
import { SectionHeading } from "./SectionHeading";

const FARM_SERVICES = [
  { Icon: Syringe, title: "Herd vaccination", text: "ECF, FMD, LSD, anthrax and rabies programmes on scheduled routes." },
  { Icon: Tractor, title: "Disease management", text: "Mastitis, pneumonia, worm burdens — treatment plans and herd protocols." },
  { Icon: ScanSearch, title: "Pregnancy scanning", text: "Portable ultrasound for cows, goats and sheep, with calving calendars." },
  { Icon: Wheat, title: "Nutritional advice", text: "Ration balancing and mineral strategies for Kenyan pastures and budgets." },
];

export function LivestockSection() {
  return (
    <section aria-labelledby="farm-heading" className="bg-white py-16 lg:py-20">
      <div className="mx-auto grid max-w-shell items-center gap-10 px-5 lg:grid-cols-2">
        <div>
          <SectionHeading
            align="left"
            subheading="For farmers & ranchers"
            title="Livestock & farm services, county by county"
            intro="Smallholder or commercial, one cow or five hundred — our mobile unit brings the clinic to your boma, crush or cowshed."
          />
          <ul className="-mt-4 grid gap-4 sm:grid-cols-2">
            {FARM_SERVICES.map(({ Icon, title, text }) => (
              <li key={title} className="rounded-brand border border-line p-4 transition-all duration-300 hover:border-pine hover:shadow-card">
                <span className="mb-2 grid h-10 w-10 place-items-center rounded-full bg-fog text-pine">
                  <Icon size={19} aria-hidden />
                </span>
                <h3 className="text-[15px] font-bold">{title}</h3>
                <p className="mt-1 text-[13px] text-body">{text}</p>
              </li>
            ))}
          </ul>
          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href={site.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              <MessageCircle size={14} aria-hidden /> Request Farm Visit via WhatsApp
            </a>
            <Link href="/home-visit" className="btn-outline">Book a Farm Call-Out</Link>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-brand shadow-lift">
          <Image
            src="/images/farm-team.jpg"
            alt="Veterinary teams delivering livestock care to cattle in Kenya"
            width={1000}
            height={578}
            className="h-auto w-full object-cover"
          />
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-navy/70 to-transparent p-5">
            <p className="text-[13px] font-bold text-white">Herd-health visit, peri-urban Nairobi</p>
            <p className="meta !text-white/80">Dairy • Beef • Goats • Sheep • Pigs • Poultry</p>
          </div>
        </div>
      </div>
    </section>
  );
}

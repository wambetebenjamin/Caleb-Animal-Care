import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CalendarCheck, CheckCircle2, ClipboardList, HeartPulse } from "lucide-react";
import { services } from "@/lib/data";
import { kes, site } from "@/lib/site";
import { medicalClinicJsonLd } from "@/lib/schema";
import { JsonLd } from "@/components/JsonLd";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const service = services.find((s) => s.slug === params.slug);
  if (!service) return {};
  return {
    title: `${service.name} in Nairobi`,
    description: service.short,
    openGraph: {
      title: `${service.name} | ${site.name}`,
      description: service.short,
      url: `${site.baseUrl}/services/${service.slug}`,
      images: [{ url: service.image }],
      type: "article",
    },
  };
}

export const revalidate = 600;

export default function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const service = services.find((s) => s.slug === params.slug);
  if (!service) notFound();

  return (
    <>
      <JsonLd
        data={medicalClinicJsonLd({
          name: service.name,
          description: service.description,
          slug: service.slug,
          priceFrom: service.priceFrom,
          priceTo: service.priceTo,
        })}
      />
      {/* Full-width banner photo */}
      <div className="relative h-[46vh] min-h-[340px] w-full overflow-hidden">
        <Image
          src={service.image}
          alt={`${service.name} at Caleb Animal Care, Nairobi`}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/30 to-transparent" aria-hidden />
        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-shell px-5 pb-8">
            <span className="rounded-full bg-brand px-3 py-1 text-[11px] font-bold uppercase tracking-[1px] text-white">
              {service.category}
            </span>
            <h1 className="mt-3 text-[32px] font-extrabold !text-white sm:text-[40px]">{service.name}</h1>
            <p className="mt-1 max-w-xl text-[15px] text-white/85">{service.short}</p>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-shell gap-10 px-5 py-14 lg:grid-cols-[1fr_340px]">
        <div>
          <div className="flex items-start gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-fog text-pine">
              <HeartPulse size={20} aria-hidden />
            </span>
            <div>
              <h2 className="text-[20px] font-extrabold">About this service</h2>
              <p className="mt-2 text-[15px] leading-[1.9] text-body">{service.description}</p>
            </div>
          </div>

          <h2 className="mb-3 mt-10 text-[20px] font-extrabold">What to expect</h2>
          <ul className="space-y-3">
            {service.whatToExpect.map((item) => (
              <li key={item} className="flex items-start gap-3 text-[14px] text-body">
                <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-pine" aria-hidden />
                {item}
              </li>
            ))}
          </ul>

          <h2 className="mb-3 mt-10 flex items-center gap-2 text-[20px] font-extrabold">
            <ClipboardList size={20} className="text-azure" aria-hidden /> How to prepare
          </h2>
          <ul className="space-y-3">
            {service.preparation.map((item) => (
              <li key={item} className="flex items-start gap-3 text-[14px] text-body">
                <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-azure" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <aside className="h-fit rounded-brand border border-line bg-mist p-6 lg:sticky lg:top-24">
          <p className="subheading">Pricing</p>
          <p className="text-[26px] font-extrabold text-heading">
            {kes(service.priceFrom)} <span className="text-[16px] font-bold text-body">– {kes(service.priceTo)}</span>
          </p>
          <p className="mt-1 text-[13px] text-body">Final quote confirmed after examination — no hidden charges, ever.</p>
          <Link href={`/book?service=${service.slug}`} className="btn-primary mt-5 w-full justify-center">
            <CalendarCheck size={15} aria-hidden /> Book Now
          </Link>
          <a href={site.whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-outline mt-3 w-full justify-center">
            Ask on WhatsApp
          </a>
          <p className="meta mt-4 !normal-case">Emergency? Call {site.phoneDisplay} — 24 hours.</p>
        </aside>
      </div>
    </>
  );
}

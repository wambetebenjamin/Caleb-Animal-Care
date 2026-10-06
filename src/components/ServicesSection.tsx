"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { services } from "@/lib/data";
import { kes } from "@/lib/site";
import { SectionHeading } from "./SectionHeading";

/** 8 services, 4-col desktop grid. Stagger fade-up 70ms apart; hover: image
 *  zooms 1.04, shadow lifts, border accent — brief animation spec. */
export function ServicesSection({ limit }: { limit?: number }) {
  const reduced = useReducedMotion();
  const list = limit ? services.slice(0, limit) : services;

  return (
    <section id="services" className="scroll-mt-24 bg-white py-16 lg:py-20">
      <div className="mx-auto max-w-shell px-5">
        <SectionHeading
          subheading="What we do"
          title="Veterinary services for every animal in your care"
          intro="From vaccinations to surgery, herd health to home visits — clear prices, no surprises."
        />
        <motion.ul
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          initial={reduced ? false : "hidden"}
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
        >
          {list.map((service) => (
            <motion.li
              key={service.slug}
              variants={{
                hidden: { opacity: 0, y: 26 },
                show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
              }}
            >
              <article className="group card-service flex h-full flex-col overflow-hidden border border-transparent hover:border-pine">
                <Link href={`/services/${service.slug}`} className="relative block h-44 overflow-hidden" tabIndex={-1} aria-hidden>
                  <Image
                    src={service.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-[250ms] ease-brand group-hover:scale-[1.04]"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold uppercase tracking-[1px] text-pine">
                    {service.category}
                  </span>
                </Link>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-[17px] font-bold">
                    <Link href={`/services/${service.slug}`} className="hover:text-pine">
                      {service.name}
                    </Link>
                  </h3>
                  <p className="mt-2 flex-1 text-[14px] leading-relaxed text-body">{service.short}</p>
                  <p className="meta mt-3 !normal-case">
                    Starting from <span className="text-[14px] font-extrabold text-heading">{kes(service.priceFrom)}</span>
                  </p>
                  <Link
                    href={`/book?service=${service.slug}`}
                    className="btn-outline mt-4 !min-h-[48px] w-full justify-center"
                  >
                    Book This Service <ArrowRight size={14} aria-hidden />
                  </Link>
                </div>
              </article>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}

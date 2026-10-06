"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { GraduationCap, Languages, Stethoscope, User } from "lucide-react";
import { vets } from "@/lib/data";
import { SectionHeading } from "./SectionHeading";

export function VetsSection() {
  const reduced = useReducedMotion();
  return (
    <section id="vets" className="scroll-mt-24 bg-mist py-16 lg:py-20">
      <div className="mx-auto max-w-shell px-5">
        <SectionHeading
          subheading="Meet the team"
          title="Our vets, your animal's people"
          intro="Four registered veterinarians covering small animals, livestock, herd health, wildlife and exotics."
        />
        <motion.ul
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          initial={reduced ? false : "hidden"}
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
        >
          {vets.map((vet) => (
            <motion.li
              key={vet.slug}
              variants={{
                hidden: { opacity: 0, y: 26 },
                show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
              }}
            >
              <article className="card-service flex h-full flex-col overflow-hidden border border-transparent hover:border-pine">
                <div className="relative h-56 overflow-hidden bg-fog">
                  <Image
                    src={vet.image}
                    alt={`${vet.name}, ${vet.specialisation} at Caleb Animal Care`}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover object-top transition-transform duration-[250ms] ease-brand hover:scale-[1.04]"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="flex items-center gap-2 text-[17px] font-bold">
                    <User size={16} className="text-pine" aria-hidden /> {vet.name}
                  </h3>
                  <p className="mt-1 flex items-start gap-2 text-[13px] text-body">
                    <GraduationCap size={15} className="mt-0.5 shrink-0 text-azure" aria-hidden />
                    {vet.qualification}
                  </p>
                  <p className="mt-1 flex items-start gap-2 text-[13px] text-body">
                    <Stethoscope size={15} className="mt-0.5 shrink-0 text-azure" aria-hidden />
                    {vet.specialisation} • {vet.years} yrs
                  </p>
                  <p className="mt-1 flex items-start gap-2 text-[13px] text-body">
                    <Languages size={15} className="mt-0.5 shrink-0 text-azure" aria-hidden />
                    {vet.languages.join(" · ")}
                  </p>
                  <Link
                    href={`/book?vet=${vet.slug}`}
                    className="btn-primary mt-4 !min-h-[48px] w-full justify-center"
                  >
                    Book with This Vet
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

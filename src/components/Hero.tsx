"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Ambulance, Home, Phone, Syringe } from "lucide-react";
import { site } from "@/lib/site";
import { PawParticles } from "./PawParticles";

const HEADLINE = "Caring for Every Animal, Big and Small.";

/** Zip .ftco-intro quick cards that overlap the hero (margin-top: -50px). */
const INTRO_CARDS = [
  {
    Icon: Ambulance,
    title: "24-Hour Emergency Care",
    text: "Accidents don't keep office hours. Neither do we — call any time, day or night.",
  },
  {
    Icon: Home,
    title: "Mobile Vet Unit",
    text: "A fully-equipped clinic on wheels serving Nairobi, Kiambu, Kajiado and Machakos.",
  },
  {
    Icon: Syringe,
    title: "Pets to Livestock",
    text: "One trusted team for the family dog, the dairy herd and the conservancy next door.",
  },
];

export function Hero() {
  const reduced = useReducedMotion();
  const words = HEADLINE.split(" ");

  return (
    <section className="relative overflow-hidden bg-mist">
      <PawParticles />
      <div className="mx-auto grid max-w-shell items-center gap-10 px-5 py-14 lg:grid-cols-2 lg:gap-12 lg:py-20">
        <div className="relative z-10">
          <motion.span
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="subheading"
          >
            Veterinary clinic • Nairobi, Kenya
          </motion.span>
          <h1 className="text-[34px] font-extrabold leading-[1.25] sm:text-[42px] lg:text-[46px]">
            {words.map((word, i) => (
              <motion.span
                key={`${word}-${i}`}
                className="inline-block whitespace-pre"
                initial={reduced ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: reduced ? 0 : 0.3 + i * 0.09 /* brief: 0.09s per word */,
                  duration: 0.45,
                  ease: [0.42, 0, 0.58, 1] /* brief: ease-in-out cubic-bezier */,
                }}
              >
                {word}{" "}
              </motion.span>
            ))}
          </h1>
          <motion.p
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: reduced ? 0 : 0.3 + words.length * 0.09 + 0.1, duration: 0.4, ease: "easeOut" }}
            className="mt-4 max-w-lg text-[16px] leading-relaxed text-body"
          >
            Nairobi&apos;s trusted veterinary clinic. Pets, livestock, and wildlife care — at the
            clinic, on your farm, or at your doorstep with our mobile unit.
          </motion.p>
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: reduced ? 0 : 0.3 + words.length * 0.09 + 0.2, duration: 0.4, ease: "easeOut" }}
            className="mt-7 flex flex-wrap gap-3"
          >
            <Link href="/book" className="btn-primary">Book an Appointment</Link>
            <Link href="/home-visit" className="btn-outline">Request Home Visit</Link>
          </motion.div>
        </div>

        <motion.div
          initial={reduced ? false : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          className="relative z-10"
        >
          <div className="relative overflow-hidden rounded-brand shadow-lift">
            <Image
              src="/images/hero-vet.jpg"
              alt="A Caleb Animal Care veterinarian treats a puppy from the mobile clinic unit in Nairobi"
              width={900}
              height={900}
              priority
              className="h-auto w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/25 via-transparent to-transparent" aria-hidden />
          </div>
          <div className="absolute -bottom-5 left-5 rounded-brand bg-white px-5 py-3 shadow-card md:left-8">
            <p className="text-[12px] font-bold uppercase tracking-[1.5px] text-pine">Mobile unit on the road</p>
            <p className="text-[13px] text-body">Home &amp; farm visits, 7 days a week</p>
          </div>
        </motion.div>
      </div>

      {/* Emergency strip — always visible at all sizes, warm red, links the hotline + WhatsApp */}
      <div className="relative z-10 border-y border-emergency-deep/30 bg-emergency text-white">
        <div className="mx-auto flex max-w-shell flex-wrap items-center justify-center gap-x-6 gap-y-2 px-5 py-3 text-center">
          <p className="flex items-center gap-2 text-[14px] font-bold">
            <Phone size={16} aria-hidden /> Emergency line:{" "}
            <a href={site.phoneHref} className="underline underline-offset-4 hover:text-white/85">
              {site.phoneDisplay}
            </a>
            <span className="hidden sm:inline">• Open 24 hours</span>
          </p>
          <a
            href={site.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="meta !text-white/90 underline-offset-2 hover:underline"
          >
            WhatsApp the same number →
          </a>
        </div>
      </div>

      {/* Zip .ftco-intro cards overlapping the hero bottom */}
      <div className="relative z-10 mx-auto max-w-shell px-5 pb-4 pt-8 md:pt-10">
        <div className="grid gap-4 md:grid-cols-3 md:-mt-2">
          {INTRO_CARDS.map(({ Icon, title, text }, i) => (
            <motion.div
              key={title}
              initial={reduced ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: i * 0.07, ease: "easeOut" }}
              className="card-service border border-transparent bg-white p-6 hover:border-pine"
            >
              <span className="mb-4 grid h-12 w-12 place-items-center rounded-full bg-brand text-white">
                <Icon size={22} aria-hidden />
              </span>
              <h2 className="text-[17px] font-bold">{title}</h2>
              <p className="mt-1 text-[14px] text-body">{text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { testimonials } from "@/lib/data";
import { cn } from "@/lib/utils";
import { SectionHeading } from "./SectionHeading";

/** Card carousel: rotates every 5s, pauses on hover. */
export function Testimonials() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();
  const interval = useRef<ReturnType<typeof setInterval> | null>(null);

  const clear = useCallback(() => {
    if (interval.current) clearInterval(interval.current);
  }, []);

  useEffect(() => {
    if (paused) {
      clear();
      return;
    }
    interval.current = setInterval(() => setIndex((i) => (i + 1) % testimonials.length), 5000);
    return clear;
  }, [paused, clear]);

  const active = testimonials[index];

  return (
    <section aria-labelledby="testimonials-heading" className="relative overflow-hidden bg-navy py-16 lg:py-20">
      <div className="absolute inset-0 bg-brand opacity-90" aria-hidden />
      <div className="relative mx-auto max-w-shell px-5">
        <SectionHeading
          light
          subheading="Happy tails"
          title="Trusted by pet owners across Nairobi"
        />
        <div
          className="mx-auto max-w-2xl"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <AnimatePresence mode="wait">
            <motion.figure
              key={index}
              initial={reduced ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, y: -12 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="rounded-brand bg-white p-7 text-center shadow-lift"
            >
              <span className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-fog text-pine">
                <Quote size={20} aria-hidden />
              </span>
              <blockquote className="text-[15px] leading-relaxed text-heading">
                “{active.review}”
              </blockquote>
              <div className="mt-4 flex items-center justify-center gap-1" aria-label={`${active.rating} out of 5 stars`}>
                {Array.from({ length: active.rating }).map((_, i) => (
                  <Star key={i} size={15} className="fill-amber-400 text-amber-400" aria-hidden />
                ))}
              </div>
              <figcaption className="mt-4 flex items-center justify-center gap-3">
                <span className="relative h-12 w-12 overflow-hidden rounded-full">
                  <Image src={active.image} alt={active.owner} fill sizes="48px" className="object-cover" />
                </span>
                <span className="text-left">
                  <span className="block text-[14px] font-bold text-heading">{active.owner}</span>
                  <span className="meta !normal-case">
                    {active.pet} • {active.service}
                  </span>
                </span>
              </figcaption>
            </motion.figure>
          </AnimatePresence>
          <div className="mt-6 flex justify-center gap-2">
            {testimonials.map((t, i) => (
              <button
                key={t.owner}
                type="button"
                aria-label={`Show testimonial from ${t.owner}`}
                onClick={() => setIndex(i)}
                className={cn(
                  "h-2.5 w-2.5 rounded-full transition-all duration-300",
                  i === index ? "w-7 bg-white" : "bg-white/50 hover:bg-white/80",
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

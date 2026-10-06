"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

/** Zip #section-counter: animateNumber over 7000ms with comma separator,
 *  triggered by waypoint at 95% viewport. */
const STATS = [
  { value: 12500, suffix: "+", label: "Animals treated since 2011" },
  { value: 3800, suffix: "+", label: "Mobile home & farm visits" },
  { value: 8, suffix: "", label: "Wildlife conservancies supported" },
  { value: 15, suffix: "", label: "Years serving Nairobi" },
];

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { amount: 0.9, once: true });
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setDisplay(value.toLocaleString("en-KE"));
      return;
    }
    const duration = 7000; // zip: animateNumber 7000ms
    const start = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(value * eased).toLocaleString("en-KE"));
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, reduced]);

  return (
    <span ref={ref} className="text-[36px] font-extrabold leading-none text-white">
      {display}
      {suffix}
    </span>
  );
}

export function StatsBand() {
  return (
    <section className="bg-brand">
      <div className="mx-auto grid max-w-shell grid-cols-2 gap-8 px-5 py-12 text-center lg:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label}>
            <Counter value={s.value} suffix={s.suffix} />
            <p className="mt-2 text-[13px] font-medium text-white/90">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

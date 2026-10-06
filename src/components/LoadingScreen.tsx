"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/**
 * Loading screen (brief spec over the zip's #ftco-loader):
 * wordmark fades in → a paw print draws itself stroke by stroke → a thin
 * progress bar fills left→right → page fades in. Total < 1.8s, exit fade
 * 0.4s ease-out (zip's loader token).
 */

const PAW_PATHS = [
  // main pad
  "M50 62C38 62 30 71 30 79c0 9 8 13 15 13 4 0 6-1 10-1s6 1 10 1c7 0 15-4 15-13 0-8-8-17-20-17Z",
  // toes
  "M32 48c-5 0-9-5-9-10s3-9 8-9 9 4 9 9-3 10-8 10Z",
  "M46 40c-5 0-8-5-8-10s3-10 8-10 8 5 8 10-3 10-8 10Z",
  "M62 40c-5 0-8-5-8-10s3-10 8-10 8 5 8 10-3 10-8 10Z",
  "M76 48c-5 0-9-5-9-10s3-9 8-9 9 4 9 9-3 10-8 10Z",
];

export function LoadingScreen() {
  const [done, setDone] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const total = reduced ? 350 : 1350; // well under 1.8s on fast connections
    const timer = setTimeout(() => setDone(true), total);
    return () => clearTimeout(timer);
  }, [reduced]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-white"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" /* zip: opacity .4s ease-out */ }}
          aria-hidden
        >
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="mb-5 text-[22px] font-extrabold tracking-tight"
          >
            <span className="text-heading">Caleb</span> <span className="text-pine">Animal Care</span>
          </motion.p>

          <svg width="84" height="84" viewBox="0 0 100 100" fill="none" aria-hidden>
            {PAW_PATHS.map((d, i) => (
              <motion.path
                key={d}
                d={d}
                stroke={i === 0 ? "var(--pine)" : "var(--azure)"}
                strokeWidth={4}
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{
                  delay: 0.15 + i * 0.12,
                  duration: 0.45,
                  ease: "easeInOut",
                }}
              />
            ))}
          </svg>

          <div className="mt-6 h-[3px] w-44 overflow-hidden rounded-full bg-fog">
            <motion.div
              className="h-full w-full origin-left bg-brand"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: reduced ? 0.2 : 1.1, ease: "easeInOut", delay: 0.15 }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

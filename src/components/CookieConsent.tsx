"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Cookie, ShieldCheck } from "lucide-react";

/**
 * Cookie consent (absent from zip — brief fallback spec).
 * Kenya Data Protection Act 2019: opt-in for non-essential cookies,
 * granular controls, withdrawal at any time. Stored in localStorage.
 */

const STORAGE_KEY = "cac-consent";

interface ConsentState {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  decidedAt: string;
}

function readConsent(): ConsentState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ConsentState) : null;
  } catch {
    return null;
  }
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [modal, setModal] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!readConsent()) setVisible(true);
  }, []);

  const save = useCallback((prefs: { analytics: boolean; marketing: boolean }) => {
    const state: ConsentState = {
      necessary: true,
      ...prefs,
      decidedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    setVisible(false);
    setModal(false);
  }, []);

  return (
    <>
      <AnimatePresence>
        {visible && (
          <motion.div
            key="cookie-banner"
            role="dialog"
            aria-live="polite"
            aria-label="Cookie consent"
            className="fixed inset-x-0 bottom-0 z-[150] border-t border-line bg-white/95 shadow-lift backdrop-blur"
            initial={reduced ? false : { y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <div className="mx-auto flex max-w-shell flex-col items-start gap-4 px-5 py-5 md:flex-row md:items-center">
              <div className="flex items-start gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand text-white">
                  <Cookie size={20} aria-hidden />
                </span>
                <p className="text-[13px] leading-relaxed text-body">
                  <strong className="text-heading">Caleb Animal Care uses cookies</strong> to improve
                  your experience and track appointment preferences. See our{" "}
                  <Link href="/legal/cookie-policy" className="font-bold text-pine underline underline-offset-2">
                    Cookie Policy
                  </Link>
                  .
                </p>
              </div>
              <div className="flex w-full flex-wrap gap-3 md:w-auto md:flex-nowrap">
                <button type="button" className="btn-primary flex-1 !min-h-[48px] md:flex-none" onClick={() => save({ analytics: true, marketing: true })}>
                  Accept All
                </button>
                <button type="button" className="btn-outline flex-1 !min-h-[48px] md:flex-none" onClick={() => setModal(true)}>
                  Manage Preferences
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {modal && (
          <motion.div
            key="cookie-modal"
            className="fixed inset-0 z-[160] grid place-items-center bg-navy/50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setModal(false)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Cookie preferences"
              className="w-full max-w-md rounded-brand bg-white p-6 shadow-lift"
              initial={reduced ? false : { y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 24, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4 flex items-center gap-3">
                <ShieldCheck className="text-pine" size={22} aria-hidden />
                <h2 className="text-[18px] font-extrabold">Cookie preferences</h2>
              </div>
              <div className="space-y-4">
                <PreferenceRow
                  title="Necessary"
                  description="Required for booking forms, cart and portal sign-in. Always on."
                  checked
                  locked
                  onChange={() => undefined}
                />
                <PreferenceRow
                  title="Analytics"
                  description="Anonymous usage statistics that help us improve clinic services."
                  checked={analytics}
                  onChange={setAnalytics}
                />
                <PreferenceRow
                  title="Marketing"
                  description="Reminders about vaccination drives, offers and pet-care tips."
                  checked={marketing}
                  onChange={setMarketing}
                />
              </div>
              <p className="meta mt-4 !normal-case">
                Compliant with the Kenya Data Protection Act, 2019. You can change or withdraw
                consent at any time from the Cookie Policy page.
              </p>
              <div className="mt-5 flex gap-3">
                <button type="button" className="btn-primary flex-1" onClick={() => save({ analytics, marketing })}>
                  Save Preferences
                </button>
                <button type="button" className="btn-outline flex-1" onClick={() => save({ analytics: false, marketing: false })}>
                  Reject All
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function PreferenceRow({
  title,
  description,
  checked,
  locked = false,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  locked?: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-brand border border-line p-3">
      <div>
        <p className="text-[14px] font-bold text-heading">
          {title} {locked && <span className="meta ml-1 text-pine">Locked on</span>}
        </p>
        <p className="text-[12px] leading-relaxed text-body">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={`${title} cookies`}
        disabled={locked}
        onClick={() => onChange(!checked)}
        className={`relative mt-1 h-7 w-12 shrink-0 rounded-full transition-colors duration-300 ${
          checked ? "bg-pine" : "bg-line"
        } ${locked ? "cursor-not-allowed opacity-70" : "cursor-pointer"}`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all duration-300 ${
            checked ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}

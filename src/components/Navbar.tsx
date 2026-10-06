"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarCheck, Clock, Facebook, Instagram, Mail, Menu, Phone, X } from "lucide-react";
import { Logo } from "./Logo";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/#services", label: "Services" },
  { href: "/#vets", label: "Our Vets" },
  { href: "/library", label: "Pet Care Library" },
  { href: "/shop", label: "Shop" },
  { href: "/#about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function TopBar() {
  return (
    <div className="hidden bg-brand text-white md:block">
      <div className="mx-auto flex max-w-shell items-center justify-between px-5 py-2">
        <div className="flex items-center gap-5 text-[13px] font-medium">
          <a href={site.phoneHref} className="flex min-h-[32px] items-center gap-1.5 hover:opacity-90">
            <Phone size={13} aria-hidden /> {site.phoneDisplay}
          </a>
          <a href={`mailto:${site.email}`} className="flex min-h-[32px] items-center gap-1.5 hover:opacity-90">
            <Mail size={13} aria-hidden /> {site.email}
          </a>
          <span className="hidden items-center gap-1.5 lg:flex">
            <Clock size={13} aria-hidden /> Mon–Sat 8:00–18:00 • Emergency 24h
          </span>
        </div>
        <div className="flex items-center gap-2" aria-label="Social media">
          {[
            { Icon: Facebook, label: "Facebook", href: site.socials[0].href },
            { Icon: Instagram, label: "Instagram", href: site.socials[1].href },
            { Icon: X as never, label: "", href: "" },
          ]
            .filter((s) => s.label)
            .map(({ Icon, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="grid h-8 w-8 place-items-center rounded-full bg-white/15 transition-colors duration-300 hover:bg-white/30"
              >
                <Icon size={14} aria-hidden />
              </a>
            ))}
        </div>
      </div>
    </div>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className={cn("sticky top-0 z-[110] bg-white transition-shadow duration-300", scrolled && "shadow-nav")}>
      <div className="mx-auto flex max-w-shell items-center justify-between gap-4 px-5 py-3">
        <Logo compact />
        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-6">
            {NAV_LINKS.map((link) => {
              const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href.split("#")[0]) && link.href !== "/";
              return (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className={cn(
                      "inline-flex min-h-[40px] items-center text-[13px] font-bold tracking-wide transition-colors duration-300",
                      active ? "text-pine" : "text-heading hover:text-pine",
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={site.phoneHref}
            className="inline-flex min-h-[40px] items-center gap-2 rounded-full bg-emergency px-4 py-2 text-[12px] font-bold text-white transition-colors duration-300 hover:bg-emergency-deep"
          >
            <Phone size={13} aria-hidden />
            <span className="hidden xl:inline">Emergency: </span>
            {site.phoneDisplay}
          </a>
          <Link href="/book" className="btn-primary !min-h-[44px] !px-5">
            <CalendarCheck size={14} aria-hidden /> Book Appointment
          </Link>
        </div>
        <button
          type="button"
          className="grid h-12 w-12 place-items-center rounded-brand border border-line text-heading lg:hidden"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} aria-hidden /> : <Menu size={22} aria-hidden />}
        </button>
      </div>

      {/* Mobile slide-down drawer */}
      <AnimatePresence>
        {open && (
          <motion.nav
            key="mobile-drawer"
            aria-label="Mobile"
            className="overflow-hidden border-t border-line bg-white lg:hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <ul className="space-y-1 px-5 py-4">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="flex min-h-[48px] items-center rounded-brand px-3 text-[14px] font-bold text-heading hover:bg-mist hover:text-pine"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="flex flex-col gap-3 pt-3">
                <a href={site.phoneHref} className="btn-emergency justify-center">
                  <Phone size={14} aria-hidden /> Emergency: {site.phoneDisplay}
                </a>
                <Link href="/book" className="btn-primary justify-center">
                  <CalendarCheck size={14} aria-hidden /> Book Appointment
                </Link>
              </li>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

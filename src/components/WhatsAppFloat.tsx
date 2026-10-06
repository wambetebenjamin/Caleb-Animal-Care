"use client";

import { MessageCircle } from "lucide-react";
import { site } from "@/lib/site";

/** Floating WhatsApp button — fixed bottom right, brand green, tooltip per brief. */
export function WhatsAppFloat() {
  return (
    <a
      href={site.whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Caleb Animal Care on WhatsApp"
      className="group fixed bottom-5 right-5 z-[120] flex items-center gap-3"
    >
      <span className="pointer-events-none hidden max-w-[220px] rounded-brand bg-navy px-3 py-2 text-[12px] font-medium leading-snug text-white opacity-0 shadow-lift transition-all duration-300 group-hover:opacity-100 md:block">
        Book an appointment or get pet advice
      </span>
      <span className="grid h-14 w-14 place-items-center rounded-full bg-wa text-white shadow-lift transition-transform duration-300 group-hover:scale-110">
        <MessageCircle size={26} fill="currentColor" strokeWidth={0} aria-hidden />
      </span>
    </a>
  );
}

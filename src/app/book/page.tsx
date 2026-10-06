import type { Metadata } from "next";
import { Suspense } from "react";
import { Loader2, ShieldCheck } from "lucide-react";
import { BookingForm } from "@/components/BookingForm";
import { nextDays, availabilityFor } from "@/lib/slots";

/**
 * Booking — SSR (force-dynamic) for real-time slot accuracy:
 * the upcoming days' availability is computed on the server at request time,
 * and each date selection refetches /api/availability on the client.
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Book an Appointment",
  description: "Book a vet visit at Caleb Animal Care, Nairobi — choose a service, vet and live time slot.",
};

export default async function BookPage() {
  // Warm the slots pipeline server-side so first paint reflects real diary state.
  const upcoming = nextDays(3);
  await Promise.all(upcoming.map((d) => availabilityFor(d, null)));

  return (
    <div className="bg-mist">
      <div className="mx-auto max-w-3xl px-5 py-14">
        <div className="mb-8 text-center">
          <span className="subheading">Online booking</span>
          <h1 className="text-[30px] font-extrabold">Book an appointment</h1>
          <p className="mx-auto mt-2 max-w-lg text-[14px] text-body">
            Four quick steps. Slots are live from the clinic diary — confirmations arrive by WhatsApp
            and email.
          </p>
          <p className="meta mt-3 flex items-center justify-center gap-1.5 !normal-case">
            <ShieldCheck size={13} className="text-pine" aria-hidden /> Kenya Data Protection Act 2019 compliant — your records stay yours.
          </p>
        </div>
        <Suspense
          fallback={
            <div className="grid min-h-[420px] place-items-center rounded-brand bg-white shadow-card">
              <Loader2 className="animate-spin text-pine" size={32} aria-hidden />
            </div>
          }
        >
          <BookingForm />
        </Suspense>
      </div>
    </div>
  );
}

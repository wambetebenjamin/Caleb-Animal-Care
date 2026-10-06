import type { Metadata } from "next";
import { Ambulance, MapPin, Clock } from "lucide-react";
import { HomeVisitForm } from "@/components/HomeVisitForm";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Request a Home Visit",
  description: "Our mobile vet unit comes to your home or farm — Nairobi, Kiambu, Kajiado and Machakos.",
};

export default function HomeVisitPage() {
  return (
    <div className="bg-mist">
      <div className="mx-auto grid max-w-shell gap-10 px-5 py-14 lg:grid-cols-[1fr_520px]">
        <div>
          <span className="subheading">Mobile vet unit</span>
          <h1 className="text-[30px] font-extrabold">Vet care at your doorstep</h1>
          <p className="mt-3 max-w-xl text-[15px] text-body">
            For animals that travel badly — or owners who&apos;d rather we do the travelling. Our mobile
            unit carries the essentials of the consult room, from vaccines and wound care to humane
            end-of-life support.
          </p>
          <ul className="mt-8 space-y-5">
            <li className="flex items-start gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-fog text-pine"><Ambulance size={20} aria-hidden /></span>
              <div>
                <h2 className="text-[16px] font-bold">Same standards as the clinic</h2>
                <p className="text-[13px] text-body">Registered vets, sterile kit, honest pricing — visit fee confirmed before dispatch.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-fog text-pine"><MapPin size={20} aria-hidden /></span>
              <div>
                <h2 className="text-[16px] font-bold">Coverage</h2>
                <p className="text-[13px] text-body">Nairobi daily; Kiambu, Kajiado and Machakos on scheduled routes.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-fog text-pine"><Clock size={20} aria-hidden /></span>
              <div>
                <h2 className="text-[16px] font-bold">Response times</h2>
                <p className="text-[13px] text-body">Routine visits same or next day. Emergencies 24/7 via {site.phoneDisplay}.</p>
              </div>
            </li>
          </ul>
        </div>
        <HomeVisitForm />
      </div>
    </div>
  );
}

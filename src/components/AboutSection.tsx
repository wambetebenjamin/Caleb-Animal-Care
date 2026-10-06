import Image from "next/image";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { SectionHeading } from "./SectionHeading";

const POINTS = [
  "Registered veterinarians (Kenya Veterinary Board) with 15 years' combined practice",
  "Fear-free clinic handling — and a mobile unit for animals who travel badly",
  "One team across pets, livestock and licensed wildlife & exotic species",
  "Digital records, vaccination reminders and online booking built in",
];

export function AboutSection() {
  return (
    <section id="about" className="scroll-mt-24 bg-white py-16 lg:py-20">
      <div className="mx-auto grid max-w-shell items-center gap-10 px-5 lg:grid-cols-2">
        <div className="relative">
          <div className="overflow-hidden rounded-brand shadow-lift">
            <Image
              src="/images/about-team.jpg"
              alt="Pet owners smiling with their dog after a Caleb Animal Care wellness visit"
              width={900}
              height={700}
              className="h-auto w-full object-cover"
            />
          </div>
          <div className="absolute -bottom-6 right-6 hidden max-w-[240px] rounded-brand bg-brand p-5 text-white shadow-lift sm:block">
            <p className="text-[20px] font-extrabold leading-tight">Same-day slots, honest advice.</p>
          </div>
        </div>
        <div>
          <SectionHeading
            align="left"
            subheading="Why Caleb Animal Care"
            title="A neighbourhood clinic with a regional heartbeat"
            intro="We started on Ngong Road in 2011 with one consult room. Today our vets cover Nairobi by mobile unit and support farms and conservancies across four counties — without losing the small-clinic feel."
          />
          <ul className="-mt-4 space-y-3">
            {POINTS.map((point) => (
              <li key={point} className="flex items-start gap-3 text-[14px] text-body">
                <CheckCircle2 size={18} className="mt-1 shrink-0 text-pine" aria-hidden />
                <span>{point}</span>
              </li>
            ))}
          </ul>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/book" className="btn-primary">Book an Appointment</Link>
            <Link href="/library" className="btn-outline">Read the Pet Care Library</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

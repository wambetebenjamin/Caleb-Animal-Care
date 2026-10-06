import Image from "next/image";
import Link from "next/link";
import { CalendarCheck, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="bg-mist">
      <div className="mx-auto max-w-2xl px-5 py-20 text-center">
        <span className="subheading">Error 404</span>
        <h1 className="text-[32px] font-extrabold">This page could not be found.</h1>
        <p className="mx-auto mt-3 max-w-md text-[15px] text-body">
          The trail went cold — maybe the link changed, or the page has found a new home. Let&apos;s
          get you back to safer ground.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href="/book" className="btn-primary">
            <CalendarCheck size={15} aria-hidden /> Book an Appointment
          </Link>
          <Link href="/" className="btn-outline">
            <Compass size={15} aria-hidden /> Back to Home
          </Link>
        </div>
        <div className="mx-auto mt-10 max-w-md overflow-hidden rounded-brand shadow-card">
          <Image
            src="/images/lost-dog.jpg"
            alt="A happy dog running free on a grassy path"
            width={640}
            height={426}
            className="h-auto w-full object-cover"
            priority
          />
        </div>
      </div>
    </div>
  );
}

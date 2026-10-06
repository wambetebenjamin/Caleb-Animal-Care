import { Mail } from "lucide-react";
import { NewsletterForm } from "./NewsletterForm";

export function NewsletterBand() {
  return (
    <section aria-labelledby="newsletter-heading" className="bg-white py-14">
      <div className="mx-auto grid max-w-shell items-center gap-6 rounded-brand bg-mist px-5 py-10 shadow-card md:grid-cols-2 md:px-10 lg:px-14">
        <div className="flex items-start gap-4">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-brand text-white">
            <Mail size={22} aria-hidden />
          </span>
          <div>
            <h2 id="newsletter-heading" className="text-[20px] font-extrabold">
              Monthly pet care tips and vaccination reminders
            </h2>
            <p className="mt-1 text-[14px] text-body">
              Written by our vets. Disease-season alerts, feeding guides and puppy/kitten checklists —
              straight to your inbox.
            </p>
          </div>
        </div>
        <NewsletterForm />
      </div>
    </section>
  );
}

import Link from "next/link";

export function LegalShell({
  heading,
  intro,
  sections,
}: {
  heading: string;
  intro: string;
  sections: { title: string; body: string[] }[];
}) {
  return (
    <div className="bg-mist py-14">
      <div className="mx-auto max-w-3xl px-5">
        <span className="subheading">Caleb Animal Care — Legal</span>
        <h1 className="text-[30px] font-extrabold">{heading}</h1>
        <p className="mt-2 text-[15px] text-body">{intro}</p>
        <nav aria-label="Other legal documents" className="meta mt-4 flex gap-4 !normal-case">
          <Link href="/legal/privacy-policy" className="text-pine hover:underline">Privacy Policy</Link>
          <Link href="/legal/terms" className="text-pine hover:underline">Terms & Conditions</Link>
          <Link href="/legal/cookie-policy" className="text-pine hover:underline">Cookie Policy</Link>
        </nav>
        <div className="mt-8 space-y-8 rounded-brand bg-white p-7 shadow-card">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-[17px] font-extrabold">{section.title}</h2>
              {section.body.map((paragraph, i) => (
                <p key={i} className="mt-3 text-[14px] leading-[1.9] text-body">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

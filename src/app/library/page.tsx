import type { Metadata } from "next";
import { getAllArticles } from "@/lib/articles";
import { LibraryBrowser } from "@/components/LibraryBrowser";
import { SectionHeading } from "@/components/SectionHeading";

export const revalidate = 600; // Library articles: ISR 600

export const metadata: Metadata = {
  title: "Pet Care Library",
  description: "Vet-written guides for Kenyan pet owners and farmers: dogs, cats, birds, livestock, reptiles, nutrition, vaccines and first aid.",
};

export default async function LibraryPage() {
  const articles = await getAllArticles();
  return (
    <div className="bg-mist py-14">
      <div className="mx-auto max-w-shell px-5">
        <SectionHeading
          subheading="Learn with us"
          title="The Pet Care Library"
          intro="Practical, local, and written by the same vets you book with. Filter by animal or topic."
        />
        <LibraryBrowser articles={articles} />
      </div>
    </div>
  );
}

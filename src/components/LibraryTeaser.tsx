import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getAllArticles } from "@/lib/articles";
import { SectionHeading } from "./SectionHeading";
import { ArticleCard } from "./ArticleCard";

export async function LibraryTeaser() {
  const articles = (await getAllArticles()).slice(0, 3);
  return (
    <section aria-labelledby="library-teaser-heading" className="bg-mist py-16 lg:py-20">
      <div className="mx-auto max-w-shell px-5">
        <SectionHeading
          subheading="Pet care library"
          title="Guides written by our own vets"
          intro="Locally-relevant advice: Nairobi's disease seasons, Kenyan feeds, and what actually works in Kenyan homes and shambas."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/library" className="btn-outline">
            Browse all guides <ArrowRight size={14} aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}

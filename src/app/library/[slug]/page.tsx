import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, CalendarCheck, Clock, UserRound } from "lucide-react";
import { getAllArticles, getArticle, getRelatedArticles } from "@/lib/articles";
import { MdxArticle } from "@/components/MdxArticle";
import { ArticleCard } from "@/components/ArticleCard";
import { JsonLd } from "@/components/JsonLd";
import { articleJsonLd } from "@/lib/schema";
import { site } from "@/lib/site";

export const revalidate = 600; // Library articles: ISR 600

export async function generateStaticParams() {
  const articles = await getAllArticles();
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const article = await getArticle(params.slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      publishedTime: article.publishedAt,
      authors: [article.authorVet],
      url: `${site.baseUrl}/library/${article.slug}`,
      images: [{ url: article.image }],
    },
  };
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await getArticle(params.slug);
  if (!article) notFound();
  const related = await getRelatedArticles(article.slug, article.category);

  return (
    <>
      <JsonLd data={articleJsonLd(article)} />
      <article className="bg-white">
        <div className="relative h-[40vh] min-h-[300px] w-full overflow-hidden">
          <Image src={article.image} alt="" fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/75 via-navy/25 to-transparent" aria-hidden />
          <div className="absolute inset-x-0 bottom-0">
            <div className="mx-auto max-w-3xl px-5 pb-8">
              <span className="rounded-full bg-brand px-3 py-1 text-[11px] font-bold uppercase tracking-[1px] text-white">
                {article.category}
              </span>
              <h1 className="mt-3 text-[28px] font-extrabold !text-white sm:text-[34px]">{article.title}</h1>
              <p className="meta mt-2 flex flex-wrap items-center gap-4 !text-white/80">
                <span className="flex items-center gap-1.5"><UserRound size={13} aria-hidden /> {article.authorVet}, {article.authorRole}</span>
                <span className="flex items-center gap-1.5"><Clock size={13} aria-hidden /> {article.readTime}</span>
                <span>{new Date(article.publishedAt).toLocaleDateString("en-KE", { dateStyle: "long" })}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-3xl px-5 py-12">
          <Link href="/library" className="mb-8 inline-flex min-h-[44px] items-center gap-2 text-[13px] font-bold text-pine hover:underline">
            <ArrowLeft size={15} aria-hidden /> All guides
          </Link>
          <MdxArticle source={article.body} />
          <div className="mt-12 rounded-brand border border-pine/30 bg-mist p-6 text-center">
            <h2 className="text-[18px] font-extrabold">Questions about your animal?</h2>
            <p className="mt-1 text-[14px] text-body">Our vets answer during clinic hours — or book a consult and we&apos;ll check your animal properly.</p>
            <Link href="/book" className="btn-primary mt-4">
              <CalendarCheck size={15} aria-hidden /> Book an Appointment
            </Link>
          </div>
        </div>
      </article>

      <section aria-labelledby="related-heading" className="bg-mist py-14">
        <div className="mx-auto max-w-shell px-5">
          <h2 id="related-heading" className="mb-8 text-center text-[24px] font-extrabold">Keep reading</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {related.map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

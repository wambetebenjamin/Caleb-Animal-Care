import Image from "next/image";
import Link from "next/link";
import { Clock, UserRound } from "lucide-react";
import type { ArticleMeta } from "@/lib/articles";

export function ArticleCard({ article }: { article: ArticleMeta }) {
  return (
    <article className="group card-service flex h-full flex-col overflow-hidden border border-transparent hover:border-pine">
      <Link href={`/library/${article.slug}`} className="relative block h-44 overflow-hidden" tabIndex={-1} aria-hidden>
        <Image
          src={article.image}
          alt=""
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-[250ms] ease-brand group-hover:scale-[1.04]"
        />
        <span className="absolute left-3 top-3 rounded-full bg-brand px-3 py-1 text-[11px] font-bold uppercase tracking-[1px] text-white">
          {article.category}
        </span>
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-[16px] font-bold leading-snug">
          <Link href={`/library/${article.slug}`} className="hover:text-pine">
            {article.title}
          </Link>
        </h3>
        <p className="mt-2 flex-1 text-[13px] leading-relaxed text-body">{article.excerpt}</p>
        <p className="meta mt-4 flex items-center gap-4 !normal-case">
          <span className="flex items-center gap-1"><Clock size={13} aria-hidden /> {article.readTime}</span>
          <span className="flex items-center gap-1"><UserRound size={13} aria-hidden /> {article.authorVet}</span>
        </p>
      </div>
    </article>
  );
}

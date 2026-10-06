"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { ArticleMeta } from "@/lib/articles";
import { articleCategories } from "@/lib/data";
import { ArticleCard } from "./ArticleCard";
import { cn } from "@/lib/utils";

export function LibraryBrowser({ articles }: { articles: ArticleMeta[] }) {
  const reduced = useReducedMotion();
  const [category, setCategory] = useState<string | null>(null);
  const filtered = category ? articles.filter((a) => a.category === category) : articles;

  return (
    <>
      <div className="mb-8 flex flex-wrap justify-center gap-2" role="tablist" aria-label="Filter by category">
        <button
          type="button"
          role="tab"
          aria-selected={category === null}
          onClick={() => setCategory(null)}
          className={cn(
            "min-h-[40px] rounded-full border px-4 text-[12px] font-bold transition-all duration-300",
            category === null ? "border-pine bg-pine text-white" : "border-line text-body hover:border-pine",
          )}
        >
          All
        </button>
        {articleCategories.map((cat) => (
          <button
            key={cat}
            type="button"
            role="tab"
            aria-selected={category === cat}
            onClick={() => setCategory(cat)}
            className={cn(
              "min-h-[40px] rounded-full border px-4 text-[12px] font-bold transition-all duration-300",
              category === cat ? "border-pine bg-pine text-white" : "border-line text-body hover:border-pine",
            )}
          >
            {cat}
          </button>
        ))}
      </div>
      <motion.ul
        key={category ?? "all"}
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        initial={reduced ? false : "hidden"}
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
      >
        {filtered.map((article) => (
          <motion.li
            key={article.slug}
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
            }}
          >
            <ArticleCard article={article} />
          </motion.li>
        ))}
        {filtered.length === 0 && (
          <li className="col-span-full rounded-brand border border-dashed border-line p-8 text-center text-[14px] text-body">
            No guides in this category yet — check back soon, or ask a vet on WhatsApp.
          </li>
        )}
      </motion.ul>
    </>
  );
}

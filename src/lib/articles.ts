import { promises as fs } from "fs";
import path from "path";

/**
 * Pet Care Library — articles are authored as .mdx files in
 * src/content/library. Front-matter drives cards, metadata and related links;
 * the body is rendered by the bundled MDX-compatible renderer
 * (src/components/MdxArticle.tsx) so the pinned dependency set stays exact.
 */

export interface ArticleMeta {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  authorVet: string;
  authorRole: string;
  publishedAt: string;
  image: string;
}

export interface Article extends ArticleMeta {
  body: string;
}

const CONTENT_DIR = path.join(process.cwd(), "src", "content", "library");

function parseFrontmatter(raw: string): { data: Record<string, string>; body: string } {
  const match = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);
  if (!match) return { data: {}, body: raw };
  const data: Record<string, string> = {};
  for (const line of match[1].split("\n")) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    data[key] = value;
  }
  return { data, body: match[2] };
}

export async function getAllArticles(): Promise<ArticleMeta[]> {
  const files = (await fs.readdir(CONTENT_DIR)).filter((f) => f.endsWith(".mdx"));
  const metas: ArticleMeta[] = [];
  for (const file of files) {
    const raw = await fs.readFile(path.join(CONTENT_DIR, file), "utf8");
    const { data } = parseFrontmatter(raw);
    metas.push({
      slug: file.replace(/\.mdx$/, ""),
      title: data.title ?? "Untitled",
      excerpt: data.excerpt ?? "",
      category: data.category ?? "Dogs",
      readTime: data.readTime ?? "4 min read",
      authorVet: data.authorVet ?? "Caleb Animal Care Team",
      authorRole: data.authorRole ?? "Veterinary Team",
      publishedAt: data.publishedAt ?? "2026-01-01",
      image: data.image ?? "/images/art-dogs.jpg",
    });
  }
  return metas.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export async function getArticle(slug: string): Promise<Article | null> {
  try {
    const raw = await fs.readFile(path.join(CONTENT_DIR, `${slug}.mdx`), "utf8");
    const { data, body } = parseFrontmatter(raw);
    return {
      slug,
      title: data.title ?? "Untitled",
      excerpt: data.excerpt ?? "",
      category: data.category ?? "Dogs",
      readTime: data.readTime ?? "4 min read",
      authorVet: data.authorVet ?? "Caleb Animal Care Team",
      authorRole: data.authorRole ?? "Veterinary Team",
      publishedAt: data.publishedAt ?? "2026-01-01",
      image: data.image ?? "/images/art-dogs.jpg",
      body,
    };
  } catch {
    return null;
  }
}

export async function getRelatedArticles(slug: string, category: string, limit = 3): Promise<ArticleMeta[]> {
  const all = await getAllArticles();
  const sameCategory = all.filter((a) => a.slug !== slug && a.category === category);
  const rest = all.filter((a) => a.slug !== slug && a.category !== category);
  return [...sameCategory, ...rest].slice(0, limit);
}

import { getAllArticles, getArticle } from "@/lib/articles";

export const revalidate = 600;

/** MDX article handler: full index or a single article via ?slug=. */
export async function GET(request: Request) {
  const slug = new URL(request.url).searchParams.get("slug");
  if (slug) {
    const article = await getArticle(slug);
    if (!article) return Response.json({ ok: false, error: "Article not found" }, { status: 404 });
    return Response.json({ ok: true, article });
  }
  const articles = await getAllArticles();
  return Response.json({ ok: true, articles });
}

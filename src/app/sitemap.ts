import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { services } from "@/lib/data";
import { getAllArticles } from "@/lib/articles";

/** Dynamic sitemap from library and service slugs. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getAllArticles();
  const staticRoutes = [
    "",
    "/book",
    "/home-visit",
    "/library",
    "/shop",
    "/contact",
    "/my-pets",
    "/legal/privacy-policy",
    "/legal/terms",
    "/legal/cookie-policy",
  ].map((path) => ({
    url: `${site.baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const serviceRoutes = services.map((s) => ({
    url: `${site.baseUrl}/services/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const articleRoutes = articles.map((a) => ({
    url: `${site.baseUrl}/library/${a.slug}`,
    lastModified: new Date(a.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...serviceRoutes, ...articleRoutes];
}

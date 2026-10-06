import { getJson, setJson } from "./store";
import { products as seed } from "./data";
import type { Product } from "./types";

const CATALOG_KEY = "shop:products";

/**
 * Product catalogue lives in Vercel KV ("shop:products"). On first access the
 * curated seed catalogue is persisted so admins can later edit stock/prices
 * without a redeploy; with no KV configured the in-memory store still serves
 * identical behaviour for dev/preview.
 */
export async function getProducts(): Promise<Product[]> {
  const existing = await getJson<Product[]>(CATALOG_KEY);
  if (existing && existing.length > 0) return existing;
  await setJson(CATALOG_KEY, seed);
  return seed;
}

export async function decrementStock(items: { productId: string; qty: number }[]): Promise<void> {
  const catalog = await getProducts();
  const next = catalog.map((p) => {
    const line = items.find((i) => i.productId === p.id);
    return line ? { ...p, stock: Math.max(0, p.stock - line.qty) } : p;
  });
  await setJson(CATALOG_KEY, next);
}

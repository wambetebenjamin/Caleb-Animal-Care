import { getProducts } from "@/lib/shop";

export const revalidate = 300;

/** Product catalogue served from Vercel KV (seeded on first access). */
export async function GET() {
  const products = await getProducts();
  return Response.json({ ok: true, products });
}

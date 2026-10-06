import { availabilityFor, nextDays } from "@/lib/slots";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/** GET /api/availability?date=YYYY-MM-DD&vet=slug → live slots from Vercel KV.
 *  Without ?date, returns the next 7 bookable days with free-slot counts. */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");
  const vet = searchParams.get("vet");

  if (date) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return Response.json({ ok: false, error: "Invalid date format" }, { status: 400 });
    }
    const slots = await availabilityFor(date, vet || null);
    return Response.json({ ok: true, date, vet: vet || "any", slots });
  }

  const days = await Promise.all(
    nextDays(7).map(async (d) => ({
      date: d,
      free: (await availabilityFor(d, null)).filter((s) => !s.taken).length,
    })),
  );
  return Response.json({ ok: true, days });
}

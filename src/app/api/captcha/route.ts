import { z } from "zod";
import { verifyCaptcha } from "@/lib/captcha";

export const dynamic = "force-dynamic";

const schema = z.object({
  token: z.string().min(1),
  expectedAction: z.string().max(40).optional(),
});

/** Server-side reCAPTCHA verification endpoint (shared by custom flows). */
export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ ok: false, error: "token is required" }, { status: 400 });
  }
  const result = await verifyCaptcha(parsed.data.token, {
    expectedAction: parsed.data.expectedAction,
  });
  return Response.json({
    ok: result.ok,
    score: result.score,
    lowScoreFallback: result.lowScoreFallback,
    devMode: result.devMode,
  });
}

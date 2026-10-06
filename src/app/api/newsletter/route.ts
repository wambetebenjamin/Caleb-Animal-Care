import { z } from "zod";
import { verifyCaptcha, captchaFailResponse } from "@/lib/captcha";
import { lpush, sadd, sismember } from "@/lib/store";
import { sendMail } from "@/lib/mail";

export const dynamic = "force-dynamic";

const schema = z.object({
  email: z.string().email().max(120),
  token: z.string().min(1),
});

/** Newsletter signup — stored in Vercel KV, reCAPTCHA verified. */
export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ ok: false, error: "Enter a valid email address." }, { status: 400 });
  }
  const email = parsed.data.email.trim().toLowerCase();

  const captcha = await verifyCaptcha(parsed.data.token, { expectedAction: "newsletter" });
  if (!captcha.ok) return captchaFailResponse(captcha);

  if (await sismember("subscribers:set", email)) {
    return Response.json({ ok: true, already: true });
  }
  await sadd("subscribers:set", email);
  await lpush("subscribers:list", { email, at: new Date().toISOString() });

  await sendMail({
    to: email,
    subject: "Welcome to the Caleb Animal Care pack",
    html: `<p>Jambo! You're subscribed to monthly pet care tips and vaccination reminders from Caleb Animal Care, Nairobi.</p><p style="color:#888;font-size:13px">No spam, one email a month, unsubscribe any time by replying STOP.</p>`,
  });

  return Response.json({ ok: true });
}

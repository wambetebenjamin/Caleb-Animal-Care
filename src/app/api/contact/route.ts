import { z } from "zod";
import { verifyCaptcha, captchaFailResponse } from "@/lib/captcha";
import { sendMail } from "@/lib/mail";
import { lpush } from "@/lib/store";
import { randomId } from "@/lib/utils";

export const dynamic = "force-dynamic";

const schema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email().max(120),
  phone: z.string().max(20).default(""),
  subject: z.string().min(3).max(80),
  message: z.string().min(10).max(3000),
  token: z.string().min(1),
});

/** General enquiry — Nodemailer to the clinic inbox, reCAPTCHA verified. */
export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ ok: false, error: "Some details are missing or invalid. Please review the form." }, { status: 400 });
  }
  const data = parsed.data;

  const captcha = await verifyCaptcha(data.token, { expectedAction: "contact" });
  if (!captcha.ok) return captchaFailResponse(captcha);

  await lpush("contact:inbox", { id: randomId("msg"), ...data, at: new Date().toISOString() });

  const { sent } = await sendMail({
    to: process.env.CLINIC_EMAIL ?? "info@calebanimalcare.co.ke",
    subject: `[${data.subject}] Message from ${data.name}`,
    html: `
      <table style="font-family:Arial,sans-serif;font-size:14px;line-height:1.8">
        <tr><td style="color:#888;padding-right:12px">Name</td><td><strong>${data.name}</strong></td></tr>
        <tr><td style="color:#888;padding-right:12px">Email</td><td>${data.email}</td></tr>
        <tr><td style="color:#888;padding-right:12px">Phone</td><td>${data.phone || "—"}</td></tr>
        <tr><td style="color:#888;padding-right:12px">Subject</td><td>${data.subject}</td></tr>
      </table>
      <p style="font-family:Arial,sans-serif;font-size:14px;margin-top:16px;white-space:pre-wrap">${data.message}</p>`,
    replyTo: data.email,
  });

  return Response.json({ ok: true, delivered: sent });
}

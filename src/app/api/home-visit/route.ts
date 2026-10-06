import { z } from "zod";
import { verifyCaptcha, captchaFailResponse } from "@/lib/captcha";
import { lpush, setJson } from "@/lib/store";
import { sendWhatsApp, homeVisitWhatsAppText } from "@/lib/whatsapp";
import { sendMail } from "@/lib/mail";
import { randomId } from "@/lib/utils";

export const dynamic = "force-dynamic";

const schema = z.object({
  owner: z.string().min(2).max(80),
  phone: z.string().min(9).max(20),
  email: z.string().email().max(120).optional().or(z.literal("")),
  location: z.string().min(2).max(80),
  landmark: z.string().max(120).default(""),
  animalType: z.string().min(2).max(30),
  concern: z.string().min(10).max(2000),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().min(3).max(40),
  token: z.string().min(1),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ ok: false, error: "Some details are missing or invalid. Please review the form." }, { status: 400 });
  }
  const data = parsed.data;

  const captcha = await verifyCaptcha(data.token, { expectedAction: "home_visit" });
  if (!captcha.ok) return captchaFailResponse(captcha);

  const id = randomId("hv");
  const record = { id, ...data, createdAt: new Date().toISOString(), status: "requested" as const };
  await setJson(`hv:id:${id}`, record);
  await lpush("hv:all", record);

  const whatsapp = await sendWhatsApp(
    data.phone,
    homeVisitWhatsAppText({
      owner: data.owner,
      animal: data.animalType,
      location: data.location,
      date: data.date,
      time: data.time,
    }),
  );
  await sendMail({
    to: process.env.CLINIC_EMAIL ?? "info@calebanimalcare.co.ke",
    subject: `Home visit request — ${data.animalType} in ${data.location}`,
    html: `<p><strong>${data.owner}</strong> (${data.phone}${data.email ? `, ${data.email}` : ""}) requests a mobile visit for a <strong>${data.animalType}</strong> in <strong>${data.location}</strong>${data.landmark ? ` (${data.landmark})` : ""}.</p><p>Preferred: ${data.date} — ${data.time}.</p><p>Concern: ${data.concern}</p>`,
    replyTo: data.email || undefined,
  });

  return Response.json({ ok: true, id, whatsappPreview: whatsapp.mode === "demo" ? whatsapp.previewLink : undefined });
}

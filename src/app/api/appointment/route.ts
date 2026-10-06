import { z } from "zod";
import { put } from "@vercel/blob";
import { verifyCaptcha, captchaFailResponse } from "@/lib/captcha";
import { lpush, setJson } from "@/lib/store";
import { sendMail, confirmEmailHtml } from "@/lib/mail";
import { sendWhatsApp, appointmentWhatsAppText } from "@/lib/whatsapp";
import { randomId, formatDate } from "@/lib/utils";
import { services, vets } from "@/lib/data";
import type { Appointment } from "@/lib/types";

export const dynamic = "force-dynamic";

const schema = z.object({
  serviceSlug: z.string().min(1),
  vetSlug: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  petName: z.string().min(1).max(60),
  species: z.string().min(1).max(30),
  breed: z.string().max(60).default(""),
  age: z.string().max(20).default(""),
  weight: z.string().max(10).default(""),
  history: z.string().max(2000).default(""),
  ownerName: z.string().min(2).max(80),
  phone: z.string().min(9).max(20),
  email: z.string().email().max(120),
  address: z.string().min(2).max(160),
  token: z.string().min(1),
});

export async function POST(request: Request) {
  let fields: Record<string, unknown>;
  let recordsFile: File | null = null;

  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("multipart/form-data")) {
    const form = await request.formData();
    fields = {};
    form.forEach((value, key) => {
      if (typeof value === "string") fields[key] = value;
    });
    const file = form.get("records");
    if (file instanceof File && file.size > 0 && file.size <= 5 * 1024 * 1024) {
      recordsFile = file;
    }
  } else {
    fields = await request.json().catch(() => ({}));
  }

  const parsed = schema.safeParse(fields);
  if (!parsed.success) {
    return Response.json({ ok: false, error: "Some details are missing or invalid. Please review the form." }, { status: 400 });
  }
  const data = parsed.data;

  const captcha = await verifyCaptcha(data.token, { expectedAction: "appointment" });
  if (!captcha.ok) return captchaFailResponse(captcha);

  // Optional upload to Vercel Blob (pet health records)
  let recordsUrl: string | undefined;
  if (recordsFile && process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const blob = await put(`records/${randomId("rec")}-${recordsFile.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`, recordsFile, {
        access: "public",
        contentType: recordsFile.type || "application/octet-stream",
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });
      recordsUrl = blob.url;
    } catch (error) {
      console.error("[blob:error]", error);
    }
  }

  const appointment: Appointment = {
    id: randomId("appt"),
    createdAt: new Date().toISOString(),
    serviceSlug: data.serviceSlug,
    vetSlug: data.vetSlug,
    date: data.date,
    time: data.time,
    pet: {
      name: data.petName,
      species: data.species,
      breed: data.breed,
      age: data.age,
      weight: data.weight,
      history: data.history,
    },
    owner: { name: data.ownerName, phone: data.phone, email: data.email, address: data.address },
    recordsUrl,
    status: "confirmed",
  };

  // Persist: by id (record), by date (availability), by owner email (portal visits)
  await setJson(`appt:id:${appointment.id}`, appointment);
  await lpush(`appt:date:${appointment.date}`, appointment);
  await lpush(`appts:user:${appointment.owner.email.toLowerCase()}`, appointment);

  const serviceName = services.find((s) => s.slug === appointment.serviceSlug)?.name ?? appointment.serviceSlug;
  const vetName = vets.find((v) => v.slug === appointment.vetSlug)?.name ?? "our team";
  const prettyDate = formatDate(appointment.date);

  const whatsapp = await sendWhatsApp(
    appointment.owner.phone,
    appointmentWhatsAppText({
      owner: appointment.owner.name.split(" ")[0],
      pet: appointment.pet.name,
      service: serviceName,
      date: prettyDate,
      time: appointment.time,
    }),
  );
  await sendMail({
    to: appointment.owner.email,
    subject: `Confirmed: ${serviceName} on ${prettyDate} at ${appointment.time}`,
    html: confirmEmailHtml({
      owner: appointment.owner.name.split(" ")[0],
      pet: appointment.pet.name,
      service: serviceName,
      date: prettyDate,
      time: appointment.time,
      vet: vetName,
    }),
  });

  return Response.json({ ok: true, id: appointment.id, whatsappPreview: whatsapp.mode === "demo" ? whatsapp.previewLink : undefined });
}

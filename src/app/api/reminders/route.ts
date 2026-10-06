import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { del, getJson, lpush, lrangeJson, setJson } from "@/lib/store";
import { sendWhatsApp, reminderWhatsAppText } from "@/lib/whatsapp";
import { normaliseKenyanPhone } from "@/lib/mpesa";
import { randomId } from "@/lib/utils";
import type { Reminder } from "@/lib/types";

export const dynamic = "force-dynamic";

/** WhatsApp reminder scheduler (owner-authenticated) + cron runner. */

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email?.toLowerCase();
  if (!email) return Response.json({ ok: false, error: "Sign in required" }, { status: 401 });

  const parsed = z
    .object({
      petName: z.string().min(1).max(60),
      medication: z.string().min(1).max(80),
      dosage: z.string().max(60).default(""),
      remindAt: z.string().min(10),
      phone: z.string().min(9).max(20),
      ownerEmail: z.string().email(),
    })
    .safeParse(await request.json().catch(() => null));
  if (!parsed.success || parsed.data.ownerEmail.toLowerCase() !== email) {
    return Response.json({ ok: false, error: "Invalid reminder details." }, { status: 400 });
  }

  const reminder: Reminder = {
    id: randomId("rem"),
    ownerEmail: email,
    ownerPhone: normaliseKenyanPhone(parsed.data.phone),
    petName: parsed.data.petName,
    medication: parsed.data.medication,
    dosage: parsed.data.dosage,
    remindAt: new Date(parsed.data.remindAt).toISOString(),
    sent: false,
    createdAt: new Date().toISOString(),
  };
  await lpush(`rem:${email}`, reminder);

  const owners = (await getJson<string[]>("rem:owners")) ?? [];
  if (!owners.includes(email)) await setJson("rem:owners", [...owners, email]);

  return Response.json({ ok: true, reminder });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // Cron runner (vercel.json → /api/reminders?due=1 daily at 06:00 UTC)
  if (searchParams.get("due")) {
    const secret = process.env.CRON_SECRET;
    const auth = request.headers.get("authorization");
    if (secret && auth !== `Bearer ${secret}`) {
      return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }
    const owners = (await getJson<string[]>("rem:owners")) ?? [];
    const today = new Date().toISOString().slice(0, 10);
    let sent = 0;

    for (const owner of owners) {
      const reminders = await lrangeJson<Reminder>(`rem:${owner}`);
      let changed = false;
      const updated = reminders.map((reminder) => {
        if (reminder.sent || reminder.remindAt.slice(0, 10) > today) return reminder;
        changed = true;
        sent += 1;
        // Fire the WhatsApp reminder (demo-mode safe)
        void sendWhatsApp(
          reminder.ownerPhone,
          reminderWhatsAppText({
            owner: "there",
            pet: reminder.petName,
            medication: reminder.medication,
            dosage: reminder.dosage,
          }),
        );
        return { ...reminder, sent: true };
      });
      if (changed) {
        await del(`rem:${owner}`);
        for (let i = updated.length - 1; i >= 0; i--) {
          await lpush(`rem:${owner}`, updated[i]);
        }
      }
    }
    return Response.json({ ok: true, sent });
  }

  const session = await getServerSession(authOptions);
  const email = session?.user?.email?.toLowerCase();
  if (!email) return Response.json({ ok: false, error: "Sign in required" }, { status: 401 });
  const list = await lrangeJson<Reminder>(`rem:${email}`);
  return Response.json({ ok: true, reminders: list });
}

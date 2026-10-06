/**
 * WhatsApp notifications via the Meta WhatsApp Cloud API.
 * When WHATSAPP_TOKEN / WHATSAPP_PHONE_ID are absent the message is logged and
 * the caller receives the deep-link it could use (demo mode).
 */

export interface WhatsAppResult {
  delivered: boolean;
  mode: "cloud-api" | "demo";
  previewLink: string;
}

export async function sendWhatsApp(toE164: string, text: string): Promise<WhatsAppResult> {
  const token = process.env.WHATSAPP_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_ID;
  const previewLink = `https://wa.me/${toE164.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;

  if (!token || !phoneId) {
    console.info(`[whatsapp:demo] to=${toE164} message="${text}"`);
    return { delivered: false, mode: "demo", previewLink };
  }

  try {
    const res = await fetch(`https://graph.facebook.com/v19.0/${phoneId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: toE164.replace(/\D/g, ""),
        type: "text",
        text: { body: text },
      }),
      cache: "no-store",
    });
    return { delivered: res.ok, mode: "cloud-api", previewLink };
  } catch (error) {
    console.error("[whatsapp:error]", error);
    return { delivered: false, mode: "cloud-api", previewLink };
  }
}

export function appointmentWhatsAppText(vars: {
  owner: string;
  pet: string;
  service: string;
  date: string;
  time: string;
}): string {
  return (
    `Hello ${vars.owner}! 🐾 ${vars.pet}'s ${vars.service} appointment at Caleb Animal Care is confirmed ` +
    `for ${vars.date} at ${vars.time}. Reply R to reschedule. Emergency line (24h): +254 112 272 061.`
  );
}

export function homeVisitWhatsAppText(vars: {
  owner: string;
  animal: string;
  location: string;
  date: string;
  time: string;
}): string {
  return (
    `New home-visit request — ${vars.owner} (${vars.animal}) in ${vars.location}, ` +
    `preferred ${vars.date} at ${vars.time}. Please confirm with the owner. — Caleb Animal Care system`
  );
}

export function reminderWhatsAppText(vars: {
  owner: string;
  pet: string;
  medication: string;
  dosage: string;
}): string {
  return (
    `⏰ Medication reminder from Caleb Animal Care: it's time to give ${vars.pet} ` +
    `${vars.medication} (${vars.dosage}). Reply DONE once given. Kwa heri!`
  );
}

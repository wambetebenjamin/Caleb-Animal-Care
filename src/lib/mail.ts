import nodemailer from "nodemailer";

/** Nodemailer transport (SMTP env). Falls back to JSON log when unconfigured. */
function transport() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST) {
    return nodemailer.createTransport({ jsonTransport: true });
  }
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT ?? 587),
    secure: Number(SMTP_PORT ?? 587) === 465,
    auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
  });
}

export async function sendMail(options: {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}): Promise<{ sent: boolean }> {
  const from = process.env.SMTP_FROM ?? "Caleb Animal Care <no-reply@calebanimalcare.co.ke>";
  try {
    const info = await transport().sendMail({ from, ...options });
    if (!process.env.SMTP_HOST) {
      console.info("[mail:dev]", options.subject, "→", options.to);
      const preview = (info as { message?: unknown }).message;
      if (preview) console.info(String(preview).slice(0, 400));
      return { sent: false };
    }
    return { sent: true };
  } catch (error) {
    console.error("[mail:error]", error);
    return { sent: false };
  }
}

export function confirmEmailHtml(vars: {
  owner: string;
  pet: string;
  service: string;
  date: string;
  time: string;
  vet: string;
}): string {
  return `
  <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto">
    <div style="background:linear-gradient(45deg,#207dff,#00bd55);padding:24px;color:#fff">
      <h1 style="margin:0;font-size:20px">Caleb Animal Care</h1>
      <p style="margin:4px 0 0;font-size:13px">Appointment confirmed</p>
    </div>
    <div style="padding:24px;border:1px solid #eee">
      <p>Hello ${vars.owner},</p>
      <p><strong>${vars.pet}</strong> is booked in for <strong>${vars.service}</strong>.</p>
      <table style="font-size:14px;line-height:1.8">
        <tr><td style="padding-right:16px;color:#888">Date</td><td><strong>${vars.date}</strong></td></tr>
        <tr><td style="padding-right:16px;color:#888">Time</td><td><strong>${vars.time}</strong></td></tr>
        <tr><td style="padding-right:16px;color:#888">Veterinarian</td><td><strong>${vars.vet}</strong></td></tr>
      </table>
      <p style="color:#888;font-size:13px">Need to reschedule? Reply to this email or WhatsApp us on +254 112 272 061. For emergencies our line is open 24 hours.</p>
    </div>
  </div>`;
}

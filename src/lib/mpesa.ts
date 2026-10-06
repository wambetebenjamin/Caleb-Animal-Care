/**
 * M-Pesa payments via Safaricom Daraja (STK Push / Lipa Na M-Pesa Online).
 * Fully env-gated: with no Daraja credentials the checkout runs in demo mode
 * and returns instructions for completing payment at the till — useful for
 * local dev and staging.
 */

export interface StkResult {
  initiated: boolean;
  mode: "daraja" | "demo";
  message: string;
  checkoutRequestId?: string;
}

function baseUrl() {
  return process.env.MPESA_ENV === "production"
    ? "https://api.safaricom.co.ke"
    : "https://sandbox.safaricom.co.ke";
}

async function darajaToken(): Promise<string | null> {
  const key = process.env.MPESA_CONSUMER_KEY;
  const secret = process.env.MPESA_CONSUMER_SECRET;
  if (!key || !secret) return null;
  const auth = Buffer.from(`${key}:${secret}`).toString("base64");
  try {
    const res = await fetch(`${baseUrl()}/oauth/v1/generate?grant_type=client_credentials`, {
      headers: { Authorization: `Basic ${auth}` },
      cache: "no-store",
    });
    const data = (await res.json()) as { access_token?: string };
    return data.access_token ?? null;
  } catch {
    return null;
  }
}

export async function initiateStkPush(params: {
  phone254: string;
  amountKes: number;
  orderRef: string;
  description: string;
}): Promise<StkResult> {
  const shortcode = process.env.MPESA_SHORTCODE;
  const passkey = process.env.MPESA_PASSKEY;
  const callback = process.env.MPESA_CALLBACK_URL;

  if (!shortcode || !passkey || !callback) {
    console.info(
      `[mpesa:demo] STK push → ${params.phone254}, KES ${params.amountKes}, ref ${params.orderRef}`,
    );
    return {
      initiated: false,
      mode: "demo",
      message:
        "Demo checkout (Daraja not configured). Pay on pickup or via M-Pesa Buy Goods till 5555 112 quoting your order number.",
    };
  }

  const token = await darajaToken();
  if (!token) {
    return { initiated: false, mode: "daraja", message: "M-Pesa is temporarily unavailable. Please pay at the clinic." };
  }

  const timestamp = new Date()
    .toISOString()
    .replace(/[-:TZ.]/g, "")
    .slice(0, 14);
  const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString("base64");

  try {
    const res = await fetch(`${baseUrl()}/mpesa/stkpush/v1/processrequest`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        BusinessShortCode: shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: Math.max(1, Math.round(params.amountKes)),
        PartyA: params.phone254,
        PartyB: shortcode,
        PhoneNumber: params.phone254,
        CallBackURL: callback,
        AccountReference: params.orderRef,
        TransactionDesc: params.description.slice(0, 13),
      }),
      cache: "no-store",
    });
    const data = (await res.json()) as { CheckoutRequestID?: string; ResponseCode?: string };
    const initiated = data.ResponseCode === "0";
    return {
      initiated,
      mode: "daraja",
      message: initiated
        ? "Check your phone and enter your M-Pesa PIN to complete payment."
        : "Could not start M-Pesa payment. You can pay at the clinic instead.",
      checkoutRequestId: data.CheckoutRequestID,
    };
  } catch {
    return { initiated: false, mode: "daraja", message: "M-Pesa is temporarily unavailable. Please pay at the clinic." };
  }
}

/** Normalise 07xx / +254xx / 254xx → 2547XXXXXXXX */
export function normaliseKenyanPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("254")) return digits;
  if (digits.startsWith("0")) return `254${digits.slice(1)}`;
  if (digits.startsWith("7") || digits.startsWith("1")) return `254${digits}`;
  return digits;
}

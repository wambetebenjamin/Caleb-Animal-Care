import { getJson, lrangeJson, setJson } from "@/lib/store";

export const dynamic = "force-dynamic";

interface StoredOrder {
  id: string;
  payment?: { checkoutRequestId?: string | null; status?: string };
  [key: string]: unknown;
}

/** Daraja STK push callback — confirms M-Pesa payment for the order. */
export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as {
      Body?: {
        stkCallback?: {
          CheckoutRequestID?: string;
          ResultCode?: number;
          ResultDesc?: string;
          CallbackMetadata?: { Item?: Array<{ Name?: string; Value?: string | number }> };
        };
      };
    };
    const cb = payload.Body?.stkCallback;
    if (cb?.CheckoutRequestID) {
      const recent = await lrangeJson<StoredOrder>("orders:all", 0, 199);
      const hit = recent.find((o) => o.payment?.checkoutRequestId === cb.CheckoutRequestID);
      if (hit) {
        const order = (await getJson<StoredOrder>(`order:${hit.id}`)) ?? hit;
        const receipt = cb.CallbackMetadata?.Item?.find((i) => i.Name === "MpesaReceiptNumber")?.Value;
        await setJson(`order:${hit.id}`, {
          ...order,
          payment: {
            ...order.payment,
            status: cb.ResultCode === 0 ? "paid" : "failed",
            resultDesc: cb.ResultDesc,
            receipt: receipt ?? null,
            confirmedAt: new Date().toISOString(),
          },
        });
      }
    }
  } catch (error) {
    console.error("[mpesa:callback]", error);
  }
  // Daraja expects a 2xx acknowledgement either way.
  return Response.json({ ResultCode: 0, ResultDesc: "Received" });
}

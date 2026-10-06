import { z } from "zod";
import { getProducts, decrementStock } from "@/lib/shop";
import { lpush, setJson } from "@/lib/store";
import { initiateStkPush, normaliseKenyanPhone } from "@/lib/mpesa";
import { sendWhatsApp } from "@/lib/whatsapp";
import { randomId } from "@/lib/utils";
import { kes } from "@/lib/site";

export const dynamic = "force-dynamic";

const schema = z.object({
  items: z
    .array(z.object({ productId: z.string().min(1), size: z.string().min(1), qty: z.number().int().min(1).max(50) }))
    .min(1),
  customer: z.object({ name: z.string().min(2).max(80), phone: z.string().min(9).max(20) }),
  fulfilment: z.enum(["pickup", "delivery"]),
  address: z.string().max(200).default(""),
  token: z.string().optional(),
});

/** Shop order — totals are recomputed server-side from the KV catalogue,
 *  Daraja STK push when configured, order persisted to Vercel KV. */
export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ ok: false, error: "Invalid order." }, { status: 400 });
  }
  const { items, customer, fulfilment, address } = parsed.data;

  const catalog = await getProducts();
  const lines = items.map((line) => {
    const product = catalog.find((p) => p.id === line.productId);
    return product ? { ...line, unitPrice: product.price, name: product.name } : null;
  });
  if (lines.some((l) => !l)) {
    return Response.json({ ok: false, error: "One of the items is no longer available." }, { status: 400 });
  }

  for (const line of lines) {
    const product = catalog.find((p) => p.id === line!.productId)!;
    if (product.stock < line!.qty) {
      return Response.json({ ok: false, error: `"${product.name}" has only ${product.stock} left.` }, { status: 409 });
    }
  }

  const subtotal = lines.reduce((sum, l) => sum + l!.unitPrice * l!.qty, 0);
  const deliveryFee = fulfilment === "delivery" ? 200 : 0;
  const total = subtotal + deliveryFee;
  const phone254 = normaliseKenyanPhone(customer.phone);
  const orderId = randomId("CAC").toUpperCase().replace(/_/g, "-");

  const stk = await initiateStkPush({
    phone254,
    amountKes: total,
    orderRef: orderId,
    description: "Caleb Animal Care shop",
  });

  const order = {
    id: orderId,
    createdAt: new Date().toISOString(),
    lines,
    subtotal,
    deliveryFee,
    total,
    customer: { name: customer.name, phone: phone254 },
    fulfilment,
    address: fulfilment === "delivery" ? address : "",
    payment: {
      method: "mpesa" as const,
      status: stk.initiated ? ("stk-pushed" as const) : ("awaiting-confirmation" as const),
      checkoutRequestId: stk.checkoutRequestId ?? null,
    },
  };
  await setJson(`order:${orderId}`, order);
  await lpush("orders:all", order);
  await lpush(`orders:user:${phone254}`, order);
  await decrementStock(items);

  await sendWhatsApp(
    phone254,
    `Caleb Animal Care order ${orderId}: ${lines.map((l) => `${l!.qty}× ${l!.name}`).join(", ")} — total ${kes(total)}. ${fulfilment === "pickup" ? "Pick up at the clinic (Kilimani)." : `Delivery to: ${address}.`} Asante!`,
  );

  return Response.json({
    ok: true,
    orderId,
    message: stk.message,
    paymentMode: stk.mode,
  });
}

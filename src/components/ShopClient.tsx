"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  CheckCircle2,
  Loader2,
  Minus,
  Plus,
  ShoppingCart,
  SmartphoneNfc,
  Trash2,
  X,
} from "lucide-react";
import type { Product } from "@/lib/types";
import { kes } from "@/lib/site";
import { cn } from "@/lib/utils";

interface CartLine {
  productId: string;
  size: string;
  qty: number;
}

const CART_KEY = "cac-cart";

export function ShopClient({ products }: { products: Product[] }) {
  const reduced = useReducedMotion();
  const [cart, setCart] = useState<CartLine[]>([]);
  const [drawer, setDrawer] = useState(false);
  const [checkout, setCheckout] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      setCart(JSON.parse(localStorage.getItem(CART_KEY) ?? "[]") as CartLine[]);
    } catch {
      setCart([]);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart, hydrated]);

  const count = cart.reduce((n, l) => n + l.qty, 0);

  function add(productId: string, size: string) {
    setCart((prev) => {
      const i = prev.findIndex((l) => l.productId === productId && l.size === size);
      if (i >= 0) {
        const next = [...prev];
        next[i] = { ...next[i], qty: next[i].qty + 1 };
        return next;
      }
      return [...prev, { productId, size, qty: 1 }];
    });
    setDrawer(true);
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-[13px] text-body">Vet-approved supplies — delivery within Nairobi or clinic pickup.</p>
        <button
          type="button"
          onClick={() => setDrawer(true)}
          className="relative grid h-12 w-12 place-items-center rounded-full bg-brand text-white shadow-card transition-transform duration-300 hover:scale-105"
          aria-label={`Open cart, ${count} items`}
        >
          <ShoppingCart size={20} aria-hidden />
          {count > 0 && (
            <span className="absolute -right-1 -top-1 grid h-6 w-6 place-items-center rounded-full bg-emergency text-[11px] font-bold">
              {count}
            </span>
          )}
        </button>
      </div>

      <motion.ul
        className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        initial={reduced ? false : "hidden"}
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
      >
        {products.map((product) => (
          <motion.li
            key={product.id}
            variants={{
              hidden: { opacity: 0, y: 24 },
              show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
            }}
          >
            <ProductCard product={product} onAdd={add} />
          </motion.li>
        ))}
      </motion.ul>

      <CartDrawer
        open={drawer}
        onClose={() => setDrawer(false)}
        cart={cart}
        setCart={setCart}
        products={products}
        onCheckout={() => {
          setDrawer(false);
          setCheckout(true);
        }}
      />
      <CheckoutModal
        open={checkout}
        onClose={() => setCheckout(false)}
        cart={cart}
        clearCart={() => setCart([])}
        products={products}
      />
    </>
  );
}

function ProductCard({ product, onAdd }: { product: Product; onAdd: (id: string, size: string) => void }) {
  const [size, setSize] = useState(product.sizes[0]);
  return (
    <article className="card-service flex h-full flex-col overflow-hidden border border-transparent hover:border-pine">
      <div className="relative h-44 overflow-hidden bg-mist">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-[250ms] ease-brand hover:scale-[1.04]"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold uppercase tracking-[1px] text-pine">
          {product.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-[15px] font-bold leading-snug">{product.name}</h3>
        <p className="mt-1 flex-1 text-[13px] text-body">{product.description}</p>
        <div className="mt-3 flex flex-wrap gap-1.5" role="radiogroup" aria-label={`${product.name} size`}>
          {product.sizes.map((s) => (
            <button
              key={s}
              type="button"
              role="radio"
              aria-checked={size === s}
              onClick={() => setSize(s)}
              className={cn(
                "min-h-[32px] rounded-full border px-3 text-[11px] font-bold transition-all duration-300",
                size === s ? "border-pine bg-pine text-white" : "border-line text-body hover:border-pine",
              )}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between gap-2">
          <p className="text-[16px] font-extrabold text-heading">{kes(product.price)}</p>
          <button
            type="button"
            onClick={() => onAdd(product.id, size)}
            className="btn-primary !min-h-[44px] !px-4"
            disabled={product.stock === 0}
          >
            <ShoppingCart size={14} aria-hidden /> {product.stock === 0 ? "Sold out" : "Add to Cart"}
          </button>
        </div>
      </div>
    </article>
  );
}

function CartDrawer({
  open, onClose, cart, setCart, products, onCheckout,
}: {
  open: boolean;
  onClose: () => void;
  cart: CartLine[];
  setCart: (c: CartLine[]) => void;
  products: Product[];
  onCheckout: () => void;
}) {
  const lines = cart
    .map((l) => ({ ...l, product: products.find((p) => p.id === l.productId)! }))
    .filter((l) => l.product);
  const subtotal = lines.reduce((sum, l) => sum + l.product.price * l.qty, 0);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[140] bg-navy/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.aside
            className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-lift"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            aria-label="Shopping cart"
          >
            <div className="flex items-center justify-between border-b border-line p-5">
              <h2 className="text-[17px] font-extrabold">Your cart</h2>
              <button type="button" onClick={onClose} aria-label="Close cart" className="grid h-11 w-11 place-items-center rounded-brand hover:bg-mist">
                <X size={20} aria-hidden />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              {lines.length === 0 && <p className="text-center text-[14px] text-body">Your cart is empty — add something for your animal.</p>}
              <ul className="space-y-4">
                {lines.map((line) => (
                  <li key={`${line.productId}-${line.size}`} className="flex gap-3 rounded-brand border border-line p-3">
                    <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-brand bg-mist">
                      <Image src={line.product.image} alt="" fill sizes="64px" className="object-cover" />
                    </span>
                    <div className="flex-1">
                      <p className="text-[13px] font-bold leading-tight">{line.product.name}</p>
                      <p className="meta !normal-case">{line.size} • {kes(line.product.price)}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <QtyButton label="Decrease" onClick={() => setCart(cart.map((c) => c === line ? { ...c, qty: Math.max(0, c.qty - 1) } : c).filter((c) => c.qty > 0))}>
                          <Minus size={13} aria-hidden />
                        </QtyButton>
                        <span className="min-w-7 text-center text-[13px] font-bold">{line.qty}</span>
                        <QtyButton label="Increase" onClick={() => setCart(cart.map((c) => c === line ? { ...c, qty: c.qty + 1 } : c))}>
                          <Plus size={13} aria-hidden />
                        </QtyButton>
                        <button
                          type="button"
                          aria-label={`Remove ${line.product.name}`}
                          className="ml-auto grid h-9 w-9 place-items-center rounded-brand text-emergency hover:bg-emergency/10"
                          onClick={() => setCart(cart.filter((c) => c !== line))}
                        >
                          <Trash2 size={15} aria-hidden />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-t border-line p-5">
              <p className="flex justify-between text-[15px] font-bold text-heading">
                <span>Subtotal</span>
                <span>{kes(subtotal)}</span>
              </p>
              <p className="meta mt-1 !normal-case">Delivery within Nairobi: KES 200 • Clinic pickup: free</p>
              <button type="button" disabled={lines.length === 0} onClick={onCheckout} className="btn-primary mt-4 w-full justify-center disabled:opacity-50">
                Checkout with M-Pesa
              </button>
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function QtyButton({ children, onClick, label }: { children: React.ReactNode; onClick: () => void; label: string }) {
  return (
    <button type="button" aria-label={label} onClick={onClick} className="grid h-9 w-9 place-items-center rounded-brand border border-line hover:border-pine">
      {children}
    </button>
  );
}

function CheckoutModal({
  open, onClose, cart, clearCart, products,
}: {
  open: boolean;
  onClose: () => void;
  cart: CartLine[];
  clearCart: () => void;
  products: Product[];
}) {
  const [form, setForm] = useState({ name: "", phone: "", fulfilment: "pickup", address: "" });
  const [status, setStatus] = useState<"idle" | "busy" | "done" | "error">("idle");
  const [result, setResult] = useState<{ orderId: string; message: string } | null>(null);

  const lines = useMemo(
    () => cart.map((l) => ({ ...l, product: products.find((p) => p.id === l.productId)! })).filter((l) => l.product),
    [cart, products],
  );
  const subtotal = lines.reduce((s, l) => s + l.product.price * l.qty, 0);
  const deliveryFee = form.fulfilment === "delivery" ? 200 : 0;

  async function placeOrder() {
    setStatus("busy");
    try {
      const res = await fetch("/api/shop/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart,
          customer: { name: form.name, phone: form.phone },
          fulfilment: form.fulfilment,
          address: form.fulfilment === "delivery" ? form.address : "",
        }),
      });
      const data = (await res.json()) as { ok: boolean; orderId?: string; message?: string; error?: string };
      if (data.ok) {
        setStatus("done");
        setResult({ orderId: data.orderId!, message: data.message! });
        clearCart();
      } else {
        setStatus("error");
        setResult(null);
      }
    } catch {
      setStatus("error");
      setResult(null);
    }
  }

  const valid = form.name.trim() && /^\+?\d[\d\s-]{8,}$/.test(form.phone.trim()) && (form.fulfilment === "pickup" || form.address.trim());

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[150] grid place-items-center overflow-y-auto bg-navy/50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-md rounded-brand bg-white p-6 shadow-lift"
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Checkout"
          >
            {status === "done" && result ? (
              <div className="text-center">
                <span className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-pine/10 text-pine">
                  <CheckCircle2 size={30} aria-hidden />
                </span>
                <h2 className="text-[19px] font-extrabold">Order received</h2>
                <p className="mt-2 text-[14px] text-body">{result.message}</p>
                <p className="mt-3 rounded-brand bg-mist p-3 text-[13px] font-bold text-heading">Order ref: {result.orderId}</p>
                <button type="button" onClick={onClose} className="btn-primary mt-5 w-full justify-center">Done</button>
              </div>
            ) : (
              <>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="flex items-center gap-2 text-[19px] font-extrabold">
                    <SmartphoneNfc size={20} className="text-pine" aria-hidden /> M-Pesa checkout
                  </h2>
                  <button type="button" onClick={onClose} aria-label="Close checkout" className="grid h-11 w-11 place-items-center rounded-brand hover:bg-mist">
                    <X size={19} aria-hidden />
                  </button>
                </div>
                <div className="space-y-3">
                  <input className="field min-h-[48px]" placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  <input className="field min-h-[48px]" placeholder="M-Pesa phone (e.g. 0712 345 678)" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                  <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Fulfilment">
                    {[
                      { id: "pickup", label: "Clinic pickup (free)" },
                      { id: "delivery", label: "Delivery (+KES 200)" },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        role="radio"
                        aria-checked={form.fulfilment === opt.id}
                        onClick={() => setForm({ ...form, fulfilment: opt.id })}
                        className={cn(
                          "min-h-[48px] rounded-brand border px-3 text-[12px] font-bold transition-all duration-300",
                          form.fulfilment === opt.id ? "border-pine bg-pine text-white" : "border-line hover:border-pine",
                        )}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  {form.fulfilment === "delivery" && (
                    <input className="field min-h-[48px]" placeholder="Delivery address & landmark" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
                  )}
                </div>
                <div className="mt-4 space-y-1 rounded-brand bg-mist p-4 text-[13px]">
                  <p className="flex justify-between"><span>Items</span><strong>{kes(subtotal)}</strong></p>
                  <p className="flex justify-between"><span>{form.fulfilment === "delivery" ? "Delivery" : "Pickup"}</span><strong>{deliveryFee ? kes(deliveryFee) : "Free"}</strong></p>
                  <p className="flex justify-between border-t border-line pt-1 text-[15px] font-extrabold text-heading">
                    <span>Total</span><span>{kes(subtotal + deliveryFee)}</span>
                  </p>
                </div>
                {status === "error" && (
                  <p className="mt-3 rounded-brand border border-emergency/40 bg-emergency/5 p-3 text-[13px] font-medium text-emergency">
                    Couldn&apos;t place the order. Please try again or call us.
                  </p>
                )}
                <button type="button" disabled={!valid || status === "busy"} onClick={placeOrder} className="btn-primary mt-4 w-full justify-center disabled:opacity-50">
                  {status === "busy" ? <Loader2 size={15} className="animate-spin" aria-hidden /> : <SmartphoneNfc size={15} aria-hidden />}
                  Pay {kes(subtotal + deliveryFee)} with M-Pesa
                </button>
                <p className="meta mt-2 !normal-case">You&apos;ll receive an STK push prompt — enter your M-Pesa PIN to confirm.</p>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

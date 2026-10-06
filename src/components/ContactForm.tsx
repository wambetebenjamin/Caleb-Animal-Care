"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { useRecaptcha, ReCaptchaV2 } from "./RecaptchaProvider";
import { cn } from "@/lib/utils";

export function ContactForm() {
  const { execute } = useRecaptcha();
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "General enquiry", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "busy" | "done" | "error">("idle");
  const [needV2, setNeedV2] = useState(false);
  const [note, setNote] = useState("");

  const set = (k: keyof typeof form, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: "" }));
  };

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Your name is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email.";
    if (form.message.trim().length < 10) e.message = "Give us a little more detail.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function submit(tokenOverride?: string) {
    if (!validate()) return;
    setStatus("busy");
    const token = tokenOverride ?? (await execute("contact"));
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, token }),
      });
      const data = (await res.json()) as { ok: boolean; code?: string; error?: string };
      if (data.ok) {
        setStatus("done");
      } else if (data.code === "RECAPTCHA_V2_REQUIRED" && !needV2) {
        setNeedV2(true);
        setStatus("idle");
      } else {
        setStatus("error");
        setNote(data.error ?? "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setNote("Network hiccup. Please try again.");
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-brand border border-pine/30 bg-white p-8 text-center shadow-card">
        <span className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-pine/10 text-pine">
          <CheckCircle2 size={34} aria-hidden />
        </span>
        <h2 className="text-[22px] font-extrabold">Message received</h2>
        <p className="mt-2 text-[14px] text-body">A vet or our reception team will reply within one working day.</p>
      </div>
    );
  }

  return (
    <form
      className="rounded-brand bg-white p-5 shadow-card sm:p-7"
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <h2 className="text-[18px] font-extrabold">General enquiry</h2>
      <p className="mb-5 text-[13px] text-body">Questions about a service, pricing or a stray animal? Write to us.</p>
      <div className="grid gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <CField id="cf-name" label="Name" value={form.name} onChange={(v) => set("name", v)} error={errors.name} />
          <CField id="cf-email" label="Email" type="email" value={form.email} onChange={(v) => set("email", v)} error={errors.email} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <CField id="cf-phone" label="Phone (optional)" value={form.phone} onChange={(v) => set("phone", v)} />
          <div>
            <label className="field-label" htmlFor="cf-subject">Subject</label>
            <select id="cf-subject" className="field min-h-[48px]" value={form.subject} onChange={(e) => set("subject", e.target.value)}>
              <option>General enquiry</option>
              <option>Service & pricing question</option>
              <option>Stray / welfare case</option>
              <option>Conservancy partnership</option>
              <option>Feedback</option>
            </select>
          </div>
        </div>
        <div>
          <label className="field-label" htmlFor="cf-message">Message</label>
          <textarea
            id="cf-message"
            rows={4}
            className={cn("field", errors.message && "border-emergency")}
            value={form.message}
            onChange={(e) => set("message", e.target.value)}
          />
          {errors.message && <p className="mt-1 text-[12px] font-medium text-emergency">{errors.message}</p>}
        </div>
      </div>
      {needV2 && <div className="mt-4"><ReCaptchaV2 onToken={(t) => submit(`v2:${t}`)} /></div>}
      {status === "error" && (
        <p className="mt-4 rounded-brand border border-emergency/40 bg-emergency/5 p-3 text-[13px] font-medium text-emergency">{note}</p>
      )}
      <button type="submit" disabled={status === "busy"} className="btn-primary mt-5 w-full justify-center disabled:opacity-60">
        {status === "busy" ? <Loader2 size={15} className="animate-spin" aria-hidden /> : <Send size={14} aria-hidden />}
        Send Enquiry
      </button>
      <p className="meta mt-3 !normal-case">Protected by reCAPTCHA.</p>
    </form>
  );
}

function CField({
  id, label, value, onChange, error, type = "text",
}: {
  id: string; label: string; value: string; onChange: (v: string) => void;
  error?: string; type?: string;
}) {
  return (
    <div>
      <label className="field-label" htmlFor={id}>{label}</label>
      <input
        id={id}
        type={type}
        className={cn("field min-h-[48px]", error && "border-emergency")}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={Boolean(error)}
      />
      {error && <p className="mt-1 text-[12px] font-medium text-emergency">{error}</p>}
    </div>
  );
}

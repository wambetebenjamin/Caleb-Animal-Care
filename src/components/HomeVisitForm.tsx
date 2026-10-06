"use client";

import { useState } from "react";
import { CheckCircle2, Home, Loader2 } from "lucide-react";
import { useRecaptcha, ReCaptchaV2 } from "./RecaptchaProvider";
import { cn } from "@/lib/utils";

const ANIMAL_TYPES = ["Dog", "Cat", "Bird", "Rabbit", "Reptile", "Cattle", "Goat", "Sheep", "Pig", "Poultry", "Horse", "Other"];
const NAIROBI_AREAS = ["Kilimani", "Lavington", "Kileleshwa", "Westlands", "Karen", "Langata", "Runda", "Gigiri", "Rongai", "Ngong Road", "Upper Hill", "South B", "Embakasi", "Kasarani", "Ruaka (Kiambu)", "Kitengela (Kajiado)", "Athi River (Machakos)", "Other / share pin"];

export function HomeVisitForm() {
  const { execute } = useRecaptcha();
  const [form, setForm] = useState({
    owner: "",
    phone: "",
    email: "",
    location: "",
    landmark: "",
    animalType: "Dog",
    concern: "",
    date: "",
    time: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "busy" | "done" | "error">("idle");
  const [needV2, setNeedV2] = useState(false);
  const [note, setNote] = useState("");
  const minDate = new Date().toISOString().slice(0, 10);

  const set = (key: keyof typeof form, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: "" }));
  };

  function validate() {
    const e: Record<string, string> = {};
    if (!form.owner.trim()) e.owner = "Your name is required.";
    if (!/^\+?\d[\d\s-]{8,}$/.test(form.phone.trim())) e.phone = "Enter a valid phone number.";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email.";
    if (!form.location) e.location = "Choose your area (or share a pin below).";
    if (form.concern.trim().length < 10) e.concern = "Tell us a little more so the vet arrives prepared.";
    if (!form.date) e.date = "Pick a preferred date.";
    if (!form.time) e.time = "Pick a preferred time.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function submit(tokenOverride?: string) {
    if (!validate()) return;
    setStatus("busy");
    const token = tokenOverride ?? (await execute("home_visit"));
    try {
      const res = await fetch("/api/home-visit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, token }),
      });
      const data = (await res.json()) as { ok: boolean; code?: string; error?: string; whatsappPreview?: string };
      if (data.ok) {
        setStatus("done");
        setNote(data.whatsappPreview ?? "");
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
        <h2 className="text-[22px] font-extrabold">Home visit requested</h2>
        <p className="mx-auto mt-2 max-w-md text-[14px] text-body">
          Our mobile unit coordinator will confirm your visit on WhatsApp shortly. For urgent cases
          call <a href="tel:+254112272061" className="font-bold text-emergency">+254 112 272 061</a> — open 24 hours.
        </p>
        {note && (
          <a href={note} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-[12px] text-pine underline">
            Demo: view the WhatsApp notification →
          </a>
        )}
      </div>
    );
  }

  return (
    <form
      className="rounded-brand bg-white p-5 shadow-card sm:p-8"
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <div className="mb-5 flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-full bg-brand text-white">
          <Home size={20} aria-hidden />
        </span>
        <div>
          <h2 className="text-[18px] font-extrabold">Request a mobile vet visit</h2>
          <p className="text-[13px] text-body">We confirm every request on WhatsApp before dispatch.</p>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <VField id="hv-owner" label="Owner name" value={form.owner} onChange={(v) => set("owner", v)} error={errors.owner} />
        <VField id="hv-phone" label="Phone (WhatsApp)" value={form.phone} onChange={(v) => set("phone", v)} error={errors.phone} placeholder="07xx xxx xxx" />
        <VField id="hv-email" label="Email (optional)" type="email" value={form.email} onChange={(v) => set("email", v)} error={errors.email} />
        <div>
          <label className="field-label" htmlFor="hv-location">Location in Nairobi</label>
          <select id="hv-location" className={cn("field min-h-[48px]", errors.location && "border-emergency")} value={form.location} onChange={(e) => set("location", e.target.value)}>
            <option value="">Choose area…</option>
            {NAIROBI_AREAS.map((a) => <option key={a}>{a}</option>)}
          </select>
          {errors.location && <Err msg={errors.location} />}
        </div>
        <VField id="hv-landmark" label="Nearest landmark / pin notes (optional)" value={form.landmark} onChange={(v) => set("landmark", v)} placeholder="e.g. Opp. Yaya Centre, green gate" />
        <div>
          <label className="field-label" htmlFor="hv-animal">Animal type</label>
          <select id="hv-animal" className="field min-h-[48px]" value={form.animalType} onChange={(e) => set("animalType", e.target.value)}>
            {ANIMAL_TYPES.map((a) => <option key={a}>{a}</option>)}
          </select>
        </div>
        <VField id="hv-date" label="Preferred date" type="date" min={minDate} value={form.date} onChange={(v) => set("date", v)} error={errors.date} />
        <div>
          <label className="field-label" htmlFor="hv-time">Preferred time</label>
          <select id="hv-time" className={cn("field min-h-[48px]", errors.time && "border-emergency")} value={form.time} onChange={(e) => set("time", e.target.value)}>
            <option value="">Choose…</option>
            <option>Morning (8am–12pm)</option>
            <option>Afternoon (12pm–4pm)</option>
            <option>Evening (4pm–7pm)</option>
          </select>
          {errors.time && <Err msg={errors.time} />}
        </div>
        <div className="sm:col-span-2">
          <label className="field-label" htmlFor="hv-concern">What&apos;s the concern?</label>
          <textarea
            id="hv-concern"
            rows={4}
            className={cn("field", errors.concern && "border-emergency")}
            placeholder="Symptoms, how long it's been going on, any treatment given so far…"
            value={form.concern}
            onChange={(e) => set("concern", e.target.value)}
          />
          {errors.concern && <Err msg={errors.concern} />}
        </div>
      </div>

      {needV2 && <div className="mt-4"><ReCaptchaV2 onToken={(t) => submit(`v2:${t}`)} /></div>}
      {status === "error" && (
        <p className="mt-4 rounded-brand border border-emergency/40 bg-emergency/5 p-3 text-[13px] font-medium text-emergency">{note}</p>
      )}
      <button type="submit" disabled={status === "busy"} className="btn-primary mt-6 w-full justify-center disabled:opacity-60">
        {status === "busy" ? <Loader2 size={15} className="animate-spin" aria-hidden /> : <Home size={15} aria-hidden />}
        {status === "busy" ? "Sending request…" : "Request Home Visit"}
      </button>
      <p className="meta mt-3 !normal-case">Protected by reCAPTCHA. No charge until the visit is confirmed.</p>
    </form>
  );
}

function VField({
  id, label, value, onChange, error, placeholder, type = "text", min,
}: {
  id: string; label: string; value: string; onChange: (v: string) => void;
  error?: string; placeholder?: string; type?: string; min?: string;
}) {
  return (
    <div>
      <label className="field-label" htmlFor={id}>{label}</label>
      <input
        id={id}
        type={type}
        min={min}
        className={cn("field min-h-[48px]", error && "border-emergency")}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={Boolean(error)}
      />
      {error && <Err msg={error} />}
    </div>
  );
}

function Err({ msg }: { msg: string }) {
  return <p className="mt-1 text-[12px] font-medium text-emergency">{msg}</p>;
}

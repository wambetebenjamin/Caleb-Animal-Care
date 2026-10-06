"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  CalendarCheck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  FileText,
  Loader2,
  Stethoscope,
  Upload,
} from "lucide-react";
import { services, vets } from "@/lib/data";
import { useRecaptcha, ReCaptchaV2 } from "./RecaptchaProvider";
import type { Slot } from "@/lib/types";
import { cn, formatDate, randomId } from "@/lib/utils";
import { kes } from "@/lib/site";

/** 4-step booking: service → vet/date/time (live /api/availability) →
 *  animal details (records upload) → owner + confirmation.
 *  Steps slide right→left, 300ms ease-out, no layout shift. */

const STEPS = ["Service", "Vet & Time", "Animal", "Confirm"] as const;

interface FormState {
  serviceSlug: string;
  vetSlug: string;
  date: string;
  time: string;
  petName: string;
  species: string;
  breed: string;
  age: string;
  weight: string;
  history: string;
  ownerName: string;
  phone: string;
  email: string;
  address: string;
}

const SPECIES = ["Dog", "Cat", "Bird", "Rabbit", "Reptile", "Cattle", "Goat", "Sheep", "Pig", "Poultry", "Other"];

export function BookingForm() {
  const params = useSearchParams();
  const reduced = useReducedMotion();
  const { execute } = useRecaptcha();
  const minDate = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [form, setForm] = useState<FormState>({
    serviceSlug: params.get("service") ?? "",
    vetSlug: params.get("vet") ?? "",
    date: "",
    time: "",
    petName: params.get("pet") ?? "",
    species: "Dog",
    breed: "",
    age: "",
    weight: "",
    history: "",
    ownerName: "",
    phone: "",
    email: "",
    address: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [slots, setSlots] = useState<Slot[] | null>(null);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [recordsFile, setRecordsFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "busy" | "done" | "error">("idle");
  const [needV2, setNeedV2] = useState(false);
  const [serverNote, setServerNote] = useState("");

  // Live availability when vet + date are known (step 2)
  useEffect(() => {
    if (!form.date) {
      setSlots(null);
      return;
    }
    let live = true;
    setSlotsLoading(true);
    fetch(`/api/availability?date=${form.date}${form.vetSlug ? `&vet=${form.vetSlug}` : ""}`)
      .then((r) => r.json())
      .then((data: { slots: Slot[] }) => {
        if (live) setSlots(data.slots);
      })
      .catch(() => live && setSlots([]))
      .finally(() => live && setSlotsLoading(false));
    return () => {
      live = false;
    };
  }, [form.date, form.vetSlug]);

  const set = useCallback(<K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value, ...(key === "time" ? {} : key === "date" || key === "vetSlug" ? { time: "" } : {}) }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }, []);

  function validateStep(target: number): boolean {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (target >= 1 && !form.serviceSlug) next.serviceSlug = "Choose a service to continue.";
    if (target >= 2) {
      if (!form.vetSlug) next.vetSlug = "Choose a veterinarian.";
      if (!form.date) next.date = "Pick a date.";
      if (!form.time) next.time = "Pick a time slot.";
    }
    if (target >= 3) {
      if (!form.petName.trim()) next.petName = "Your animal's name is required.";
      if (!form.species) next.species = "Required.";
      if (!form.age.trim()) next.age = "Approximate age helps the vet prepare.";
    }
    if (target >= 4) {
      if (!form.ownerName.trim()) next.ownerName = "Your name is required.";
      if (!/^\+?\d[\d\s-]{8,}$/.test(form.phone.trim())) next.phone = "Enter a valid phone number.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = "Enter a valid email.";
      if (!form.address.trim()) next.address = "Helps us route the mobile unit if needed.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function go(to: number) {
    if (to > step && !validateStep(step + 1)) return;
    setDirection(to > step ? 1 : -1);
    setStep(to);
  }

  async function submit(tokenOverride?: string) {
    if (!validateStep(4)) {
      go(3);
      return;
    }
    setStatus("busy");
    const token = tokenOverride ?? (await execute("appointment"));
    const payload = new FormData();
    Object.entries(form).forEach(([k, v]) => payload.append(k, v));
    payload.append("token", token);
    if (recordsFile) payload.append("records", recordsFile);
    try {
      const res = await fetch("/api/appointment", { method: "POST", body: payload });
      const data = (await res.json()) as { ok: boolean; code?: string; error?: string; whatsappPreview?: string };
      if (data.ok) {
        setStatus("done");
        setNeedV2(false);
        setServerNote(data.whatsappPreview ?? "");
      } else if (data.code === "RECAPTCHA_V2_REQUIRED" && !needV2) {
        setNeedV2(true);
        setStatus("idle");
      } else {
        setStatus("error");
        setServerNote(data.error ?? "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setServerNote("Network hiccup. Please try again.");
    }
  }

  const chosenVet = vets.find((v) => v.slug === form.vetSlug);
  const chosenService = services.find((s) => s.slug === form.serviceSlug);

  if (status === "done") {
    return (
      <div className="rounded-brand border border-pine/30 bg-white p-8 text-center shadow-card">
        <span className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-pine/10 text-pine">
          <CheckCircle2 size={34} aria-hidden />
        </span>
        <h2 className="text-[22px] font-extrabold">Appointment confirmed</h2>
        <p className="mx-auto mt-2 max-w-md text-[14px] text-body">
          {chosenService?.name} for <strong className="text-heading">{form.petName}</strong> with{" "}
          {chosenVet?.name} on <strong className="text-heading">{formatDate(form.date)}</strong> at{" "}
          <strong className="text-heading">{form.time}</strong>. A WhatsApp and email confirmation is
          on its way to {form.phone}.
        </p>
        {serverNote && (
          <p className="mt-3 text-[12px] text-body">
            Demo preview:{" "}
            <a href={serverNote} target="_blank" rel="noopener noreferrer" className="text-pine underline">
              open WhatsApp confirmation
            </a>
          </p>
        )}
        <a href={`tel:+254112272061`} className="btn-outline mt-6 inline-flex">Call us if anything changes</a>
      </div>
    );
  }

  return (
    <div className="rounded-brand bg-white p-5 shadow-card sm:p-8">
      {/* Stepper */}
      <ol className="mb-8 flex items-center gap-2" aria-label="Booking progress">
        {STEPS.map((label, i) => (
          <li key={label} className="flex flex-1 items-center gap-2">
            <span
              className={cn(
                "grid h-8 w-8 shrink-0 place-items-center rounded-full text-[12px] font-bold transition-colors duration-300",
                i < step && "bg-pine text-white",
                i === step && "bg-brand text-white",
                i > step && "bg-fog text-body",
              )}
              aria-current={i === step ? "step" : undefined}
            >
              {i < step ? <CheckCircle2 size={15} aria-hidden /> : i + 1}
            </span>
            <span className={cn("hidden text-[12px] font-bold uppercase tracking-[1px] sm:block", i === step ? "text-heading" : "text-body/70")}>
              {label}
            </span>
            {i < STEPS.length - 1 && <span className="h-px flex-1 bg-line" aria-hidden />}
          </li>
        ))}
      </ol>

      <div className="min-h-[380px]">
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={step}
            custom={direction}
            initial={reduced ? { opacity: 0 } : { opacity: 0, x: 48 * direction }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, x: -48 * direction }}
            transition={{ duration: 0.3, ease: "easeOut" /* brief: slide 300ms ease-out */ }}
          >
            {step === 0 && (
              <fieldset>
                <legend className="mb-4 flex items-center gap-2 text-[17px] font-bold">
                  <Stethoscope size={18} className="text-pine" aria-hidden /> Select a service category
                </legend>
                <div className="grid gap-3 sm:grid-cols-2">
                  {services.map((s) => (
                    <label
                      key={s.slug}
                      className={cn(
                        "flex min-h-[56px] cursor-pointer items-start gap-3 rounded-brand border p-4 transition-all duration-300",
                        form.serviceSlug === s.slug ? "border-pine bg-pine/5 shadow-card" : "border-line hover:border-pine/60",
                      )}
                    >
                      <input
                        type="radio"
                        name="service"
                        className="mt-1 accent-[#00bd56]"
                        checked={form.serviceSlug === s.slug}
                        onChange={() => set("serviceSlug", s.slug)}
                      />
                      <span>
                        <span className="block text-[14px] font-bold text-heading">{s.name}</span>
                        <span className="meta !normal-case">from {kes(s.priceFrom)}</span>
                      </span>
                    </label>
                  ))}
                </div>
                {errors.serviceSlug && <FieldError message={errors.serviceSlug} />}
              </fieldset>
            )}

            {step === 1 && (
              <fieldset>
                <legend className="mb-4 flex items-center gap-2 text-[17px] font-bold">
                  <CalendarCheck size={18} className="text-pine" aria-hidden /> Preferred vet, date and slot
                </legend>
                <div className="grid gap-5">
                  <div>
                    <label className="field-label" htmlFor="vet">Veterinarian</label>
                    <select
                      id="vet"
                      className="field min-h-[48px]"
                      value={form.vetSlug}
                      onChange={(e) => set("vetSlug", e.target.value)}
                    >
                      <option value="">Any available vet — or choose one</option>
                      {vets.map((v) => (
                        <option key={v.slug} value={v.slug}>
                          {v.name} — {v.specialisation}
                        </option>
                      ))}
                    </select>
                    {errors.vetSlug && <FieldError message={errors.vetSlug} />}
                  </div>
                  <div>
                    <label className="field-label" htmlFor="date">Preferred date</label>
                    <input
                      id="date"
                      type="date"
                      min={minDate}
                      className="field min-h-[48px]"
                      value={form.date}
                      onChange={(e) => set("date", e.target.value)}
                    />
                    {errors.date && <FieldError message={errors.date} />}
                  </div>
                  <div>
                    <span className="field-label">Available slots {form.date && `— ${formatDate(form.date)}`}</span>
                    {!form.date && <p className="text-[13px] text-body">Pick a date to load live availability.</p>}
                    {form.date && slotsLoading && (
                      <p className="flex items-center gap-2 text-[13px] text-body">
                        <Loader2 size={15} className="animate-spin" aria-hidden /> Checking the diary…
                      </p>
                    )}
                    {form.date && slots && slots.length === 0 && !slotsLoading && (
                      <p className="text-[13px] text-body">
                        No bookable slots that day (Sundays are emergencies only). Try another date or call{" "}
                        <a href="tel:+254112272061" className="font-bold text-pine">+254 112 272 061</a>.
                      </p>
                    )}
                    {slots && slots.length > 0 && (
                      <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
                        {slots.map((slot) => (
                          <li key={slot.time}>
                            <button
                              type="button"
                              disabled={slot.taken}
                              onClick={() => set("time", slot.time)}
                              className={cn(
                                "min-h-[48px] w-full rounded-brand border text-[13px] font-bold transition-all duration-300",
                                form.time === slot.time
                                  ? "border-pine bg-pine text-white"
                                  : slot.taken
                                    ? "cursor-not-allowed border-line bg-mist text-body/40 line-through"
                                    : "border-line hover:border-pine hover:text-pine",
                              )}
                              aria-pressed={form.time === slot.time}
                            >
                              {slot.time}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                    {errors.time && <FieldError message={errors.time} />}
                  </div>
                </div>
              </fieldset>
            )}

            {step === 2 && (
              <fieldset>
                <legend className="mb-4 flex items-center gap-2 text-[17px] font-bold">
                  <FileText size={18} className="text-pine" aria-hidden /> Pet / animal details
                </legend>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field id="petName" label="Pet / animal name" value={form.petName} onChange={(v) => set("petName", v)} error={errors.petName} placeholder="e.g. Simba" />
                  <div>
                    <label className="field-label" htmlFor="species">Species</label>
                    <select id="species" className="field min-h-[48px]" value={form.species} onChange={(e) => set("species", e.target.value)}>
                      {SPECIES.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <Field id="breed" label="Breed" value={form.breed} onChange={(v) => set("breed", v)} placeholder="e.g. Boer goat" />
                  <Field id="age" label="Age" value={form.age} onChange={(v) => set("age", v)} placeholder="e.g. 3 years" error={errors.age} />
                  <Field id="weight" label="Weight (kg, approx.)" value={form.weight} onChange={(v) => set("weight", v)} placeholder="e.g. 12" />
                  <div>
                    <label className="field-label" htmlFor="records">Upload previous vet records (optional)</label>
                    <label
                      htmlFor="records"
                      className="flex min-h-[48px] cursor-pointer items-center gap-3 rounded-brand border border-dashed border-line px-4 py-3 text-[13px] font-medium text-body transition-colors duration-300 hover:border-pine"
                    >
                      <Upload size={16} className="text-pine" aria-hidden />
                      {recordsFile ? recordsFile.name : "PDF or photo, up to 5 MB"}
                    </label>
                    <input
                      id="records"
                      type="file"
                      accept=".pdf,image/*"
                      className="sr-only"
                      onChange={(e) => setRecordsFile(e.target.files?.[0] ?? null)}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="field-label" htmlFor="history">Medical history notes</label>
                    <textarea
                      id="history"
                      rows={3}
                      className="field"
                      placeholder="Past illnesses, allergies, current medication, symptoms you've noticed…"
                      value={form.history}
                      onChange={(e) => set("history", e.target.value)}
                    />
                  </div>
                </div>
              </fieldset>
            )}

            {step === 3 && (
              <fieldset>
                <legend className="mb-4 text-[17px] font-bold">Owner details & confirmation</legend>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field id="ownerName" label="Your full name" value={form.ownerName} onChange={(v) => set("ownerName", v)} error={errors.ownerName} placeholder="e.g. Achieng Otieno" />
                  <Field id="phone" label="Phone (WhatsApp preferred)" value={form.phone} onChange={(v) => set("phone", v)} error={errors.phone} placeholder="07xx xxx xxx" />
                  <Field id="email" label="Email" type="email" value={form.email} onChange={(v) => set("email", v)} error={errors.email} placeholder="you@example.co.ke" />
                  <Field id="address" label="Address / estate" value={form.address} onChange={(v) => set("address", v)} error={errors.address} placeholder="e.g. Lavington, Kabarnet Gardens" />
                </div>
                <div className="mt-5 rounded-brand border border-line bg-mist p-4 text-[13px] text-body">
                  <p className="font-bold text-heading">Your booking</p>
                  <p className="mt-1">
                    {chosenService?.name ?? "—"} with {chosenVet?.name ?? "first available vet"}
                    {form.date ? ` on ${formatDate(form.date)}` : ""}{form.time ? ` at ${form.time}` : ""} for{" "}
                    {form.petName || "your animal"} ({form.species.toLowerCase()}).
                  </p>
                  <p className="meta mt-2 !normal-case">
                    Estimated fee: {chosenService ? `${kes(chosenService.priceFrom)} – ${kes(chosenService.priceTo)}` : "—"} •
                    Confirmation via WhatsApp & email.
                  </p>
                </div>
                {needV2 && (
                  <div className="mt-4">
                    <ReCaptchaV2 onToken={(t) => submit(`v2:${t}`)} />
                  </div>
                )}
                {status === "error" && (
                  <p className="mt-4 rounded-brand border border-emergency/40 bg-emergency/5 p-3 text-[13px] font-medium text-emergency">
                    {serverNote}
                  </p>
                )}
              </fieldset>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-6 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => go(step - 1)}
          disabled={step === 0 || status === "busy"}
          className="btn-outline disabled:invisible"
        >
          <ChevronLeft size={15} aria-hidden /> Back
        </button>
        {step < 3 ? (
          <button type="button" onClick={() => go(step + 1)} className="btn-primary">
            Continue <ChevronRight size={15} aria-hidden />
          </button>
        ) : (
          <button type="button" onClick={() => submit()} disabled={status === "busy"} className="btn-primary disabled:opacity-60">
            {status === "busy" ? <Loader2 size={15} className="animate-spin" aria-hidden /> : <CheckCircle2 size={15} aria-hidden />}
            Confirm Booking
          </button>
        )}
      </div>
      <p className="meta mt-4 !normal-case">Step {step + 1} of 4 • Protected by reCAPTCHA • Ref {randomId("CAC").toUpperCase()}</p>
    </div>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  error,
  placeholder,
  type = "text",
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="field-label" htmlFor={id}>{label}</label>
      <input
        id={id}
        type={type}
        className={cn("field min-h-[48px]", error && "border-emergency")}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={Boolean(error)}
      />
      {error && <FieldError message={error} />}
    </div>
  );
}

function FieldError({ message }: { message: string }) {
  return <p className="mt-1 text-[12px] font-medium text-emergency">{message}</p>;
}

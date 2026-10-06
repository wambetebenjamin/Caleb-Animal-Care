"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  Bell,
  Bone,
  CalendarCheck,
  Camera,
  CheckCircle2,
  Loader2,
  PawPrint,
  Plus,
  Stethoscope,
  Syringe,
  Trash2,
  TrendingUp,
} from "lucide-react";
import type { Appointment, PetProfile, Reminder } from "@/lib/types";
import { cn, formatDate } from "@/lib/utils";
import { WeightChart } from "./WeightChart";

const TABS = [
  { id: "overview", label: "Overview", Icon: PawPrint },
  { id: "vaccinations", label: "Vaccinations", Icon: Syringe },
  { id: "visits", label: "Past Visits", Icon: Stethoscope },
  { id: "medication", label: "Medication", Icon: Bell },
  { id: "weight", label: "Weight Log", Icon: TrendingUp },
] as const;

type TabId = (typeof TABS)[number]["id"];

interface Props {
  initialPets: PetProfile[];
  initialReminders: Reminder[];
  initialVisits: Appointment[];
  ownerEmail: string;
}

export function PetTracker({ initialPets, initialReminders, initialVisits, ownerEmail }: Props) {
  const [pets, setPets] = useState(initialPets);
  const [reminders, setReminders] = useState(initialReminders);
  const [activePetId, setActivePetId] = useState(initialPets[0]?.id ?? "");
  const [tab, setTab] = useState<TabId>("overview");
  const [registering, setRegistering] = useState(initialPets.length === 0);

  const pet = pets.find((p) => p.id === activePetId) ?? pets[0];

  return (
    <div className="rounded-brand bg-white p-4 shadow-card sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-[19px] font-extrabold">
          <Bone size={20} className="text-pine" aria-hidden /> My animals
        </h2>
        <button type="button" onClick={() => setRegistering(true)} className="btn-primary !min-h-[44px] !px-4">
          <Plus size={15} aria-hidden /> Register a Pet
        </button>
      </div>

      {/* Pet switcher */}
      {pets.length > 0 && (
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Choose pet">
          {pets.map((p) => (
            <button
              key={p.id}
              type="button"
              role="tab"
              aria-selected={p.id === pet?.id}
              onClick={() => setActivePetId(p.id)}
              className={cn(
                "flex min-h-[48px] shrink-0 items-center gap-2 rounded-full border px-4 text-[13px] font-bold transition-all duration-300",
                p.id === pet?.id ? "border-pine bg-pine text-white" : "border-line text-body hover:border-pine",
              )}
            >
              <span className="relative h-8 w-8 overflow-hidden rounded-full bg-fog">
                {p.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.photo} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span className="grid h-full w-full place-items-center text-pine"><PawPrint size={15} aria-hidden /></span>
                )}
              </span>
              {p.name}
            </button>
          ))}
        </div>
      )}

      {registering && (
        <RegisterPetForm
          onCancel={() => setRegistering(false)}
          onRegistered={(p) => {
            setPets((prev) => [...prev, p]);
            setActivePetId(p.id);
            setRegistering(false);
          }}
        />
      )}

      {pet && !registering && (
        <>
          {/* Tabs — horizontal scroll on mobile */}
          <div className="mt-6 flex gap-1 overflow-x-auto border-b border-line" role="tablist" aria-label="Pet health sections">
            {TABS.map(({ id, label, Icon }) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={tab === id}
                onClick={() => setTab(id)}
                className={cn(
                  "flex min-h-[48px] shrink-0 items-center gap-2 border-b-2 px-4 text-[13px] font-bold transition-colors duration-300",
                  tab === id ? "border-pine text-pine" : "border-transparent text-body hover:text-heading",
                )}
              >
                <Icon size={15} aria-hidden /> {label}
              </button>
            ))}
          </div>

          <div className="pt-6" role="tabpanel">
            {tab === "overview" && <Overview pet={pet} onDeleted={() => setPets((prev) => { const next = prev.filter((p) => p.id !== pet.id); setActivePetId(next[0]?.id ?? ""); return next; })} />}
            {tab === "vaccinations" && <Vaccinations pet={pet} onChange={(p) => setPets((prev) => prev.map((x) => (x.id === p.id ? p : x)))} />}
            {tab === "visits" && <Visits visits={initialVisits.filter((v) => v.pet.name.toLowerCase() === pet.name.toLowerCase())} />}
            {tab === "medication" && <Medication pet={pet} reminders={reminders.filter((r) => r.petName.toLowerCase() === pet.name.toLowerCase())} ownerEmail={ownerEmail} onAdded={(r) => setReminders((prev) => [...prev, r])} />}
            {tab === "weight" && <Weight pet={pet} onChange={(p) => setPets((prev) => prev.map((x) => (x.id === p.id ? p : x)))} />}
          </div>
        </>
      )}

      {pets.length === 0 && !registering && (
        <p className="rounded-brand border border-dashed border-line p-6 text-center text-[14px] text-body">
          No animals registered yet — add your first pet to unlock vaccination schedules, reminders and the weight chart.
        </p>
      )}
    </div>
  );
}

function RegisterPetForm({ onCancel, onRegistered }: { onCancel: () => void; onRegistered: (p: PetProfile) => void }) {
  const [form, setForm] = useState({ name: "", species: "Dog", breed: "", ageYears: "" });
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    if (!form.name.trim() || !form.ageYears.trim()) {
      setError("Name and age are required.");
      return;
    }
    setBusy(true);
    setError("");
    const payload = new FormData();
    payload.append("name", form.name);
    payload.append("species", form.species);
    payload.append("breed", form.breed);
    payload.append("ageYears", form.ageYears);
    if (photo) payload.append("photo", photo);
    const res = await fetch("/api/my-pets", { method: "POST", body: payload });
    const data = (await res.json()) as { ok: boolean; pet?: PetProfile; error?: string };
    setBusy(false);
    if (data.ok && data.pet) {
      onRegistered(data.pet);
    } else {
      setError(data.error ?? "Could not register the pet. Try again.");
    }
  }

  return (
    <div className="mt-5 rounded-brand border border-pine/40 bg-mist p-5">
      <h3 className="text-[16px] font-bold">Register a pet</h3>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <input className="field min-h-[48px]" placeholder="Pet name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <select className="field min-h-[48px]" value={form.species} onChange={(e) => setForm({ ...form, species: e.target.value })}>
          {["Dog", "Cat", "Bird", "Rabbit", "Reptile", "Other"].map((s) => <option key={s}>{s}</option>)}
        </select>
        <input className="field min-h-[48px]" placeholder="Breed" value={form.breed} onChange={(e) => setForm({ ...form, breed: e.target.value })} />
        <input className="field min-h-[48px]" placeholder="Age in years *" inputMode="decimal" value={form.ageYears} onChange={(e) => setForm({ ...form, ageYears: e.target.value })} />
        <label className="flex min-h-[48px] cursor-pointer items-center gap-3 rounded-brand border border-dashed border-line bg-white px-4 text-[13px] font-medium text-body hover:border-pine sm:col-span-2">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="Preview" className="h-10 w-10 rounded-full object-cover" />
          ) : (
            <Camera size={16} className="text-pine" aria-hidden />
          )}
          <span>{photo ? photo.name : "Upload a photo (optional, max 1 MB)"}</span>
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0] ?? null;
              if (file && file.size > 1024 * 1024) {
                setError("Photo must be under 1 MB.");
                return;
              }
              setError("");
              setPhoto(file);
              setPreview(file ? URL.createObjectURL(file) : "");
            }}
          />
        </label>
      </div>
      {error && <p className="mt-2 text-[12px] font-medium text-emergency">{error}</p>}
      <div className="mt-4 flex gap-3">
        <button type="button" onClick={submit} disabled={busy} className="btn-primary">
          {busy ? <Loader2 size={15} className="animate-spin" aria-hidden /> : <CheckCircle2 size={15} aria-hidden />} Save Pet
        </button>
        <button type="button" onClick={onCancel} className="btn-outline">Cancel</button>
      </div>
    </div>
  );
}

function Overview({ pet, onDeleted }: { pet: PetProfile; onDeleted: () => void }) {
  const [busy, setBusy] = useState(false);
  const nextVaccine = [...pet.vaccines].sort((a, b) => a.nextDue.localeCompare(b.nextDue))[0];
  return (
    <div className="grid gap-5 md:grid-cols-[220px_1fr]">
      <div className="relative h-52 overflow-hidden rounded-brand bg-fog md:h-full">
        {pet.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={pet.photo} alt={pet.name} className="h-full w-full object-cover" />
        ) : (
          <span className="grid h-full w-full place-items-center text-pine"><PawPrint size={52} aria-hidden /></span>
        )}
      </div>
      <div>
        <h3 className="text-[20px] font-extrabold">{pet.name}</h3>
        <p className="text-[14px] text-body">{pet.species}{pet.breed ? ` • ${pet.breed}` : ""} • {pet.ageYears} yr{Number(pet.ageYears) === 1 ? "" : "s"}</p>
        <dl className="mt-4 grid gap-2 text-[13px]">
          <div className="flex justify-between rounded-brand bg-mist px-4 py-2">
            <dt className="text-body">Next vaccination due</dt>
            <dd className="font-bold text-heading">{nextVaccine ? `${nextVaccine.name} — ${formatDate(nextVaccine.nextDue)}` : "Not set"}</dd>
          </div>
          <div className="flex justify-between rounded-brand bg-mist px-4 py-2">
            <dt className="text-body">Latest weight</dt>
            <dd className="font-bold text-heading">
              {pet.weights.length ? `${pet.weights[pet.weights.length - 1].kg} kg (${formatDate(pet.weights[pet.weights.length - 1].date)})` : "Not logged"}
            </dd>
          </div>
        </dl>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href={`/book?pet=${encodeURIComponent(pet.name)}`} className="btn-primary">
            <CalendarCheck size={15} aria-hidden /> Book a Check-up
          </Link>
          <button
            type="button"
            disabled={busy}
            onClick={async () => {
              if (!confirm(`Remove ${pet.name} from your portal?`)) return;
              setBusy(true);
              await fetch(`/api/my-pets?id=${pet.id}`, { method: "DELETE" });
              onDeleted();
            }}
            className="btn-emergency !px-4"
          >
            <Trash2 size={14} aria-hidden /> Remove
          </button>
        </div>
      </div>
    </div>
  );
}

function Vaccinations({ pet, onChange }: { pet: PetProfile; onChange: (p: PetProfile) => void }) {
  const [form, setForm] = useState({ name: "Rabies", givenAt: "", nextDue: "" });
  const [busy, setBusy] = useState(false);
  const today = new Date().toISOString().slice(0, 10);

  async function add() {
    if (!form.name || !form.nextDue) return;
    setBusy(true);
    const res = await fetch("/api/my-pets", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: pet.id, vaccine: { ...form, givenAt: form.givenAt || today } }),
    });
    const data = (await res.json()) as { ok: boolean; pet?: PetProfile };
    setBusy(false);
    if (data.ok && data.pet) onChange(data.pet);
  }

  return (
    <div>
      <ul className="space-y-3">
        {pet.vaccines.length === 0 && <li className="rounded-brand border border-dashed border-line p-4 text-[13px] text-body">No vaccines logged yet — add {pet.name}&apos;s rabies shot to start the reminder schedule.</li>}
        {pet.vaccines.map((v, i) => {
          const overdue = v.nextDue < today;
          return (
            <li key={`${v.name}-${i}`} className="flex flex-wrap items-center justify-between gap-2 rounded-brand border border-line p-4">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-fog text-pine"><Syringe size={18} aria-hidden /></span>
                <div>
                  <p className="text-[14px] font-bold">{v.name}</p>
                  <p className="meta !normal-case">Given {formatDate(v.givenAt)}</p>
                </div>
              </div>
              <span
                className={cn(
                  "rounded-full px-3 py-1.5 text-[12px] font-bold",
                  overdue ? "badge-overdue bg-emergency/10 text-emergency" : "bg-pine/10 text-pine",
                )}
              >
                {overdue ? "Overdue — was due " : "Due "} {formatDate(v.nextDue)}
              </span>
            </li>
          );
        })}
      </ul>
      <div className="mt-5 grid gap-3 rounded-brand bg-mist p-4 sm:grid-cols-4">
        <select className="field min-h-[48px]" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} aria-label="Vaccine">
          {["Rabies", "DHPP (parvo/distemper)", "FVRCP", "Kennel cough", "Leptospirosis", "Other"].map((v) => <option key={v}>{v}</option>)}
        </select>
        <input type="date" className="field min-h-[48px]" value={form.givenAt} onChange={(e) => setForm({ ...form, givenAt: e.target.value })} aria-label="Date given" />
        <input type="date" className="field min-h-[48px]" value={form.nextDue} onChange={(e) => setForm({ ...form, nextDue: e.target.value })} aria-label="Next due date" />
        <button type="button" onClick={add} disabled={busy} className="btn-primary justify-center">
          {busy ? <Loader2 size={15} className="animate-spin" aria-hidden /> : <Plus size={15} aria-hidden />} Add
        </button>
      </div>
      <p className="meta mt-2 !normal-case">We send a WhatsApp reminder before each due date.</p>
    </div>
  );
}

function Visits({ visits }: { visits: Appointment[] }) {
  if (visits.length === 0) {
    return <p className="rounded-brand border border-dashed border-line p-4 text-[13px] text-body">No recorded visits yet for this pet.</p>;
  }
  return (
    <ul className="space-y-3">
      {visits.map((v) => (
        <li key={v.id} className="flex flex-wrap items-center justify-between gap-2 rounded-brand border border-line p-4">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-fog text-azure"><Stethoscope size={18} aria-hidden /></span>
            <div>
              <p className="text-[14px] font-bold capitalize">{v.serviceSlug.replace(/-/g, " ")}</p>
              <p className="meta !normal-case">{formatDate(v.date)} at {v.time}</p>
            </div>
          </div>
          <span className="rounded-full bg-pine/10 px-3 py-1.5 text-[12px] font-bold text-pine">{v.status}</span>
        </li>
      ))}
    </ul>
  );
}

function Medication({ pet, reminders, ownerEmail, onAdded }: { pet: PetProfile; reminders: Reminder[]; ownerEmail: string; onAdded: (r: Reminder) => void }) {
  const [form, setForm] = useState({ medication: "", dosage: "", date: "", time: "08:00", phone: "" });
  const [busy, setBusy] = useState(false);
  const minDate = new Date().toISOString().slice(0, 10);

  async function add() {
    if (!form.medication || !form.date || !/^\+?\d[\d\s-]{8,}$/.test(form.phone.trim())) return;
    setBusy(true);
    const res = await fetch("/api/reminders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        petName: pet.name,
        medication: form.medication,
        dosage: form.dosage,
        remindAt: `${form.date}T${form.time}:00`,
        phone: form.phone,
        ownerEmail,
      }),
    });
    const data = (await res.json()) as { ok: boolean; reminder?: Reminder };
    setBusy(false);
    if (data.ok && data.reminder) onAdded(data.reminder);
  }

  return (
    <div>
      <ul className="space-y-3">
        {reminders.length === 0 && <li className="rounded-brand border border-dashed border-line p-4 text-[13px] text-body">No medication reminders. Set one and we&apos;ll WhatsApp you on the day.</li>}
        {reminders.map((r) => (
          <li key={r.id} className="flex flex-wrap items-center justify-between gap-2 rounded-brand border border-line p-4">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-fog text-pine"><Bell size={18} aria-hidden /></span>
              <div>
                <p className="text-[14px] font-bold">{r.medication} {r.dosage && `(${r.dosage})`}</p>
                <p className="meta !normal-case">{new Date(r.remindAt).toLocaleString("en-KE", { dateStyle: "medium", timeStyle: "short" })}</p>
              </div>
            </div>
            <span className={cn("rounded-full px-3 py-1.5 text-[12px] font-bold", r.sent ? "bg-pine/10 text-pine" : "bg-azure/10 text-azure")}>
              {r.sent ? "Sent" : "Scheduled"}
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-5 grid gap-3 rounded-brand bg-mist p-4 sm:grid-cols-2 lg:grid-cols-5">
        <input className="field min-h-[48px]" placeholder="Medication *" value={form.medication} onChange={(e) => setForm({ ...form, medication: e.target.value })} />
        <input className="field min-h-[48px]" placeholder="Dosage (e.g. 1 tab)" value={form.dosage} onChange={(e) => setForm({ ...form, dosage: e.target.value })} />
        <input type="date" min={minDate} className="field min-h-[48px]" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} aria-label="Reminder date" />
        <input type="tel" className="field min-h-[48px]" placeholder="WhatsApp number *" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <button type="button" onClick={add} disabled={busy} className="btn-primary justify-center">
          {busy ? <Loader2 size={15} className="animate-spin" aria-hidden /> : <Bell size={15} aria-hidden />} Set Reminder
        </button>
      </div>
      <p className="meta mt-2 !normal-case">The system sends a WhatsApp reminder on the set date, around 8 AM EAT.</p>
    </div>
  );
}

function Weight({ pet, onChange }: { pet: PetProfile; onChange: (p: PetProfile) => void }) {
  const [form, setForm] = useState({ kg: "", date: new Date().toISOString().slice(0, 10) });
  const [busy, setBusy] = useState(false);

  async function add() {
    const kg = Number(form.kg);
    if (!kg || kg <= 0) return;
    setBusy(true);
    const res = await fetch("/api/my-pets", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: pet.id, weight: { date: form.date, kg } }),
    });
    const data = (await res.json()) as { ok: boolean; pet?: PetProfile };
    setBusy(false);
    if (data.ok && data.pet) onChange(data.pet);
  }

  return (
    <div>
      <WeightChart data={pet.weights} />
      <div className="mt-5 grid gap-3 rounded-brand bg-mist p-4 sm:grid-cols-3">
        <input className="field min-h-[48px]" placeholder="Weight (kg) *" inputMode="decimal" value={form.kg} onChange={(e) => setForm({ ...form, kg: e.target.value })} />
        <input type="date" className="field min-h-[48px]" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} aria-label="Weigh-in date" />
        <button type="button" onClick={add} disabled={busy} className="btn-primary justify-center">
          {busy ? <Loader2 size={15} className="animate-spin" aria-hidden /> : <Plus size={15} aria-hidden />} Log Weight
        </button>
      </div>
    </div>
  );
}

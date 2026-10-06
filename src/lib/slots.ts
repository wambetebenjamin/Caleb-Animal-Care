import { lrangeJson } from "./store";
import type { Appointment, Slot } from "./types";

/** Clinic roster: Mon–Sat 09:00–16:30, 30-minute slots. Sundays: emergencies only. */
export function dailySlots(dateIso: string): string[] {
  const day = new Date(`${dateIso}T00:00:00`).getDay();
  if (day === 0) return [];
  const times: string[] = [];
  for (let h = 9; h <= 16; h++) {
    times.push(`${String(h).padStart(2, "0")}:00`);
    times.push(`${String(h).padStart(2, "0")}:30`);
  }
  times.push("16:30");
  return Array.from(new Set(times));
}

export async function availabilityFor(dateIso: string, vetSlug: string | null): Promise<Slot[]> {
  const base = dailySlots(dateIso);
  if (base.length === 0) return [];
  const booked = await lrangeJson<Appointment>(`appt:date:${dateIso}`);
  const taken = new Set(
    booked
      .filter((a) => !vetSlug || a.vetSlug === vetSlug)
      .map((a) => a.time),
  );
  const today = new Date();
  const isToday = dateIso === today.toISOString().slice(0, 10);
  const nowMins = today.getHours() * 60 + today.getMinutes();
  return base.map((time) => {
    const [h, m] = time.split(":").map(Number);
    const passed = isToday && h * 60 + m <= nowMins + 60; // 1h lead time
    return { time, taken: taken.has(time) || passed };
  });
}

export function nextDays(count: number): string[] {
  const out: string[] = [];
  const d = new Date();
  while (out.length < count) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() !== 0) out.push(d.toISOString().slice(0, 10));
  }
  return out;
}

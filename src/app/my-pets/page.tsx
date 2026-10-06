import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { ShieldCheck, LogOut } from "lucide-react";
import { authOptions } from "@/lib/auth-options";
import { getJson, lrangeJson } from "@/lib/store";
import type { Appointment, PetProfile, Reminder } from "@/lib/types";
import { PetTracker } from "@/components/PetTracker";

/**
 * Pet wellness portal — SSR, no caching, authenticated only
 * (edge middleware blocks /my-pets without a valid session).
 */
export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "My Pets — Wellness Portal",
  description: "Your animals' vaccination schedules, visit history, medication reminders and weight charts.",
  robots: { index: false },
};

export default async function MyPetsPage() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  if (!email) redirect("/login?callbackUrl=/my-pets");

  const petIds = (await getJson<string[]>(`pets:index:${email}`)) ?? [];
  const pets = (
    await Promise.all(petIds.map((id) => getJson<PetProfile>(`pet:${email}:${id}`)))
  ).filter((p): p is PetProfile => Boolean(p));

  const reminders = await lrangeJson<Reminder>(`rem:${email}`);
  const visits = await lrangeJson<Appointment>(`appts:user:${email}`);

  return (
    <div className="bg-mist py-14">
      <div className="mx-auto max-w-shell px-5">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="subheading">Owner portal</span>
            <h1 className="text-[28px] font-extrabold">
              Karibu, {session.user?.name ?? "Pet Parent"}
            </h1>
            <p className="text-[14px] text-body">
              Vaccines, reminders and weight trends for your animals — synced with the clinic diary.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <p className="meta flex items-center gap-1.5 !normal-case">
              <ShieldCheck size={13} className="text-pine" aria-hidden /> Signed in as {email}
            </p>
            <a href="/api/auth/signout?callbackUrl=/" className="btn-outline !min-h-[40px] !px-4 !text-[11px]">
              <LogOut size={13} aria-hidden /> Sign out
            </a>
          </div>
        </div>
        <PetTracker
          initialPets={pets}
          initialReminders={reminders}
          initialVisits={visits}
          ownerEmail={email}
        />
      </div>
    </div>
  );
}

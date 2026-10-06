import { z } from "zod";
import { getServerSession } from "next-auth";
import { put } from "@vercel/blob";
import { authOptions } from "@/lib/auth-options";
import { del, getJson, setJson } from "@/lib/store";
import { randomId } from "@/lib/utils";
import type { PetProfile } from "@/lib/types";

export const dynamic = "force-dynamic";

/** CRUD for pet profiles — owner-protected. */

async function ownerEmail(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  return session?.user?.email?.toLowerCase() ?? null;
}

export async function GET() {
  const email = await ownerEmail();
  if (!email) return Response.json({ ok: false, error: "Sign in required" }, { status: 401 });
  const ids = (await getJson<string[]>(`pets:index:${email}`)) ?? [];
  const pets = (
    await Promise.all(ids.map((id) => getJson<PetProfile>(`pet:${email}:${id}`)))
  ).filter(Boolean);
  return Response.json({ ok: true, pets });
}

export async function POST(request: Request) {
  const email = await ownerEmail();
  if (!email) return Response.json({ ok: false, error: "Sign in required" }, { status: 401 });

  const form = await request.formData();
  const parsed = z
    .object({
      name: z.string().min(1).max(60),
      species: z.string().min(1).max(30),
      breed: z.string().max(60).default(""),
      ageYears: z.coerce.number().min(0).max(60),
    })
    .safeParse({
      name: form.get("name"),
      species: form.get("species"),
      breed: form.get("breed") ?? "",
      ageYears: form.get("ageYears"),
    });
  if (!parsed.success) {
    return Response.json({ ok: false, error: "Name and age are required." }, { status: 400 });
  }

  let photo: string | undefined;
  const file = form.get("photo");
  if (file instanceof File && file.size > 0 && file.size <= 1024 * 1024) {
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const blob = await put(`pets/${email}/${randomId("photo")}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`, file, {
          access: "public",
          contentType: file.type,
          token: process.env.BLOB_READ_WRITE_TOKEN,
        });
        photo = blob.url;
      } catch (error) {
        console.error("[blob:error]", error);
      }
    } else {
      // Dev fallback: small inlined data URL inside the store record
      const buffer = Buffer.from(await file.arrayBuffer());
      photo = `data:${file.type || "image/jpeg"};base64,${buffer.toString("base64")}`;
    }
  }

  const pet: PetProfile = {
    id: randomId("pet"),
    ownerEmail: email,
    name: parsed.data.name,
    species: parsed.data.species,
    breed: parsed.data.breed,
    ageYears: parsed.data.ageYears,
    photo,
    weights: [],
    vaccines: [],
    createdAt: new Date().toISOString(),
  };
  await setJson(`pet:${email}:${pet.id}`, pet);
  const ids = (await getJson<string[]>(`pets:index:${email}`)) ?? [];
  await setJson(`pets:index:${email}`, [...ids, pet.id]);
  return Response.json({ ok: true, pet });
}

export async function PATCH(request: Request) {
  const email = await ownerEmail();
  if (!email) return Response.json({ ok: false, error: "Sign in required" }, { status: 401 });
  const body = (await request.json().catch(() => null)) as {
    id?: string;
    weight?: { date: string; kg: number };
    vaccine?: { name: string; givenAt: string; nextDue: string };
  } | null;
  if (!body?.id) return Response.json({ ok: false, error: "Missing pet id" }, { status: 400 });

  const key = `pet:${email}:${body.id}`;
  const pet = await getJson<PetProfile>(key);
  if (!pet) return Response.json({ ok: false, error: "Pet not found" }, { status: 404 });

  if (body.weight && body.weight.kg > 0 && /^\d{4}-\d{2}-\d{2}$/.test(body.weight.date)) {
    pet.weights.push({ date: body.weight.date, kg: Math.round(body.weight.kg * 10) / 10 });
    pet.weights.sort((a, b) => a.date.localeCompare(b.date));
  }
  if (body.vaccine?.name && /^\d{4}-\d{2}-\d{2}$/.test(body.vaccine.nextDue)) {
    pet.vaccines.push({
      name: body.vaccine.name.slice(0, 60),
      givenAt: body.vaccine.givenAt || new Date().toISOString().slice(0, 10),
      nextDue: body.vaccine.nextDue,
    });
  }
  await setJson(key, pet);
  return Response.json({ ok: true, pet });
}

export async function DELETE(request: Request) {
  const email = await ownerEmail();
  if (!email) return Response.json({ ok: false, error: "Sign in required" }, { status: 401 });
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return Response.json({ ok: false, error: "Missing pet id" }, { status: 400 });

  await del(`pet:${email}:${id}`);
  const ids = (await getJson<string[]>(`pets:index:${email}`)) ?? [];
  await setJson(`pets:index:${email}`, ids.filter((x) => x !== id));
  return Response.json({ ok: true });
}

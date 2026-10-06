import { kv } from "@vercel/kv";

/**
 * Storage façade. Uses Vercel KV when env credentials exist (production);
 * otherwise falls back to a process-local in-memory store so the app runs
 * end-to-end in local dev / preview without provisioning. Same call shapes.
 */

const hasKv = Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);

interface Memory {
  strings: Map<string, string>;
  lists: Map<string, string[]>;
  sets: Map<string, Set<string>>;
}

const g = globalThis as unknown as { __cacMemory?: Memory };
const mem: Memory = (g.__cacMemory ??= {
  strings: new Map(),
  lists: new Map(),
  sets: new Map(),
});

export const storageInfo = { driver: hasKv ? ("vercel-kv" as const) : ("memory" as const) };

export async function getJson<T>(key: string): Promise<T | null> {
  if (hasKv) {
    return (await kv.get<T>(key)) ?? null;
  }
  const raw = mem.strings.get(key);
  return raw ? (JSON.parse(raw) as T) : null;
}

export async function setJson(key: string, value: unknown): Promise<void> {
  if (hasKv) {
    await kv.set(key, value as never);
    return;
  }
  mem.strings.set(key, JSON.stringify(value));
}

export async function lpush(key: string, value: unknown): Promise<void> {
  if (hasKv) {
    await kv.lpush(key, JSON.stringify(value));
    return;
  }
  const list = mem.lists.get(key) ?? [];
  list.unshift(JSON.stringify(value));
  mem.lists.set(key, list);
}

export async function lrangeJson<T>(key: string, start = 0, stop = -1): Promise<T[]> {
  let raws: unknown[];
  if (hasKv) {
    raws = await kv.lrange(key, start, stop);
  } else {
    const list = mem.lists.get(key) ?? [];
    const end = stop === -1 ? list.length : stop + 1;
    raws = list.slice(start, end);
  }
  return raws
    .map((entry) => {
      if (typeof entry === "string") {
        try {
          return JSON.parse(entry) as T;
        } catch {
          return entry as T;
        }
      }
      return entry as T;
    })
    .filter(Boolean);
}

export async function sadd(key: string, member: string): Promise<void> {
  if (hasKv) {
    await kv.sadd(key, member);
    return;
  }
  const set = mem.sets.get(key) ?? new Set<string>();
  set.add(member);
  mem.sets.set(key, set);
}

export async function smembers(key: string): Promise<string[]> {
  if (hasKv) {
    return (await kv.smembers(key)) as string[];
  }
  return Array.from(mem.sets.get(key) ?? []);
}

export async function sismember(key: string, member: string): Promise<boolean> {
  if (hasKv) {
    return (await kv.sismember(key, member)) === 1;
  }
  return mem.sets.get(key)?.has(member) ?? false;
}

export async function del(key: string): Promise<void> {
  if (hasKv) {
    await kv.del(key);
    return;
  }
  mem.strings.delete(key);
  mem.lists.delete(key);
  mem.sets.delete(key);
}

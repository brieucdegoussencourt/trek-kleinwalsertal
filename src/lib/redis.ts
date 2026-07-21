// ============================================================
// Shared Upstash Redis REST helpers (provisioned through the
// Vercel Marketplace — UPSTASH_REDIS_REST_URL/TOKEN or the
// KV_REST_API_URL/TOKEN naming). Used by the live tracker and
// the photo album stores.
// ============================================================

const REDIS_URL =
  process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
const REDIS_TOKEN =
  process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;

export const hasRedis = Boolean(REDIS_URL && REDIS_TOKEN);

export async function redisGet(key: string): Promise<string | null> {
  const res = await fetch(`${REDIS_URL}/get/${encodeURIComponent(key)}`, {
    headers: { Authorization: `Bearer ${REDIS_TOKEN}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Redis GET ${res.status}`);
  const data = (await res.json()) as { result: string | null };
  return data.result;
}

export async function redisSet(key: string, value: string): Promise<void> {
  const res = await fetch(`${REDIS_URL}/set/${encodeURIComponent(key)}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${REDIS_TOKEN}` },
    body: value,
  });
  if (!res.ok) throw new Error(`Redis SET ${res.status}`);
}

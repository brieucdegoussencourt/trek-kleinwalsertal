// ============================================================
// Photo album storage.
// Production: image bytes in Vercel Blob via its REST API
// (BLOB_READ_WRITE_TOKEN), metadata index in Upstash Redis
// (see lib/redis.ts).
// Local dev without env vars: images kept as data URLs in an
// in-memory index (survives HMR, dev only).
// ============================================================

import { hasRedis, redisGet, redisSet } from "@/lib/redis";

export interface PhotoMeta {
  id: string;
  /** Public image URL (Vercel Blob) — a data URL in local dev. */
  url: string;
  /** Tracker id of the uploader ("brieuc" | "sophie"). */
  user: string;
  caption: string;
  /** Unix ms of the upload. */
  t: number;
}

const MAX_PHOTOS = 500;
const INDEX_KEY = "photos:index";

// ── Vercel Blob helpers (REST, same spirit as lib/redis.ts) ─

const BLOB_API_URL = "https://vercel.com/api/blob";
const BLOB_API_VERSION = "12";

// Connecting a Blob store with a custom env prefix renames the variable
// (e.g. FOO_READ_WRITE_TOKEN), so fall back to scanning for a token value.
const BLOB_TOKEN =
  process.env.BLOB_READ_WRITE_TOKEN ??
  Object.values(process.env).find((v) => v?.startsWith("vercel_blob_rw_"));

export const hasBlob = Boolean(BLOB_TOKEN);

function blobHeaders(): Record<string, string> {
  return {
    authorization: `Bearer ${BLOB_TOKEN}`,
    "x-api-version": BLOB_API_VERSION,
    // Store id is the 4th segment of a vercel_blob_rw_<store>_<secret> token.
    "x-vercel-blob-store-id": BLOB_TOKEN?.split("_")[3] ?? "",
  };
}

async function blobPut(pathname: string, file: Blob): Promise<string> {
  const res = await fetch(
    `${BLOB_API_URL}/?pathname=${encodeURIComponent(pathname)}`,
    {
      method: "PUT",
      headers: {
        ...blobHeaders(),
        "x-vercel-blob-access": "public",
        "x-content-type": file.type,
      },
      body: file,
    },
  );
  if (!res.ok) {
    const detail = (await res.text().catch(() => "")).slice(0, 300);
    throw new Error(`Blob PUT ${res.status}: ${detail}`);
  }
  const data = (await res.json()) as { url: string };
  return data.url;
}

async function blobDelete(url: string): Promise<void> {
  const res = await fetch(`${BLOB_API_URL}/delete`, {
    method: "POST",
    headers: { ...blobHeaders(), "content-type": "application/json" },
    body: JSON.stringify({ urls: [url] }),
  });
  if (!res.ok) {
    const detail = (await res.text().catch(() => "")).slice(0, 300);
    throw new Error(`Blob DELETE ${res.status}: ${detail}`);
  }
}

// ── In-memory fallback (dev) ────────────────────────────────

const globalStore = globalThis as unknown as {
  __photoIndex?: PhotoMeta[];
};

// ── Index ───────────────────────────────────────────────────

export async function listPhotos(): Promise<PhotoMeta[]> {
  if (hasRedis) {
    const raw = await redisGet(INDEX_KEY);
    return raw ? (JSON.parse(raw) as PhotoMeta[]) : [];
  }
  return globalStore.__photoIndex ?? [];
}

async function saveIndex(photos: PhotoMeta[]): Promise<void> {
  if (hasRedis) {
    await redisSet(INDEX_KEY, JSON.stringify(photos));
  } else {
    globalStore.__photoIndex = photos;
  }
}

// ── Store API ───────────────────────────────────────────────

export async function addPhoto(
  file: Blob,
  meta: Omit<PhotoMeta, "url">,
): Promise<PhotoMeta> {
  let url: string;
  if (hasBlob) {
    const ext = file.type === "image/png" ? "png" : "jpg";
    url = await blobPut(`photos/${meta.id}.${ext}`, file);
  } else {
    // Dev fallback: inline the image. Heavy, but memory-only.
    const buf = Buffer.from(await file.arrayBuffer());
    url = `data:${file.type};base64,${buf.toString("base64")}`;
  }

  const photo: PhotoMeta = { ...meta, url };
  const photos = [...(await listPhotos()), photo].slice(-MAX_PHOTOS);
  await saveIndex(photos);
  return photo;
}

export async function removePhoto(id: string): Promise<boolean> {
  const photos = await listPhotos();
  const photo = photos.find((p) => p.id === id);
  if (!photo) return false;
  await saveIndex(photos.filter((p) => p.id !== id));
  if (hasBlob && photo.url.startsWith("http")) {
    await blobDelete(photo.url).catch(() => {
      // index entry is gone — an orphaned blob is acceptable
    });
  }
  return true;
}

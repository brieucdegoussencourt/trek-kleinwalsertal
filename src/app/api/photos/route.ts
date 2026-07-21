import { NextResponse } from "next/server";
import { LIVE_TRACKERS } from "@/data/trek";
import { addPhoto, hasBlob, listPhotos, removePhoto } from "@/lib/photoStore";

/** Vercel serverless request bodies are capped at ~4.5 MB. */
const MAX_FILE_BYTES = 4_400_000;
const MAX_CAPTION = 200;

const VALID_IDS = new Set(LIVE_TRACKERS.map((t) => t.id));
const VALID_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

// Same protection as the live tracker: holders of the record key may
// write. If the env var is not configured (local dev), writes are open.
function keyOk(key: string | null): boolean {
  const requiredKey = process.env.LIVE_RECORD_KEY;
  return !requiredKey || key === requiredKey;
}

// ── GET: public album for viewers ───────────────────────────

export async function GET() {
  const photos = await listPhotos();
  return NextResponse.json(
    { photos, now: Date.now() },
    { headers: { "Cache-Control": "no-store" } },
  );
}

// ── POST: upload one photo (multipart, key-protected) ───────

export async function POST(req: Request) {
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "corps invalide" }, { status: 400 });
  }

  const user = form.get("user");
  if (typeof user !== "string" || !VALID_IDS.has(user)) {
    return NextResponse.json({ error: "utilisateur inconnu" }, { status: 400 });
  }

  const key = form.get("key");
  if (!keyOk(typeof key === "string" ? key : null)) {
    return NextResponse.json({ error: "clé invalide" }, { status: 401 });
  }

  const file = form.get("file");
  if (!(file instanceof Blob) || file.size === 0) {
    return NextResponse.json({ error: "aucune photo" }, { status: 400 });
  }
  if (!VALID_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: "format non pris en charge" },
      { status: 400 },
    );
  }
  if (file.size > MAX_FILE_BYTES) {
    return NextResponse.json({ error: "photo trop lourde" }, { status: 413 });
  }

  // The data-URL fallback is for local dev only: on Vercel it would push
  // whole images into the Redis index and explode its request size limit.
  if (!hasBlob && process.env.VERCEL) {
    return NextResponse.json(
      {
        error:
          "Stockage photo non configuré — connectez un Blob store au projet " +
          "sur Vercel puis redéployez (les variables d'environnement ne sont " +
          "prises en compte qu'au déploiement).",
      },
      { status: 503 },
    );
  }

  const caption = form.get("caption");
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  try {
    const photo = await addPhoto(file, {
      id,
      user,
      caption:
        typeof caption === "string" ? caption.trim().slice(0, MAX_CAPTION) : "",
      t: Date.now(),
    });
    return NextResponse.json({ ok: true, photo });
  } catch (e) {
    console.error("photo upload failed:", e);
    const detail = e instanceof Error ? e.message : "erreur inconnue";
    return NextResponse.json(
      { error: `envoi impossible — ${detail}` },
      { status: 500 },
    );
  }
}

// ── DELETE: remove one photo (key-protected) ────────────────

export async function DELETE(req: Request) {
  let body: { key?: string; id?: string };
  try {
    body = (await req.json()) as { key?: string; id?: string };
  } catch {
    return NextResponse.json({ error: "corps invalide" }, { status: 400 });
  }

  if (!keyOk(body.key ?? null)) {
    return NextResponse.json({ error: "clé invalide" }, { status: 401 });
  }
  if (!body.id) {
    return NextResponse.json({ error: "id manquant" }, { status: 400 });
  }

  try {
    const removed = await removePhoto(body.id);
    if (!removed) {
      return NextResponse.json({ error: "photo inconnue" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("photo delete failed:", e);
    const detail = e instanceof Error ? e.message : "erreur inconnue";
    return NextResponse.json(
      { error: `suppression impossible — ${detail}` },
      { status: 500 },
    );
  }
}

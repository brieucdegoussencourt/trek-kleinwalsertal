"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { LIVE_TRACKERS } from "@/data/trek";
import type { PhotoMeta } from "@/lib/photoStore";

const POLL_MS = 60_000;
/** Long-edge cap before upload — plenty for a web album, light on 4G. */
const MAX_EDGE_PX = 1600;
const JPEG_QUALITY = 0.82;
/** Server rejects anything above ~4.4 MB (Vercel body limit). */
const MAX_UPLOAD_BYTES = 4_400_000;

/**
 * Downscale + re-encode a photo on the phone before upload: a 12 MP
 * HEIC/JPEG becomes a ~300-500 kB JPEG, which matters on mountain 4G.
 * Falls back to the original file when the browser can't decode it.
 */
async function compressImage(file: File): Promise<Blob> {
  const objectUrl = URL.createObjectURL(file);
  try {
    const img = new Image();
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("decode"));
      img.src = objectUrl;
    });

    const scale = Math.min(
      1,
      MAX_EDGE_PX / Math.max(img.naturalWidth, img.naturalHeight),
    );
    const w = Math.max(1, Math.round(img.naturalWidth * scale));
    const h = Math.max(1, Math.round(img.naturalHeight * scale));

    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("canvas");
    ctx.drawImage(img, 0, 0, w, h);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY),
    );
    if (!blob) throw new Error("encode");
    return blob;
  } catch {
    // Undecodable format (rare) — send as-is if the server will take it.
    if (file.size <= MAX_UPLOAD_BYTES) return file;
    throw new Error("Format de photo non pris en charge par ce navigateur.");
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

function trackerOf(userId: string) {
  return LIVE_TRACKERS.find((t) => t.id === userId);
}

export default function PhotosSection() {
  // ── Album (viewers) ────────────────────────────────────────
  const [photos, setPhotos] = useState<PhotoMeta[] | null>(null);
  const [openPhoto, setOpenPhoto] = useState<PhotoMeta | null>(null);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/photos", { cache: "no-store" });
      if (res.ok) {
        const data = (await res.json()) as { photos: PhotoMeta[] };
        setPhotos(data.photos);
      }
    } catch {
      // network hiccup — next poll will retry
    }
  }, []);

  useEffect(() => {
    const first = setTimeout(refresh, 0);
    const id = setInterval(refresh, POLL_MS);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, [refresh]);

  // ── Uploader ───────────────────────────────────────────────
  // Same identity + record key as the Live tab (shared localStorage).
  const [me, setMe] = useState<string>(() =>
    typeof window === "undefined"
      ? ""
      : (localStorage.getItem("live-user") ?? ""),
  );
  const [recordKey, setRecordKey] = useState<string>(() =>
    typeof window === "undefined"
      ? ""
      : (localStorage.getItem("live-key") ?? ""),
  );
  const [caption, setCaption] = useState("");
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploading = progress !== null;

  useEffect(() => {
    if (me) localStorage.setItem("live-user", me);
  }, [me]);
  useEffect(() => {
    localStorage.setItem("live-key", recordKey);
  }, [recordKey]);

  const pickFiles = useCallback(() => {
    setError(null);
    if (!me) {
      setError("Choisissez d'abord qui ajoute les photos.");
      return;
    }
    fileInputRef.current?.click();
  }, [me]);

  const upload = useCallback(
    async (files: FileList) => {
      const list = Array.from(files);
      if (list.length === 0) return;
      setError(null);
      setProgress({ done: 0, total: list.length });

      let failed = 0;
      for (const [i, file] of list.entries()) {
        try {
          const blob = await compressImage(file);
          const form = new FormData();
          form.set("user", me);
          form.set("key", recordKey);
          form.set("caption", caption);
          form.set("file", blob, "photo.jpg");
          const res = await fetch("/api/photos", { method: "POST", body: form });
          if (res.status === 401) throw new Error("Clé d'enregistrement invalide");
          if (!res.ok) throw new Error(`Erreur serveur (${res.status})`);
        } catch (e) {
          failed++;
          setError(e instanceof Error ? e.message : "Envoi impossible");
        }
        setProgress({ done: i + 1, total: list.length });
      }

      setProgress(null);
      if (failed === 0) setCaption("");
      refresh();
    },
    [me, recordKey, caption, refresh],
  );

  const deletePhoto = useCallback(
    async (photo: PhotoMeta) => {
      if (!confirm("Supprimer cette photo ?")) return;
      try {
        const res = await fetch("/api/photos", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: recordKey, id: photo.id }),
        });
        if (res.status === 401) throw new Error("Clé d'enregistrement invalide");
        if (!res.ok) throw new Error(`Erreur serveur (${res.status})`);
        setOpenPhoto(null);
        refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Suppression impossible");
      }
    },
    [recordKey, refresh],
  );

  const sorted = photos ? [...photos].reverse() : null;

  return (
    <div className="space-y-6">
      {/* ── Upload panel ─────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-sm space-y-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-rock">
          Ajouter des photos
        </p>

        {/* Identity + key — same as the Live tab */}
        <div className="flex flex-wrap items-center gap-3">
          {LIVE_TRACKERS.map((t) => (
            <button
              key={t.id}
              onClick={() => !uploading && setMe(t.id)}
              disabled={uploading}
              className={`flex items-center gap-2 rounded-xl border-2 px-4 py-2 text-sm font-semibold transition-colors ${
                me === t.id
                  ? "text-white"
                  : "bg-white text-stone-600 hover:border-stone-300"
              } ${uploading && me !== t.id ? "opacity-40" : ""}`}
              style={
                me === t.id
                  ? { background: t.color, borderColor: t.color }
                  : { borderColor: "#e7e5e4" }
              }
            >
              <span
                className={`h-2.5 w-2.5 rounded-full ${me === t.id ? "bg-white" : ""}`}
                style={me === t.id ? {} : { background: t.color }}
              />
              {t.name}
            </button>
          ))}

          <input
            type="password"
            value={recordKey}
            onChange={(e) => setRecordKey(e.target.value)}
            disabled={uploading}
            placeholder="Clé d'enregistrement"
            className="flex-1 min-w-[160px] rounded-xl border-2 border-stone-200 px-3 py-2 text-sm focus:border-pine outline-none disabled:opacity-50"
          />
        </div>

        {/* Caption + picker */}
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            disabled={uploading}
            maxLength={200}
            placeholder="Légende (optionnelle)"
            className="flex-1 min-w-[200px] rounded-xl border-2 border-stone-200 px-3 py-2 text-sm focus:border-pine outline-none disabled:opacity-50"
          />

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.length) upload(e.target.files);
              e.target.value = ""; // allow re-picking the same files
            }}
          />
          <button
            onClick={pickFiles}
            disabled={uploading}
            className="rounded-xl bg-pine text-white font-bold px-6 py-3 text-sm hover:bg-[#0a5843] transition-colors disabled:opacity-60"
          >
            {uploading
              ? `Envoi ${progress.done}/${progress.total}…`
              : "📷 Choisir des photos"}
          </button>
        </div>

        {error && (
          <p className="text-sm font-semibold text-coral bg-coral/10 rounded-md px-3 py-2">
            {error}
          </p>
        )}

        <p className="text-[11px] text-stone-400 leading-relaxed">
          Depuis votre téléphone : appareil photo ou galerie, plusieurs photos
          à la fois. Les images sont compressées avant l&rsquo;envoi
          (max {MAX_EDGE_PX} px) pour passer même en 4G de montagne. La légende
          s&rsquo;applique à toutes les photos de l&rsquo;envoi.
        </p>
      </div>

      {/* ── Album ────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-stone-200 p-3 sm:p-4 shadow-sm">
        <div className="flex items-baseline justify-between px-1 pb-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-rock">
            Album du trek
          </p>
          <p className="text-[11px] text-stone-400">
            {sorted === null
              ? "Chargement…"
              : sorted.length === 0
                ? "Aucune photo"
                : `${sorted.length} photo${sorted.length > 1 ? "s" : ""}`}
          </p>
        </div>

        {sorted === null ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-xl bg-stone-100 animate-pulse" />
            ))}
          </div>
        ) : sorted.length === 0 ? (
          <p className="px-1 py-10 text-center text-sm text-stone-400">
            Aucune photo pour l&rsquo;instant — elles apparaîtront ici pendant
            le trek.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {sorted.map((photo) => {
              const tracker = trackerOf(photo.user);
              return (
                <button
                  key={photo.id}
                  onClick={() => setOpenPhoto(photo)}
                  className="group relative aspect-square overflow-hidden rounded-xl bg-stone-100"
                >
                  {/* Blob URLs are remote & dynamic — plain <img> is the right tool */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.url}
                    alt={photo.caption || "Photo du trek"}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {tracker && (
                    <span
                      className="absolute bottom-1.5 left-1.5 h-2.5 w-2.5 rounded-full ring-2 ring-white/80"
                      style={{ background: tracker.color }}
                      title={tracker.name}
                    />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Lightbox ─────────────────────────────────────────── */}
      {openPhoto && (
        <div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/90 p-4"
          onClick={() => setOpenPhoto(null)}
        >
          <button
            onClick={() => setOpenPhoto(null)}
            aria-label="Fermer"
            className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/10 text-white text-xl hover:bg-white/20 transition-colors"
          >
            ✕
          </button>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={openPhoto.url}
            alt={openPhoto.caption || "Photo du trek"}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[75vh] max-w-full rounded-xl object-contain"
          />

          <div
            onClick={(e) => e.stopPropagation()}
            className="mt-4 flex flex-col items-center gap-2 text-center"
          >
            {openPhoto.caption && (
              <p className="max-w-lg text-sm text-white">{openPhoto.caption}</p>
            )}
            <p className="flex items-center gap-2 text-xs text-white/60">
              {trackerOf(openPhoto.user) && (
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: trackerOf(openPhoto.user)!.color }}
                />
              )}
              {trackerOf(openPhoto.user)?.name ?? openPhoto.user} ·{" "}
              {new Date(openPhoto.t).toLocaleDateString("fr-BE", {
                day: "2-digit",
                month: "2-digit",
              })}{" "}
              {new Date(openPhoto.t).toLocaleTimeString("fr-BE", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            {recordKey && (
              <button
                onClick={() => deletePhoto(openPhoto)}
                className="text-xs text-white/50 underline underline-offset-2 hover:text-coral transition-colors"
              >
                Supprimer cette photo
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

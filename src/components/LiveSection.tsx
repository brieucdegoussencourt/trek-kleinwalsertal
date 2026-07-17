"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { LIVE_TRACKERS } from "@/data/trek";
import type { LivePoint, TrackerState } from "@/lib/liveStore";

const LiveMap = dynamic(() => import("@/components/LiveMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[380px] sm:h-[460px] w-full rounded-2xl bg-stone-100 animate-pulse" />
  ),
});

const POLL_MS = 15_000;
const FLUSH_MS = 10_000;
const MIN_MOVE_M = 15;

interface LiveState {
  trackers: Record<string, TrackerState>;
  now: number;
}

function distM(a: LivePoint, b: LivePoint): number {
  const R = 6371000;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

export default function LiveSection() {
  // ── Viewer state ───────────────────────────────────────────
  const [live, setLive] = useState<LiveState | null>(null);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/live", { cache: "no-store" });
      if (res.ok) setLive((await res.json()) as LiveState);
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

  // ── Recorder state ─────────────────────────────────────────
  // Lazy init from localStorage: this component only mounts client-side
  // (the Live tab is selected after hydration), so window is available.
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
  const [recording, setRecording] = useState(false);
  const [sentCount, setSentCount] = useState(0);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const watchIdRef = useRef<number | null>(null);
  const flushTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const bufferRef = useRef<LivePoint[]>([]);
  const lastPointRef = useRef<LivePoint | null>(null);
  const wakeLockRef = useRef<{ release: () => Promise<void> } | null>(null);

  // Persist identity + key across visits.
  useEffect(() => {
    if (me) localStorage.setItem("live-user", me);
  }, [me]);
  useEffect(() => {
    localStorage.setItem("live-key", recordKey);
  }, [recordKey]);

  const post = useCallback(
    async (action: string, points?: LivePoint[]) => {
      const res = await fetch("/api/live", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: me, key: recordKey, action, points }),
      });
      if (res.status === 401) throw new Error("Clé d'enregistrement invalide");
      if (!res.ok) throw new Error(`Erreur serveur (${res.status})`);
    },
    [me, recordKey],
  );

  const flush = useCallback(async () => {
    if (bufferRef.current.length === 0) return;
    const points = bufferRef.current.splice(0);
    try {
      await post("points", points);
      setSentCount((n) => n + points.length);
      refresh();
    } catch (e) {
      // put the points back and surface the problem
      bufferRef.current.unshift(...points);
      setError(e instanceof Error ? e.message : "Envoi impossible");
    }
  }, [post, refresh]);

  const stop = useCallback(async () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    if (flushTimerRef.current) {
      clearInterval(flushTimerRef.current);
      flushTimerRef.current = null;
    }
    await wakeLockRef.current?.release().catch(() => {});
    wakeLockRef.current = null;
    setRecording(false);
    await flush();
    try {
      await post("stop");
    } catch {
      // state flag only — points are already saved
    }
    refresh();
  }, [flush, post, refresh]);

  const start = useCallback(async () => {
    setError(null);
    if (!me) {
      setError("Choisissez d'abord qui enregistre.");
      return;
    }
    if (!("geolocation" in navigator)) {
      setError("Géolocalisation non disponible sur cet appareil.");
      return;
    }
    try {
      await post("start"); // validates the key before touching the GPS
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
      return;
    }

    setSentCount(0);
    lastPointRef.current = null;

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const p: LivePoint = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          t: pos.timestamp,
          alt: pos.coords.altitude ?? undefined,
          acc: pos.coords.accuracy ?? undefined,
        };
        setAccuracy(p.acc ?? null);
        const last = lastPointRef.current;
        // Thin on the client: keep a point if we moved enough or 20 s passed.
        if (!last || distM(last, p) >= MIN_MOVE_M || p.t - last.t >= 20_000) {
          bufferRef.current.push(p);
          lastPointRef.current = p;
        }
      },
      (err) => {
        setError(
          err.code === err.PERMISSION_DENIED
            ? "Accès à la position refusé — autorisez la localisation pour ce site."
            : `GPS : ${err.message}`,
        );
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 20000 },
    );

    flushTimerRef.current = setInterval(flush, FLUSH_MS);
    setRecording(true);

    // Keep the screen awake while recording (best effort).
    try {
      const nav = navigator as Navigator & {
        wakeLock?: { request: (t: "screen") => Promise<{ release: () => Promise<void> }> };
      };
      wakeLockRef.current = (await nav.wakeLock?.request("screen")) ?? null;
    } catch {
      // unsupported — recording still works while the screen is on
    }
  }, [me, post, flush]);

  // Clean up if the component unmounts mid-recording.
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null)
        navigator.geolocation.clearWatch(watchIdRef.current);
      if (flushTimerRef.current) clearInterval(flushTimerRef.current);
    };
  }, []);

  const clearMine = useCallback(async () => {
    setError(null);
    try {
      await post("clear");
      setSentCount(0);
      refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
    }
  }, [post, refresh]);

  const meTracker = LIVE_TRACKERS.find((t) => t.id === me);

  return (
    <div className="space-y-6">
      {/* Live map */}
      <div className="bg-white rounded-2xl border border-stone-200 p-3 sm:p-4 shadow-sm">
        <div className="flex items-baseline justify-between px-1 pb-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-rock">
            Position en direct
          </p>
          <p className="text-[11px] text-stone-400">
            Actualisé toutes les 15 s
          </p>
        </div>
        {live ? (
          <LiveMap trackers={live.trackers} now={live.now} />
        ) : (
          <div className="h-[380px] sm:h-[460px] w-full rounded-2xl bg-stone-100 animate-pulse" />
        )}

        {/* Status chips */}
        <div className="flex flex-wrap gap-2 px-1 pt-3">
          {LIVE_TRACKERS.map((t) => {
            const s = live?.trackers[t.id];
            const isLive =
              s?.recording && live && live.now - s.updatedAt < 120_000;
            const label = !s || s.track.length === 0
              ? "Aucune trace"
              : isLive
                ? "🔴 En direct"
                : `Vu il y a ${Math.max(1, Math.round((live!.now - s.updatedAt) / 60_000))} min`;
            return (
              <span
                key={t.id}
                className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-3 py-1 text-xs text-stone-600"
              >
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: t.color }}
                />
                <b>{t.name}</b> · {label}
              </span>
            );
          })}
        </div>
      </div>

      {/* Recorder */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-sm space-y-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-rock">
          Enregistrer ma trace
        </p>

        {/* Identity */}
        <div className="flex flex-wrap items-center gap-3">
          {LIVE_TRACKERS.map((t) => (
            <button
              key={t.id}
              onClick={() => !recording && setMe(t.id)}
              disabled={recording}
              className={`flex items-center gap-2 rounded-xl border-2 px-4 py-2 text-sm font-semibold transition-colors ${
                me === t.id
                  ? "text-white"
                  : "bg-white text-stone-600 hover:border-stone-300"
              } ${recording && me !== t.id ? "opacity-40" : ""}`}
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
            disabled={recording}
            placeholder="Clé d'enregistrement"
            className="flex-1 min-w-[160px] rounded-xl border-2 border-stone-200 px-3 py-2 text-sm focus:border-pine outline-none disabled:opacity-50"
          />
        </div>

        {/* Start / stop */}
        <div className="flex flex-wrap items-center gap-3">
          {recording ? (
            <button
              onClick={stop}
              className="rounded-xl bg-coral text-white font-bold px-6 py-3 text-sm hover:opacity-90 transition-opacity"
            >
              ■ Arrêter l&rsquo;enregistrement
            </button>
          ) : (
            <button
              onClick={start}
              className="rounded-xl bg-pine text-white font-bold px-6 py-3 text-sm hover:bg-[#0a5843] transition-colors"
            >
              ● Démarrer l&rsquo;enregistrement
            </button>
          )}

          {recording && meTracker && (
            <span className="inline-flex items-center gap-2 text-sm text-stone-600">
              <span
                className="h-2.5 w-2.5 rounded-full animate-pulse"
                style={{ background: meTracker.color }}
              />
              {meTracker.name} · {sentCount} points envoyés
              {accuracy !== null && ` · ±${Math.round(accuracy)} m`}
            </span>
          )}

          {!recording && sentCount > 0 && (
            <span className="text-sm text-stone-400">
              Trace envoyée — {sentCount} points.
            </span>
          )}

          {!recording && me && (
            <button
              onClick={clearMine}
              className="text-xs text-stone-400 underline underline-offset-2 hover:text-coral transition-colors"
            >
              Effacer ma trace
            </button>
          )}
        </div>

        {error && (
          <p className="text-sm font-semibold text-coral bg-coral/10 rounded-md px-3 py-2">
            {error}
          </p>
        )}

        <p className="text-[11px] text-stone-400 leading-relaxed">
          L&rsquo;enregistrement fonctionne tant que cette page reste ouverte,
          écran allumé (l&rsquo;écran est maintenu éveillé automatiquement si
          possible). La position est publiée sur cette page publique — pensez à
          arrêter l&rsquo;enregistrement le soir. Batterie : comptez ~10–15 %
          par heure de suivi GPS.
        </p>
      </div>
    </div>
  );
}

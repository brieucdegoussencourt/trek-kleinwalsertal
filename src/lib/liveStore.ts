// ============================================================
// Live-tracking storage.
// Production: Upstash Redis via its REST API (provisioned through
// the Vercel Marketplace — UPSTASH_REDIS_REST_URL/TOKEN or the
// KV_REST_API_URL/TOKEN naming).
// Local dev without env vars: in-memory fallback (survives HMR,
// NOT reliable on serverless — dev only).
// ============================================================

export interface LivePoint {
  lat: number;
  lng: number;
  /** Unix ms. */
  t: number;
  /** Altitude in metres, if the device provides it. */
  alt?: number;
  /** Reported accuracy in metres. */
  acc?: number;
}

export interface TrackerState {
  recording: boolean;
  /** Unix ms of the last update (points or start/stop). */
  updatedAt: number;
  track: LivePoint[];
}

const MAX_POINTS = 4000;

const REDIS_URL =
  process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
const REDIS_TOKEN =
  process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;

const hasRedis = Boolean(REDIS_URL && REDIS_TOKEN);

// ── In-memory fallback (dev) ────────────────────────────────

const globalStore = globalThis as unknown as {
  __liveStore?: Map<string, TrackerState>;
};
function memMap(): Map<string, TrackerState> {
  globalStore.__liveStore ??= new Map();
  return globalStore.__liveStore;
}

// ── Redis helpers ───────────────────────────────────────────

async function redisGet(key: string): Promise<string | null> {
  const res = await fetch(`${REDIS_URL}/get/${encodeURIComponent(key)}`, {
    headers: { Authorization: `Bearer ${REDIS_TOKEN}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Redis GET ${res.status}`);
  const data = (await res.json()) as { result: string | null };
  return data.result;
}

async function redisSet(key: string, value: string): Promise<void> {
  const res = await fetch(`${REDIS_URL}/set/${encodeURIComponent(key)}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${REDIS_TOKEN}` },
    body: value,
  });
  if (!res.ok) throw new Error(`Redis SET ${res.status}`);
}

// ── Store API ───────────────────────────────────────────────

const KEY_PREFIX = "live:";

function emptyState(): TrackerState {
  return { recording: false, updatedAt: 0, track: [] };
}

/** Halve the track (keep every 2nd point) once it exceeds the cap. */
function thin(track: LivePoint[]): LivePoint[] {
  if (track.length <= MAX_POINTS) return track;
  return track.filter((_, i) => i % 2 === 0 || i === track.length - 1);
}

export async function getTracker(id: string): Promise<TrackerState> {
  if (hasRedis) {
    const raw = await redisGet(KEY_PREFIX + id);
    return raw ? (JSON.parse(raw) as TrackerState) : emptyState();
  }
  return memMap().get(id) ?? emptyState();
}

async function setTracker(id: string, state: TrackerState): Promise<void> {
  if (hasRedis) {
    await redisSet(KEY_PREFIX + id, JSON.stringify(state));
  } else {
    memMap().set(id, state);
  }
}

export async function appendPoints(
  id: string,
  points: LivePoint[],
): Promise<void> {
  const state = await getTracker(id);
  state.track = thin([...state.track, ...points]);
  state.updatedAt = Date.now();
  state.recording = true;
  await setTracker(id, state);
}

export async function setRecording(
  id: string,
  recording: boolean,
): Promise<void> {
  const state = await getTracker(id);
  state.recording = recording;
  state.updatedAt = Date.now();
  await setTracker(id, state);
}

export async function clearTracker(id: string): Promise<void> {
  await setTracker(id, emptyState());
}

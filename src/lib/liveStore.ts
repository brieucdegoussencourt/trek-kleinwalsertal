// ============================================================
// Live-tracking storage.
// Production: Upstash Redis via its REST API (see lib/redis.ts).
// Local dev without env vars: in-memory fallback (survives HMR,
// NOT reliable on serverless — dev only).
// ============================================================

import { hasRedis, redisGet, redisSet } from "@/lib/redis";

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

export interface LogEntry {
  /** Unix ms. */
  t: number;
  lat: number;
  lng: number;
  /** Reverse-geocoded place, e.g. "Mittelberg, Vorarlberg, Autriche". */
  place: string | null;
}

export interface TrackerState {
  recording: boolean;
  /** Unix ms of the last update (points or start/stop). */
  updatedAt: number;
  track: LivePoint[];
  /** Position journal — one entry per minute of recording at most. */
  log: LogEntry[];
}

const MAX_POINTS = 4000;
const MAX_LOG = 300;

// ── In-memory fallback (dev) ────────────────────────────────

const globalStore = globalThis as unknown as {
  __liveStore?: Map<string, TrackerState>;
};
function memMap(): Map<string, TrackerState> {
  globalStore.__liveStore ??= new Map();
  return globalStore.__liveStore;
}

// ── Store API ───────────────────────────────────────────────

const KEY_PREFIX = "live:";

function emptyState(): TrackerState {
  return { recording: false, updatedAt: 0, track: [], log: [] };
}

/** Halve the track (keep every 2nd point) once it exceeds the cap. */
function thin(track: LivePoint[]): LivePoint[] {
  if (track.length <= MAX_POINTS) return track;
  return track.filter((_, i) => i % 2 === 0 || i === track.length - 1);
}

export async function getTracker(id: string): Promise<TrackerState> {
  let state: TrackerState | undefined;
  if (hasRedis) {
    const raw = await redisGet(KEY_PREFIX + id);
    state = raw ? (JSON.parse(raw) as TrackerState) : undefined;
  } else {
    state = memMap().get(id);
  }
  if (!state) return emptyState();
  state.log ??= []; // states written before the journal existed
  return state;
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
): Promise<TrackerState> {
  const state = await getTracker(id);
  state.track = thin([...state.track, ...points]);
  state.updatedAt = Date.now();
  state.recording = true;
  await setTracker(id, state);
  return state;
}

export async function appendLog(id: string, entry: LogEntry): Promise<void> {
  const state = await getTracker(id);
  state.log = [...state.log, entry].slice(-MAX_LOG);
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

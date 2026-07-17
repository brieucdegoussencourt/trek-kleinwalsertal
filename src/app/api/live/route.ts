import { NextResponse } from "next/server";
import { LIVE_TRACKERS } from "@/data/trek";
import {
  appendPoints,
  clearTracker,
  getTracker,
  setRecording,
  type LivePoint,
  type TrackerState,
} from "@/lib/liveStore";

const VALID_IDS = new Set(LIVE_TRACKERS.map((t) => t.id));

// ── GET: public state for viewers ───────────────────────────

export async function GET() {
  const trackers: Record<string, TrackerState> = {};
  for (const { id } of LIVE_TRACKERS) {
    trackers[id] = await getTracker(id);
  }
  return NextResponse.json(
    { trackers, now: Date.now() },
    { headers: { "Cache-Control": "no-store" } },
  );
}

// ── POST: recorder actions (key-protected) ──────────────────

interface LiveActionBody {
  user?: string;
  key?: string;
  action?: "points" | "start" | "stop" | "clear";
  points?: LivePoint[];
}

function isValidPoint(p: unknown): p is LivePoint {
  if (typeof p !== "object" || p === null) return false;
  const q = p as Record<string, unknown>;
  return (
    typeof q.lat === "number" &&
    typeof q.lng === "number" &&
    typeof q.t === "number" &&
    q.lat >= -90 &&
    q.lat <= 90 &&
    q.lng >= -180 &&
    q.lng <= 180
  );
}

export async function POST(req: Request) {
  let body: LiveActionBody;
  try {
    body = (await req.json()) as LiveActionBody;
  } catch {
    return NextResponse.json({ error: "corps invalide" }, { status: 400 });
  }

  const { user, key, action } = body;

  if (!user || !VALID_IDS.has(user)) {
    return NextResponse.json({ error: "utilisateur inconnu" }, { status: 400 });
  }

  // Only holders of the record key may write. If the env var is not
  // configured (local dev), writes are open.
  const requiredKey = process.env.LIVE_RECORD_KEY;
  if (requiredKey && key !== requiredKey) {
    return NextResponse.json({ error: "clé invalide" }, { status: 401 });
  }

  switch (action) {
    case "points": {
      const points = (body.points ?? []).filter(isValidPoint).slice(0, 500);
      if (points.length === 0) {
        return NextResponse.json({ error: "aucun point" }, { status: 400 });
      }
      await appendPoints(user, points);
      return NextResponse.json({ ok: true, added: points.length });
    }
    case "start":
      await setRecording(user, true);
      return NextResponse.json({ ok: true });
    case "stop":
      await setRecording(user, false);
      return NextResponse.json({ ok: true });
    case "clear":
      await clearTracker(user);
      return NextResponse.json({ ok: true });
    default:
      return NextResponse.json({ error: "action inconnue" }, { status: 400 });
  }
}

"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { LIVE_TRACKERS } from "@/data/trek";
import { TREK_TRACKS } from "@/data/tracks";
import type { LivePoint, TrackerState } from "@/lib/liveStore";

interface LiveMapProps {
  trackers: Record<string, TrackerState>;
  now: number;
}

const FADED = "#9CA3AF";

function isLive(state: TrackerState, now: number): boolean {
  return state.recording && now - state.updatedAt < 120_000;
}

export default function LiveMap({ trackers, now }: LiveMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);
  const didFitRef = useRef(false);

  // ── Init once ──────────────────────────────────────────────
  useEffect(() => {
    if (mapRef.current || !containerRef.current) return;

    const map = L.map(containerRef.current, {
      scrollWheelZoom: false,
      zoomControl: true,
    });

    L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
      maxZoom: 17,
      subdomains: "abc",
      attribution:
        '© <a href="https://openstreetmap.org">OpenStreetMap</a> · ' +
        '© <a href="https://opentopomap.org">OpenTopoMap</a> (CC-BY-SA)',
    }).addTo(map);

    // Default frame: the whole planned trek.
    const all = Object.values(TREK_TRACKS).flat() as [number, number][];
    map.fitBounds(L.latLngBounds(all), { padding: [30, 30] });

    layerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;
    setTimeout(() => map.invalidateSize(), 0);

    // The Live tab hides (not unmounts) this map; re-measure when the
    // container's size changes, e.g. when the tab becomes visible again.
    const observer = new ResizeObserver(() => map.invalidateSize());
    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
      map.remove();
      mapRef.current = null;
      layerRef.current = null;
      didFitRef.current = false;
    };
  }, []);

  // ── Redraw when tracker data changes ───────────────────────
  useEffect(() => {
    const map = mapRef.current;
    const layer = layerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();

    // Planned route, faint, for context.
    for (const track of Object.values(TREK_TRACKS)) {
      L.polyline(track, { color: FADED, weight: 2, opacity: 0.4 }).addTo(layer);
    }

    const livePts: LivePoint[] = [];

    for (const tracker of LIVE_TRACKERS) {
      const state = trackers[tracker.id];
      if (!state || state.track.length === 0) continue;

      // Split into segments at long gaps (pause, overnight, restart) so we
      // don't draw straight connector lines across the map.
      const GAP_MS = 30 * 60_000;
      const segments: [number, number][][] = [];
      let current: [number, number][] = [];
      let prev: LivePoint | null = null;
      for (const p of state.track) {
        if (prev && p.t - prev.t > GAP_MS && current.length > 0) {
          segments.push(current);
          current = [];
        }
        current.push([p.lat, p.lng]);
        prev = p;
      }
      if (current.length > 0) segments.push(current);

      for (const seg of segments) {
        L.polyline(seg, {
          color: tracker.color,
          weight: 4,
          opacity: 0.9,
        }).addTo(layer);
      }

      const last = state.track[state.track.length - 1];
      livePts.push(last);
      const live = isLive(state, now);

      const icon = L.divIcon({
        className: "live-marker",
        iconSize: [34, 34],
        iconAnchor: [17, 17],
        popupAnchor: [0, -18],
        html: `<div style="position:relative;width:34px;height:34px">
          ${live ? `<div style="position:absolute;inset:0;border-radius:50%;background:${tracker.color};opacity:.3;animation:live-ping 1.6s ease-out infinite"></div>` : ""}
          <div style="position:absolute;inset:3px;border-radius:50%;background:${tracker.color};color:#fff;display:flex;align-items:center;justify-content:center;font:700 13px/1 system-ui,sans-serif;border:2.5px solid #fff;box-shadow:0 1px 5px rgba(0,0,0,.4)">${tracker.name[0]}</div>
        </div>`,
      });

      const seenMin = Math.round((now - state.updatedAt) / 60_000);
      L.marker([last.lat, last.lng], { icon, title: tracker.name })
        .bindPopup(
          `<b>${tracker.name}</b><br>${
            live ? "🔴 En direct" : `Vu il y a ${seenMin} min`
          }${last.alt ? `<br>${Math.round(last.alt)} m` : ""}`,
        )
        .addTo(layer);
    }

    // First data arrival: frame the live positions.
    if (livePts.length > 0 && !didFitRef.current) {
      map.fitBounds(
        L.latLngBounds(livePts.map((p) => [p.lat, p.lng])),
        { padding: [60, 60], maxZoom: 14 },
      );
      didFitRef.current = true;
    }
  }, [trackers, now]);

  return (
    <div
      ref={containerRef}
      className="h-[380px] sm:h-[460px] w-full rounded-2xl overflow-hidden z-0"
    />
  );
}

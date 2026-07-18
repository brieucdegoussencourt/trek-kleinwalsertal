"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { TREK_DAYS, type WaypointKind } from "@/data/trek";
import { TREK_TRACKS } from "@/data/tracks";
import { createTopoLayer } from "@/lib/mapTiles";

// One colour per day — the overview legend and trails share these.
export const DAY_COLOR: Record<number, string> = {
  1: "#0F6E56", // pine
  2: "#D85A30", // coral
  3: "#378ADD", // azure
  4: "#EF9F27", // gold
};

// Marker colour by waypoint type (selected day's numbered markers).
const KIND_COLOR: Record<WaypointKind, string> = {
  start:    "#0F6E56",
  hut:      "#0F6E56",
  pass:     "#EF9F27",
  peak:     "#D85A30",
  village:  "#378ADD",
  poi:      "#5F5E5A",
  transfer: "#378ADD",
};

interface TrekMapProps {
  selectedDay: number;
  /** False = pure overview (no day emphasised, no numbered waypoints). */
  focused: boolean;
  onSelectDay: (dayNumber: number) => void;
  /** Back to the pure overview (called by the reset button). */
  onReset: () => void;
}

function allTrackBounds(): L.LatLngBounds {
  const pts = Object.values(TREK_TRACKS).flat() as [number, number][];
  return L.latLngBounds(pts);
}

export default function TrekMap({
  selectedDay,
  focused,
  onSelectDay,
  onReset,
}: TrekMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);

  // ── Init map once ──────────────────────────────────────────
  useEffect(() => {
    if (mapRef.current || !containerRef.current) return;

    const map = L.map(containerRef.current, {
      scrollWheelZoom: false,
      zoomControl: true,
    });

    createTopoLayer().addTo(map);

    map.fitBounds(allTrackBounds(), { padding: [30, 30] });

    layerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    // Ensure correct sizing after the container settles, and re-measure
    // whenever the container resizes (orientation change, layout shifts) —
    // a stale size leaves grey unrendered bands.
    setTimeout(() => map.invalidateSize(), 0);
    const observer = new ResizeObserver(() => map.invalidateSize());
    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
      map.remove();
      mapRef.current = null;
      layerRef.current = null;
    };
  }, []);

  // ── Redraw on selection / focus change ─────────────────────
  useEffect(() => {
    const map = mapRef.current;
    const layer = layerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();

    // Every day's trail in its own colour. In overview (not focused) all
    // days are equal; once a day is chosen it pops and the others dim.
    for (const day of TREK_DAYS) {
      const isSel = focused && day.dayNumber === selectedDay;
      const dim = focused && !isSel;
      const color = DAY_COLOR[day.dayNumber];
      const track = TREK_TRACKS[day.dayNumber];
      const select = () => onSelectDay(day.dayNumber);
      const tooltip = `Jour ${day.dayNumber} · ${day.label}`;

      if (track) {
        L.polyline(track, {
          color,
          weight: isSel ? 5 : 4,
          opacity: isSel ? 0.95 : dim ? 0.6 : 0.85,
        })
          .bindTooltip(tooltip, { sticky: true })
          .on("click", select)
          .addTo(layer);
      }

      // Transfer legs (bus/lift) — dashed, from the previous waypoint.
      day.waypoints.forEach((w, i) => {
        if (w.transfer && i > 0) {
          L.polyline([day.waypoints[i - 1].coord, w.coord], {
            color,
            weight: isSel ? 4 : 3,
            opacity: isSel ? 0.9 : dim ? 0.4 : 0.7,
            dashArray: "5 9",
          })
            .bindTooltip(tooltip, { sticky: true })
            .on("click", select)
            .addTo(layer);
        }
      });

      // Day badge at the trail's midpoint.
      if (track) {
        const mid = track[Math.floor(track.length / 2)];
        const badge = L.divIcon({
          className: "trek-day-badge",
          iconSize: [30, 30],
          iconAnchor: [15, 15],
          html: `<div style="width:30px;height:30px;border-radius:50%;background:${color};color:#fff;display:flex;align-items:center;justify-content:center;font:700 12px/1 system-ui,sans-serif;box-shadow:0 1px 5px rgba(0,0,0,.4);border:2px solid #fff;opacity:${dim ? 0.75 : 1};cursor:pointer">J${day.dayNumber}</div>`,
        });
        L.marker(mid, { icon: badge, title: tooltip })
          .on("click", select)
          .addTo(layer);
      }
    }

    // Numbered waypoints only once a day is explicitly chosen.
    if (!focused) return;
    const day = TREK_DAYS.find((d) => d.dayNumber === selectedDay);
    if (!day) return;

    day.waypoints.forEach((w, i) => {
      const icon = L.divIcon({
        className: "trek-wp",
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [0, -13],
        html: `<div style="width:24px;height:24px;border-radius:50%;background:${
          KIND_COLOR[w.kind]
        };color:#fff;display:flex;align-items:center;justify-content:center;font:700 11px/1 system-ui,sans-serif;box-shadow:0 1px 4px rgba(0,0,0,.35);border:2px solid #fff">${
          i + 1
        }</div>`,
      });
      L.marker(w.coord, { icon, title: w.name })
        .bindPopup(
          `<b>${w.name}</b>${w.altitudeM ? `<br>${w.altitudeM} m` : ""}`,
        )
        .addTo(layer);
    });

    map.fitBounds(L.latLngBounds(day.waypoints.map((w) => w.coord)), {
      padding: [45, 45],
      maxZoom: 14,
      animate: true,
    });
  }, [selectedDay, focused, onSelectDay]);

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="h-[380px] sm:h-[460px] w-full rounded-2xl overflow-hidden z-0"
      />
      {/* Reset to whole-trip overview */}
      {focused && (
        <button
          onClick={() => {
            onReset();
            mapRef.current?.fitBounds(allTrackBounds(), {
              padding: [30, 30],
              animate: true,
            });
          }}
          className="absolute top-3 right-3 z-[1000] rounded-lg bg-white/95 border border-stone-200 shadow-sm px-3 py-1.5 text-[11px] font-semibold text-stone-600 hover:text-pine transition-colors"
        >
          ↺ Vue d&rsquo;ensemble
        </button>
      )}
    </div>
  );
}

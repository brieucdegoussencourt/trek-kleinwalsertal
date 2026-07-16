"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { TREK_DAYS, type WaypointKind } from "@/data/trek";
import { TREK_TRACKS } from "@/data/tracks";

// Marker colour by waypoint type — mirrors the site's design tokens.
const KIND_COLOR: Record<WaypointKind, string> = {
  start:    "#0F6E56", // pine
  hut:      "#0F6E56", // pine
  pass:     "#EF9F27", // gold
  peak:     "#D85A30", // coral
  village:  "#378ADD", // azure
  poi:      "#5F5E5A", // rock
  transfer: "#378ADD", // azure
};

const PINE = "#0F6E56";
const AZURE = "#378ADD";
const FADED = "#9CA3AF";

interface TrekMapProps {
  selectedDay: number;
  onSelectDay: (dayNumber: number) => void;
}

export default function TrekMap({ selectedDay, onSelectDay }: TrekMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);

  // ── Init map once ──────────────────────────────────────────
  useEffect(() => {
    if (mapRef.current || !containerRef.current) return;

    const map = L.map(containerRef.current, {
      scrollWheelZoom: false,
      zoomControl: true,
    }).setView([47.32, 10.16], 12);

    L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
      maxZoom: 17,
      subdomains: "abc",
      attribution:
        '© <a href="https://openstreetmap.org">OpenStreetMap</a> · ' +
        '© <a href="https://opentopomap.org">OpenTopoMap</a> (CC-BY-SA)',
    }).addTo(map);

    layerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    // Ensure correct sizing after the container settles.
    setTimeout(() => map.invalidateSize(), 0);

    return () => {
      map.remove();
      mapRef.current = null;
      layerRef.current = null;
    };
  }, []);

  // ── Redraw routes on day selection ─────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    const layer = layerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();

    // Faded context: every other day's real trail.
    for (const day of TREK_DAYS) {
      if (day.dayNumber === selectedDay) continue;
      const track = TREK_TRACKS[day.dayNumber];
      if (track) {
        L.polyline(track, { color: FADED, weight: 2, opacity: 0.55 })
          .on("click", () => onSelectDay(day.dayNumber))
          .addTo(layer);
      }
      for (const w of day.waypoints) {
        L.circleMarker(w.coord, {
          radius: 3,
          color: FADED,
          weight: 1,
          fillColor: "#ffffff",
          fillOpacity: 1,
        })
          .on("click", () => onSelectDay(day.dayNumber))
          .addTo(layer);
      }
    }

    // Highlighted: the selected day, drawn on top.
    const day = TREK_DAYS.find((d) => d.dayNumber === selectedDay);
    if (!day) return;
    const pts = day.waypoints;

    // Real trail geometry.
    const track = TREK_TRACKS[day.dayNumber];
    if (track) {
      L.polyline(track, { color: PINE, weight: 4, opacity: 0.9 }).addTo(layer);
    }

    // Transfer legs (bus/lift) — dashed straight line from the previous waypoint.
    pts.forEach((w, i) => {
      if (w.transfer && i > 0) {
        L.polyline([pts[i - 1].coord, w.coord], {
          color: AZURE,
          weight: 4,
          opacity: 0.9,
          dashArray: "5 9",
        }).addTo(layer);
      }
    });

    pts.forEach((w, i) => {
      const icon = L.divIcon({
        className: "trek-wp",
        iconSize: [26, 26],
        iconAnchor: [13, 13],
        popupAnchor: [0, -14],
        html: `<div style="width:26px;height:26px;border-radius:50%;background:${
          KIND_COLOR[w.kind]
        };color:#fff;display:flex;align-items:center;justify-content:center;font:700 12px/1 system-ui,sans-serif;box-shadow:0 1px 4px rgba(0,0,0,.35);border:2px solid #fff">${
          i + 1
        }</div>`,
      });
      L.marker(w.coord, { icon, title: w.name })
        .bindPopup(
          `<b>${w.name}</b>${w.altitudeM ? `<br>${w.altitudeM} m` : ""}`,
        )
        .addTo(layer);
    });

    map.fitBounds(L.latLngBounds(pts.map((w) => w.coord)), {
      padding: [45, 45],
      maxZoom: 14,
      animate: true,
    });
  }, [selectedDay, onSelectDay]);

  return (
    <div
      ref={containerRef}
      className="h-[360px] sm:h-[440px] w-full rounded-2xl overflow-hidden z-0"
    />
  );
}

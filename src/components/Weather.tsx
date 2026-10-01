"use client";

import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  CloudSunRain,
  Droplets,
  Sun,
  TriangleAlert,
  Wind,
  type LucideIcon,
} from "lucide-react";
import { TREK_DAYS, WEATHER_SPOTS, WEATHER_LINKS } from "@/data/trek";

// ─── WMO weather codes → icon + French label ───────────────

function wmoInfo(code: number): { icon: LucideIcon; label: string } {
  if (code === 0)              return { icon: Sun,            label: "Grand soleil" };
  if (code <= 2)               return { icon: CloudSun,       label: "Éclaircies" };
  if (code === 3)              return { icon: Cloud,          label: "Couvert" };
  if (code <= 48)              return { icon: CloudFog,       label: "Brouillard" };
  if (code <= 57)              return { icon: CloudDrizzle,   label: "Bruine" };
  if (code <= 67)              return { icon: CloudRain,      label: "Pluie" };
  if (code <= 77)              return { icon: CloudSnow,      label: "Neige" };
  if (code <= 82)              return { icon: CloudSunRain,   label: "Averses" };
  if (code <= 86)              return { icon: CloudSnow,      label: "Averses de neige" };
  return { icon: CloudLightning, label: "Orage" };
}

interface DayForecast {
  dayNumber: number;
  spotName: string;
  altitudeM: number;
  icon: LucideIcon;
  label: string;
  tMax: number;
  tMin: number;
  precipMm: number;
  precipProb: number | null;
  gustsKmh: number;
}

type FetchState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ok"; forecasts: DayForecast[] };

export default function Weather() {
  const [state, setState] = useState<FetchState>({ status: "loading" });

  useEffect(() => {
    const lats = WEATHER_SPOTS.map((s) => s.coord[0]).join(",");
    const lons = WEATHER_SPOTS.map((s) => s.coord[1]).join(",");
    const eles = WEATHER_SPOTS.map((s) => s.altitudeM).join(",");
    const start = WEATHER_SPOTS[0].dateIso;
    const end = WEATHER_SPOTS[WEATHER_SPOTS.length - 1].dateIso;
    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lons}&elevation=${eles}` +
      `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_gusts_10m_max` +
      `&timezone=Europe%2FVienna&start_date=${start}&end_date=${end}`;

    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        const results = Array.isArray(data) ? data : [data];
        const forecasts = WEATHER_SPOTS.map((spot, i) => {
          const daily = results[i]?.daily;
          const idx = daily?.time?.indexOf(spot.dateIso);
          if (idx === undefined || idx < 0) throw new Error("date hors fenêtre");
          const { icon, label } = wmoInfo(daily.weather_code[idx]);
          return {
            dayNumber: spot.dayNumber,
            spotName: spot.name,
            altitudeM: spot.altitudeM,
            icon,
            label,
            tMax: Math.round(daily.temperature_2m_max[idx]),
            tMin: Math.round(daily.temperature_2m_min[idx]),
            precipMm: Math.round(daily.precipitation_sum[idx] * 10) / 10,
            precipProb: daily.precipitation_probability_max?.[idx] ?? null,
            gustsKmh: Math.round(daily.wind_gusts_10m_max[idx]),
          };
        });
        setState({ status: "ok", forecasts });
      })
      .catch(() => setState({ status: "error" }));
  }, []);

  return (
    <div className="space-y-10">
      <section>
        <h3 className="font-display text-2xl font-medium tracking-tight text-ink mb-1">
          Prévisions sur le parcours
        </h3>
        <p className="text-sm text-stone-600 mb-5">
          Au point haut de chaque étape, température ajustée à l&rsquo;altitude
          — source Open-Meteo, actualisé à chaque visite.
        </p>

        <p role="status" className="sr-only">
          {state.status === "loading"
            ? "Chargement des prévisions…"
            : state.status === "ok"
              ? "Prévisions chargées."
              : ""}
        </p>

        {state.status === "loading" && (
          <div aria-hidden="true" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {WEATHER_SPOTS.map((s) => (
              <div
                key={s.dayNumber}
                className="h-48 rounded-xl bg-line/60 animate-pulse"
              />
            ))}
          </div>
        )}

        {state.status === "error" && (
          <div role="alert" className="flex gap-3 rounded-lg border border-line bg-white px-4 py-3 text-sm text-stone-700 leading-relaxed">
            <TriangleAlert aria-hidden="true" className="size-4 shrink-0 mt-0.5 text-gold-deep" />
            Prévisions indisponibles pour le moment — la fenêtre de prévision
            est d&rsquo;environ 16 jours. Consultez les sites spécialisés
            ci-dessous.
          </div>
        )}

        {state.status === "ok" && (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {state.forecasts.map((f) => {
              const day = TREK_DAYS.find((d) => d.dayNumber === f.dayNumber)!;
              const wetWarning =
                (f.precipProb !== null && f.precipProb >= 60) || f.gustsKmh >= 60;
              return (
                <li
                  key={f.dayNumber}
                  className="bg-white rounded-xl border border-line p-4 flex flex-col gap-3"
                >
                  <div>
                    <h4 className="text-xs text-rock">
                      <span className="font-semibold text-ink">Jour {f.dayNumber}</span> · {day.dateShort}
                    </h4>
                    <p className="text-xs text-rock mt-0.5">
                      {f.spotName} · {f.altitudeM} m
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <f.icon aria-hidden="true" className="size-8 shrink-0 text-pine" strokeWidth={1.5} />
                    <div>
                      <p className="text-sm font-medium text-ink">
                        {f.label}
                      </p>
                      <p className="text-sm text-stone-600 tabular-nums">
                        <span className="sr-only">Maximum </span>
                        <span className="font-semibold text-ink">{f.tMax}°</span>
                        <span aria-hidden="true"> / </span>
                        <span className="sr-only">, minimum </span>
                        {f.tMin}°
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1 pt-3 border-t border-line text-xs text-stone-600 tabular-nums">
                    <p className={`flex items-center gap-1.5 ${wetWarning ? "text-coral-deep font-medium" : ""}`}>
                      <Droplets aria-hidden="true" className="size-3.5" />
                      <span className="sr-only">Précipitations : </span>
                      {f.precipMm} mm
                      {f.precipProb !== null && (
                        <>
                          <span aria-hidden="true"> · </span>
                          <span className="sr-only">, probabilité </span>
                          {f.precipProb}%
                        </>
                      )}
                    </p>
                    <p className="flex items-center gap-1.5"><Wind aria-hidden="true" className="size-3.5" />rafales {f.gustsKmh} km/h</p>
                  </div>

                  {wetWarning && (
                    <p className="flex items-center gap-1.5 text-xs font-medium text-coral-deep">
                      <TriangleAlert aria-hidden="true" className="size-3.5" />Journée à surveiller — partir tôt
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* Specialist sources */}
      <section>
        <h3 className="font-display text-2xl font-medium tracking-tight text-ink mb-4">
          Sites spécialisés montagne
        </h3>
        <ul className="grid sm:grid-cols-3 gap-3">
          {WEATHER_LINKS.map((l) => (
            <li key={l.url} className="flex">
              <a
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-white rounded-xl border border-line px-4 py-3 hover:border-stone-300 transition-colors"
              >
                <p className="flex items-center gap-1 text-sm font-medium text-ink">
                  {l.label}
                  <span className="sr-only"> (nouvel onglet)</span>
                  <ArrowUpRight aria-hidden="true" className="size-3.5 text-rock" />
                </p>
                <p className="text-xs text-stone-600 mt-0.5">{l.note}</p>
              </a>
            </li>
          ))}
        </ul>
        <p className="text-[11px] text-stone-600 mt-4 leading-relaxed">
          En juillet, vérifiez la météo chaque soir au refuge et chaque matin
          avant de partir : les orages se forment souvent en début
          d&rsquo;après-midi.
        </p>
      </section>
    </div>
  );
}

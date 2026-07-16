"use client";

import { useEffect, useState } from "react";
import { TREK_DAYS, WEATHER_SPOTS, WEATHER_LINKS } from "@/data/trek";

// ─── WMO weather codes → emoji + French label ───────────────

function wmoInfo(code: number): { emoji: string; label: string } {
  if (code === 0)              return { emoji: "☀️", label: "Grand soleil" };
  if (code <= 2)               return { emoji: "🌤️", label: "Éclaircies" };
  if (code === 3)              return { emoji: "☁️", label: "Couvert" };
  if (code <= 48)              return { emoji: "🌫️", label: "Brouillard" };
  if (code <= 57)              return { emoji: "🌦️", label: "Bruine" };
  if (code <= 67)              return { emoji: "🌧️", label: "Pluie" };
  if (code <= 77)              return { emoji: "🌨️", label: "Neige" };
  if (code <= 82)              return { emoji: "🌦️", label: "Averses" };
  if (code <= 86)              return { emoji: "🌨️", label: "Averses de neige" };
  return { emoji: "⛈️", label: "Orage" };
}

interface DayForecast {
  dayNumber: number;
  spotName: string;
  altitudeM: number;
  emoji: string;
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
          const { emoji, label } = wmoInfo(daily.weather_code[idx]);
          return {
            dayNumber: spot.dayNumber,
            spotName: spot.name,
            altitudeM: spot.altitudeM,
            emoji,
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
        <h3 className="font-display text-xl text-stone-700 mb-1">
          Prévisions sur le parcours
        </h3>
        <p className="text-sm text-stone-400 mb-5">
          Au point haut de chaque étape, température ajustée à l&rsquo;altitude
          — source Open-Meteo, actualisé à chaque visite.
        </p>

        {state.status === "loading" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {WEATHER_SPOTS.map((s) => (
              <div
                key={s.dayNumber}
                className="h-48 rounded-2xl bg-stone-100 animate-pulse"
              />
            ))}
          </div>
        )}

        {state.status === "error" && (
          <div className="bg-gold/10 border-l-4 border-gold rounded-r-md px-4 py-3 text-sm text-[#7a4e00] leading-relaxed">
            Prévisions indisponibles pour le moment — la fenêtre de prévision
            est d&rsquo;environ 16 jours. Consultez les sites spécialisés
            ci-dessous.
          </div>
        )}

        {state.status === "ok" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {state.forecasts.map((f) => {
              const day = TREK_DAYS.find((d) => d.dayNumber === f.dayNumber)!;
              const wetWarning =
                (f.precipProb !== null && f.precipProb >= 60) || f.gustsKmh >= 60;
              return (
                <div
                  key={f.dayNumber}
                  className="bg-white rounded-2xl border border-stone-200 p-4 flex flex-col gap-3"
                >
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-pine">
                      Jour {f.dayNumber} · {day.dateShort}
                    </p>
                    <p className="text-xs text-stone-400 mt-0.5">
                      {f.spotName} · {f.altitudeM} m
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-3xl leading-none">{f.emoji}</span>
                    <div>
                      <p className="text-sm font-semibold text-stone-800">
                        {f.label}
                      </p>
                      <p className="text-sm text-stone-500 tabular-nums">
                        <span className="font-bold text-stone-800">{f.tMax}°</span>
                        {" / "}
                        {f.tMin}°
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs text-stone-500 tabular-nums">
                    <p className={wetWarning ? "text-coral font-semibold" : ""}>
                      💧 {f.precipMm} mm
                      {f.precipProb !== null && ` · ${f.precipProb}%`}
                    </p>
                    <p>💨 rafales {f.gustsKmh} km/h</p>
                  </div>

                  {wetWarning && (
                    <p className="text-[11px] font-semibold text-coral bg-coral/10 rounded-md px-2 py-1">
                      ⚠ Journée à surveiller — partir tôt
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Specialist sources */}
      <section>
        <h3 className="font-display text-xl text-stone-700 mb-4">
          Sites spécialisés montagne
        </h3>
        <div className="grid sm:grid-cols-3 gap-3">
          {WEATHER_LINKS.map((l) => (
            <a
              key={l.url}
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-xl border border-stone-200 px-4 py-3 hover:border-pine/40 transition-colors"
            >
              <p className="text-sm font-semibold text-stone-800">{l.label} →</p>
              <p className="text-xs text-stone-400 mt-0.5">{l.note}</p>
            </a>
          ))}
        </div>
        <p className="text-[11px] text-stone-400 mt-4 leading-relaxed">
          En juillet, vérifiez la météo chaque soir au refuge et chaque matin
          avant de partir : les orages se forment souvent en début
          d&rsquo;après-midi.
        </p>
      </section>
    </div>
  );
}

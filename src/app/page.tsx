"use client";

import { useState } from "react";
import {
  TREK_DAYS,
  TREK_SUMMARY,
  CHECKLIST,
  GEAR,
  TREK_META,
  type TrekDay,
  type ChecklistItem,
  type GearItem,
} from "@/data/trek";

// ─── Constants ───────────────────────────────────────────────

const DIFFICULTY_LABEL: Record<TrekDay["difficulty"], string> = {
  easy: "Facile",
  moderate: "Modérée",
  sustained: "Soutenu",
  hard: "Difficile",
};

const DIFFICULTY_PILL: Record<TrekDay["difficulty"], string> = {
  easy: "bg-emerald-100 text-emerald-800",
  moderate: "bg-amber-100 text-amber-800",
  sustained: "bg-orange-100 text-orange-800",
  hard: "bg-red-100 text-red-800",
};

const DIFFICULTY_BORDER: Record<TrekDay["difficulty"], string> = {
  easy: "border-l-emerald-400",
  moderate: "border-l-[#EF9F27]",
  sustained: "border-l-orange-400",
  hard: "border-l-red-500",
};

const ACCOM_LABEL: Record<TrekDay["accommodation"]["type"], string> = {
  "refuge-dav": "Refuge DAV",
  "refuge-prive": "Refuge privé",
  hotel: "Hôtel",
};

// ─── Shared atoms ─────────────────────────────────────────────

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-5 mb-10">
      <div className="h-px flex-1 bg-stone-200" />
      <h2 className="font-display italic text-2xl text-stone-700 whitespace-nowrap">
        {children}
      </h2>
      <div className="h-px flex-1 bg-stone-200" />
    </div>
  );
}

function StatCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-stone-50 rounded-xl px-3 py-3 text-center">
      <p className="text-base font-bold text-stone-800 tabular-nums">{value}</p>
      <p className="text-[10px] text-stone-400 uppercase tracking-widest mt-0.5">{label}</p>
    </div>
  );
}

// ─── Day card (expandable) ────────────────────────────────────

function DayCard({ day }: { day: TrekDay }) {
  const [open, setOpen] = useState(false);

  const route = day.via
    ? `${day.from} → ${day.via} → ${day.to}`
    : `${day.from} → ${day.to}`;

  return (
    <article
      className={`border-l-4 ${DIFFICULTY_BORDER[day.difficulty]} bg-white rounded-r-2xl shadow-sm overflow-hidden`}
    >
      {/* ── Collapsed header ── */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="w-full text-left px-5 py-5 flex items-start gap-4 hover:bg-stone-50/70 transition-colors group"
      >
        {/* Day badge */}
        <div className="shrink-0 w-11 h-11 rounded-full bg-[#EF9F27] flex flex-col items-center justify-center text-white shadow-sm">
          <span className="text-[9px] font-bold uppercase leading-none tracking-wide">Jour</span>
          <span className="text-lg font-bold leading-none">{day.dayNumber}</span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-xs text-stone-400 uppercase tracking-widest">{day.date}</span>
            <span
              className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${DIFFICULTY_PILL[day.difficulty]}`}
            >
              {DIFFICULTY_LABEL[day.difficulty]}
            </span>
          </div>
          <h3 className="font-display text-[1.2rem] leading-snug text-stone-900">{day.label}</h3>
          <p className="text-sm text-stone-400 mt-0.5 truncate">{route}</p>

          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-sm font-medium text-stone-700">
            <span>{day.stats.distanceKm} km</span>
            <span className="text-stone-300">·</span>
            <span>↑ {day.stats.elevationGainM} m</span>
            <span className="text-stone-300">·</span>
            <span>↓ {day.stats.elevationLossM} m</span>
            <span className="text-stone-300">·</span>
            <span>{day.stats.durationMin}–{day.stats.durationMax}</span>
          </div>
        </div>

        {/* Chevron */}
        <span
          className={`shrink-0 text-stone-300 text-xl leading-none mt-1 transition-transform duration-300 group-hover:text-stone-500 ${open ? "rotate-180" : ""}`}
        >
          ⌄
        </span>
      </button>

      {/* ── Expanded body ── */}
      {open && (
        <div className="px-5 pb-6 pt-1 border-t border-stone-100 space-y-6">
          {/* Full stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-3">
            <StatCell label="Distance" value={`${day.stats.distanceKm} km`} />
            <StatCell label="D +" value={`${day.stats.elevationGainM} m`} />
            <StatCell label="D −" value={`${day.stats.elevationLossM} m`} />
            <StatCell label="Durée" value={`${day.stats.durationMin}–${day.stats.durationMax}`} />
            <StatCell label="Altitude nuit" value={`${day.stats.altitudeNightM} m`} />
          </div>

          {/* Warning banner */}
          {day.warning && (
            <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-900 leading-relaxed">
              <p className="font-semibold mb-1">⚠ Vigilance</p>
              <p>{day.warning}</p>
            </div>
          )}

          {/* Must-see */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0F6E56] mb-3">
              À ne pas manquer
            </p>
            <ul className="space-y-3">
              {day.mustSee.map((item) => (
                <li key={item.title} className="flex gap-3">
                  <span className="text-[#EF9F27] shrink-0 mt-0.5 text-base leading-none">★</span>
                  <div>
                    <p className="font-semibold text-sm text-stone-800">{item.title}</p>
                    <p className="text-sm text-stone-500 leading-relaxed mt-0.5">{item.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Bonus tips */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#378ADD] mb-3">
              Bons plans
            </p>
            <ul className="space-y-3">
              {day.bonusTips.map((item) => (
                <li key={item.title} className="flex gap-3">
                  <span className="text-[#378ADD] shrink-0 mt-0.5 font-bold text-sm leading-none">→</span>
                  <div>
                    <p className="font-semibold text-sm text-stone-800">{item.title}</p>
                    <p className="text-sm text-stone-500 leading-relaxed mt-0.5">{item.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Practical info banner */}
          {day.practicalInfo && (
            <div className="rounded-xl bg-[#378ADD]/8 border border-[#378ADD]/20 px-4 py-3 text-sm text-stone-800 leading-relaxed">
              <p className="font-semibold text-[#378ADD] mb-1 text-[11px] uppercase tracking-widest">
                Infos pratiques
              </p>
              <p>{day.practicalInfo}</p>
            </div>
          )}

          {/* Accommodation */}
          <div className="rounded-xl bg-[#0F6E56]/6 border border-[#0F6E56]/15 px-4 py-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0F6E56] mb-3">
              Nuit · {ACCOM_LABEL[day.accommodation.type]}
            </p>
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-0.5">
                <p className="font-semibold text-stone-800">{day.accommodation.name}</p>
                {day.accommodation.altitudeM && (
                  <p className="text-sm text-stone-500">{day.accommodation.altitudeM} m d'altitude</p>
                )}
                {day.accommodation.capacity && (
                  <p className="text-sm text-stone-500">{day.accommodation.capacity}</p>
                )}
                {day.accommodation.paymentNote && (
                  <p className="text-sm font-semibold text-red-700 mt-1">{day.accommodation.paymentNote}</p>
                )}
                {day.accommodation.priceNote && (
                  <p className="text-sm text-stone-600">{day.accommodation.priceNote}</p>
                )}
              </div>
              {day.accommodation.bookingUrl && (
                <a
                  href={day.accommodation.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="shrink-0 rounded-lg bg-[#0F6E56] text-white text-xs font-semibold px-3 py-2 hover:bg-[#0a5843] transition-colors whitespace-nowrap"
                >
                  Réserver →
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </article>
  );
}

// ─── Checklist row ────────────────────────────────────────────

function ChecklistRow({ item }: { item: ChecklistItem }) {
  const [checked, setChecked] = useState(false);
  return (
    <div
      className={`flex items-start gap-4 rounded-xl border px-4 py-3 shadow-sm cursor-pointer transition-colors select-none ${
        checked
          ? "bg-[#0F6E56]/5 border-[#0F6E56]/20"
          : "bg-white border-stone-100 hover:border-stone-200"
      }`}
      onClick={() => setChecked((c) => !c)}
    >
      <div
        className={`mt-0.5 h-5 w-5 shrink-0 rounded border-2 flex items-center justify-center transition-colors ${
          checked ? "bg-[#0F6E56] border-[#0F6E56]" : "border-stone-300"
        }`}
      >
        {checked && (
          <span className="text-white text-xs font-bold leading-none">✓</span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        {item.url && !checked ? (
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="font-medium text-sm text-stone-800 hover:text-[#0F6E56] underline underline-offset-2 transition-colors"
          >
            {item.label}
          </a>
        ) : (
          <p className={`font-medium text-sm transition-colors ${checked ? "line-through text-stone-400" : "text-stone-800"}`}>
            {item.label}
          </p>
        )}
        {item.note && !checked && (
          <p className="text-xs text-stone-400 mt-0.5">{item.note}</p>
        )}
      </div>
    </div>
  );
}

// ─── Gear item ────────────────────────────────────────────────

function GearRow({ item }: { item: GearItem }) {
  return (
    <li className="flex items-center gap-3 text-sm py-1">
      <span
        className={`shrink-0 h-1.5 w-1.5 rounded-full ${
          item.priority === "essential" ? "bg-[#EF9F27]" : "bg-stone-300"
        }`}
      />
      <span className={item.priority === "essential" ? "text-stone-700" : "text-stone-500"}>
        {item.label}
      </span>
    </li>
  );
}

// ─── Page ─────────────────────────────────────────────────────

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] font-sans text-foreground">
      {/* ══ Hero ══════════════════════════════════════════════ */}
      <header className="relative bg-[#0F6E56] text-white overflow-hidden">
        {/* Dot grid texture */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="relative max-w-2xl mx-auto px-6 py-20 text-center">
          <p className="text-[11px] uppercase tracking-[0.4em] text-white/50 mb-5">
            {TREK_META.participants} · {TREK_META.month} · {TREK_META.region}
          </p>
          <h1 className="font-display text-5xl sm:text-6xl font-bold leading-none mb-3 text-white">
            {TREK_META.title}
          </h1>
          <p className="text-white/60 text-base mt-2">{TREK_META.subtitle}</p>
          <p className="font-display italic text-white/40 text-xl mt-8">
            &ldquo;{TREK_META.tagline}&rdquo;
          </p>

          {/* Stats bar */}
          <div className="mt-12 grid grid-cols-3 sm:grid-cols-6 gap-2">
            {[
              { label: "km", value: String(TREK_SUMMARY.totalKm) },
              { label: "D +", value: `${TREK_SUMMARY.totalElevationGainM}m` },
              { label: "D −", value: `${TREK_SUMMARY.totalElevationLossM}m` },
              { label: "marche", value: TREK_SUMMARY.totalHikingHours },
              { label: "jours", value: String(TREK_SUMMARY.days) },
              { label: "nuits", value: String(TREK_SUMMARY.nights) },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="bg-white/10 rounded-xl py-3 px-2 text-center backdrop-blur-sm"
              >
                <p className="text-xl font-bold tabular-nums text-white">{value}</p>
                <p className="text-[10px] text-white/40 uppercase tracking-widest mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-16 space-y-24">
        {/* ══ Intro ══════════════════════════════════════════ */}
        <section>
          <p className="font-display italic text-stone-500 text-lg leading-relaxed text-center">
            {TREK_META.description}
          </p>
        </section>

        {/* ══ Itinerary ══════════════════════════════════════ */}
        <section>
          <SectionTitle>L&rsquo;Itinéraire</SectionTitle>
          <div className="space-y-4">
            {TREK_DAYS.map((day) => (
              <DayCard key={day.dayNumber} day={day} />
            ))}
          </div>
        </section>

        {/* ══ Summary table ══════════════════════════════════ */}
        <section>
          <SectionTitle>Récapitulatif</SectionTitle>
          <div className="overflow-x-auto rounded-2xl border border-stone-200 shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#0F6E56] text-white">
                  {["Jour", "Étape", "km", "D +", "D −", "Durée"].map((h, i) => (
                    <th
                      key={h}
                      className={`px-4 py-3 text-[11px] font-semibold uppercase tracking-wider ${
                        i === 0 || i === 1 ? "text-left" : "text-right"
                      }`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TREK_DAYS.map((day, i) => (
                  <tr
                    key={day.dayNumber}
                    className={`${i % 2 === 0 ? "bg-white" : "bg-stone-50"} hover:bg-stone-100 transition-colors`}
                  >
                    <td className="px-4 py-3 font-bold text-[#EF9F27] whitespace-nowrap">
                      J. {day.dayNumber}
                    </td>
                    <td className="px-4 py-3 text-stone-700">
                      <span className="font-medium">{day.from}</span>
                      <span className="text-stone-300 mx-1">→</span>
                      <span className="font-medium">{day.to}</span>
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-stone-700">
                      {day.stats.distanceKm}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-stone-700">
                      +{day.stats.elevationGainM}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-stone-700">
                      −{day.stats.elevationLossM}
                    </td>
                    <td className="px-4 py-3 text-right text-stone-700 whitespace-nowrap">
                      {day.stats.durationMin}–{day.stats.durationMax}
                    </td>
                  </tr>
                ))}
                <tr className="border-t-2 border-stone-200 bg-stone-100 font-bold">
                  <td className="px-4 py-3 text-stone-700" colSpan={2}>
                    Total
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-stone-800">
                    {TREK_SUMMARY.totalKm}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-stone-800">
                    +{TREK_SUMMARY.totalElevationGainM}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-stone-800">
                    −{TREK_SUMMARY.totalElevationLossM}
                  </td>
                  <td className="px-4 py-3 text-right text-stone-800">
                    {TREK_SUMMARY.totalHikingHours}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ══ Checklist ══════════════════════════════════════ */}
        <section>
          <SectionTitle>Avant de partir</SectionTitle>
          <div className="space-y-2">
            {CHECKLIST.map((item) => (
              <ChecklistRow key={item.label} item={item} />
            ))}
          </div>
        </section>

        {/* ══ Gear ═══════════════════════════════════════════ */}
        <section>
          <SectionTitle>Équipement</SectionTitle>
          <div className="grid sm:grid-cols-2 gap-8">
            {/* Essential */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px flex-1 bg-[#EF9F27]/25" />
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#EF9F27]">
                  Essentiel
                </p>
                <div className="h-px flex-1 bg-[#EF9F27]/25" />
              </div>
              <ul className="space-y-1">
                {GEAR.filter((g) => g.priority === "essential").map((item) => (
                  <GearRow key={item.label} item={item} />
                ))}
              </ul>
            </div>
            {/* Recommended */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px flex-1 bg-stone-200" />
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-stone-400">
                  Recommandé
                </p>
                <div className="h-px flex-1 bg-stone-200" />
              </div>
              <ul className="space-y-1">
                {GEAR.filter((g) => g.priority === "recommended").map((item) => (
                  <GearRow key={item.label} item={item} />
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>

      {/* ══ Footer ════════════════════════════════════════════ */}
      <footer className="border-t border-stone-200 py-12 text-center space-y-2">
        <p className="font-display italic text-stone-400 text-base">
          &ldquo;{TREK_META.quote}&rdquo;
        </p>
        <p className="text-stone-300 text-xs">{TREK_META.credit}</p>
      </footer>
    </div>
  );
}

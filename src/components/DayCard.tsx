"use client";

import type { TrekDay } from "@/data/trek";

interface DayCardProps {
  day: TrekDay;
  isActive: boolean;
  onClick: () => void;
}

const DIFFICULTY_LABEL: Record<TrekDay["difficulty"], string> = {
  easy:      "Facile",
  moderate:  "Modérée",
  sustained: "Soutenu",
  hard:      "Difficile",
};

function Pill({ bg, text, children }: { bg: string; text: string; children: React.ReactNode }) {
  return (
    <span className={`inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded tracking-[0.04em] ${bg} ${text}`}>
      {children}
    </span>
  );
}

export default function DayCard({ day, isActive, onClick }: DayCardProps) {
  const isHard = day.difficulty === "sustained" || day.difficulty === "hard";

  return (
    <button
      onClick={onClick}
      aria-pressed={isActive}
      className={`w-full text-left rounded-xl border-2 bg-white p-4 transition-all duration-200 ${
        isActive
          ? "border-pine shadow-md shadow-pine/10"
          : "border-stone-200 hover:border-stone-300 hover:shadow-sm"
      }`}
    >
      {/* Header row */}
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className={`text-[10px] uppercase tracking-[0.1em] font-bold ${isActive ? "text-pine" : "text-rock"}`}>
            Jour {day.dayNumber}
          </p>
          <p className="text-xs text-stone-400 mt-0.5">{day.dateShort}</p>
        </div>
        {isActive && (
          <span className="h-2 w-2 rounded-full bg-pine shrink-0 mt-1" />
        )}
      </div>

      {/* Label */}
      <p className="font-display font-semibold text-[0.95rem] text-stone-800 leading-snug mb-1">
        {day.label}
      </p>

      {/* Route */}
      <p className="text-xs text-stone-400 mb-3 truncate">
        {day.from}
        {day.via ? ` → ${day.via}` : ""}
        {" → "}{day.to}
      </p>

      {/* Pills */}
      <div className="flex flex-wrap gap-1.5">
        <Pill bg="bg-emerald-100" text="text-emerald-800">
          {day.stats.distanceKm} km
        </Pill>
        <Pill bg="bg-gold/15" text="text-[#7a4e00]">
          ↑ {day.stats.elevationGainM} m
        </Pill>
        <Pill bg="bg-azure/15" text="text-[#1a4a7a]">
          {day.stats.durationMin}–{day.stats.durationMax}
        </Pill>
        {isHard && (
          <Pill bg="bg-coral/15" text="text-[#7a2800]">
            {DIFFICULTY_LABEL[day.difficulty]}
          </Pill>
        )}
      </div>
    </button>
  );
}

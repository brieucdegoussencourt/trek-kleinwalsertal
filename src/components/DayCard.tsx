"use client";

import { Clock, Footprints, TrendingUp } from "lucide-react";
import type { TrekDay } from "@/data/trek";
import DifficultyBadge from "@/components/DifficultyBadge";

interface DayCardProps {
  day: TrekDay;
  isActive: boolean;
  onClick: () => void;
}

/** Route separator: an arrow for the eye, "vers" for screen readers. */
function Arrow() {
  return (
    <>
      <span aria-hidden="true"> → </span>
      <span className="sr-only"> vers </span>
    </>
  );
}

export default function DayCard({ day, isActive, onClick }: DayCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      className={`w-full flex flex-col text-left rounded-xl border bg-white p-4 transition-[border-color,box-shadow] duration-200 ${
        isActive
          ? "border-pine ring-3 ring-pine/10"
          : "border-line hover:border-stone-300"
      }`}
    >
      {/* Header row */}
      <div className="flex items-center justify-between gap-2 text-xs text-rock">
        <p>
          <span className={`font-semibold ${isActive ? "text-pine" : "text-ink"}`}>
            Jour {day.dayNumber}
          </span>
          {" · "}
          {day.dateShort}
        </p>
        {(day.difficulty === "sustained" || day.difficulty === "hard") && (
          <DifficultyBadge difficulty={day.difficulty} />
        )}
      </div>

      {/* Label */}
      <p className="font-display font-medium text-[1.05rem] text-ink leading-snug mt-2.5 mb-1">
        {day.label}
      </p>

      {/* Route */}
      <p className="text-xs text-rock mb-4 truncate">
        {day.from}
        {day.via && <><Arrow />{day.via}</>}
        <Arrow />{day.to}
      </p>

      {/* Stats */}
      <p className="mt-auto pt-3 border-t border-line flex flex-wrap gap-x-3.5 gap-y-1 text-xs text-stone-700 tabular-nums">
        <span className="inline-flex items-center gap-1">
          <Footprints aria-hidden="true" className="size-3.5 text-rock" />
          {day.stats.distanceKm} km
        </span>
        <span className="inline-flex items-center gap-1">
          <TrendingUp aria-hidden="true" className="size-3.5 text-rock" />
          <span className="sr-only">dénivelé positif </span>
          {day.stats.elevationGainM} m
        </span>
        <span className="inline-flex items-center gap-1">
          <Clock aria-hidden="true" className="size-3.5 text-rock" />
          <span className="sr-only">durée </span>
          {day.stats.durationMin}–{day.stats.durationMax}
        </span>
      </p>
    </button>
  );
}

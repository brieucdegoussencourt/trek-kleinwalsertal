import { TREK_DAYS, TREK_SUMMARY } from "@/data/trek";
import type { TrekDay } from "@/data/trek";

const DIFFICULTY_LABEL: Record<TrekDay["difficulty"], string> = {
  easy:      "Facile",
  moderate:  "Modérée",
  sustained: "Soutenu",
  hard:      "Difficile",
};

const DIFFICULTY_PILL: Record<TrekDay["difficulty"], string> = {
  easy:      "bg-emerald-100 text-emerald-800",
  moderate:  "bg-gold/15 text-[#7a4e00]",
  sustained: "bg-coral/15 text-[#7a2800]",
  hard:      "bg-coral/20 text-[#7a2800]",
};

// `sr` is what screen readers announce when the visual header is terse.
const COL_HEADERS: { label: string; sr?: string }[] = [
  { label: "Jour" },
  { label: "Étape" },
  { label: "km", sr: "Distance en km" },
  { label: "D +", sr: "Dénivelé positif en mètres" },
  { label: "D −", sr: "Dénivelé négatif en mètres" },
  { label: "Durée" },
  { label: "Difficulté" },
];

export default function SummaryTable() {
  return (
    // Focusable so keyboard users can scroll the table sideways on mobile.
    <div
      role="region"
      aria-labelledby="summary-caption"
      tabIndex={0}
      className="overflow-x-auto rounded-xl border border-stone-200 shadow-sm"
    >
      <table className="w-full text-sm">
        <caption id="summary-caption" className="sr-only">
          Récapitulatif des {TREK_DAYS.length} étapes : distance, dénivelés, durée et difficulté
        </caption>
        <thead>
          <tr className="bg-pine text-white">
            {COL_HEADERS.map((h, i) => (
              <th
                key={h.label}
                scope="col"
                className={`px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.1em] ${
                  i >= 2 ? "text-right" : "text-left"
                }`}
              >
                {h.sr ? (
                  <>
                    <span aria-hidden="true">{h.label}</span>
                    <span className="sr-only">{h.sr}</span>
                  </>
                ) : (
                  h.label
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {TREK_DAYS.map((day, i) => (
            <tr
              key={day.dayNumber}
              className={`border-b border-stone-100 hover:bg-pine/5 transition-colors ${
                i % 2 === 0 ? "bg-white" : "bg-snow"
              }`}
            >
              <th scope="row" className="px-4 py-3 text-left font-bold text-[#7a4e00] whitespace-nowrap">
                <span aria-hidden="true">J. {day.dayNumber}</span>
                <span className="sr-only">Jour {day.dayNumber}</span>
              </th>
              <td className="px-4 py-3 text-stone-700 max-w-[180px]">
                <p className="font-medium leading-snug">{day.label}</p>
                <p className="text-xs text-stone-600 mt-0.5 truncate">
                  {day.from}
                  <span aria-hidden="true"> → </span>
                  <span className="sr-only"> vers </span>
                  {day.to}
                </p>
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
              <td className="px-4 py-3 text-right">
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${DIFFICULTY_PILL[day.difficulty]}`}>
                  {DIFFICULTY_LABEL[day.difficulty]}
                </span>
              </td>
            </tr>
          ))}

          {/* Totals row */}
          <tr className="bg-pine/8 border-t-2 border-stone-200 font-bold">
            <th scope="row" className="px-4 py-3 text-left text-stone-700" colSpan={2}>
              Total
            </th>
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
            <td className="px-4 py-3" />
          </tr>
        </tbody>
      </table>
    </div>
  );
}

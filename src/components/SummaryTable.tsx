import { TREK_DAYS, TREK_SUMMARY } from "@/data/trek";
import DifficultyBadge from "@/components/DifficultyBadge";

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
      className="overflow-x-auto rounded-xl border border-line bg-white"
    >
      <table className="w-full text-sm">
        <caption id="summary-caption" className="sr-only">
          Récapitulatif des {TREK_DAYS.length} étapes : distance, dénivelés, durée et difficulté
        </caption>
        <thead>
          <tr className="border-b border-line">
            {COL_HEADERS.map((h, i) => (
              <th
                key={h.label}
                scope="col"
                className={`px-4 py-3 text-xs font-medium text-rock ${
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
          {TREK_DAYS.map((day) => (
            <tr
              key={day.dayNumber}
              className="border-b border-line/70 hover:bg-snow transition-colors"
            >
              <th scope="row" className="px-4 py-3 text-left font-semibold text-pine whitespace-nowrap">
                <span aria-hidden="true">J. {day.dayNumber}</span>
                <span className="sr-only">Jour {day.dayNumber}</span>
              </th>
              <td className="px-4 py-3 text-stone-700 max-w-[180px]">
                <p className="font-medium text-ink leading-snug">{day.label}</p>
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
                <DifficultyBadge difficulty={day.difficulty} />
              </td>
            </tr>
          ))}

          {/* Totals row */}
          <tr className="bg-snow font-semibold">
            <th scope="row" className="px-4 py-3 text-left text-stone-700" colSpan={2}>
              Total
            </th>
            <td className="px-4 py-3 text-right tabular-nums text-ink">
              {TREK_SUMMARY.totalKm}
            </td>
            <td className="px-4 py-3 text-right tabular-nums text-ink">
              +{TREK_SUMMARY.totalElevationGainM}
            </td>
            <td className="px-4 py-3 text-right tabular-nums text-ink">
              −{TREK_SUMMARY.totalElevationLossM}
            </td>
            <td className="px-4 py-3 text-right text-ink">
              {TREK_SUMMARY.totalHikingHours}
            </td>
            <td className="px-4 py-3" />
          </tr>
        </tbody>
      </table>
    </div>
  );
}

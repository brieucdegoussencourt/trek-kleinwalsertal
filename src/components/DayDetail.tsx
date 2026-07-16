import type { TrekDay } from "@/data/trek";

interface DayDetailProps {
  day: TrekDay;
}

const ACCOM_LABEL: Record<TrekDay["accommodation"]["type"], string> = {
  "refuge-dav":   "Refuge DAV",
  "refuge-prive": "Refuge privé",
  hotel:          "Hôtel",
};

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white border border-stone-200 rounded-xl p-4 text-center">
      <p className="text-[15px] font-bold text-stone-800 tabular-nums">{value}</p>
      <p className="text-[10px] uppercase tracking-[0.1em] text-stone-400 mt-1">{label}</p>
    </div>
  );
}

function HighlightItem({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-3">
      <span className="shrink-0 mt-0.5 leading-none">{icon}</span>
      <div>
        <p className="text-sm font-semibold text-stone-800 leading-snug">{title}</p>
        <p className="text-sm text-stone-500 leading-relaxed mt-0.5">{description}</p>
      </div>
    </div>
  );
}

export default function DayDetail({ day }: DayDetailProps) {
  const route = day.via
    ? `${day.from} → ${day.via} → ${day.to}`
    : `${day.from} → ${day.to}`;

  return (
    <div className="detail-in space-y-6">
      {/* Route header */}
      <div>
        <h3 className="font-display text-2xl font-semibold text-stone-800">{day.label}</h3>
        <p className="text-sm text-stone-400 mt-1">{route}</p>
      </div>

      {/* 4 stat boxes */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatBox label="Distance"     value={`${day.stats.distanceKm} km`}                          />
        <StatBox label="Dénivelé +"   value={`${day.stats.elevationGainM} m`}                       />
        <StatBox label="Durée"        value={`${day.stats.durationMin}–${day.stats.durationMax}`}   />
        <StatBox label="Altitude nuit" value={`${day.stats.altitudeNightM} m`}                      />
      </div>

      {/* Warning banner */}
      {day.warning && (
        <div className="bg-coral/10 border-l-4 border-coral rounded-r-md px-4 py-3 text-[11px] text-[#7a2800] leading-relaxed">
          <p className="font-bold mb-1 text-xs">⚠ Attention</p>
          <p>{day.warning}</p>
        </div>
      )}

      {/* Step-by-step itinerary */}
      {day.itinerary && day.itinerary.length > 0 && (
        <div className="rounded-xl bg-white border border-stone-200 p-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-rock mb-3">
            Étape par étape
          </p>
          <ol className="space-y-2.5">
            {day.itinerary.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="shrink-0 flex items-center justify-center w-5 h-5 mt-0.5 rounded-full bg-pine/10 text-pine text-[11px] font-bold tabular-nums">
                  {i + 1}
                </span>
                <p className="text-sm text-stone-600 leading-relaxed">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* 2-column highlights */}
      <div className="grid sm:grid-cols-2 gap-4">
        {/* Must see — pine border */}
        <div className="rounded-xl border-l-4 border-pine bg-pine/5 p-4 space-y-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-pine">
            Must see
          </p>
          {day.mustSee.map((item) => (
            <HighlightItem
              key={item.title}
              icon={<span className="text-pine text-sm">★</span>}
              title={item.title}
              description={item.description}
            />
          ))}
        </div>

        {/* Bonus tips — amber border */}
        <div className="rounded-xl border-l-4 border-gold bg-gold/5 p-4 space-y-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#7a4e00]">
            Si vous avez le temps…
          </p>
          {day.bonusTips.map((item) => (
            <HighlightItem
              key={item.title}
              icon={<span className="text-gold text-sm font-bold">→</span>}
              title={item.title}
              description={item.description}
            />
          ))}
        </div>
      </div>

      {/* Practical info banner */}
      {day.practicalInfo && (
        <div className="bg-azure/10 border-l-4 border-azure rounded-r-md px-4 py-3 text-[11px] text-[#0e2d52] leading-relaxed">
          <p className="font-bold mb-1 text-xs">ℹ Infos pratiques</p>
          <p>{day.practicalInfo}</p>
        </div>
      )}

      {/* Accommodation */}
      <div className="rounded-xl bg-white border border-stone-200 p-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-rock mb-3">
          Hébergement · {ACCOM_LABEL[day.accommodation.type]}
        </p>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-0.5">
            <p className="font-semibold text-stone-800">{day.accommodation.name}</p>
            {day.accommodation.altitudeM && (
              <p className="text-sm text-stone-400">{day.accommodation.altitudeM} m d&rsquo;altitude</p>
            )}
            {day.accommodation.capacity && (
              <p className="text-sm text-stone-500">{day.accommodation.capacity}</p>
            )}
            {day.accommodation.paymentNote && (
              <p className="text-sm font-semibold text-coral mt-1">{day.accommodation.paymentNote}</p>
            )}
            {day.accommodation.priceNote && (
              <p className="text-sm text-stone-500">{day.accommodation.priceNote}</p>
            )}
          </div>
          {day.accommodation.bookingUrl && (
            <a
              href={day.accommodation.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 rounded-lg bg-pine text-white text-xs font-semibold px-3 py-2 hover:bg-[#0a5843] transition-colors whitespace-nowrap"
            >
              Réserver →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

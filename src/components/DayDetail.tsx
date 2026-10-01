import {
  ArrowUpRight,
  BedDouble,
  Info,
  Sparkles,
  Star,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react";
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
    <div className="flex flex-col-reverse bg-snow rounded-lg px-4 py-3">
      <dt className="text-xs text-rock mt-0.5">{label}</dt>
      <dd className="text-lg font-semibold text-ink tabular-nums">{value}</dd>
    </div>
  );
}

function HighlightList({
  title,
  icon: Icon,
  items,
}: {
  title: React.ReactNode;
  icon: LucideIcon;
  items: { title: string; description: string }[];
}) {
  return (
    <div>
      <h4 className="flex items-center gap-2 text-sm font-semibold text-ink mb-3">
        <Icon aria-hidden="true" className="size-4 text-pine" strokeWidth={1.75} />
        {title}
      </h4>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.title} className="pl-6">
            <p className="text-sm font-medium text-ink leading-snug">{item.title}</p>
            <p className="text-sm text-stone-600 leading-relaxed mt-0.5">{item.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** The single callout style: neutral surface, a toned icon and title. */
function Callout({
  tone,
  icon: Icon,
  title,
  children,
}: {
  tone: "warning" | "info";
  icon: LucideIcon;
  title: string;
  children: React.ReactNode;
}) {
  const color = tone === "warning" ? "text-coral-deep" : "text-azure-deep";
  return (
    <div className="flex gap-3 rounded-lg border border-line bg-snow px-4 py-3">
      <Icon aria-hidden="true" className={`size-4 shrink-0 mt-0.5 ${color}`} strokeWidth={2} />
      <div className="text-sm leading-relaxed text-stone-700">
        <p className={`font-semibold mb-0.5 ${color}`}>{title}</p>
        {children}
      </div>
    </div>
  );
}

export default function DayDetail({ day }: DayDetailProps) {
  const stops = [day.from, day.via, day.to].filter(Boolean);

  return (
    <div className="detail-in space-y-6">
      {/* Route header */}
      <div>
        <p className="eyebrow mb-2">
          Jour {day.dayNumber} · {day.date}
        </p>
        <h3 className="font-display text-2xl sm:text-3xl font-medium tracking-tight text-ink">{day.label}</h3>
        <p className="text-sm text-rock mt-1.5">
          {stops.map((stop, i) => (
            <span key={i}>
              {i > 0 && (
                <>
                  <span aria-hidden="true"> → </span>
                  <span className="sr-only"> puis </span>
                </>
              )}
              {stop}
            </span>
          ))}
        </p>
      </div>

      {/* 4 stat boxes */}
      <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatBox label="Distance"     value={`${day.stats.distanceKm} km`}                          />
        <StatBox label="Dénivelé +"   value={`${day.stats.elevationGainM} m`}                       />
        <StatBox label="Durée"        value={`${day.stats.durationMin}–${day.stats.durationMax}`}   />
        <StatBox label="Altitude nuit" value={`${day.stats.altitudeNightM} m`}                      />
      </dl>

      {/* Warning banner */}
      {day.warning && (
        <Callout tone="warning" icon={TriangleAlert} title="Attention">
          <p>{day.warning}</p>
        </Callout>
      )}

      {/* Step-by-step itinerary */}
      {day.itinerary && day.itinerary.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-ink mb-3">
            Étape par étape
          </h4>
          <ol className="space-y-2.5">
            {day.itinerary.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span aria-hidden="true" className="shrink-0 flex items-center justify-center w-5 h-5 mt-0.5 rounded-full border border-line text-rock text-[11px] font-medium tabular-nums">
                  {i + 1}
                </span>
                <p className="text-sm text-stone-700 leading-relaxed">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* 2-column highlights */}
      <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 border-t border-line pt-6">
        <HighlightList
          title={<span lang="en">Must see</span>}
          icon={Star}
          items={day.mustSee}
        />
        <HighlightList
          title="Si vous avez le temps…"
          icon={Sparkles}
          items={day.bonusTips}
        />
      </div>

      {/* Practical info */}
      {day.practicalInfo && (
        <Callout tone="info" icon={Info} title="Infos pratiques">
          <p>{day.practicalInfo}</p>
        </Callout>
      )}

      {/* Accommodation */}
      <div className="rounded-lg border border-line p-4">
        <h4 className="flex items-center gap-2 text-xs text-rock mb-2">
          <BedDouble aria-hidden="true" className="size-4" strokeWidth={1.75} />
          Hébergement · {ACCOM_LABEL[day.accommodation.type]}
        </h4>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-0.5">
            <p className="font-display text-lg font-medium text-ink">{day.accommodation.name}</p>
            {day.accommodation.altitudeM && (
              <p className="text-sm text-rock">{day.accommodation.altitudeM} m d&rsquo;altitude</p>
            )}
            {day.accommodation.capacity && (
              <p className="text-sm text-rock">{day.accommodation.capacity}</p>
            )}
            {day.accommodation.paymentNote && (
              <p className="text-sm font-semibold text-coral-deep mt-1">{day.accommodation.paymentNote}</p>
            )}
            {day.accommodation.priceNote && (
              <p className="text-sm text-rock">{day.accommodation.priceNote}</p>
            )}
          </div>
          {day.accommodation.bookingUrl && (
            <a
              href={day.accommodation.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center gap-1 rounded-lg bg-pine text-white text-sm font-medium px-3.5 py-2 hover:bg-pine-dark transition-colors whitespace-nowrap"
            >
              Réserver
              <span className="sr-only"> {day.accommodation.name} (nouvel onglet)</span>
              <ArrowUpRight aria-hidden="true" className="size-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

import Image from "next/image";
import { TREK_SUMMARY, TREK_META, HERO_IMAGE } from "@/data/trek";

const STATS = [
  { label: "Distance",  value: `${TREK_SUMMARY.totalKm} km`             },
  { label: "Marche",    value: TREK_SUMMARY.totalHikingHours             },
  { label: "Dénivelé",  value: `+${TREK_SUMMARY.totalElevationGainM} m` },
  { label: "Jours",     value: String(TREK_SUMMARY.days)                 },
];

export default function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden bg-ink text-white"
    >
      {/* Backdrop photo, darkened from the bottom so the text always reads. */}
      <Image
        src={HERO_IMAGE.src}
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-10 object-cover object-[center_35%]"
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-ink/40" />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-ink/80 via-ink/40 to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/90 via-transparent to-ink/40"
      />

      <div className="max-w-5xl mx-auto px-5 sm:px-6 pt-24 pb-12 sm:pt-36 sm:pb-14">
        <p className="text-xs font-medium uppercase tracking-[0.12em] text-white/75 mb-4">
          {TREK_META.subtitle}
        </p>

        {/* Title — the page's single h1, with its keyword context for search
            engines and screen readers. */}
        <h1
          id="hero-title"
          className="font-display text-5xl sm:text-6xl md:text-7xl font-medium tracking-tight leading-none"
        >
          <span className="sr-only">Trek dans le </span>
          Kleinwalsertal
          <span className="sr-only"> : 4 jours en refuge dans le Vorarlberg</span>
        </h1>

        <p className="text-white/85 text-base sm:text-lg mt-4">
          {TREK_META.participants} · {TREK_META.month}
        </p>

        <p className="max-w-xl mt-6 text-sm sm:text-[15px] leading-relaxed text-white/80">
          {TREK_META.description}
        </p>

        {/* Stats — hairline-separated row */}
        <dl className="mt-10 sm:mt-12 grid grid-cols-2 sm:grid-cols-4 border-t border-white/20">
          {STATS.map(({ label, value }, i) => (
            <div
              key={label}
              className={`flex flex-col-reverse pt-4 pb-1 ${
                i > 0 ? "sm:pl-6 sm:border-l sm:border-white/20" : ""
              } ${i % 2 === 1 ? "pl-6 border-l border-white/20 sm:pl-6" : ""}`}
            >
              <dt className="text-xs text-white/70 mt-1">{label}</dt>
              <dd className="font-display text-2xl sm:text-3xl tabular-nums">{value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <p className="absolute bottom-1.5 right-3 text-[10px] text-white/55">
        Photo : {HERO_IMAGE.credit}
      </p>
    </section>
  );
}

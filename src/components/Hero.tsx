import { TREK_SUMMARY, TREK_META } from "@/data/trek";

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
      className="relative bg-gradient-to-br from-[#0a3d2e] to-[#117052] text-white overflow-hidden"
    >
      {/* Dot texture */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative max-w-5xl mx-auto px-5 sm:px-6 pt-14 pb-28 sm:pt-20 sm:pb-32 text-center">
        {/* Eyebrow */}
        <p className="text-[11px] uppercase tracking-[0.25em] text-[#7eecc6] font-medium mb-5 sm:mb-6">
          {TREK_META.subtitle}
        </p>

        {/* Title — the page's single h1, with its keyword context for search
            engines and screen readers. */}
        <h1
          id="hero-title"
          className="font-display text-5xl sm:text-6xl md:text-7xl font-bold text-white leading-none mb-3"
        >
          <span className="sr-only">Trek dans le </span>
          Kleinwalsertal
          <span className="sr-only"> : 4 jours en refuge dans le Vorarlberg</span>
        </h1>

        {/* Subtitle */}
        <p className="text-white/90 text-base sm:text-lg mt-2">
          {TREK_META.participants} · {TREK_META.month}
        </p>

        {/* Lede */}
        <p className="max-w-2xl mx-auto mt-6 text-sm sm:text-[15px] leading-relaxed text-white/90">
          {TREK_META.description}
        </p>

        {/* Stats — 2×2 grid on mobile, single pill row on sm+ */}
        <dl className="mt-10 sm:mt-12 grid grid-cols-2 gap-3 sm:inline-grid sm:grid-cols-4 sm:gap-0 sm:divide-x sm:divide-white/20 sm:bg-white/10 sm:backdrop-blur-sm sm:rounded-2xl sm:overflow-hidden">
          {STATS.map(({ label, value }) => (
            <div
              key={label}
              className="flex flex-col-reverse bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 text-center sm:bg-transparent sm:backdrop-blur-none sm:rounded-none sm:px-6 sm:py-4 sm:min-w-22"
            >
              <dt className="text-[10px] uppercase tracking-[0.15em] text-white mt-1">{label}</dt>
              <dd className="text-xl sm:text-2xl font-bold text-white tabular-nums">{value}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Mountain silhouette */}
      <svg
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        className="absolute bottom-0 left-0 w-full h-16 sm:h-20"
        aria-hidden="true"
        focusable="false"
      >
        <path
          d="M0,80 L0,65 L90,38 L170,58 L260,22 L360,50 L450,28 L540,54 L630,16 L720,46 L810,20 L900,50 L990,14 L1080,44 L1170,24 L1270,54 L1360,36 L1440,52 L1440,80 Z"
          fill="#F1EFE8"
          fillOpacity="0.25"
        />
        <path
          d="M0,80 L0,70 L120,48 L200,64 L320,32 L420,58 L520,36 L620,62 L720,28 L820,56 L920,38 L1020,62 L1120,42 L1220,66 L1320,50 L1440,60 L1440,80 Z"
          fill="#F1EFE8"
        />
      </svg>
    </section>
  );
}

import { TREK_SUMMARY, TREK_META } from "@/data/trek";

const STATS = [
  { label: "Distance",  value: `${TREK_SUMMARY.totalKm} km`             },
  { label: "Marche",    value: TREK_SUMMARY.totalHikingHours             },
  { label: "Dénivelé",  value: `+${TREK_SUMMARY.totalElevationGainM} m` },
  { label: "Jours",     value: String(TREK_SUMMARY.days)                 },
];

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-[#0a3d2e] to-[#1D9E75] text-white overflow-hidden">
      {/* Dot texture */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative max-w-5xl mx-auto px-5 sm:px-6 pt-14 pb-28 sm:pt-20 sm:pb-32 text-center">
        {/* Eyebrow */}
        <p className="text-[11px] uppercase tracking-[0.25em] text-[#7eecc6] font-medium mb-5 sm:mb-6">
          Trek en refuge · Vorarlberg, Autriche
        </p>

        {/* Title */}
        <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold text-white leading-none mb-3">
          Kleinwalsertal
        </h1>

        {/* Subtitle */}
        <p className="text-white/60 text-base sm:text-lg mt-2">
          {TREK_META.participants} · {TREK_META.month}
        </p>

        {/* Stats — 2×2 grid on mobile, single pill row on sm+ */}
        <div className="mt-10 sm:mt-12 grid grid-cols-2 gap-3 sm:hidden">
          {STATS.map(({ label, value }) => (
            <div key={label} className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 text-center">
              <p className="text-xl font-bold text-white tabular-nums">{value}</p>
              <p className="text-[10px] uppercase tracking-[0.15em] text-white/45 mt-1">{label}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 hidden sm:inline-flex items-stretch divide-x divide-white/20 bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden">
          {STATS.map(({ label, value }) => (
            <div key={label} className="px-6 py-4 text-center min-w-22">
              <p className="text-2xl font-bold text-white tabular-nums">{value}</p>
              <p className="text-[10px] uppercase tracking-[0.15em] text-white/45 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Mountain silhouette */}
      <svg
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        className="absolute bottom-0 left-0 w-full h-16 sm:h-20"
        aria-hidden="true"
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

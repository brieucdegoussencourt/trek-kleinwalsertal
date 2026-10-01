import { ImageResponse } from "next/og";
import { TREK_META, TREK_SUMMARY } from "@/data/trek";

export const alt =
  "Trek Kleinwalsertal — 4 jours en refuge dans le Vorarlberg, Autriche";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const STATS = [
  { value: `${String(TREK_SUMMARY.totalKm).replace(".", ",")} km`, label: "Distance" },
  { value: `+${TREK_SUMMARY.totalElevationGainM.toLocaleString("fr-FR")} m`, label: "Dénivelé" },
  { value: TREK_SUMMARY.totalHikingHours, label: "Marche" },
  { value: `${TREK_SUMMARY.days} jours`, label: "En refuge" },
];

// Social preview card — same palette and silhouette as the hero.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          background: "linear-gradient(135deg, #0a3d2e 0%, #11634b 100%)",
          color: "white",
        }}
      >
        <div
          style={{
            fontSize: 26,
            letterSpacing: 8,
            textTransform: "uppercase",
            color: "#7eecc6",
            marginBottom: 18,
          }}
        >
          Trek en refuge · Vorarlberg, Autriche
        </div>
        <div style={{ fontSize: 120, fontWeight: 700, lineHeight: 1 }}>
          Kleinwalsertal
        </div>
        <div style={{ fontSize: 34, color: "rgba(255,255,255,0.8)", marginTop: 22 }}>
          {TREK_META.month}
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 48,
            marginBottom: 70,
            background: "rgba(255,255,255,0.12)",
            borderRadius: 24,
          }}
        >
          {STATS.map((s, i) => (
            <div
              key={s.label}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "22px 40px",
                borderLeft: i === 0 ? "none" : "2px solid rgba(255,255,255,0.2)",
              }}
            >
              <div style={{ fontSize: 44, fontWeight: 700 }}>{s.value}</div>
              <div
                style={{
                  fontSize: 18,
                  letterSpacing: 3,
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.75)",
                  marginTop: 6,
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>

        <svg
          width="1200"
          height="110"
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          style={{ position: "absolute", bottom: 0, left: 0 }}
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
      </div>
    ),
    size,
  );
}

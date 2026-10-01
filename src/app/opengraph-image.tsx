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

// Social preview card — same ink palette as the hero.
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
          background: "#1F2421",
          color: "white",
        }}
      >
        <div
          style={{
            fontSize: 26,
            letterSpacing: 8,
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.7)",
            marginBottom: 18,
          }}
        >
          Trek en refuge · Vorarlberg, Autriche
        </div>
        <div style={{ fontSize: 120, fontWeight: 600, lineHeight: 1 }}>
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

      </div>
    ),
    size,
  );
}

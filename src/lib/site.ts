import { TREK_SUMMARY } from "@/data/trek";

// Canonical origin. Vercel injects the production domain at build time, so
// preview deployments still point search engines at production.
export const SITE_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

export const SITE_NAME = "Trek Kleinwalsertal";

export const SEO_TITLE =
  "Trek Kleinwalsertal · 4 jours en refuge dans le Vorarlberg (Autriche)";

// Kept under ~160 characters so search results don't truncate it.
export const SEO_DESCRIPTION =
  `Trek de ${TREK_SUMMARY.days} jours en refuge dans le Kleinwalsertal : ` +
  `${String(TREK_SUMMARY.totalKm).replace(".", ",")} km, ` +
  `+${TREK_SUMMARY.totalElevationGainM.toLocaleString("fr-FR")} m, de la ` +
  "Kanzelwand au Gottesacker. Carte, étapes, météo, sécurité et checklist.";

export const SEO_KEYWORDS = [
  "Kleinwalsertal",
  "trek Kleinwalsertal",
  "randonnée Kleinwalsertal",
  "trek en refuge Autriche",
  "Vorarlberg randonnée",
  "Allgäu",
  "Oberstdorf",
  "Riezlern",
  "Hirschegg",
  "Kanzelwand",
  "Fiderepasshütte",
  "Widderstein",
  "Widdersteinhütte",
  "Gottesacker",
  "Hoher Ifen",
  "Breitachklamm",
  "itinéraire randonnée Alpes",
];

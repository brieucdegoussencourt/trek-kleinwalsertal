import {
  TREK_DAYS,
  TREK_META,
  TREK_SUMMARY,
  VALLEY_CHAPTERS,
  WEATHER_SPOTS,
} from "@/data/trek";
import { SEO_DESCRIPTION, SEO_TITLE, SITE_NAME, SITE_URL } from "@/lib/site";

/**
 * schema.org structured data: the website plus the trek as a TouristTrip,
 * one sub-trip per day with its geo-tagged waypoints.
 */
export function trekJsonLd() {
  const tripId = `${SITE_URL}/#trek`;
  const dateOf = (day: number) =>
    WEATHER_SPOTS.find((s) => s.dayNumber === day)?.dateIso;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        description: SEO_DESCRIPTION,
        inLanguage: "fr",
        author: { "@type": "Person", name: TREK_META.participants },
      },
      {
        "@type": "WebPage",
        "@id": `${SITE_URL}/#webpage`,
        url: SITE_URL,
        name: SEO_TITLE,
        description: SEO_DESCRIPTION,
        inLanguage: "fr",
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: { "@id": tripId },
        primaryImageOfPage: `${SITE_URL}/opengraph-image`,
        image: VALLEY_CHAPTERS.map((c) => c.image.src),
      },
      {
        "@type": "TouristTrip",
        "@id": tripId,
        name: `${TREK_META.title} — ${TREK_SUMMARY.days} jours en refuge`,
        description: TREK_META.description,
        inLanguage: "fr",
        touristType: ["Randonnée", "Trek en refuge", "Montagne"],
        image: `${SITE_URL}/opengraph-image`,
        departureTime: dateOf(1),
        arrivalTime: dateOf(TREK_SUMMARY.days),
        about: {
          "@type": "Place",
          name: "Kleinwalsertal",
          address: {
            "@type": "PostalAddress",
            addressRegion: "Vorarlberg",
            addressCountry: "AT",
          },
          geo: { "@type": "GeoCoordinates", latitude: 47.33, longitude: 10.17 },
        },
        subTrip: TREK_DAYS.map((day) => ({
          "@type": "TouristTrip",
          name: `Jour ${day.dayNumber} · ${day.label}`,
          description: day.itinerary.join(" "),
          departureTime: dateOf(day.dayNumber),
          itinerary: {
            "@type": "ItemList",
            numberOfItems: day.waypoints.length,
            itemListElement: day.waypoints.map((w, i) => ({
              "@type": "ListItem",
              position: i + 1,
              item: {
                "@type": "Place",
                name: w.name,
                geo: {
                  "@type": "GeoCoordinates",
                  latitude: w.coord[0],
                  longitude: w.coord[1],
                  ...(w.altitudeM ? { elevation: w.altitudeM } : {}),
                },
              },
            })),
          },
        })),
      },
    ],
  };
}

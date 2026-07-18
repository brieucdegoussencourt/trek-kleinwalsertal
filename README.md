# 🏔 Trek Kleinwalsertal

A personal trip-planning website for a 4-day alpine hut trek in the Kleinwalsertal valley, Vorarlberg, Austria — July 2026.

Built for **Brieuc & Sophie**.

## What it is

A single-page Next.js app that turns structured data files into a full interactive guide — plus a live GPS tracker for friends and family to follow the hike:

- **Hero** — key stats at a glance (43.1 km, +2 690 m, ~18 h over 4 days)
- **Overview map** — the whole trek on OpenTopoMap tiles, one colour per day, drawn from real trail geometry. Loads as a clean overview; clicking a trail, its J1–J4 badge, or a day card focuses that day (numbered step waypoints, zoom, recap scroll). Bus and cable-car transfers render as dashed legs
- **Itinerary** — day cards that expand into full details: step-by-step route, must-sees, bonus tips, warnings, practical info, and accommodation. Day 1 starts on foot from the Hotel Jagdhof; Day 4 loops over the Gottesacker back to a second night at the A-ROSA
- **La vallée** — the Kleinwalsertal in five illustrated chapters (the enclave, the Walser people, the summits, the Gottesacker karst, the Breitachklamm) with freely-licensed Wikimedia Commons photos and learn-more links
- **📍 Live** — record your GPS track from a phone (Brieuc in azure, Sophie in coral, start/stop, shared record key) and let visitors watch both positions update on the map every 15 s, with live/last-seen status chips and a **position journal**: one reverse-geocoded entry per minute (place, time, exact coordinates)
- **Summary table** — all 4 days compared side by side
- **Météo** — live forecast for each stage at its high point, altitude-adjusted (Open-Meteo), with storm/wind warnings and links to specialist mountain weather sites
- **Sécurité** — tap-to-call emergency numbers (140 / 144 / 112) and mountain safety tips adapted from the official Vorarlberg Tourismus guidance
- **Checklist** — gear to pack, with tick-off checkboxes

## Aperçu

|  |  |
| --- | --- |
| ![Hero — key stats](docs/screenshots/hero.jpg) | ![Overview map — one colour per day](docs/screenshots/overview-map.jpg) |
| *Hero — key stats at a glance* | *Overview map — clickable day trails* |
| ![Day recap — step by step](docs/screenshots/day-detail.png) | ![Météo — live forecast per stage](docs/screenshots/meteo.png) |
| *Day recap — step-by-step route* | *Météo — altitude-adjusted forecast* |

![Sécurité — emergency numbers and safety tips](docs/screenshots/securite.png)
*Sécurité — tap-to-call emergency numbers and mountain safety tips*

## Stack

- [Next.js 16](https://nextjs.org) (App Router) — including an API route for the live tracker
- [Tailwind CSS v4](https://tailwindcss.com)
- [Leaflet](https://leafletjs.com) + [OpenTopoMap](https://opentopomap.org) tiles
- [Open-Meteo](https://open-meteo.com) forecast API (no key required)
- [Upstash Redis](https://upstash.com) (Vercel Marketplace) for live-tracking storage — in-memory fallback in local dev
- [Nominatim](https://nominatim.org) reverse geocoding for the position journal
- [Playfair Display](https://fonts.google.com/specimen/Playfair+Display) + [Inter](https://fonts.google.com/specimen/Inter) via `next/font`
- TypeScript

## Data

- `src/data/trek.ts` — all trek content: days, stats, waypoints, valley chapters, weather spots, safety tips, gear, live-tracker identities. One file to update if plans change.
- `src/data/tracks.ts` — real trail geometry per day, routed along OSM hiking paths with [BRouter](https://brouter.de) (SRTM elevation) and simplified for the web. Per-day distances and elevation figures are measured from these tracks.
- Live positions live in Redis (`live:<user>` keys), never in the repo.

## Run locally

```bash
npm install
vercel env pull .env.development.local   # Redis credentials + LIVE_RECORD_KEY
npm run dev
```

Without the env file the app still runs — live tracking then uses unauthenticated in-memory storage (dev only).

Deployed on [Vercel](https://vercel.com) — every push to `main` goes live. Writing positions requires the `LIVE_RECORD_KEY` env var to be set (and typed into the Live tab by the person recording).

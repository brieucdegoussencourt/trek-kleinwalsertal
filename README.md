# 🏔 Trek Kleinwalsertal

A personal trip-planning website for a 4-day alpine trek in the Kleinwalsertal valley, Vorarlberg, Austria — July 2026.

Built for **Brieuc & Sophie**.

## What it is

A single-page Next.js app that turns a structured data file (`src/data/trek.ts`) into a full interactive guide:

- **Hero** — key stats at a glance (distance, elevation, duration)
- **Itinerary** — clickable day cards that expand into full details: highlights, practical info, warnings, and accommodation
- **Summary table** — all 4 days compared side by side
- **Checklist** — reservations to make and gear to pack

## Stack

- [Next.js 16](https://nextjs.org) (App Router)
- [Tailwind CSS v4](https://tailwindcss.com)
- [Playfair Display](https://fonts.google.com/specimen/Playfair+Display) + [Inter](https://fonts.google.com/specimen/Inter) via `next/font`
- TypeScript

## Data

All content lives in `src/data/trek.ts` — one file to update if plans change.

## Run locally

```bash
npm install
npm run dev
```

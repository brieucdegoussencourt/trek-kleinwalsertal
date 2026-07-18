"use client";

import { useCallback, useState } from "react";
import dynamic from "next/dynamic";
import { TREK_DAYS } from "@/data/trek";
import Nav, { type Tab } from "@/components/Nav";
import Hero from "@/components/Hero";
import DayCard from "@/components/DayCard";
import DayDetail from "@/components/DayDetail";
import SummaryTable from "@/components/SummaryTable";
import ValleySection from "@/components/ValleySection";
import LiveSection from "@/components/LiveSection";
import Weather from "@/components/Weather";
import SafetyTips from "@/components/SafetyTips";
import Checklist from "@/components/Checklist";
import Footer from "@/components/Footer";

// Leaflet touches `window`, so load the map client-side only.
const TrekMap = dynamic(() => import("@/components/TrekMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[380px] sm:h-[460px] w-full rounded-2xl bg-stone-100 animate-pulse" />
  ),
});

const TABS: { id: Tab; label: string }[] = [
  { id: "itineraire",    label: "Itinéraire"    },
  { id: "vallee",        label: "La vallée"     },
  { id: "live",          label: "📍 Live"       },
  { id: "recapitulatif", label: "Récapitulatif" },
  { id: "meteo",         label: "Météo"         },
  { id: "securite",      label: "Sécurité"      },
  { id: "checklist",     label: "Checklist"     },
];

export default function Home() {
  const [activeTab,   setActiveTab]   = useState<Tab>("itineraire");
  const [selectedDay, setSelectedDay] = useState(1);
  // False until a day is explicitly chosen — the map stays a pure overview.
  const [dayFocused,  setDayFocused]  = useState(false);
  // Once visited, the Live section stays mounted (hidden) so an active
  // GPS recording survives tab switches.
  const [liveVisited, setLiveVisited] = useState(false);

  const dayData = TREK_DAYS.find((d) => d.dayNumber === selectedDay)!;

  const selectDay = useCallback((dayNumber: number) => {
    setSelectedDay(dayNumber);
    setDayFocused(true);
  }, []);

  // Map click → select the day AND bring its recap into view.
  const handleMapSelect = useCallback(
    (dayNumber: number) => {
      selectDay(dayNumber);
      document
        .getElementById("day-detail")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    [selectDay],
  );

  return (
    <div className="min-h-screen bg-snow font-sans text-foreground">
      <Nav
        onTabChange={(tab) => {
          setActiveTab(tab);
          if (tab === "live") setLiveVisited(true);
          document.getElementById("content")?.scrollIntoView({ behavior: "smooth" });
        }}
      />

      <Hero />

      <main id="content" className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        {/* ── Tab bar ────────────────────────────────────────── */}
        <div className="flex border-b border-stone-200 mb-8 overflow-x-auto">
          {TABS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => {
                setActiveTab(id);
                if (id === "live") setLiveVisited(true);
              }}
              className={`shrink-0 px-4 sm:px-5 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                activeTab === id
                  ? "border-pine text-pine"
                  : "border-transparent text-stone-500 hover:text-stone-700"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ── Itinéraire ─────────────────────────────────────── */}
        {activeTab === "itineraire" && (
          <div className="space-y-6">
            {/* Overview map — whole trip, one colour per day */}
            <div className="bg-white rounded-2xl border border-stone-200 p-3 sm:p-4 shadow-sm">
              <div className="flex items-baseline justify-between px-1 pb-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-rock">
                  Vue d&rsquo;ensemble du trek
                </p>
                <p className="text-[11px] text-stone-400">
                  Cliquez un tracé pour le récap du jour
                </p>
              </div>
              <TrekMap
                selectedDay={selectedDay}
                focused={dayFocused}
                onSelectDay={handleMapSelect}
                onReset={() => setDayFocused(false)}
              />
            </div>

            {/* Day cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {TREK_DAYS.map((day) => (
                <DayCard
                  key={day.dayNumber}
                  day={day}
                  isActive={selectedDay === day.dayNumber}
                  onClick={() => selectDay(day.dayNumber)}
                />
              ))}
            </div>

            {/* Detail panel — key forces remount → triggers animation */}
            <div
              id="day-detail"
              className="scroll-mt-20 bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-sm"
            >
              <DayDetail key={selectedDay} day={dayData} />
            </div>
          </div>
        )}

        {/* ── La vallée ──────────────────────────────────────── */}
        {activeTab === "vallee" && <ValleySection />}

        {/* ── Live — kept mounted so recording survives tab switches ── */}
        {(liveVisited || activeTab === "live") && (
          <div className={activeTab === "live" ? "" : "hidden"}>
            <LiveSection />
          </div>
        )}

        {/* ── Récapitulatif ──────────────────────────────────── */}
        {activeTab === "recapitulatif" && <SummaryTable />}

        {/* ── Météo ──────────────────────────────────────────── */}
        {activeTab === "meteo" && <Weather />}

        {/* ── Sécurité ───────────────────────────────────────── */}
        {activeTab === "securite" && <SafetyTips />}

        {/* ── Checklist ──────────────────────────────────────── */}
        {activeTab === "checklist" && <Checklist />}
      </main>

      <Footer />
    </div>
  );
}

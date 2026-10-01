"use client";

import { useCallback, useRef, useState, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import { TREK_DAYS } from "@/data/trek";
import Nav, { TABS, type Tab } from "@/components/Nav";
import Hero from "@/components/Hero";
import DayCard from "@/components/DayCard";
import DayDetail from "@/components/DayDetail";
import SummaryTable from "@/components/SummaryTable";
import ValleySection from "@/components/ValleySection";
import LiveSection from "@/components/LiveSection";
import PhotosSection from "@/components/PhotosSection";
import Weather from "@/components/Weather";
import SafetyTips from "@/components/SafetyTips";
import Checklist from "@/components/Checklist";
import Footer from "@/components/Footer";

// Leaflet touches `window`, so load the map client-side only.
const TrekMap = dynamic(() => import("@/components/TrekMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[380px] sm:h-[460px] w-full rounded-lg bg-stone-100 animate-pulse" />
  ),
});

const TAB_IDS = TABS.map((t) => t.id);

// ── Active tab lives in the URL hash (#meteo, #securite…) ─────
// Every tab is deep-linkable and the back button walks through tabs.
function subscribeHash(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  window.addEventListener("popstate", onChange);
  return () => {
    window.removeEventListener("hashchange", onChange);
    window.removeEventListener("popstate", onChange);
  };
}

function readHashTab(): Tab {
  const id = window.location.hash.slice(1) as Tab;
  return TAB_IDS.includes(id) ? id : "itineraire";
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function TrekApp() {
  const activeTab = useSyncExternalStore(
    subscribeHash,
    readHashTab,
    () => "itineraire" as Tab,
  );
  const [selectedDay, setSelectedDay] = useState(1);
  // False until a day is explicitly chosen — the map stays a pure overview.
  const [dayFocused,  setDayFocused]  = useState(false);
  // Once visited, the Live section stays mounted (hidden) so an active
  // GPS recording survives tab switches.
  const [liveVisited, setLiveVisited] = useState(false);
  if (activeTab === "live" && !liveVisited) setLiveVisited(true);

  const tabRefs = useRef<Partial<Record<Tab, HTMLButtonElement | null>>>({});

  const selectTab = useCallback((tab: Tab) => {
    if (readHashTab() === tab && window.location.hash) return;
    window.history.pushState(null, "", `#${tab}`);
    // pushState doesn't fire hashchange — notify the store ourselves.
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  }, []);

  // Switching tab from further down the page brings the new panel's top
  // into view instead of leaving the reader mid-way through it.
  const showTab = useCallback(
    (tab: Tab) => {
      selectTab(tab);
      const content = document.getElementById("content");
      if (content && content.getBoundingClientRect().top < 0) {
        content.scrollIntoView({
          behavior: prefersReducedMotion() ? "auto" : "smooth",
        });
      }
    },
    [selectTab],
  );

  // WAI-ARIA tabs pattern: arrows / Home / End move between tabs.
  function onTabKeyDown(e: React.KeyboardEvent) {
    const i = TAB_IDS.indexOf(activeTab);
    const next =
      e.key === "ArrowRight" ? TAB_IDS[(i + 1) % TAB_IDS.length]
      : e.key === "ArrowLeft" ? TAB_IDS[(i - 1 + TAB_IDS.length) % TAB_IDS.length]
      : e.key === "Home" ? TAB_IDS[0]
      : e.key === "End" ? TAB_IDS[TAB_IDS.length - 1]
      : null;
    if (!next) return;
    e.preventDefault();
    showTab(next);
    tabRefs.current[next]?.focus();
  }

  // Selecting a day (map or card) focuses it: the map zooms to the day
  // and the recap below updates — without scrolling the page.
  const selectDay = useCallback((dayNumber: number) => {
    setSelectedDay(dayNumber);
    setDayFocused(true);
  }, []);

  const panelProps = (id: Tab) => ({
    role: "tabpanel" as const,
    id: `panel-${id}`,
    "aria-labelledby": `tab-${id}`,
    tabIndex: -1,
    hidden: activeTab !== id,
    className: "outline-none",
  });

  return (
    <div className="min-h-screen bg-snow font-sans text-foreground">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[2000] focus:rounded-lg focus:bg-pine focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Aller au contenu
      </a>

      <Nav />

      <main>
        <Hero />

        {/* ── Tab bar — the site's single, sticky navigation ───── */}
        <div className="sticky top-0 z-50 bg-snow/90 backdrop-blur-md border-b border-line">
          <div
            role="tablist"
            aria-label="Sections du guide"
            onKeyDown={onTabKeyDown}
            className="max-w-5xl mx-auto px-2 sm:px-4 flex overflow-x-auto [scrollbar-width:none]"
          >
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                ref={(el) => {
                  tabRefs.current[id] = el;
                }}
                role="tab"
                id={`tab-${id}`}
                aria-selected={activeTab === id}
                aria-controls={`panel-${id}`}
                tabIndex={activeTab === id ? 0 : -1}
                onClick={() => showTab(id)}
                className={`shrink-0 inline-flex items-center gap-2 px-3 sm:px-4 py-3.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
                  activeTab === id
                    ? "border-pine text-ink"
                    : "border-transparent text-rock hover:text-ink"
                }`}
              >
                <Icon aria-hidden="true" className="size-4" strokeWidth={1.75} />
                {label}
              </button>
            ))}
          </div>
        </div>

        <div
          id="content"
          tabIndex={-1}
          className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-12 scroll-mt-12 outline-none"
        >
          {/* Text-heavy panels are always rendered (just hidden) so their
              content is in the server HTML for search engines. Panels that
              poll APIs or need `window` mount on demand. */}

          {/* ── Itinéraire ─────────────────────────────────────── */}
          <section {...panelProps("itineraire")}>
            <h2 className="sr-only">Itinéraire du trek jour par jour</h2>
            <div className="space-y-5">
              {/* Overview map — whole trip, one colour per day */}
              <div className="bg-white rounded-xl border border-line p-3 sm:p-4">
                <div className="flex items-baseline justify-between gap-3 px-1 pb-3">
                  <h3 className="eyebrow">
                    Vue d&rsquo;ensemble du trek
                  </h3>
                  <p className="text-xs text-rock text-right">
                    Cliquez un tracé pour zoomer sur le jour
                  </p>
                </div>
                {activeTab === "itineraire" && (
                  <TrekMap
                    selectedDay={selectedDay}
                    focused={dayFocused}
                    onSelectDay={selectDay}
                    onReset={() => setDayFocused(false)}
                  />
                )}
              </div>

              {/* Day cards grid */}
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" aria-label="Les 4 étapes">
                {TREK_DAYS.map((day) => (
                  <li key={day.dayNumber} className="flex">
                    <DayCard
                      day={day}
                      isActive={selectedDay === day.dayNumber}
                      onClick={() => selectDay(day.dayNumber)}
                    />
                  </li>
                ))}
              </ul>

              {/* Detail panel — every day is in the HTML, only the selected
                  one is shown (un-hiding restarts the entrance animation). */}
              <div
                id="day-detail"
                className="scroll-mt-20 bg-white rounded-xl border border-line p-5 sm:p-8"
              >
                {TREK_DAYS.map((day) => (
                  <div key={day.dayNumber} hidden={day.dayNumber !== selectedDay}>
                    <DayDetail day={day} />
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── La vallée ──────────────────────────────────────── */}
          <section {...panelProps("vallee")}>
            <h2 className="sr-only">La vallée du Kleinwalsertal</h2>
            <ValleySection />
          </section>

          {/* ── Live — kept mounted so recording survives tab switches ── */}
          <section {...panelProps("live")}>
            <h2 className="sr-only">Suivi GPS en direct</h2>
            {liveVisited && <LiveSection />}
          </section>

          {/* ── Photos ─────────────────────────────────────────── */}
          <section {...panelProps("photos")}>
            <h2 className="sr-only">Album photos du trek</h2>
            {activeTab === "photos" && <PhotosSection />}
          </section>

          {/* ── Récapitulatif ──────────────────────────────────── */}
          <section {...panelProps("recapitulatif")}>
            <h2 className="sr-only">Récapitulatif des étapes</h2>
            <SummaryTable />
          </section>

          {/* ── Météo ──────────────────────────────────────────── */}
          <section {...panelProps("meteo")}>
            <h2 className="sr-only">Météo en montagne sur le parcours</h2>
            {activeTab === "meteo" && <Weather />}
          </section>

          {/* ── Sécurité ───────────────────────────────────────── */}
          <section {...panelProps("securite")}>
            <h2 className="sr-only">Sécurité en montagne</h2>
            <SafetyTips />
          </section>

          {/* ── Checklist ──────────────────────────────────────── */}
          <section {...panelProps("checklist")}>
            <h2 className="sr-only">Checklist de l&rsquo;équipement</h2>
            <Checklist />
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

"use client";

import { useState } from "react";

export type Tab =
  | "itineraire"
  | "vallee"
  | "live"
  | "photos"
  | "recapitulatif"
  | "meteo"
  | "securite"
  | "checklist";

/** Content tabs, in order. `emoji` is decorative (hidden from screen readers). */
export const TABS: { id: Tab; label: string; emoji?: string }[] = [
  { id: "itineraire",    label: "Itinéraire"                },
  { id: "vallee",        label: "La vallée"                 },
  { id: "live",          label: "Live",        emoji: "📍"  },
  { id: "photos",        label: "Photos",      emoji: "📷"  },
  { id: "recapitulatif", label: "Récapitulatif"             },
  { id: "meteo",         label: "Météo"                     },
  { id: "securite",      label: "Sécurité"                  },
  { id: "checklist",     label: "Checklist"                 },
];

interface NavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const NAV_LINKS: { label: string; tab: Tab }[] = [
  { label: "Itinéraire", tab: "itineraire" },
  { label: "La vallée",  tab: "vallee"     },
  { label: "Live",       tab: "live"       },
  { label: "Photos",     tab: "photos"     },
  { label: "Météo",      tab: "meteo"      },
  { label: "Sécurité",   tab: "securite"   },
  { label: "Checklist",  tab: "checklist"  },
];

export default function Nav({ activeTab, onTabChange }: NavProps) {
  const [open, setOpen] = useState(false);

  // Real links (#meteo…) so they work without JS and can be opened or
  // copied; with JS we switch tabs in place.
  function handleClick(e: React.MouseEvent, tab: Tab) {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    onTabChange(tab);
    setOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-stone-200">
      <nav
        aria-label="Navigation principale"
        className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4"
        onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
      >
        {/* Logo */}
        <a
          href="#"
          className="text-sm font-semibold text-pine tracking-tight whitespace-nowrap rounded"
        >
          <span aria-hidden="true">🏔 </span>
          Kleinwalsertal · <span lang="de">Juli</span> 2026
        </a>

        {/* Desktop links */}
        <ul className="hidden sm:flex items-center gap-1">
          {NAV_LINKS.map(({ label, tab }) => (
            <li key={tab}>
              <a
                href={`#${tab}`}
                onClick={(e) => handleClick(e, tab)}
                aria-current={activeTab === tab ? "page" : undefined}
                className={`block px-3 py-1.5 text-[11px] uppercase tracking-[0.1em] font-medium transition-colors rounded ${
                  activeTab === tab ? "text-pine" : "text-rock hover:text-pine"
                }`}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          className="sm:hidden flex flex-col justify-center gap-1.25 p-2.5 -mr-2 text-rock hover:text-pine transition-colors rounded"
        >
          <span
            aria-hidden="true"
            className={`block h-0.5 w-5 bg-current rounded-full transition-transform duration-200 origin-center ${
              open ? "rotate-45 translate-y-1.75" : ""
            }`}
          />
          <span
            aria-hidden="true"
            className={`block h-0.5 w-5 bg-current rounded-full transition-opacity duration-200 ${
              open ? "opacity-0" : ""
            }`}
          />
          <span
            aria-hidden="true"
            className={`block h-0.5 w-5 bg-current rounded-full transition-transform duration-200 origin-center ${
              open ? "-rotate-45 -translate-y-1.75" : ""
            }`}
          />
        </button>
      </nav>

      {/* Mobile dropdown */}
      <ul
        id="mobile-menu"
        hidden={!open}
        className="sm:hidden border-t border-stone-100 bg-white px-4 py-1"
      >
        {NAV_LINKS.map(({ label, tab }) => (
          <li key={tab} className="border-b border-stone-100 last:border-0">
            <a
              href={`#${tab}`}
              onClick={(e) => handleClick(e, tab)}
              aria-current={activeTab === tab ? "page" : undefined}
              className={`block w-full px-2 py-3 text-sm font-medium transition-colors ${
                activeTab === tab ? "text-pine" : "text-stone-700 hover:text-pine"
              }`}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </header>
  );
}

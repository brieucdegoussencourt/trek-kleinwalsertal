"use client";

import { useState } from "react";

export type Tab = "itineraire" | "recapitulatif" | "checklist";

interface NavProps {
  onTabChange: (tab: Tab) => void;
}

const NAV_LINKS: { label: string; tab: Tab }[] = [
  { label: "Itinéraire",      tab: "itineraire" },
  { label: "Hébergements",    tab: "itineraire" },
  { label: "Checklist",       tab: "checklist"  },
  { label: "Infos pratiques", tab: "itineraire" },
];

export default function Nav({ onTabChange }: NavProps) {
  const [open, setOpen] = useState(false);

  function handleClick(tab: Tab) {
    onTabChange(tab);
    setOpen(false);
    document.getElementById("content")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-stone-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Logo */}
        <span className="text-sm font-semibold text-pine tracking-tight whitespace-nowrap">
          🏔 Kleinwalsertal · Juli 2026
        </span>

        {/* Desktop links */}
        <div className="hidden sm:flex items-center gap-1">
          {NAV_LINKS.map(({ label, tab }) => (
            <button
              key={label}
              onClick={() => handleClick(tab)}
              className="px-3 py-1.5 text-[11px] uppercase tracking-[0.1em] font-medium text-rock hover:text-pine transition-colors rounded"
            >
              {label}
            </button>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
          className="sm:hidden flex flex-col justify-center gap-1.25 p-2 -mr-1 text-rock hover:text-pine transition-colors"
        >
          <span
            className={`block h-0.5 w-5 bg-current rounded-full transition-transform duration-200 origin-center ${
              open ? "rotate-45 translate-y-1.75" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-5 bg-current rounded-full transition-opacity duration-200 ${
              open ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-5 bg-current rounded-full transition-transform duration-200 origin-center ${
              open ? "-rotate-45 -translate-y-1.75" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="sm:hidden border-t border-stone-100 bg-white px-4 py-1">
          {NAV_LINKS.map(({ label, tab }) => (
            <button
              key={label}
              onClick={() => handleClick(tab)}
              className="block w-full text-left px-2 py-3 text-sm font-medium text-stone-700 hover:text-pine transition-colors border-b border-stone-100 last:border-0"
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}

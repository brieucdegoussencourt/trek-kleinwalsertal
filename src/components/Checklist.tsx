"use client";

import { useState } from "react";
import { CHECKLIST, GEAR } from "@/data/trek";
import type { ChecklistItem, GearItem } from "@/data/trek";

function CheckRow({ item }: { item: ChecklistItem }) {
  const [checked, setChecked] = useState(false);

  return (
    <div
      role="checkbox"
      aria-checked={checked}
      tabIndex={0}
      onClick={() => setChecked((c) => !c)}
      onKeyDown={(e) => e.key === " " && setChecked((c) => !c)}
      className={`flex items-start gap-3 rounded-xl border px-4 py-3 cursor-pointer select-none transition-all ${
        checked
          ? "bg-pine/5 border-pine/20"
          : "bg-white border-stone-200 hover:border-stone-300"
      }`}
    >
      {/* Checkbox */}
      <div
        className={`mt-0.5 h-5 w-5 shrink-0 rounded border-2 flex items-center justify-center transition-colors ${
          checked ? "bg-pine border-pine" : "border-stone-300"
        }`}
      >
        {checked && (
          <span className="text-white text-xs font-bold leading-none">✓</span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {item.url && !checked ? (
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-sm font-medium text-stone-800 hover:text-pine underline underline-offset-2 transition-colors"
          >
            {item.label}
          </a>
        ) : (
          <p
            className={`text-sm font-medium transition-colors ${
              checked ? "line-through text-stone-400" : "text-stone-800"
            }`}
          >
            {item.label}
          </p>
        )}
        {item.note && !checked && (
          <p className="text-xs text-stone-400 mt-0.5">{item.note}</p>
        )}
      </div>
    </div>
  );
}

function GearRow({ item }: { item: GearItem }) {
  return (
    <div className="flex items-center gap-3 py-2 border-b border-stone-100 last:border-0">
      <span
        className={`h-1.5 w-1.5 rounded-full shrink-0 ${
          item.priority === "essential" ? "bg-gold" : "bg-rock/40"
        }`}
      />
      <span
        className={`text-sm ${
          item.priority === "essential" ? "text-stone-700" : "text-stone-500"
        }`}
      >
        {item.label}
      </span>
    </div>
  );
}

export default function Checklist() {
  const essential   = GEAR.filter((g) => g.priority === "essential");
  const recommended = GEAR.filter((g) => g.priority === "recommended");

  return (
    <div className="space-y-12">
      {/* Reservations */}
      <section>
        <h3 className="font-display text-xl text-stone-700 mb-4">
          Réservations &amp; Logistique
        </h3>
        <div className="space-y-2">
          {CHECKLIST.map((item) => (
            <CheckRow key={item.label} item={item} />
          ))}
        </div>
      </section>

      {/* Gear */}
      <section>
        <h3 className="font-display text-xl text-stone-700 mb-5">Équipement</h3>
        <div className="grid sm:grid-cols-2 gap-6">
          {/* Indispensable */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="h-px flex-1 bg-gold/30" />
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#7a4e00]">
                Indispensable
              </p>
              <span className="h-px flex-1 bg-gold/30" />
            </div>
            <div className="bg-white rounded-xl border border-stone-200 px-4 py-1">
              {essential.map((item) => (
                <GearRow key={item.label} item={item} />
              ))}
            </div>
          </div>

          {/* Fortement conseillé */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="h-px flex-1 bg-stone-200" />
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-rock">
                Fortement conseillé
              </p>
              <span className="h-px flex-1 bg-stone-200" />
            </div>
            <div className="bg-white rounded-xl border border-stone-200 px-4 py-1">
              {recommended.map((item) => (
                <GearRow key={item.label} item={item} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

"use client";

import { useState } from "react";
import { GEAR } from "@/data/trek";
import type { GearItem } from "@/data/trek";

function GearRow({ item }: { item: GearItem }) {
  const [checked, setChecked] = useState(false);

  return (
    <div
      role="checkbox"
      aria-checked={checked}
      tabIndex={0}
      onClick={() => setChecked((c) => !c)}
      onKeyDown={(e) => e.key === " " && setChecked((c) => !c)}
      className="flex items-center gap-3 py-2.5 border-b border-stone-100 last:border-0 cursor-pointer select-none"
    >
      {/* Checkbox */}
      <div
        className={`h-5 w-5 shrink-0 rounded border-2 flex items-center justify-center transition-colors ${
          checked ? "bg-pine border-pine" : "border-stone-300"
        }`}
      >
        {checked && (
          <span className="text-white text-xs font-bold leading-none">✓</span>
        )}
      </div>

      {/* Label */}
      <span
        className={`text-sm transition-colors ${
          checked
            ? "line-through text-stone-400"
            : item.priority === "essential"
              ? "text-stone-700"
              : "text-stone-500"
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

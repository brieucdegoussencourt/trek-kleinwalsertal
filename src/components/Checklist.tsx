"use client";

import { useId, useState } from "react";
import { GEAR } from "@/data/trek";
import type { GearItem } from "@/data/trek";

function GearRow({ item }: { item: GearItem }) {
  const [checked, setChecked] = useState(false);

  // A real checkbox under a styled box: native keyboard, form and
  // screen-reader behaviour for free.
  return (
    <li className="border-b border-stone-100 last:border-0">
      <label className="flex items-center gap-3 py-2.5 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
          className="peer sr-only"
        />
        {/* Checkbox */}
        <span
          aria-hidden="true"
          className={`h-5 w-5 shrink-0 rounded border-2 flex items-center justify-center transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-pine ${
            checked ? "bg-pine border-pine" : "border-stone-500"
          }`}
        >
          {checked && (
            <span className="text-white text-xs font-bold leading-none">✓</span>
          )}
        </span>

        {/* Label */}
        <span
          className={`text-sm transition-colors ${
            checked
              ? "line-through text-stone-500"
              : item.priority === "essential"
                ? "text-stone-800"
                : "text-stone-600"
          }`}
        >
          {item.label}
        </span>
      </label>
    </li>
  );
}

function GearGroup({
  title,
  items,
  lineClass,
  titleClass,
}: {
  title: string;
  items: GearItem[];
  lineClass: string;
  titleClass: string;
}) {
  const id = useId();
  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <span aria-hidden="true" className={`h-px flex-1 ${lineClass}`} />
        <h4 id={id} className={`text-[10px] font-bold uppercase tracking-[0.2em] ${titleClass}`}>
          {title}
        </h4>
        <span aria-hidden="true" className={`h-px flex-1 ${lineClass}`} />
      </div>
      <ul aria-labelledby={id} className="bg-white rounded-xl border border-stone-200 px-4 py-1">
        {items.map((item) => (
          <GearRow key={item.label} item={item} />
        ))}
      </ul>
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
          <GearGroup
            title="Indispensable"
            items={essential}
            lineClass="bg-gold/30"
            titleClass="text-[#7a4e00]"
          />
          <GearGroup
            title="Fortement conseillé"
            items={recommended}
            lineClass="bg-stone-200"
            titleClass="text-rock"
          />
        </div>
      </section>
    </div>
  );
}

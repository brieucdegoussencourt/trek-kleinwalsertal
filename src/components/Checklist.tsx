"use client";

import { useId, useState } from "react";
import { Check } from "lucide-react";
import { GEAR } from "@/data/trek";
import type { GearItem } from "@/data/trek";

function GearRow({ item }: { item: GearItem }) {
  const [checked, setChecked] = useState(false);

  // A real checkbox under a styled box: native keyboard, form and
  // screen-reader behaviour for free.
  return (
    <li className="border-b border-line/70 last:border-0">
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
          className={`h-[18px] w-[18px] shrink-0 rounded-[5px] border flex items-center justify-center transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-pine ${
            checked ? "bg-pine border-pine" : "border-stone-400 bg-white"
          }`}
        >
          {checked && <Check className="size-3 text-white" strokeWidth={3} />}
        </span>

        {/* Label */}
        <span
          className={`text-sm transition-colors ${
            checked
              ? "line-through text-stone-500"
              : item.priority === "essential"
                ? "text-ink"
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
  titleClass,
}: {
  title: string;
  items: GearItem[];
  titleClass: string;
}) {
  const id = useId();
  return (
    <div>
      <h4 id={id} className={`text-sm font-semibold mb-3 ${titleClass}`}>
        {title}
        <span className="ml-2 font-normal text-rock">{items.length}</span>
      </h4>
      <ul aria-labelledby={id} className="bg-white rounded-xl border border-line px-4 py-1">
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
        <h3 className="font-display text-2xl font-medium tracking-tight text-ink mb-5">Équipement</h3>
        <div className="grid sm:grid-cols-2 gap-6">
          <GearGroup
            title="Indispensable"
            items={essential}
            titleClass="text-ink"
          />
          <GearGroup
            title="Fortement conseillé"
            items={recommended}
            titleClass="text-ink"
          />
        </div>
      </section>
    </div>
  );
}

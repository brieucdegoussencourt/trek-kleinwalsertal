import { CloudSunRain, Footprints, Phone, Siren, type LucideIcon } from "lucide-react";
import { SAFETY_SECTIONS, EMERGENCY_NUMBERS, type SafetySection } from "@/data/trek";

const SECTION_ICON: Record<SafetySection["icon"], LucideIcon> = {
  before:    Footprints,
  weather:   CloudSunRain,
  emergency: Siren,
};

export default function SafetyTips() {
  return (
      <div className="space-y-10">
        {/* Emergency numbers — the thing you need fast */}
        <section>
          <h3 className="font-display text-2xl font-medium tracking-tight text-ink mb-4">
            Numéros d&rsquo;urgence
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {EMERGENCY_NUMBERS.map((n) => (
              <a
                key={n.number}
                href={`tel:${n.number}`}
                aria-label={`Appeler le ${n.number} — ${n.label}`}
                className="group flex items-center gap-4 bg-white rounded-xl border border-line hover:border-coral/50 transition-colors p-4"
              >
                <span aria-hidden="true" className="flex size-10 shrink-0 items-center justify-center rounded-full bg-coral/10 text-coral-deep">
                  <Phone className="size-4" strokeWidth={2} />
                </span>
                <span>
                  <span className="block font-display text-2xl font-medium text-coral-deep tabular-nums leading-none">
                    {n.number}
                  </span>
                  <span className="block text-xs text-rock mt-1">{n.label}</span>
                </span>
              </a>
            ))}
          </div>
          <p className="text-[11px] text-stone-600 mt-3">
            Numéros enregistrables dès maintenant — un appui suffit depuis cette
            page en montagne.
          </p>
        </section>

        {/* Tip sections */}
        {SAFETY_SECTIONS.map((section) => {
          const Icon = SECTION_ICON[section.icon];
          return (
          <section key={section.title}>
            <h3 className="font-display text-2xl font-medium tracking-tight text-ink mb-4">
              <span className="inline-flex items-center gap-2.5">
                <Icon aria-hidden="true" className="size-5 text-pine" strokeWidth={1.75} />
                {section.title}
              </span>
            </h3>
            <ul className="grid sm:grid-cols-2 gap-3">
              {section.tips.map((tip) => (
                <li
                  key={tip.title}
                  className="bg-white rounded-xl border border-line p-4"
                >
                  <h4 className="text-sm font-semibold text-ink">
                    {tip.title}
                  </h4>
                  <p className="text-sm text-stone-600 leading-relaxed mt-1">
                    {tip.description}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        );
      })}

      {/* Source */}
      <p className="text-[11px] text-stone-600 leading-relaxed">
        D&rsquo;après les recommandations officielles de{" "}
        <a
          href="https://www.vorarlberg.travel/en/safety-tips-on-the-mountain/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-pine transition-colors"
        >
          <span lang="en">Vorarlberg Tourismus — Safety tips on the mountain</span>
          <span className="sr-only"> (nouvel onglet)</span>
        </a>
        , adaptées à cet itinéraire.
      </p>
    </div>
  );
}

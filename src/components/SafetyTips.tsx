import { SAFETY_SECTIONS, EMERGENCY_NUMBERS } from "@/data/trek";

export default function SafetyTips() {
  return (
    <div className="space-y-10">
      {/* Emergency numbers — the thing you need fast */}
      <section>
        <h3 className="font-display text-xl text-stone-700 mb-4">
          Numéros d&rsquo;urgence
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {EMERGENCY_NUMBERS.map((n) => (
            <a
              key={n.number}
              href={`tel:${n.number}`}
              className="bg-white rounded-2xl border-2 border-coral/30 hover:border-coral transition-colors p-4 text-center"
            >
              <p className="text-3xl font-bold text-coral tabular-nums">
                {n.number}
              </p>
              <p className="text-xs text-stone-500 mt-1">{n.label}</p>
            </a>
          ))}
        </div>
        <p className="text-[11px] text-stone-400 mt-3">
          Numéros enregistrables dès maintenant — un appui suffit depuis cette
          page en montagne.
        </p>
      </section>

      {/* Tip sections */}
      {SAFETY_SECTIONS.map((section) => (
        <section key={section.title}>
          <h3 className="font-display text-xl text-stone-700 mb-4">
            <span className="mr-2">{section.icon}</span>
            {section.title}
          </h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {section.tips.map((tip) => (
              <div
                key={tip.title}
                className="bg-white rounded-xl border border-stone-200 p-4"
              >
                <p className="text-sm font-semibold text-stone-800">
                  {tip.title}
                </p>
                <p className="text-sm text-stone-500 leading-relaxed mt-1">
                  {tip.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      ))}

      {/* Source */}
      <p className="text-[11px] text-stone-400 leading-relaxed">
        D&rsquo;après les recommandations officielles de{" "}
        <a
          href="https://www.vorarlberg.travel/en/safety-tips-on-the-mountain/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-pine transition-colors"
        >
          Vorarlberg Tourismus — Safety tips on the mountain
        </a>
        , adaptées à cet itinéraire.
      </p>
    </div>
  );
}

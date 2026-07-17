import Image from "next/image";
import { VALLEY_CHAPTERS } from "@/data/trek";

export default function ValleySection() {
  return (
    <div className="space-y-12">
      {/* Intro */}
      <div className="max-w-2xl">
        <h3 className="font-display text-2xl text-stone-800 mb-3">
          La vallée en cinq chapitres
        </h3>
        <p className="text-sm text-stone-500 leading-relaxed">
          Avant d&rsquo;y poser les chaussures, un peu de contexte : d&rsquo;où
          vient cette vallée sans route vers son propre pays, qui sont les
          Walser, et pourquoi ses paysages ne ressemblent à aucun autre coin
          des Alpes.
        </p>
      </div>

      {/* Chapters — image and text alternate sides on desktop */}
      {VALLEY_CHAPTERS.map((chapter, i) => (
        <section
          key={chapter.title}
          className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden md:grid md:grid-cols-2"
        >
          <div className={`relative h-56 sm:h-72 md:h-full md:min-h-[320px] ${i % 2 === 1 ? "md:order-2" : ""}`}>
            <Image
              src={chapter.image.src}
              alt={chapter.image.alt}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
            <p className="absolute bottom-0 right-0 bg-black/45 text-white/80 text-[9px] px-2 py-0.5 rounded-tl-md">
              {chapter.image.credit}
            </p>
          </div>

          <div className="p-6 sm:p-8 space-y-4">
            <div className="flex items-baseline gap-3">
              <span className="font-display text-3xl text-pine/30 font-bold">
                {i + 1}
              </span>
              <h4 className="font-display text-xl font-semibold text-stone-800">
                {chapter.title}
              </h4>
            </div>

            {chapter.paragraphs.map((p) => (
              <p key={p.slice(0, 24)} className="text-sm text-stone-600 leading-relaxed">
                {p}
              </p>
            ))}

            <div className="flex flex-wrap gap-2 pt-1">
              {chapter.links.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-full border border-stone-200 px-3 py-1.5 text-xs font-medium text-stone-600 hover:border-pine hover:text-pine transition-colors"
                >
                  {link.label} →
                </a>
              ))}
            </div>
          </div>
        </section>
      ))}

      <p className="text-[11px] text-stone-400 leading-relaxed">
        Photos : Wikimedia Commons, licences Creative Commons — crédits sur
        chaque image.
      </p>
    </div>
  );
}

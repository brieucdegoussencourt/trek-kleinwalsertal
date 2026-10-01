import type { TrekDay } from "@/data/trek";

export const DIFFICULTY_LABEL: Record<TrekDay["difficulty"], string> = {
  easy:      "Facile",
  moderate:  "Modérée",
  sustained: "Soutenu",
  hard:      "Difficile",
};

// Outline badge: tone grows with difficulty, but stays quiet.
const TONE: Record<TrekDay["difficulty"], string> = {
  easy:      "border-pine/25 text-pine",
  moderate:  "border-gold/40 text-gold-deep",
  sustained: "border-coral/35 text-coral-deep",
  hard:      "border-coral/60 bg-coral/5 text-coral-deep",
};

export default function DifficultyBadge({
  difficulty,
}: {
  difficulty: TrekDay["difficulty"];
}) {
  return (
    <span
      className={`inline-block shrink-0 rounded-full border px-2 py-px text-[11px] font-medium leading-4 ${TONE[difficulty]}`}
    >
      {DIFFICULTY_LABEL[difficulty]}
    </span>
  );
}

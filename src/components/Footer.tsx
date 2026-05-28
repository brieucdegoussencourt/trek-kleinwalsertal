import { TREK_META } from "@/data/trek";

export default function Footer() {
  return (
    <footer className="border-t border-stone-200 py-12 text-center">
      <p className="font-display italic text-stone-400 text-lg">
        &ldquo;{TREK_META.quote}&rdquo;
      </p>
      <p className="text-stone-300 text-xs mt-3">{TREK_META.credit}</p>
    </footer>
  );
}

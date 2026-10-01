import { TREK_META } from "@/data/trek";

export default function Footer() {
  return (
    <footer className="border-t border-line py-14 text-center">
      <p className="font-display italic text-ink/80 text-xl">
        &ldquo;{TREK_META.quote}&rdquo;
      </p>
      <p className="text-rock text-xs mt-3">{TREK_META.credit}</p>
    </footer>
  );
}

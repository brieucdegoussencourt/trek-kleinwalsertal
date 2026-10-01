import {
  Camera,
  ClipboardCheck,
  CloudSun,
  LifeBuoy,
  Mountain,
  Radio,
  Route,
  Table2,
  type LucideIcon,
} from "lucide-react";

export type Tab =
  | "itineraire"
  | "vallee"
  | "live"
  | "photos"
  | "recapitulatif"
  | "meteo"
  | "securite"
  | "checklist";

/** Content tabs, in order. `icon` is decorative (hidden from screen readers). */
export const TABS: { id: Tab; label: string; icon: LucideIcon }[] = [
  { id: "itineraire",    label: "Itinéraire",    icon: Route          },
  { id: "vallee",        label: "La vallée",     icon: Mountain       },
  { id: "live",          label: "Live",          icon: Radio          },
  { id: "photos",        label: "Photos",        icon: Camera         },
  { id: "recapitulatif", label: "Récapitulatif", icon: Table2         },
  { id: "meteo",         label: "Météo",         icon: CloudSun       },
  { id: "securite",      label: "Sécurité",      icon: LifeBuoy       },
  { id: "checklist",     label: "Checklist",     icon: ClipboardCheck },
];

/** Brand bar laid over the hero photo; section navigation is the sticky
    tab bar below the hero. */
export default function Nav() {
  return (
    <header className="absolute inset-x-0 top-0 z-20">
      <div className="max-w-5xl mx-auto px-5 sm:px-6 h-14 flex items-center justify-between gap-4 text-white">
        <a
          href="#"
          className="flex items-center gap-2 text-sm font-semibold tracking-tight rounded"
        >
          <Mountain aria-hidden="true" className="size-4" strokeWidth={2} />
          Kleinwalsertal
        </a>
        <p className="text-xs text-white/75">
          <span lang="de">Juli</span> 2026
        </p>
      </div>
    </header>
  );
}

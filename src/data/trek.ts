// ============================================================
// Trek Kleinwalsertal — Juillet 2026
// Brieuc & Sophie
// ============================================================

export interface DayStats {
  distanceKm: number;
  elevationGainM: number;
  elevationLossM: number;
  durationMin: string;
  durationMax: string;
  altitudeNightM: number;
}

export interface Accommodation {
  name: string;
  type: "refuge-dav" | "refuge-prive" | "hotel";
  altitudeM?: number;
  capacity?: string;
  paymentNote?: string;
  priceNote?: string;
  bookingUrl?: string;
}

export interface DayHighlight {
  title: string;
  description: string;
}

export interface TrekDay {
  dayNumber: number;
  date: string;
  dateShort: string;
  label: string;
  from: string;
  to: string;
  via?: string;
  stats: DayStats;
  difficulty: "moderate" | "sustained" | "easy" | "hard";
  mustSee: DayHighlight[];
  bonusTips: DayHighlight[];
  practicalInfo?: string;
  warning?: string;
  accommodation: Accommodation;
}

export interface TrekSummary {
  totalKm: number;
  totalElevationGainM: number;
  totalElevationLossM: number;
  totalHikingHours: string;
  nights: number;
  days: number;
}

export interface ChecklistItem {
  label: string;
  url?: string;
  note?: string;
}

export interface GearItem {
  label: string;
  priority: "essential" | "recommended";
}

// ─── Trek metadata ───────────────────────────────────────────

export const TREK_META = {
  title: "Trek Kleinwalsertal",
  subtitle: "Trek en refuge · Vorarlberg, Autriche",
  tagline: "Klein mais costaud !",
  participants: "Brieuc & Sophie",
  month: "Juillet 2026",
  region: "Vorarlberg · Autriche",
  description:
    "Nichée dans les Alpes du Vorarlberg autrichien, le Kleinwalsertal est une enclave géographique unique : accessible uniquement depuis l'Allemagne via Oberstdorf, cette vallée alpine préservée offre des paysages de haute montagne spectaculaires, des refuges authentiques et une atmosphère hors du temps.",
  quote: "Petits pas, grands horizons.",
  credit: "Fait avec un peu d'IA et bcp d'amour",
} as const;

// ─── Summary ─────────────────────────────────────────────────

export const TREK_SUMMARY: TrekSummary = {
  totalKm: 39.5,
  totalElevationGainM: 2500,
  totalElevationLossM: 3050,
  totalHikingHours: "~17h",
  nights: 3,
  days: 4,
};

// ─── Days ────────────────────────────────────────────────────

export const TREK_DAYS: TrekDay[] = [
  {
    dayNumber: 1,
    date: "Mardi 21 juillet",
    dateShort: "Mar. 21 juil.",
    label: "Mise en jambes panoramique",
    from: "Kanzelwand",
    to: "Fiderepasshütte",
    stats: {
      distanceKm: 7.5,
      elevationGainM: 550,
      elevationLossM: 250,
      durationMin: "3h00",
      durationMax: "3h30",
      altitudeNightM: 2070,
    },
    difficulty: "moderate",
    mustSee: [
      {
        title: "Panorama de la Kanzelwand",
        description:
          "Vue à 360° depuis 1 957m sur les Alpes de l'Allgäu, du Vorarlberg et par temps clair jusqu'en Suisse.",
      },
      {
        title: "Fiderepasshütte au coucher de soleil",
        description:
          "L'un des refuges les plus photographiés des Alpes — position panoramique spectaculaire à 2 070m.",
      },
    ],
    bonusTips: [
      {
        title: "Montée au Schusser (2 252m)",
        description:
          "Accessible depuis le refuge — 1h A/R pour un panorama encore plus dégagé avant le dîner.",
      },
      {
        title: "Kaiserschmarrn au refuge",
        description:
          "Dessert autrichien traditionnel en fin de repas — une tradition incontournable !",
      },
    ],
    practicalInfo:
      "Réservation sur fiderepasshuette.de — indispensable en juillet. Paiement ESPÈCES uniquement. Prévoir 80–90 EUR/pers demi-pension. Accès facilité par la Kanzelwandbahn (~17 EUR/pers aller), sinon +7 km / +850 m / +2h30 à pied.",
    accommodation: {
      name: "Fiderepasshütte",
      type: "refuge-dav",
      altitudeM: 2070,
      capacity: "~110 places en dortoir",
      paymentNote: "ESPÈCES UNIQUEMENT",
      priceNote: "~80–90 EUR/pers demi-pension",
      bookingUrl: "https://www.fiderepasshuette.de",
    },
  },
  {
    dayNumber: 2,
    date: "Mercredi 22 juillet",
    dateShort: "Mer. 22 juil.",
    label: "L'étape reine",
    from: "Fiderepasshütte",
    to: "Widdersteinütte",
    stats: {
      distanceKm: 12,
      elevationGainM: 850,
      elevationLossM: 800,
      durationMin: "5h30",
      durationMax: "6h00",
      altitudeNightM: 2009,
    },
    difficulty: "sustained",
    mustSee: [
      {
        title: "Fiderepassscharte en début d'étape",
        description:
          "Falaises plongeantes d'un côté, vallée à 1 000m en contrebas de l'autre — le plus beau belvédère du trek.",
      },
      {
        title: "Alpages du Krumbacher Hoehenweg",
        description:
          "En juillet : arnica, gentianes et rhododendrons alpins en pleine floraison.",
      },
    ],
    bonusTips: [
      {
        title: "Halte à la Mindelheimer Hütte (2 013m)",
        description:
          "À mi-parcours — une Radler bien méritée avec panorama garanti.",
      },
      {
        title: "Soirée romantique à la Widdersteinütte",
        description:
          "Dîner sous les étoiles avec la silhouette du Widderstein en toile de fond.",
      },
    ],
    warning:
      "Ne sous-estimez pas cette étape. La progression dans les pierriers est bien plus lente qu'en sentier ordinaire. Départ recommandé avant 7h30. Bâtons de randonnée indispensables. Passages exposés avec mains courantes — bons randonneurs requis.",
    accommodation: {
      name: "Widdersteinütte",
      type: "refuge-prive",
      altitudeM: 2009,
      capacity: "Refuge intime et chaleureux",
      bookingUrl: "https://www.kleinwalsertal.com",
    },
  },
  {
    dayNumber: 3,
    date: "Jeudi 23 juillet",
    dateShort: "Jeu. 23 juil.",
    label: "Descente sauvage + SPA",
    from: "Widdersteinütte",
    to: "Hirschegg",
    via: "Baad",
    stats: {
      distanceKm: 6.5,
      elevationGainM: 50,
      elevationLossM: 800,
      durationMin: "2h15",
      durationMax: "2h45",
      altitudeNightM: 1086,
    },
    difficulty: "easy",
    mustSee: [
      {
        title: "Descente de la Bargunttal",
        description:
          "Vallée sauvage et préservée — l'une des plus belles descentes du trek.",
      },
      {
        title: "SPA-ROSA à l'A-ROSA Ifen Hotel",
        description:
          "Piscine infinity extérieure avec vue panoramique, sauna aux herbes alpines, bain de sel. Suite SPA Privée pour couples.",
      },
    ],
    bonusTips: [
      {
        title: "Option : Grosser Widderstein (2 533m)",
        description:
          "+500m D+ · 3 km A/R · 2h30 supplémentaires. Départ à l'aube depuis le refuge. Condition sine qua non : météo parfaite et jambes fraîches.",
      },
      {
        title: "Dîner Kilian Stuba",
        description:
          "Restaurant gastronomique de l'hôtel — cuisine alpine contemporaine après 3 jours de refuges. Alternative : le Carnozet, cuisine Walser régionale avec terrasse.",
      },
    ],
    practicalInfo:
      "WalserBus Ligne 1 : Baad → Hirschegg direct, ~20–25 min, toutes les 20 min. Gratuit avec la Gastekarte de l'hôtel. Réserver la Suite SPA Privée à l'avance.",
    accommodation: {
      name: "A-ROSA Ifen Hotel",
      type: "hotel",
      altitudeM: 1086,
      capacity: "5 étoiles — Spa inclus",
      bookingUrl: "https://www.arosahotels.co.uk",
    },
  },
  {
    dayNumber: 4,
    date: "Vendredi 24 juillet",
    dateShort: "Ven. 24 juil.",
    label: "Final de légende",
    from: "Hirschegg",
    to: "Riezlern",
    via: "Gottesackerplateau",
    stats: {
      distanceKm: 13.5,
      elevationGainM: 1050,
      elevationLossM: 1200,
      durationMin: "5h30",
      durationMax: "6h00",
      altitudeNightM: 1086,
    },
    difficulty: "sustained",
    mustSee: [
      {
        title: "Gottesackerplateau",
        description:
          "Plateau karstique de 7 km² parsemé de lapiaz, dolines et gouffres. Nulle part en Europe centrale n'existe pareil paysage — un contraste total avec les alpages verts.",
      },
      {
        title: "Vue depuis la Hahnenköpfle",
        description:
          "Panorama à 360° sur l'ensemble du Kleinwalsertal et les Alpes du Bregenzerwald.",
      },
    ],
    bonusTips: [
      {
        title: "Le Hölloch depuis l'extérieur",
        description:
          "13 km de réseau souterrain — l'air froid qui s'en échappe et la profondeur du gouffre (entrée à 80m) sont saisissants. Aucun équipement requis.",
      },
      {
        title: "Descente finale à travers le Mahdtal",
        description:
          "Forêt et alpages après l'univers minéral du plateau — le contraste et la tranquillité sont totaux.",
      },
    ],
    practicalInfo:
      "Astuce genoux : Ifenbahn depuis l'Auenhütte pour économiser la montée initiale de 600m. Ramène l'étape à 9,5 km et +450m D+. Très recommandé après 3 jours de trek. Vérifier horaires sur ok-bergbahnen.com.",
    accommodation: {
      name: "Hotel Riezlern",
      type: "hotel",
      altitudeM: 1086,
      capacity: "Retour à la base",
    },
  },
];

// ─── Checklist ───────────────────────────────────────────────

export const CHECKLIST: ChecklistItem[] = [
  {
    label: "Réserver Fiderepasshütte",
    url: "https://www.fiderepasshuette.de",
    note: "Très demandé en juillet — réserver dès maintenant",
  },
  {
    label: "Réserver Widdersteinütte",
    url: "https://www.kleinwalsertal.com",
  },
  {
    label: "Réserver A-ROSA Ifen Hotel Hirschegg",
    url: "https://www.arosahotels.co.uk",
    note: "Réserver la Suite SPA Privée en même temps",
  },
  {
    label: "Réserver hotel Riezlern (Jour 0 + Jour 4)",
  },
  {
    label: "Vérifier Kanzelwandbahn",
    url: "https://www.kanzelwandbahn.de",
    note: "Ouvert en juillet — ~17 EUR/pers aller",
  },
  {
    label: "Vérifier Ifenbahn (Jour 4)",
    url: "https://www.ok-bergbahnen.com",
  },
  {
    label: "Météo quotidienne",
    url: "https://www.meteo.at",
    note: "Aussi mountain-forecast.com par sommet",
  },
  {
    label: "Prévoir espèces",
    note: "Min. 150 EUR/pers — Fiderepasshütte CASH uniquement",
  },
];

// ─── Gear ────────────────────────────────────────────────────

export const GEAR: GearItem[] = [
  { label: "Chaussures montantes (cheville protégée)", priority: "essential" },
  { label: "Bâtons de randonnée télescopiques", priority: "essential" },
  { label: "Sac de couchage léger (liner de soie)", priority: "essential" },
  { label: "Gore-tex / veste de pluie", priority: "essential" },
  { label: "Couche intermédiaire (polaire)", priority: "essential" },
  { label: "Crème solaire haute protection + lèvres", priority: "essential" },
  { label: "Gourde 1,5 L minimum", priority: "essential" },
  { label: "Espèces (Fiderepasshütte : zéro carte bancaire)", priority: "recommended" },
  { label: "Boules Quies (dortoirs en refuge)", priority: "recommended" },
  { label: "Pharmacie : ampoules, ibuprofène, pansements", priority: "recommended" },
  { label: "Komoot / AllTrails — traces GPX offline", priority: "recommended" },
  { label: "Lampe frontale", priority: "recommended" },
  { label: "Couverture de survie légère", priority: "recommended" },
  { label: "Tenue légère pour le spa A-ROSA", priority: "recommended" },
];

// ─── Geography & access ──────────────────────────────────────

export const TREK_ACCESS = {
  valleyExtent: "~15 km d'ouest (Riezlern, 1086m) à est (Baad, 1100m)",
  bus: "WalserBus Ligne 1 — gratuit avec la Gastekarte de votre hôtel, toutes les 10–20 min en haute saison",
  drivingFromBrussels:
    "Bruxelles → Riezlern : ~730 km via E40 → Cologne → A8 → Memmingen → A7 → Sonthofen → Oberstdorf. Compter 7h30–8h30. Pas de vignette autrichienne requise.",
} as const;
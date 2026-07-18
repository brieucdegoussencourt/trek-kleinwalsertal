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

export type WaypointKind =
  | "start"
  | "hut"
  | "pass"
  | "peak"
  | "village"
  | "poi"
  | "transfer";

export interface Waypoint {
  name: string;
  /** [latitude, longitude] in decimal degrees (WGS84). */
  coord: [number, number];
  altitudeM?: number;
  kind: WaypointKind;
  /** Reached by bus/lift rather than on foot — rendered as a dashed leg. */
  transfer?: boolean;
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
  itinerary: string[];
  waypoints: Waypoint[];
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
  totalKm: 43.1,
  totalElevationGainM: 2690,
  totalElevationLossM: 3530,
  totalHikingHours: "~18h",
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
    from: "Riezlern",
    to: "Fiderepasshütte",
    stats: {
      distanceKm: 10.1,
      elevationGainM: 1440,
      elevationLossM: 480,
      durationMin: "5h00",
      durationMax: "6h00",
      altitudeNightM: 2070,
    },
    difficulty: "sustained",
    itinerary: [
      "Départ de l'Hotel Jagdhof (Riezlern · Westegg, 1 096 m) — petit-déjeuner copieux conseillé !",
      "Courte mise en jambes jusqu'à la station-vallée de la Kanzelwandbahn (~10 min).",
      "Longue montée régulière par les pistes et sentiers jusqu'à la station supérieure de la Kanzelwand (~1 957 m).",
      "Courte ascension jusqu'au sommet de la Kanzelwand (2 058 m) pour le panorama à 360°.",
      "Traversée du versant allemand (Allgäu) : alternance de courtes montées et descentes le long des crêtes.",
      "Progression vers l'ouest en direction du Fiderepass, sous les parois des Kanzelwand-Köpfe.",
      "Arrivée à la Fiderepasshütte (2 070 m), perchée sur le col — installation et coucher de soleil.",
    ],
    waypoints: [
      { name: "Hotel Jagdhof · Riezlern",           coord: [47.35886, 10.19116], altitudeM: 1096, kind: "start" },
      { name: "Kanzelwandbahn · station vallée",    coord: [47.35584, 10.18486], altitudeM: 1087, kind: "poi" },
      { name: "Kanzelwand · station supérieure",    coord: [47.33767, 10.20123], altitudeM: 1957, kind: "poi" },
      { name: "Sommet de la Kanzelwand",            coord: [47.33478, 10.20770], altitudeM: 2058, kind: "peak" },
      { name: "Fiderepasshütte",                    coord: [47.31561, 10.21244], altitudeM: 2070, kind: "hut" },
    ],
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
      "Étape en montée intégrale à pied depuis l'hôtel (1 096 m → 2 070 m). Pour raccourcir : la Kanzelwandbahn — à 10 min à pied du Jagdhof — monte à la station supérieure (~17 EUR/pers aller) et ramène l'étape à ~4 km / +580 m. Réservation Fiderepasshütte sur fiderepasshuette.de — indispensable en juillet. Paiement ESPÈCES uniquement. Prévoir 80–90 EUR/pers demi-pension.",
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
      distanceKm: 11.6,
      elevationGainM: 890,
      elevationLossM: 950,
      durationMin: "5h30",
      durationMax: "6h00",
      altitudeNightM: 2009,
    },
    difficulty: "sustained",
    itinerary: [
      "Départ tôt (avant 7h30) depuis la Fiderepasshütte, montée vers l'est jusqu'à la Fiderescharte — passages câblés / mains courantes.",
      "Descente rocheuse en serpentins par le Saubuckel vers la Taufersbergalpe (non gardée).",
      "Bascule sur le Krumbacher Höhenweg : sentier de balcon sans grosse dénivellation, sous les parois de la via ferrata.",
      "Halte à la Mindelheimer Hütte (2 013 m), à mi-parcours — pause bienvenue.",
      "Continuation par le Geißhornjoch (1 982 m) puis le Gemstelpass (1 971 m).",
      "Courte montée d'environ 200 m sous le Geißhorn, puis descente facile jusqu'à la Widdersteinhütte (2 009 m).",
    ],
    waypoints: [
      { name: "Fiderepasshütte",     coord: [47.31561, 10.21244], altitudeM: 2070, kind: "start" },
      { name: "Fiderescharte",       coord: [47.31386, 10.22016], altitudeM: 2200, kind: "pass" },
      { name: "Mindelheimer Hütte",  coord: [47.29233, 10.19490], altitudeM: 2013, kind: "hut" },
      { name: "Gemstelpass",         coord: [47.27817, 10.14288], altitudeM: 1971, kind: "pass" },
      { name: "Widdersteinhütte",    coord: [47.27851, 10.13688], altitudeM: 2009, kind: "hut" },
    ],
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
      distanceKm: 7.6,
      elevationGainM: 60,
      elevationLossM: 840,
      durationMin: "2h15",
      durationMax: "2h45",
      altitudeNightM: 1111,
    },
    difficulty: "easy",
    itinerary: [
      "Descente courte mais raide depuis la Widdersteinhütte vers le Hochalppass.",
      "Basculement dans la Bärguntal (Bargunttal), vallée sauvage et préservée.",
      "Passage par la Bärgunthütte, puis descente régulière le long du torrent.",
      "Arrivée à Baad (1 244 m), hameau le plus haut de la vallée.",
      "WalserBus Ligne 1 : Baad → Hirschegg (~20–25 min), gratuit avec la Gästekarte.",
      "Check-in à l'A-ROSA Ifen Hotel (1 086 m) — après-midi spa bien mérité.",
    ],
    waypoints: [
      { name: "Widdersteinhütte",       coord: [47.27851, 10.13688], altitudeM: 2009, kind: "start" },
      { name: "Hochalppass",            coord: [47.27594, 10.11491], altitudeM: 1935, kind: "pass" },
      { name: "Bärgunthütte",           coord: [47.29277, 10.11403], altitudeM: 1408, kind: "hut" },
      { name: "Baad",                   coord: [47.31035, 10.12128], altitudeM: 1244, kind: "village" },
      { name: "Hirschegg · A-ROSA Ifen", coord: [47.34942, 10.17191], altitudeM: 1111, kind: "transfer", transfer: true },
    ],
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
      altitudeM: 1111,
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
    to: "Hirschegg",
    via: "Gottesackerplateau",
    stats: {
      distanceKm: 13.8,
      elevationGainM: 300,
      elevationLossM: 1260,
      durationMin: "4h00",
      durationMax: "5h00",
      altitudeNightM: 1111,
    },
    difficulty: "sustained",
    itinerary: [
      "Rejoindre l'Auenhütte (station vallée de l'Ifenbahn) depuis Hirschegg.",
      "Montée en Ifenbahn jusqu'à la station supérieure Ifen II (~2 030 m) — évite ~750 m de grimpe.",
      "Courte montée à la Hahnenköpfle (~2 085 m) : panorama à 360° sur le Kleinwalsertal et le Bregenzerwald.",
      "Traversée du Gottesackerplateau : lapiaz, dolines et gouffres — suivre attentivement le balisage (bonne visibilité indispensable).",
      "Passage par les ruines de la Gottesackeralpe (~1 835 m).",
      "Descente par le Mahdtal, devant l'entrée béante du Hölloch (gouffre de 80 m).",
      "Sortie du Mahdtal à Wälde, puis retour à Hirschegg à pied — la boucle est bouclée.",
      "Dernière nuit au A-ROSA Ifen Hotel : spa, sauna et dîner pour fêter le trek !",
    ],
    waypoints: [
      { name: "Auenhütte · Ifenbahn",   coord: [47.34292, 10.13698], altitudeM: 1280, kind: "start" },
      { name: "Hahnenköpfle",           coord: [47.35791, 10.10226], altitudeM: 2085, kind: "peak", transfer: true },
      { name: "Gottesackerplateau",     coord: [47.36433, 10.10002], altitudeM: 1900, kind: "poi" },
      { name: "Gottesackeralpe",        coord: [47.37210, 10.11130], altitudeM: 1835, kind: "poi" },
      { name: "Hölloch",                coord: [47.37785, 10.15040], altitudeM: 1180, kind: "poi" },
      { name: "Hirschegg · A-ROSA Ifen", coord: [47.34942, 10.17191], altitudeM: 1111, kind: "village" },
    ],
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
      "Boucle depuis Hirschegg : déposez les gros sacs à l'hôtel avant de partir ! Version par défaut : Ifenbahn depuis l'Auenhütte jusqu'à Ifen II (~2 030 m) — vivement recommandé après 3 jours de trek. Puriste ? Montée intégrale à pied : 18 km / +1 100 m / ~7 h. Aucun point d'eau ni ravitaillement sur le plateau : prévoir eau + en-cas. Horaires Ifenbahn sur ok-bergbahnen.com.",
    accommodation: {
      name: "A-ROSA Ifen Hotel",
      type: "hotel",
      altitudeM: 1111,
      capacity: "5 étoiles — Spa inclus · 2e nuit",
      bookingUrl: "https://www.arosahotels.co.uk",
    },
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

// ─── Weather ─────────────────────────────────────────────────

export interface WeatherSpot {
  dayNumber: number;
  /** Trek date, ISO YYYY-MM-DD — drives the Open-Meteo request. */
  dateIso: string;
  /** Point haut de l'étape — le plus pertinent pour la météo de rando. */
  name: string;
  coord: [number, number];
  altitudeM: number;
}

export const WEATHER_SPOTS: WeatherSpot[] = [
  { dayNumber: 1, dateIso: "2026-07-21", name: "Kanzelwand",       coord: [47.33478, 10.20770], altitudeM: 2058 },
  { dayNumber: 2, dateIso: "2026-07-22", name: "Fiderescharte",    coord: [47.31386, 10.22016], altitudeM: 2200 },
  { dayNumber: 3, dateIso: "2026-07-23", name: "Widdersteinhütte", coord: [47.27851, 10.13688], altitudeM: 2009 },
  { dayNumber: 4, dateIso: "2026-07-24", name: "Hahnenköpfle",     coord: [47.35791, 10.10226], altitudeM: 2085 },
];

export const WEATHER_LINKS = [
  {
    label: "Mountain-Forecast · Kanzelwand",
    url: "https://www.mountain-forecast.com/peaks/Kanzelwand",
    note: "Prévisions par sommet et par altitude",
  },
  {
    label: "Bergfex · Météo Kleinwalsertal",
    url: "https://www.bergfex.com/sommer/kleinwalsertal/wetter/",
    note: "Bulletin de la vallée + webcams",
  },
  {
    label: "GeoSphere Austria (meteo.at)",
    url: "https://www.meteo.at",
    note: "Service météo officiel autrichien",
  },
] as const;

// ─── Safety ──────────────────────────────────────────────────

export interface SafetyTip {
  title: string;
  description: string;
}

export interface SafetySection {
  title: string;
  icon: string;
  tips: SafetyTip[];
}

export const EMERGENCY_NUMBERS = [
  { number: "140", label: "Secours alpin · Autriche" },
  { number: "144", label: "Urgences · Vorarlberg" },
  { number: "112", label: "Numéro d'urgence européen" },
] as const;

export const SAFETY_SECTIONS: SafetySection[] = [
  {
    title: "Avant de partir",
    icon: "🥾",
    tips: [
      {
        title: "Rythme & acclimatation",
        description:
          "Commencez doucement : le corps a besoin de s'adapter à l'altitude et à l'effort. Les premiers jours, adoptez un rythme plus lent que d'habitude.",
      },
      {
        title: "Préparez votre itinéraire",
        description:
          "Cartes et topos en main, choisissez des sentiers adaptés à la saison et à votre condition physique. Les traces GPX offline (Komoot / AllTrails) sont vos amies.",
      },
      {
        title: "Prévenez votre hébergement",
        description:
          "Indiquez chaque matin votre itinéraire et l'heure d'arrivée prévue au refuge suivant — et signalez tout retard. C'est le filet de sécurité classique en montagne.",
      },
      {
        title: "Restez sur les sentiers balisés",
        description:
          "Prudence particulière sur les névés raides et les pentes herbeuses glissantes après la pluie. Ne coupez jamais les lacets.",
      },
    ],
  },
  {
    title: "Météo en montagne",
    icon: "🌦️",
    tips: [
      {
        title: "Surveillez l'évolution en journée",
        description:
          "Orages d'été et fronts froids arrivent souvent l'après-midi : partez tôt, visez les passages exposés (Fiderescharte, Gottesackerplateau) avant midi.",
      },
      {
        title: "−1 °C tous les 100 m",
        description:
          "Par beau temps, la température baisse d'environ 1 °C par 100 m d'altitude : il peut faire 10 °C de moins à la Fiderepasshütte qu'à Riezlern.",
      },
      {
        title: "Réévaluez en chemin",
        description:
          "Comparez régulièrement le ciel aux prévisions. Si le temps se dégrade, faites demi-tour ou mettez-vous à l'abri — le plateau karstique est dangereux par brouillard.",
      },
    ],
  },
  {
    title: "En cas d'urgence",
    icon: "🆘",
    tips: [
      {
        title: "Signal de détresse alpin",
        description:
          "6 signaux par minute (sifflet, lampe, gestes), pause d'une minute, puis répéter — jusqu'à réponse des secours.",
      },
      {
        title: "Que dire au 140",
        description:
          "QUI appelle · OÙ exactement · QUE s'est-il passé · COMBIEN de personnes concernées. Restez joignable après l'appel.",
      },
      {
        title: "what3words",
        description:
          "Installez l'application avant le départ : elle transforme votre position en 3 mots uniques, transmissibles aux secours même sans réseau data.",
      },
      {
        title: "Assurance secours en montagne",
        description:
          "Le secours héliporté est payant en Autriche. L'adhésion Bergrettung Österreich (~28 EUR/an) couvre les frais de recherche et de sauvetage.",
      },
    ],
  },
];

// ─── La vallée — chapitres de présentation ───────────────────

export interface ValleyChapter {
  title: string;
  paragraphs: string[];
  image: {
    /** Wikimedia Commons thumbnail (freely licensed). */
    src: string;
    alt: string;
    credit: string;
  };
  links: { label: string; url: string }[];
}

export const VALLEY_CHAPTERS: ValleyChapter[] = [
  {
    title: "Une enclave singulière",
    paragraphs: [
      "Le Kleinwalsertal est une curiosité géographique : cette vallée autrichienne du Vorarlberg n'est accessible par la route que depuis l'Allemagne, via Oberstdorf. Coupée du reste de l'Autriche par les crêtes, elle vit depuis un siècle au rythme de ses voisins bavarois — on y roulait au Deutsche Mark bien avant l'euro.",
      "Quatre villages s'égrènent le long de la Breitach entre 1 086 et 1 244 m : Riezlern, Hirschegg, Mittelberg et Baad, tout au fond. Une seule commune, Mittelberg, et à peine 5 000 habitants pour l'une des vallées les plus visitées des Alpes.",
    ],
    image: {
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Riezlern-view_from_Schwende_to_Riezlern_village-01ESD.jpg/1280px-Riezlern-view_from_Schwende_to_Riezlern_village-01ESD.jpg",
      alt: "Vue sur le village de Riezlern dans la vallée",
      credit: "Rikki Mitterer · CC BY-SA 4.0 · Wikimedia Commons",
    },
    links: [
      { label: "Kleinwalsertal — Wikipédia", url: "https://fr.wikipedia.org/wiki/Kleinwalsertal" },
      { label: "Site officiel de la vallée", url: "https://www.kleinwalsertal.com/en/" },
    ],
  },
  {
    title: "Le peuple Walser",
    paragraphs: [
      "Vers 1270, des familles venues du Haut-Valais suisse franchissent les cols pour coloniser les hautes vallées de l'arc alpin. Ces Walser — « Valaisans » — s'installent ici vers 1300 et défrichent la vallée. Libres paysans de montagne, ils paient leur indépendance d'une vie rude à plus de 1 100 m.",
      "Leur héritage est partout : le dialecte walser encore parlé, les maisons de bois brunies par le soleil, les hameaux dispersés et l'église St. Jodok de Mittelberg. Le Walsermuseum de Riezlern raconte cette épopée alpine.",
    ],
    image: {
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Bei_der_Kirche_-_panoramio_%283%29.jpg/1280px-Bei_der_Kirche_-_panoramio_%283%29.jpg",
      alt: "L'église de Mittelberg, cœur historique walser de la vallée",
      credit: "Richard Mayer · CC BY 3.0 · Wikimedia Commons",
    },
    links: [
      { label: "Les Walser — Wikipédia", url: "https://fr.wikipedia.org/wiki/Walser" },
    ],
  },
  {
    title: "Des sommets de caractère",
    paragraphs: [
      "Le Grosser Widderstein (2 533 m) veille sur le fond de la vallée — c'est lui que vous contournerez au jour 3, et il figure sur le blason de Mittelberg. Face à lui, le Hoher Ifen (2 230 m) dresse sa silhouette unique dans les Alpes : une dalle calcaire inclinée, posée comme un paquebot de pierre.",
      "Entre les deux, la crête du Fellhorn et de la Kanzelwand marque la frontière germano-autrichienne — votre itinéraire du jour 1 la longe au plus près.",
    ],
    image: {
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Gro%C3%9Fer_Kleiner_Widderstein_von_Osten.jpg/1280px-Gro%C3%9Fer_Kleiner_Widderstein_von_Osten.jpg",
      alt: "Le Grosser et le Kleiner Widderstein vus de l'est",
      credit: "Whgler · CC BY-SA 4.0 · Wikimedia Commons",
    },
    links: [
      { label: "Grosser Widderstein — Wikipédia (de)", url: "https://de.wikipedia.org/wiki/Gro%C3%9Fer_Widderstein" },
      { label: "Hoher Ifen — Wikipédia", url: "https://fr.wikipedia.org/wiki/Hoher_Ifen" },
    ],
  },
  {
    title: "Le Gottesacker, désert de pierre",
    paragraphs: [
      "Au pied du Hoher Ifen s'étend l'un des paysages les plus étranges d'Europe centrale : le Gottesackerplateau, « champ du repos de Dieu ». Sept kilomètres carrés de lapiaz — un calcaire blanc strié, crevassé, sculpté par l'eau depuis des millions d'années.",
      "Sous vos pieds, le Hölloch : près de 13 km de galeries souterraines, l'un des plus grands réseaux karstiques d'Allemagne — son entrée béante se visite au jour 4. L'ensemble est classé réserve naturelle : restez sur le sentier balisé.",
    ],
    image: {
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Hoher_Ifen_mit_Gottesacker_%28NSG_700.12%29.jpg/1280px-Hoher_Ifen_mit_Gottesacker_%28NSG_700.12%29.jpg",
      alt: "Le Hoher Ifen et le plateau karstique du Gottesacker",
      credit: "CatalpaSpirit · CC BY-SA 4.0 · Wikimedia Commons",
    },
    links: [
      { label: "Le Gottesackerplateau — Vorarlberg Tourismus", url: "https://www.vorarlberg.travel/en/gottesackerplateau-kleinwalsertal/" },
    ],
  },
  {
    title: "La Breitachklamm, porte de la vallée",
    paragraphs: [
      "La Breitach, qui draine toute la vallée, s'échappe vers Oberstdorf par une entaille spectaculaire : la Breitachklamm, la gorge rocheuse la plus profonde d'Europe centrale — jusqu'à 150 m de parois au-dessus du torrent.",
      "Des passerelles taillées dans la roche permettent de la parcourir en une heure environ. Une idée d'excursion parfaite pour la veille du départ ou le lendemain du trek, à dix minutes de Riezlern.",
    ],
    image: {
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Breitachklamm_11072015_%28Foto_Hilarmont%29_%28110%29.jpg/1280px-Breitachklamm_11072015_%28Foto_Hilarmont%29_%28110%29.jpg",
      alt: "Les parois de la Breitachklamm au-dessus du torrent",
      credit: "Hilarmont · CC BY-SA 3.0 de · Wikimedia Commons",
    },
    links: [
      { label: "Breitachklamm — site officiel", url: "https://www.breitachklamm.com/" },
    ],
  },
];

// ─── Live tracking ───────────────────────────────────────────

export interface LiveTracker {
  id: string;
  name: string;
  color: string;
}

export const LIVE_TRACKERS: LiveTracker[] = [
  { id: "brieuc", name: "Brieuc", color: "#378ADD" }, // azure
  { id: "sophie", name: "Sophie", color: "#D85A30" }, // coral
];

// ─── Geography & access ──────────────────────────────────────

export const TREK_ACCESS = {
  valleyExtent: "~15 km d'ouest (Riezlern, 1086m) à est (Baad, 1100m)",
  bus: "WalserBus Ligne 1 — gratuit avec la Gastekarte de votre hôtel, toutes les 10–20 min en haute saison",
  drivingFromBrussels:
    "Bruxelles → Riezlern : ~730 km via E40 → Cologne → A8 → Memmingen → A7 → Sonthofen → Oberstdorf. Compter 7h30–8h30. Pas de vignette autrichienne requise.",
} as const;
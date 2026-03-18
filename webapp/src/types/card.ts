export type CardClass = 'Character' | 'Monster' | 'Mutant';

export interface AttackData {
  emojis: string[];
  name: string;
  toHit: string;
  damage: string;
  riders: string;
}

export interface CardData {
  // Identity
  entityName: string;
  cardClass: CardClass;
  tagline: string;
  level: number;
  cardNumber: string;
  portrait: string; // data URL or empty
  // Combat
  hpMax: number;
  hpCurrent: number;
  def: number;
  attacks: AttackData[];
  // A.S.P.I.C.E.
  adaptability: number;
  strength: number;
  perception: number;
  intellect: number;
  constitution: number;
  ego: number;
  // Tactical Profile
  movement: string;
  fortitudeSave: string;
  reflexSave: string;
  willSave: string;
  resistances: string;
  immunities: string;
  // Narrative
  anomalyManifestations: string;
  specialTraits: string;
  originFile: string;
}

export const CLASS_COLORS: Record<CardClass, string> = {
  Character: '#2980B9',
  Monster: '#D4842A',
  Mutant: '#4CAF50',
};

export const CLASS_ICONS: Record<CardClass, string> = {
  Character: '🧑',
  Monster: '👾',
  Mutant: '☢️',
};

export function getModifier(score: number): string {
  const mod = Math.floor((score - 10) / 2);
  return mod >= 0 ? `+${mod}` : `${mod}`;
}

export const DEFAULT_CARD_DATA: CardData = {
  entityName: 'ENTITY UNKNOWN',
  cardClass: 'Mutant',
  tagline: 'It remembers what it was before the meltdown.',
  level: 1,
  cardNumber: '',
  portrait: '',
  hpMax: 30,
  hpCurrent: 30,
  def: 14,
  attacks: [
    { emojis: ['☢️'], name: 'Irradiated Claw', toHit: '+5', damage: '2d6+3 radiation', riders: 'DC 14 Fort or poisoned' },
    { emojis: ['🐾'], name: 'Tail Swipe', toHit: '+3', damage: '1d8+2 bludgeoning', riders: '' },
  ],
  adaptability: 14,
  strength: 16,
  perception: 12,
  intellect: 8,
  constitution: 18,
  ego: 10,
  movement: '30 ft., burrow 15 ft.',
  fortitudeSave: '+7',
  reflexSave: '+4',
  willSave: '+2',
  resistances: 'radiation, fire',
  immunities: 'poison, frightened',
  anomalyManifestations: 'Radiation Burst\nMutation Pulse',
  specialTraits: 'Radiation Aura (5 ft.)\nDarkvision 60 ft.',
  originFile: 'Former Hanford maintenance worker exposed during the Event. Transformation began 72 hours post-exposure. Subject displays enhanced physical capabilities and radiation immunity. Consider armed and extremely dangerous.',
};

export const SAMPLE_CARDS: CardData[] = [
  {
    entityName: 'RADIOACTIVE JACKALOPE',
    cardClass: 'Mutant',
    tagline: 'It glows in the dark. That should have been the warning.',
    level: 5,
    cardNumber: '#001',
    portrait: '',
    hpMax: 52,
    hpCurrent: 52,
    def: 15,
    attacks: [
      { emojis: ['☢️', '🐾'], name: 'Antler Gore', toHit: '+6', damage: '2d8+4 piercing + radiation', riders: '' },
      { emojis: ['☢️'], name: 'Irradiated Spit', toHit: '+4', damage: '2d6 radiation', riders: 'DC 13 Fort or poisoned' },
    ],
    adaptability: 16, strength: 18, perception: 14, intellect: 6, constitution: 20, ego: 8,
    movement: '40 ft., leap 20 ft.',
    fortitudeSave: '+8', reflexSave: '+5', willSave: '+2',
    resistances: 'radiation', immunities: 'poison',
    anomalyManifestations: 'Radiation Burst\nGlow Field',
    specialTraits: 'Irradiated Hide\nNocturnal Hunter',
    originFile: 'Specimen recovered from the Hanford Exclusion Zone perimeter. Subject displays rapid cell mutation consistent with prolonged isotope exposure. Antler growth abnormal—structure resembles crystallized uranium deposits. Extreme caution advised during containment.',
  },
  {
    entityName: 'SENTINEL DRONE MK-IV',
    cardClass: 'Monster',
    tagline: 'It was built to protect. It never learned to stop.',
    level: 8,
    cardNumber: '#002',
    portrait: '',
    hpMax: 95,
    hpCurrent: 95,
    def: 19,
    attacks: [
      { emojis: ['⚡'], name: 'Plasma Rifle', toHit: '+8', damage: '3d8 energy', riders: '' },
      { emojis: ['⚠️'], name: 'Concussion Grenade', toHit: '+6', damage: '2d10 bludgeoning', riders: 'knockback 15 ft.' },
    ],
    adaptability: 12, strength: 20, perception: 18, intellect: 14, constitution: 22, ego: 6,
    movement: '40 ft., hover 10 ft.',
    fortitudeSave: '+9', reflexSave: '+7', willSave: '+3',
    resistances: 'energy, fire', immunities: 'poison, radiation, frightened',
    anomalyManifestations: 'Targeting Lock\nEMP Pulse',
    specialTraits: 'Construct Immunity\nArmored Chassis',
    originFile: 'Pre-Event DOE security unit. Network connection severed during the Event. Now operating on corrupted patrol protocols. Target designation: ALL BIOLOGICAL. Originally manufactured by Apex Defense Solutions under government contract #HNF-77-221-B.',
  },
  {
    entityName: 'SARA CHEN',
    cardClass: 'Character',
    tagline: 'The reactor gave her more than cancer.',
    level: 3,
    cardNumber: '#003',
    portrait: '',
    hpMax: 38,
    hpCurrent: 38,
    def: 13,
    attacks: [
      { emojis: ['🔥'], name: 'Plasma Torch', toHit: '+4', damage: '2d6 fire', riders: '' },
      { emojis: ['⚡'], name: 'Shock Baton', toHit: '+5', damage: '1d6+2 bludgeoning + 1d4 electric', riders: '' },
    ],
    adaptability: 16, strength: 12, perception: 14, intellect: 18, constitution: 13, ego: 15,
    movement: '30 ft.',
    fortitudeSave: '+4', reflexSave: '+5', willSave: '+6',
    resistances: 'radiation (partial)', immunities: '',
    anomalyManifestations: 'Radiation Sense\nHeat Vision',
    specialTraits: 'Technical Expertise\nRadiation Tolerance',
    originFile: 'Former Hanford Site engineer, reactor core division. Survived the Event with moderate radiation exposure. Developed minor anomaly manifestations over 6 months post-Event. Currently leading a survivor cell in the old B-Reactor building. Trust level: conditional.',
  },
];

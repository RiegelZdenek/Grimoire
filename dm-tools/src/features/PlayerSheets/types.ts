export interface AbilityScores {
    str: number;
    dex: number;
    con: number;
    int: number;
    wis: number;
    cha: number;
}

export interface InventoryItem {
    id: string;
    name: string;
    quantity: number;
    weight: number;
    notes?: string;
}

export interface CharacterItem {
    id: string;
    name: string;
    description: string;
}

export interface Passives {
    perception: number;
    investigation: number;
    insight: number;
}

export interface Weapon {
    id: string;
    name: string;
    attackBonus: string;
    damage: string;
    type: string;
}

export interface Spell {
    id: string;
    name: string;
    level: number; // 0 for cantrip
    castingTime: string;
    range: string;
    duration: string;
    description: string;
}

export interface Character {
    id: string;

    // Header Info
    name: string;
    race: string;
    className: string;
    subclass: string;
    level: number;

    // Stats
    abilityScores: AbilityScores;
    passives: Passives;
    armorClass: number;
    initiativeBonus: number;
    speed: number;
    proficiencyBonus: number;

    // Lists
    proficiencies: string[];
    feats: CharacterItem[];
    inventory: InventoryItem[];
    weapons: Weapon[];
    spells: Spell[];

    // Text
    backstory: string;
}

// A helper piece of mock data to populate new/empty states 
export const createEmptyCharacter = (): Character => ({
    id: crypto.randomUUID(),
    name: "New Character",
    race: "",
    className: "",
    subclass: "",
    level: 1,
    abilityScores: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
    passives: { perception: 10, investigation: 10, insight: 10 },
    armorClass: 10,
    initiativeBonus: 0,
    speed: 30,
    proficiencyBonus: 2,
    proficiencies: [],
    feats: [],
    inventory: [],
    weapons: [],
    spells: [],
    backstory: ""
});

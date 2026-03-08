export interface ItemProperty {
    name: string;
    abbreviation: string;
    source: string;
    entries?: any[];
}

export interface WeaponType {
    name: string;
    abbreviation: string;
    source: string;
}

export interface Weapon {
    name: string;
    rarity: string;
    weight: number;
    value?: number;
    dmg: string;
    dmgType: string;
    weaponCategory: string;
    properties: ItemProperty[];
    weaponType: WeaponType | undefined;
    entries?: any[];
}

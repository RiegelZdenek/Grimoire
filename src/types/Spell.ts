export interface Spell {
    name: string;
    level: number;
    school: string;
    classes: string[];
    actionType: string;
    concentration: boolean;
    ritual: boolean;
    range: string;
    components: string[];
    material?: string;
    duration: string;
    description: string;
    cantripUpgrade?: string; // Optional, present in cantrips
    higherLevelSlot?: string; // Optional, present in leveled spells
    castingTime?: string; // Optional, some have specific casting times instead of simple actionType
}

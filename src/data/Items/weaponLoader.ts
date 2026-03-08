import type { Weapon, ItemProperty, WeaponType } from "../../types/Weapon";

export async function loadWeapons(): Promise<Weapon[]> {
    const VALID_SOURCES = ["XPHB", "XDMG", "FRAIF", "FRHOF"];

    const itemsBaseData = (await import('./items-base.json')).default || await import('./items-base.json');
    const itemsData = (await import('./items.json')).default || await import('./items.json');

    // 1. Build dictionaries for item properties and types
    const propertyDict = new Map<string, ItemProperty>();
    if (itemsBaseData.itemProperty) {
        for (const prop of itemsBaseData.itemProperty as any[]) {
            const abbreviation = prop.abbreviation;
            const source = prop.source;
            const key = `${abbreviation}|${source}`.toLowerCase();
            const name = prop.name || (prop.entries && prop.entries[0] && prop.entries[0].name) || abbreviation;

            propertyDict.set(key, {
                name: name,
                abbreviation: prop.abbreviation,
                source: prop.source,
                entries: prop.entries
            });
            // also set a generic key if we just lookup by abbreviation
            propertyDict.set(abbreviation.toLowerCase(), {
                name: name,
                abbreviation: prop.abbreviation,
                source: prop.source,
                entries: prop.entries
            });
        }
    }

    const typeDict = new Map<string, WeaponType>();
    if (itemsBaseData.itemType) {
        for (const t of itemsBaseData.itemType as any[]) {
            const abbreviation = t.abbreviation;
            const source = t.source;
            const key = abbreviation.includes('|') ? abbreviation.toLowerCase() : `${abbreviation}|${source}`.toLowerCase();
            typeDict.set(key, {
                name: t.name,
                abbreviation: t.abbreviation,
                source: t.source
            });
            typeDict.set(abbreviation.split('|')[0].toLowerCase(), {
                name: t.name,
                abbreviation: t.abbreviation,
                source: t.source
            });
        }
    }

    // 2. Build base item lookup
    const baseItemsLookup = new Map<string, any>();
    if (itemsBaseData.baseitem) {
        for (const b of itemsBaseData.baseitem as any[]) {
            const bSource = b.source || '';
            const bName = b.name || '';
            baseItemsLookup.set(`${bName}|${bSource}`.toLowerCase(), b);
            if (!baseItemsLookup.has(bName.toLowerCase())) {
                baseItemsLookup.set(bName.toLowerCase(), b);
            }
        }
    }

    // 3. Extract weapons from baseitem and items and merge base properties
    const allRawItems = [
        ...(itemsBaseData.baseitem || []),
        ...(itemsData.item || [])
    ];

    const rawWeapons: any[] = [];

    for (const item of allRawItems) {
        if (!VALID_SOURCES.includes(item.source)) continue;

        let isWeapon = false;
        let baseObj: any = null;

        if (item.weapon === true) {
            isWeapon = true;
        } else if (item.baseItem) {
            const baseKey = item.baseItem.split('|')[0].toLowerCase();
            baseObj = baseItemsLookup.get(baseKey);
            if (baseObj && baseObj.weapon === true) {
                isWeapon = true;
            }
        } else if (typeof item.type === 'string' && (item.type.startsWith('M|') || item.type === 'M' || item.type.startsWith('R|') || item.type === 'R')) {
            isWeapon = true;
        }

        if (isWeapon) {
            const merged = baseObj ? { ...baseObj, ...item } : item;
            rawWeapons.push(merged);
        }
    }

    // 3. Map to Weapon interface
    const weapons: Weapon[] = rawWeapons.map((raw: any) => {
        // Lookup properties
        const properties: ItemProperty[] = [];
        if (raw.property && Array.isArray(raw.property)) {
            for (const pRaw of raw.property) {
                let p = pRaw;
                let note = '';
                if (typeof pRaw === 'object' && pRaw.uid) {
                    p = pRaw.uid;
                    note = pRaw.note || '';
                }
                if (typeof p !== 'string') continue;

                const pLower = p.toLowerCase();
                let prop = propertyDict.get(pLower) || propertyDict.get(pLower.split('|')[0]);
                if (prop) {
                    properties.push(note ? { ...prop, name: `${prop.name} (${note})` } : prop);
                } else {
                    // fallback generic
                    properties.push({ name: note ? `${p} (${note})` : p, abbreviation: p, source: 'UNKNOWN' });
                }
            }
        }

        // Lookup type
        let weaponType: WeaponType | undefined;
        if (raw.type) {
            const tLower = raw.type.toLowerCase();
            weaponType = typeDict.get(tLower) || typeDict.get(tLower.split('|')[0]);
        }

        return {
            name: raw.name,
            rarity: raw.rarity || 'none',
            weight: raw.weight || 0,
            value: raw.value !== undefined ? raw.value : undefined,
            dmg: raw.dmg1 || '',
            dmgType: raw.dmgType || '',
            weaponCategory: raw.weaponCategory || '',
            properties: properties,
            weaponType: weaponType,
            entries: raw.entries
        };
    });

    return weapons;
}

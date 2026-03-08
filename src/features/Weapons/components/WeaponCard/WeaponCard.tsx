import React from 'react';
import { clsx } from 'clsx';
import styles from './WeaponCard.module.css';
import type { Weapon } from '../../../../types/Weapon';
import { extractDamageRolls } from '../../../Spells/utils/diceParser';

interface WeaponCardProps {
    weapon: Weapon;
    isSelected?: boolean;
    onClick?: (name: string) => void;
}

const getRarityClass = (rarity: string) => {
    switch (rarity.toLowerCase()) {
        case 'uncommon': return styles.rarityUncommon;
        case 'rare': return styles.rarityRare;
        case 'very rare': return styles.rarityVeryRare;
        case 'epic': return styles.rarityVeryRare;
        case 'legendary': return styles.rarityLegendary;
        case 'artifact': return styles.rarityArtifact;
        case 'none':
        case 'common':
        default: return styles.rarityCommon;
    }
};

const clean5eToolsTags = (text: string) => {
    return text.replace(/{@\w+ ([^|}]*)(?:\|[^}]*)?}/g, '$1');
};

const renderEntryAsText = (entry: any): string => {
    if (typeof entry === 'string') {
        return clean5eToolsTags(entry);
    }
    if (entry.type === 'entries' && entry.entries) {
        return entry.entries.map(renderEntryAsText).join(' ');
    }
    if (entry.type === 'list' && entry.items) {
        return entry.items.map(renderEntryAsText).join(', ');
    }
    if (entry.type === 'item') {
        const name = entry.name ? `${entry.name} ` : '';
        const body = entry.entry ? renderEntryAsText(entry.entry) : (entry.entries ? entry.entries.map(renderEntryAsText).join(' ') : '');
        return name + body;
    }
    return '';
};

export const WeaponCard: React.FC<WeaponCardProps> = ({ weapon, isSelected, onClick }) => {
    const damageRolls = extractDamageRolls(weapon.dmg);
    const displayDamage = weapon.dmg.trim() === '' ? 'None' : `${weapon.dmg} ${weapon.dmgType}`;

    // Type name
    const typeName = weapon.weaponType?.name || weapon.weaponCategory || "Weapon";

    let descriptionText = '';
    if (weapon.entries && weapon.entries.length > 0) {
        descriptionText = weapon.entries.map(renderEntryAsText).join(' ').trim();
    }

    return (
        <div
            className={clsx(styles.card, getRarityClass(weapon.rarity), isSelected && styles.selected)}
            onClick={() => onClick && onClick(weapon.name)}
        >
            <div className={styles.header}>
                <div className={styles.titleArea}>
                    <h3 className={styles.name}>{weapon.name}</h3>
                    <span className={styles.level}>{typeName}</span>
                </div>
                <div className={styles.costArea}>
                    <span className={styles.price}>{weapon.value ? `${weapon.value / 100} gp` : weapon.rarity}</span>
                </div>
            </div>

            <div className={styles.meta}>
                <div className={styles.components}>
                    <span className={styles.componentIcon} title="Damage">
                        {displayDamage}
                    </span>
                    {damageRolls.map((roll, i) => (
                        <span key={i} className={styles.extractedRoll} style={{ color: roll.color, backgroundColor: roll.bg, borderColor: roll.color }}>
                            {roll.raw}
                        </span>
                    ))}
                    {weapon.properties?.slice(0, 3).map((prop, index) => (
                        <span key={index} className={styles.componentIcon} title={prop.name}>
                            {prop.abbreviation}
                        </span>
                    ))}
                </div>
            </div>

            {descriptionText && (
                <p className={styles.description}>
                    {descriptionText}
                </p>
            )}
        </div>
    );
};

import React from 'react';
import { clsx } from 'clsx';
import styles from './WeaponDetailPane.module.css';
import type { Weapon } from '../../../../types/Weapon';
import { X, Crosshair, Hammer, Coins, Weight } from 'lucide-react';
import { extractDamageRolls } from '../../../Spells/utils/diceParser';

interface WeaponDetailPaneProps {
    weapon: Weapon;
    onClose?: () => void;
}

const getRarityClass = (rarity: string) => {
    switch (rarity.toLowerCase()) {
        case 'uncommon': return styles.rarityUncommon;
        case 'rare': return styles.rarityRare;
        case 'very rare': return styles.rarityVeryRare;
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

const renderEntry = (entry: any, index: number, isRoot = false): React.ReactNode => {
    if (typeof entry === 'string') {
        const text = clean5eToolsTags(entry);
        return isRoot ? <p key={index} className={styles.paragraph}>{text}</p> : <span key={index}>{text} </span>;
    }

    if (entry.type === 'entries') {
        return (
            <div key={index} className={styles.paragraphGroup}>
                {entry.name && <h4 className={styles.paragraphHeader}>{entry.name}</h4>}
                {entry.entries?.map((e: any, i: number) => renderEntry(e, i, true))}
            </div>
        );
    }

    if (entry.type === 'list') {
        return (
            <ul key={index} className={styles.list}>
                {entry.items?.map((item: any, idx: number) => (
                    <li key={idx} className={styles.listItem}>{renderEntry(item, idx, false)}</li>
                ))}
            </ul>
        );
    }

    if (entry.type === 'item') {
        return (
            <span key={index}>
                {entry.name && <strong>{entry.name} </strong>}
                {entry.entry ? renderEntry(entry.entry, 0, false) : entry.entries?.map((e: any, i: number) => renderEntry(e, i, false))}
            </span>
        );
    }
    return null;
};

export const WeaponDetailPane: React.FC<WeaponDetailPaneProps> = ({ weapon, onClose }) => {
    const typeName = weapon.weaponType?.name || weapon.weaponCategory || "Weapon";
    const displayDamage = weapon.dmg.trim() === '' ? 'None' : `${weapon.dmg} ${weapon.dmgType}`;
    const damageRolls = extractDamageRolls(weapon.dmg);

    return (
        <div className={clsx(styles.pane, getRarityClass(weapon.rarity))}>
            <div className={styles.header}>
                <div className={styles.titleRow}>
                    <h2 className={styles.name}>{weapon.name}</h2>
                    {onClose && (
                        <button className={styles.closeButton} onClick={onClose} aria-label="Close details">
                            <X size={24} />
                        </button>
                    )}
                </div>
                <div className={styles.subtitleRow}>
                    <span className={styles.type}>{typeName}</span>
                    <span className={styles.rarityBadge}>{weapon.rarity}</span>
                </div>
            </div>

            <div className={styles.content}>
                <div className={styles.propertiesGrid}>
                    <div className={styles.property}>
                        <Crosshair size={16} className={styles.propertyIcon} />
                        <div className={styles.propertyData}>
                            <span className={styles.propertyLabel}>Damage</span>
                            <span className={styles.propertyValue}>
                                {displayDamage}
                                {damageRolls.length > 0 && (
                                    <span className={styles.rollBadge} style={{ color: damageRolls[0].color, backgroundColor: damageRolls[0].bg, borderColor: damageRolls[0].color }}>
                                        {damageRolls[0].raw}
                                    </span>
                                )}
                            </span>
                        </div>
                    </div>

                    <div className={styles.property}>
                        <Hammer size={16} className={styles.propertyIcon} />
                        <div className={styles.propertyData}>
                            <span className={styles.propertyLabel}>Properties</span>
                            <span className={styles.propertyValue}>
                                {weapon.properties?.length > 0
                                    ? weapon.properties.map(p => p.name).join(', ')
                                    : 'None'}
                            </span>
                        </div>
                    </div>

                    <div className={styles.property}>
                        <Coins size={16} className={styles.propertyIcon} />
                        <div className={styles.propertyData}>
                            <span className={styles.propertyLabel}>Value</span>
                            <span className={styles.propertyValue}>
                                {weapon.value ? `${weapon.value / 100} gp` : '—'}
                            </span>
                        </div>
                    </div>

                    <div className={styles.property}>
                        <Weight size={16} className={styles.propertyIcon} />
                        <div className={styles.propertyData}>
                            <span className={styles.propertyLabel}>Weight</span>
                            <span className={styles.propertyValue}>{weapon.weight} lb.</span>
                        </div>
                    </div>
                </div>

                <div className={styles.divider} />

                <div className={styles.descriptionContainer}>
                    {weapon.entries && weapon.entries.length > 0 ? (
                        weapon.entries.map((entry, i) => renderEntry(entry, i, true))
                    ) : (
                        <p className={styles.paragraph}><em>No additional description available.</em></p>
                    )}
                </div>
            </div>
        </div>
    );
};

import React from 'react';
import styles from './WeaponCard.module.css';
import type { Weapon } from '../../../../types/Weapon';
import { extractDamageRolls } from '../../../Spells/utils/diceParser';

interface WeaponCardProps {
    weapon: Weapon;
}

export const WeaponCard: React.FC<WeaponCardProps> = ({ weapon }) => {
    const damageRolls = extractDamageRolls(weapon.Damage);

    // For weapons without damage dice (like Nets or Shot)
    const displayDamage = weapon.Damage.trim() === '' ? 'None' : weapon.Damage;

    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <h3 className={styles.name}>{weapon.Name}</h3>
                <div className={styles.stats}>
                    <span className={styles.statBadge}>{weapon.Cost}</span>
                    <span className={styles.statBadge}>{weapon.Weight}</span>
                </div>
            </div>

            <div className={styles.damageArea}>
                <span className={styles.damageLabel}>Damage:</span>
                <span className={styles.damageText}>{displayDamage}</span>

                {damageRolls.length > 0 && (
                    <div className={styles.extractedRolls}>
                        {damageRolls.map((roll, i) => (
                            <span
                                key={i}
                                className={styles.extractedRoll}
                                style={{ color: roll.color, backgroundColor: roll.bg, borderColor: roll.color }}
                            >
                                {roll.raw}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {weapon.Properties && weapon.Properties.length > 0 && (
                <div className={styles.properties}>
                    {weapon.Properties.map((prop, index) => (
                        <span key={index} className={styles.propertyBadge}>
                            {prop}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};

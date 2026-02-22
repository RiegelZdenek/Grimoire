import React from 'react';
import styles from './SpellCard.module.css';
import type { Spell } from '../../../../types/Spell';
import { clsx } from 'clsx';
import { Sparkles, MessageSquare, Hand, Package, Circle, Triangle, Square } from 'lucide-react';
import { extractDamageRolls } from '../../utils/diceParser';

interface SpellCardProps {
    spell: Spell;
    isSelected: boolean;
    onClick: (name: string) => void;
}

const getLevelString = (level: number, school: string) => {
    if (level === 0) return `${school} Cantrip`;
    const ordinals = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th'];
    return `${ordinals[level - 1]}-level ${school}`;
};

const toRoman = (num: number): string => {
    const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'];
    return romanNumerals[num - 1] || num.toString();
};

const getActionIcon = (type: string) => {
    if (type === 'action') return <Circle size={14} className={styles.actionIcon} fill="#22c55e" color="#22c55e" />;
    if (type === 'bonusAction') return <Triangle size={14} className={styles.bonusActionIcon} fill="#f59e0b" color="#f59e0b" />;
    if (type === 'reaction') return <Square size={14} className={styles.reactionIcon} fill="#d946ef" color="#d946ef" style={{ transform: 'rotate(45deg)' }} />;
    return <Circle size={14} className={styles.actionIcon} fill="#22c55e" color="#22c55e" />; // fallback
};

export const SpellCard: React.FC<SpellCardProps> = ({ spell, isSelected, onClick }) => {
    const hasV = spell.components.includes('v') || spell.components.includes('V');
    const hasS = spell.components.includes('s') || spell.components.includes('S');
    const hasM = spell.components.includes('m') || spell.components.includes('M');

    const damageRolls = extractDamageRolls(spell.description);

    return (
        <div
            className={clsx(styles.card, isSelected && styles.selected)}
            onClick={() => onClick(spell.name)}
        >
            <div className={styles.header}>
                <div className={styles.titleArea}>
                    <h3 className={styles.name}>{spell.name}</h3>
                    <span className={styles.level}>{getLevelString(spell.level, spell.school)}</span>
                </div>
                <div className={styles.costArea}>
                    {spell.level > 0 && (
                        <div className={styles.spellSlot} title={`Level ${spell.level} Spell Slot`}>
                            <Square size={14} fill="#3b82f6" color="#3b82f6" className={styles.spellSlotIcon} />
                            <span>{toRoman(spell.level)}</span>
                        </div>
                    )}
                    <div className={styles.actionCost} title={spell.castingTime || spell.actionType}>
                        {getActionIcon(spell.actionType)}
                    </div>
                </div>
            </div>

            <div className={styles.meta}>
                <div className={styles.components}>
                    {hasV && <span className={styles.componentIcon} title="Verbal"><MessageSquare size={14} />V</span>}
                    {hasS && <span className={styles.componentIcon} title="Somatic"><Hand size={14} />S</span>}
                    {hasM && <span className={styles.componentIcon} title="Material"><Package size={14} />M</span>}
                    {spell.concentration && <span className={clsx(styles.componentIcon, styles.concentration)} title="Concentration"><Sparkles size={14} />C</span>}
                    {damageRolls.map((roll, i) => (
                        <span key={i} className={styles.extractedRoll} style={{ color: roll.color, backgroundColor: roll.bg, borderColor: roll.color }}>
                            {roll.raw}
                        </span>
                    ))}
                </div>
            </div>

            <p className={styles.description}>
                {spell.description}
            </p>
        </div>
    );
};

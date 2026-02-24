import React from 'react';
import styles from './SpellDetailPane.module.css';
import type { Spell } from '../../../../types/Spell';
import { ArrowUpCircle, BookOpen, Clock, Fingerprint, Maximize, Ruler, X } from 'lucide-react';

interface SpellDetailPaneProps {
    spell: Spell;
    onClose?: () => void;
}

const getLevelString = (level: number, school: string) => {
    if (level === 0) return `${school} Cantrip`;
    const ordinals = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th'];
    return `${ordinals[level - 1]}-level ${school}`;
};

const getActionTypeString = (type: string) => {
    if (type === 'action') return '1 Action';
    if (type === 'bonusAction') return '1 Bonus Action';
    if (type === 'reaction') return '1 Reaction';
    return type;
};

import { formatTextWithDiceAndBold } from '../../utils/diceParser';

export const SpellDetailPane: React.FC<SpellDetailPaneProps> = ({ spell, onClose }) => {
    // Format description into paragraphs
    const paragraphs = spell.description.split('\n\n').filter(p => p.trim() !== '');

    const hasV = spell.components.includes('v') || spell.components.includes('V');
    const hasS = spell.components.includes('s') || spell.components.includes('S');
    const hasM = spell.components.includes('m') || spell.components.includes('M');

    return (
        <div className={styles.pane}>
            <div className={styles.header}>
                <div className={styles.titleRow}>
                    <h2 className={styles.name}>{spell.name}</h2>
                    {onClose && (
                        <button className={styles.closeButton} onClick={onClose} aria-label="Close details">
                            <X size={24} />
                        </button>
                    )}
                </div>
                <span className={styles.level}>{getLevelString(spell.level, spell.school)}</span>

                <div className={styles.classes}>
                    {spell.classes.map((c: string) => (
                        <span key={c} className={styles.classTag}>{c}</span>
                    ))}
                </div>
            </div>

            <div className={styles.content}>
                <div className={styles.propertiesGrid}>

                    <div className={styles.property}>
                        <Clock size={16} className={styles.propertyIcon} />
                        <div className={styles.propertyData}>
                            <span className={styles.propertyLabel}>Casting Time</span>
                            <span className={styles.propertyValue}>
                                {spell.castingTime || getActionTypeString(spell.actionType)}
                                {spell.ritual && ' (Ritual)'}
                            </span>
                        </div>
                    </div>

                    <div className={styles.property}>
                        <Maximize size={16} className={styles.propertyIcon} />
                        <div className={styles.propertyData}>
                            <span className={styles.propertyLabel}>Range</span>
                            <span className={styles.propertyValue}>{spell.range}</span>
                        </div>
                    </div>

                    <div className={styles.property}>
                        <Fingerprint size={16} className={styles.propertyIcon} />
                        <div className={styles.propertyData}>
                            <span className={styles.propertyLabel}>Components</span>
                            <span className={styles.propertyValue}>
                                {[
                                    hasV ? 'V' : null,
                                    hasS ? 'S' : null,
                                    hasM ? 'M' : null
                                ].filter(Boolean).join(', ')}
                                {spell.material && <span className={styles.materialText}> ({spell.material})</span>}
                            </span>
                        </div>
                    </div>

                    <div className={styles.property}>
                        <Ruler size={16} className={styles.propertyIcon} />
                        <div className={styles.propertyData}>
                            <span className={styles.propertyLabel}>Duration</span>
                            <span className={styles.propertyValue}>
                                {spell.concentration && <span className={styles.concentrationBadge}>Concentration</span>}
                                {spell.duration}
                            </span>
                        </div>
                    </div>

                </div>

                <div className={styles.divider} />

                <div className={styles.descriptionContainer}>
                    <div className={styles.sectionHeader}>
                        <BookOpen size={16} className={styles.sectionIcon} />
                        <h3 className={styles.sectionTitle}>Description</h3>
                    </div>
                    <div className={styles.description}>
                        {paragraphs.map((p: string, i: number) => (
                            <p key={i}>{formatTextWithDiceAndBold(p, { boldText: styles.boldText, diceRoll: styles.diceRoll })}</p>
                        ))}
                    </div>
                </div>

                {(spell.cantripUpgrade || spell.higherLevelSlot) && (
                    <div className={styles.upgradeContainer}>
                        <div className={styles.sectionHeader}>
                            <ArrowUpCircle size={16} className={styles.sectionIcon} />
                            <h3 className={styles.sectionTitle}>At Higher Levels</h3>
                        </div>
                        <p className={styles.upgradeText}>
                            {spell.cantripUpgrade || spell.higherLevelSlot}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

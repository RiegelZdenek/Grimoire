import React from 'react';
import styles from './SpellList.module.css';
import type { Spell } from '../../../../types/Spell';
import { SpellCard } from '../SpellCard/SpellCard';
import { Inbox } from 'lucide-react';

interface SpellListProps {
    spells: Spell[];
    onSelectSpell: (name: string) => void;
    selectedSpellName: string | null;
}

export const SpellList: React.FC<SpellListProps> = ({ spells, onSelectSpell, selectedSpellName }) => {
    if (spells.length === 0) {
        return (
            <div className={styles.emptyState}>
                <Inbox size={48} className={styles.emptyIcon} />
                <h3>No Spells Found</h3>
                <p>Try adjusting your search or filters.</p>
            </div>
        );
    }

    return (
        <div className={styles.listContainer}>
            <div className={styles.listHeader}>
                <span className={styles.count}>{spells.length} spells</span>
            </div>
            <div className={styles.scrollArea}>
                <div className={styles.grid}>
                    {spells.map(spell => (
                        <SpellCard
                            key={spell.name}
                            spell={spell}
                            isSelected={spell.name === selectedSpellName}
                            onClick={onSelectSpell}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

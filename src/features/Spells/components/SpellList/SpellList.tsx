import React from 'react';
import styles from './SpellList.module.css';
import type { Spell } from '../../../../types/Spell';
import { SpellCard } from '../SpellCard/SpellCard';
import { Inbox } from 'lucide-react';

interface SpellListProps {
    spells: Spell[];
    onSelectSpell: (name: string) => void;
    selectedSpellName: string | null;
    onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
}

export const SpellList: React.FC<SpellListProps> = ({ spells, onSelectSpell, selectedSpellName, onScroll }) => {
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
            <div className={styles.scrollArea} onScroll={onScroll}>
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

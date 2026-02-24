import React, { useState, useMemo, useRef, useCallback } from 'react';
import styles from './Spells.module.css';
import spellData from './spellList.json';
import type { Spell } from '../../types/Spell';

import { SpellList } from './components/SpellList/SpellList';
import { SpellDetailPane } from './components/SpellDetailPane/SpellDetailPane';
import { ClassBadge } from './components/ClassBadge/ClassBadge';
export const Spells: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedClasses, setSelectedClasses] = useState<Set<string>>(new Set());
    const [selectedSpellName, setSelectedSpellName] = useState<string | null>(null);
    const spells: Spell[] = spellData as Spell[];
    const [isScrolled, setIsScrolled] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const lastScrollTop = useRef(0);

    const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
        const scrollTop = e.currentTarget.scrollTop;
        if (scrollTop > lastScrollTop.current && scrollTop > 0) {
            setIsScrolled(true);
        } else if (scrollTop < lastScrollTop.current && scrollTop <= 50) {
            setIsScrolled(false);
        }
        lastScrollTop.current = scrollTop;
    }, []);

    // Get unique classes for the badges
    const allClasses = useMemo(() => {
        const classes = new Set<string>();
        spells.forEach(spell => {
            spell.classes.forEach(c => classes.add(c));
        });
        return Array.from(classes).sort();
    }, [spells]);

    const toggleClass = (className: string) => {
        const newSelected = new Set(selectedClasses);
        if (newSelected.has(className)) {
            newSelected.delete(className);
        } else {
            newSelected.add(className);
        }
        setSelectedClasses(newSelected);
    };

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setSelectedSpellName(null);
            setIsClosing(false);
        }, 300); // match animation duration (0.3s)
    };

    const filteredSpells = useMemo(() => {
        return spells.filter(spell => {
            const matchesSearch = spell.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesClass = selectedClasses.size === 0 || spell.classes.some(c => selectedClasses.has(c));
            return matchesSearch && matchesClass;
        });
    }, [spells, searchQuery, selectedClasses]);

    const selectedSpell = useMemo(() => {
        return spells.find(s => s.name === selectedSpellName) || null;
    }, [spells, selectedSpellName]);

    return (
        <div className={styles.container}>
            <div className={`${styles.header} ${isScrolled ? styles.isSticky : ''}`}>
                <div className={styles.searchRow}>
                    <input
                        type="text"
                        placeholder="Search spells..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>

                <div className={styles.badgesContainer}>
                    {allClasses.map(className => (
                        <ClassBadge
                            key={className}
                            className={className}
                            isSelected={selectedClasses.has(className)}
                            onClick={() => toggleClass(className)}
                        />
                    ))}
                </div>
            </div>

            <div className={styles.content}>
                <div
                    className={`${styles.listContainer} ${selectedSpell ? styles.listWithSelection : ''}`}
                    onScroll={handleScroll}
                >
                    <SpellList
                        spells={filteredSpells}
                        onSelectSpell={setSelectedSpellName}
                        selectedSpellName={selectedSpellName}
                    />
                </div>

                {selectedSpell && (
                    <div className={`${styles.detailContainer} ${isClosing ? styles.isClosing : ''}`}>
                        <SpellDetailPane
                            spell={selectedSpell}
                            onClose={handleClose}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

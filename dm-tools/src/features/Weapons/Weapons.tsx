import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import styles from './Weapons.module.css';
import { WeaponCard } from './components/WeaponCard/WeaponCard';
import type { Weapon } from '../../types/Weapon';

// Import all weapon lists
import firearms from './lists/firearms.json';
import martialMelee from './lists/martial_melee.json';
import martialRanged from './lists/martial_ranged.json';
import simpleMelee from './lists/simple_melee.json';
import simpleRanged from './lists/simple_ranged.json';

// Combine them into a single list
const allWeapons: Weapon[] = [
    ...firearms,
    ...martialMelee,
    ...martialRanged,
    ...simpleMelee,
    ...simpleRanged
];

// Deduplicate by Name (just in case) and sort alphabetically
const uniqueSortedWeapons = Array.from(new Map(allWeapons.map(w => [w.Name, w])).values())
    .sort((a, b) => a.Name.localeCompare(b.Name));

export const Weapons: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredWeapons = useMemo(() => {
        const query = searchQuery.toLowerCase();
        if (!query) return uniqueSortedWeapons;

        return uniqueSortedWeapons.filter((weapon) => {
            const matchesName = weapon.Name.toLowerCase().includes(query);
            const matchesProperty = weapon.Properties.some(p => p.toLowerCase().includes(query));
            return matchesName || matchesProperty;
        });
    }, [searchQuery]);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.searchRow}>
                    <div className={styles.searchIconWrapper}>
                        <Search className={styles.searchIcon} size={20} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search weapons or properties..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>
            </div>

            <div className={styles.content}>
                <div className={styles.listContainer}>
                    <div className={styles.listHeader}>
                        <span className={styles.count}>{filteredWeapons.length} Weapons Found</span>
                    </div>

                    <div className={styles.scrollArea}>
                        {filteredWeapons.length > 0 ? (
                            <div className={styles.grid}>
                                {filteredWeapons.map((weapon) => (
                                    <WeaponCard key={weapon.Name} weapon={weapon} />
                                ))}
                            </div>
                        ) : (
                            <div className={styles.emptyState}>
                                <Search size={48} className={styles.emptyIcon} />
                                <h3>No Weapons Found</h3>
                                <p>Try adjusting your search criteria</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

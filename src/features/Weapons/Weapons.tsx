import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { Search } from 'lucide-react';
import styles from './Weapons.module.css';
import { WeaponCard } from './components/WeaponCard/WeaponCard';
import { WeaponDetailPane } from './components/WeaponDetailPane/WeaponDetailPane';
import type { Weapon } from '../../types/Weapon';
import { loadWeapons } from '../../data/Items/weaponLoader';

const rarityOrder: Record<string, number> = {
    'artifact': 6,
    'legendary': 5,
    'very rare': 4,
    'epic': 4,
    'rare': 3,
    'uncommon': 2,
    'common': 1,
    'none': 0,
    'unknown': 0
};

export const Weapons: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isScrolled, setIsScrolled] = useState(false);
    const [weapons, setWeapons] = useState<Weapon[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedWeaponName, setSelectedWeaponName] = useState<string | null>(null);
    const [isClosing, setIsClosing] = useState(false);
    const lastScrollTop = useRef(0);

    useEffect(() => {
        let isMounted = true;
        loadWeapons().then((data: Weapon[]) => {
            if (isMounted) {
                // Remove duplicates and sort by rarity, then alphabetically by name
                const uniqueWeapons = Array.from(new Map(data.map((w: Weapon) => [w.name, w])).values());
                const sortedWeapons = uniqueWeapons.sort((a: Weapon, b: Weapon) => {
                    const rarityA = rarityOrder[a.rarity.toLowerCase()] || 0;
                    const rarityB = rarityOrder[b.rarity.toLowerCase()] || 0;
                    if (rarityA !== rarityB) {
                        return rarityA - rarityB; // Ascending order (lowest rarity first)
                    }
                    return a.name.localeCompare(b.name);
                });
                setWeapons(sortedWeapons);
                setIsLoading(false);
            }
        });
        return () => {
            isMounted = false;
        };
    }, []);

    const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
        const scrollTop = e.currentTarget.scrollTop;
        if (scrollTop > lastScrollTop.current && scrollTop > 0) {
            setIsScrolled(true);
        } else if (scrollTop < lastScrollTop.current && scrollTop <= 50) {
            setIsScrolled(false);
        }
        lastScrollTop.current = scrollTop;
    }, []);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setSelectedWeaponName(null);
            setIsClosing(false);
        }, 300); // Match animation duration
    };

    const filteredWeapons = useMemo(() => {
        const query = searchQuery.toLowerCase();
        if (!query) return weapons;

        return weapons.filter((weapon) => {
            const matchesName = weapon.name.toLowerCase().includes(query);
            const matchesProperty = weapon.properties.some(p => p.name.toLowerCase().includes(query));
            return matchesName || matchesProperty;
        });
    }, [searchQuery, weapons]);

    const selectedWeapon = useMemo(() => {
        return weapons.find(w => w.name === selectedWeaponName) || null;
    }, [weapons, selectedWeaponName]);

    if (isLoading) {
        return (
            <div className={styles.container}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', flexDirection: 'column', color: '#8b8496' }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        border: '4px solid #3c324b',
                        borderTop: '4px solid #bbafe8',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        marginBottom: '1rem'
                    }} />
                    <h2>Loading Armory...</h2>
                    <style>{`
                        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                    `}</style>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={`${styles.header} ${isScrolled ? styles.isSticky : ''}`}>
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
                <div
                    className={`${styles.listContainer} ${selectedWeapon ? styles.listWithSelection : ''}`}
                    onScroll={handleScroll}
                >
                    <div className={styles.scrollArea}>
                        {filteredWeapons.length > 0 ? (
                            <div className={styles.grid}>
                                {filteredWeapons.map((weapon) => (
                                    <WeaponCard
                                        key={weapon.name}
                                        weapon={weapon}
                                        isSelected={weapon.name === selectedWeaponName}
                                        onClick={setSelectedWeaponName}
                                    />
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

                {selectedWeapon && (
                    <div className={`${styles.detailContainer} ${isClosing ? styles.isClosing : ''}`}>
                        <WeaponDetailPane
                            weapon={selectedWeapon}
                            onClose={handleClose}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

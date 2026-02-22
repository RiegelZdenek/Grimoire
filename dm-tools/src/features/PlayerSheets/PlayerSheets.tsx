import { useState, useRef } from 'react';
import { useCharacterStore } from './useCharacterStore';
import { CharacterTabs } from './CharacterTabs';
import { CharacterSheet } from './CharacterSheet';
import styles from './PlayerSheets.module.css';

export function PlayerSheets() {
    const {
        characters,
        isLoaded,
        addCharacter,
        updateCharacter,
        deleteCharacter,
        exportData,
        importData
    } = useCharacterStore();

    const [activeIndex, setActiveIndex] = useState(0);

    // Swipe detection state
    const touchStartX = useRef<number | null>(null);
    const touchEndX = useRef<number | null>(null);

    // Minimum swipe distance to trigger a change
    const minSwipeDistance = 50;

    if (!isLoaded) return <div className={styles.loading}>Loading your grimoire...</div>;

    // Safety bounds
    const safeIndex = Math.min(Math.max(0, activeIndex), characters.length - 1);
    const activeCharacter = characters[safeIndex];

    const onTouchStart = (e: React.TouchEvent) => {
        touchEndX.current = null;
        touchStartX.current = e.targetTouches[0].clientX;
    };

    const onTouchMove = (e: React.TouchEvent) => {
        touchEndX.current = e.targetTouches[0].clientX;
    };

    const onTouchEnd = () => {
        if (!touchStartX.current || !touchEndX.current) return;

        const distance = touchStartX.current - touchEndX.current;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe && safeIndex < characters.length - 1) {
            setActiveIndex(safeIndex + 1);
        } else if (isRightSwipe && safeIndex > 0) {
            setActiveIndex(safeIndex - 1);
        }
    };

    const handleAddCharacter = () => {
        addCharacter();
        setActiveIndex(characters.length); // switch to newest
    };

    const handleDelete = (id: string) => {
        deleteCharacter(id);
        setActiveIndex(prev => Math.max(0, prev - 1)); // adjust index smoothly
    };

    return (
        <div className={styles.container}>
            <CharacterTabs
                characters={characters}
                activeIndex={safeIndex}
                onChangeActive={setActiveIndex}
                onAddCharacter={handleAddCharacter}
                onDeleteCharacter={handleDelete}
                onExport={exportData}
                onImport={importData}
            />

            <div
                className={styles.swipeContainer}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            >
                {activeCharacter && (
                    <CharacterSheet
                        key={activeCharacter.id}
                        character={activeCharacter}
                        onUpdate={updateCharacter}
                    />
                )}
            </div>
        </div>
    );
}

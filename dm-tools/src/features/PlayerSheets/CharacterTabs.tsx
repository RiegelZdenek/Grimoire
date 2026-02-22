import { Plus, Download, Upload, Trash2 } from 'lucide-react';
import clsx from 'clsx';
import type { Character } from './types';
import styles from './CharacterTabs.module.css';
import { useRef } from 'react';

interface CharacterTabsProps {
    characters: Character[];
    activeIndex: number;
    onChangeActive: (index: number) => void;
    onAddCharacter: () => void;
    onDeleteCharacter: (id: string) => void;
    onExport: () => void;
    onImport: (file: File) => void;
}

export function CharacterTabs({
    characters,
    activeIndex,
    onChangeActive,
    onAddCharacter,
    onDeleteCharacter,
    onExport,
    onImport
}: CharacterTabsProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onImport(file);
            // Reset input so the same file can be selected again if needed
            e.target.value = '';
        }
    };

    return (
        <div className={styles.tabsContainer}>
            <div className={styles.scrollArea}>
                {characters.map((char, index) => {
                    const isActive = activeIndex === index;
                    return (
                        <div key={char.id} className={clsx(styles.tabWrapper, { [styles.active]: isActive })}>
                            <button
                                className={styles.tabBtn}
                                onClick={() => onChangeActive(index)}
                            >
                                {char.name || "Unnamed"}
                            </button>
                            {characters.length > 1 && isActive && (
                                <button
                                    className={styles.deleteBtn}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDeleteCharacter(char.id);
                                    }}
                                    title="Delete Character"
                                >
                                    <Trash2 size={14} />
                                </button>
                            )}
                        </div>
                    );
                })}
                <button
                    className={clsx(styles.tabBtn, styles.addBtn)}
                    onClick={onAddCharacter}
                    title="Add Character"
                >
                    <Plus size={20} />
                </button>
            </div>

            <div className={styles.actionsBox}>
                <button className={styles.actionBtn} onClick={onExport} title="Export Characters (JSON)">
                    <Download size={18} />
                </button>
                <button className={styles.actionBtn} onClick={handleImportClick} title="Import Characters (JSON)">
                    <Upload size={18} />
                </button>
                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    accept=".json"
                    onChange={handleFileChange}
                />
            </div>
        </div>
    );
}

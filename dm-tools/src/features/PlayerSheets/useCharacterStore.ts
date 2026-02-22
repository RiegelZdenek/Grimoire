import { useState, useEffect } from 'react';
import type { Character } from './types';
import { createEmptyCharacter } from './types';

const STORAGE_KEY = 'dm-tools-player-sheets';

export function useCharacterStore() {
    const [characters, setCharacters] = useState<Character[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Initial load from localStorage
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                setCharacters(parsed);
            } catch (e) {
                console.error("Failed to parse characters from localStorage", e);
                // If empty or corrupted, create a default one
                setCharacters([createEmptyCharacter()]);
            }
        } else {
            // No data, start with an empty character
            setCharacters([createEmptyCharacter()]);
        }
        setIsLoaded(true);
    }, []);

    // Save to localStorage whenever characters change (after initial load)
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(characters));
        }
    }, [characters, isLoaded]);

    const addCharacter = () => {
        const newChar = createEmptyCharacter();
        setCharacters(prev => [...prev, newChar]);
        return newChar.id;
    };

    const updateCharacter = (updated: Character) => {
        setCharacters(prev => prev.map(c => c.id === updated.id ? updated : c));
    };

    const deleteCharacter = (id: string) => {
        setCharacters(prev => {
            const filtered = prev.filter(c => c.id !== id);
            // Prevent deleting the last character so UI doesn't break entirely, or handle it
            return filtered.length > 0 ? filtered : [createEmptyCharacter()];
        });
    };

    // Export feature: Triggers a file download
    const exportData = () => {
        const dataStr = JSON.stringify(characters, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `dm-tools-characters-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    // Import feature: Reads a JSON file
    const importData = (file: File) => {
        return new Promise<void>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const result = e.target?.result as string;
                    const parsed = JSON.parse(result) as Character[];

                    // Basic validation that it's an array of objects
                    if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].id) {
                        setCharacters(parsed);
                        resolve();
                    } else {
                        reject(new Error("Invalid character data format"));
                    }
                } catch (err) {
                    reject(err);
                }
            };
            reader.readAsText(file);
        });
    };

    return {
        characters,
        isLoaded,
        addCharacter,
        updateCharacter,
        deleteCharacter,
        exportData,
        importData
    };
}

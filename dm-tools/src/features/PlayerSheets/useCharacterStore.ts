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

    const exportCharacter = (character: Character) => {
        const jsonString = JSON.stringify(character, null, 2);

        // Convert string to Base64 to bypass some "Blob" filters
        const base64Data = btoa(unescape(encodeURIComponent(jsonString)));
        const dataUri = `data:application/json;base64,${base64Data}`;

        const link = document.createElement('a');
        link.href = dataUri;

        const safeName = (character.name || 'unnamed').replace(/[^a-z0-9]/gi, '_');
        link.download = `dm-tools-${safeName}.json`;

        // Force append and click
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Import feature: Reads a JSON file
    const importData = (file: File) => {
        return new Promise<void>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const result = e.target?.result as string;
                    const parsed = JSON.parse(result);

                    // Check if it's an array of characters (old format) or a single character
                    if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].id) {
                        setCharacters(parsed);
                        resolve();
                    } else if (parsed && !Array.isArray(parsed) && parsed.id) {
                        // Append the imported single character
                        setCharacters(prev => [...prev, parsed as Character]);
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
        exportCharacter,
        importData
    };
}

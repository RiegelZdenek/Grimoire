import { useState, useEffect } from 'react';

export interface Track {
    id: string;
    title: string;
    filename: string; // the path within public/audio
}

export interface Category {
    id: string;
    title: string;
    icon: string;
    tracks: Track[];
}

export function useSoundboard() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch('/tracklist.json')
            .then(res => res.json())
            .then(data => {
                setCategories(data as Category[]);
                setIsLoading(false);
            })
            .catch(err => {
                console.error("Failed to load tracks:", err);
                setIsLoading(false);
            });
    }, []);

    return { categories, isLoading };
}

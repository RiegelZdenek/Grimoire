import { useState } from 'react';
import { CategoryGrid } from './CategoryGrid/CategoryGrid';
import { TracklistSidebar } from './TracklistSidebar/TracklistSidebar';
import { AudioPlayer } from './AudioPlayer/AudioPlayer';
import type { Category, Track } from './useSoundboard';
import { useSoundboard } from './useSoundboard';
import styles from './Soundboard.module.css';

export function Soundboard() {
    const { categories, isLoading } = useSoundboard();
    const [activeCategory, setActiveCategory] = useState<Category | null>(null);

    // Audio Playback State
    const [activeTrack, setActiveTrack] = useState<Track | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const handleCategorySelect = (categoryId: string) => {
        const category = categories.find(c => c.id === categoryId);
        if (category) {
            setActiveCategory(category);
        }
    };

    const handlePlayTrack = (track: Track) => {
        if (activeTrack?.id === track.id) {
            // Toggle play/pause if clicking the same track
            setIsPlaying(!isPlaying);
        } else {
            // Play new track
            setActiveTrack(track);
            setIsPlaying(true);
        }
    };

    const handleTogglePlay = () => {
        if (activeTrack) {
            setIsPlaying(!isPlaying);
        }
    };

    const handleNextTrack = () => {
        if (!activeTrack || !activeCategory) return;

        // Find next track in current category
        const currentIndex = activeCategory.tracks.findIndex(t => t.id === activeTrack.id);
        if (currentIndex !== -1 && currentIndex < activeCategory.tracks.length - 1) {
            const nextTrack = activeCategory.tracks[currentIndex + 1];
            setActiveTrack(nextTrack);
            setIsPlaying(true);
        } else if (activeCategory.tracks.length > 0) {
            // Loop back to start
            setActiveTrack(activeCategory.tracks[0]);
            setIsPlaying(true);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.mainContent}>
                <header className={styles.header}>
                    <h1>Soundboard</h1>
                    <p>Select a scenario to set the atmosphere.</p>
                </header>

                {!isLoading && (
                    <CategoryGrid
                        categories={categories}
                        activeCategoryId={activeCategory?.id}
                        onSelectCategory={handleCategorySelect}
                    />
                )}
            </div>

            <TracklistSidebar
                category={activeCategory}
                onClose={() => setActiveCategory(null)}
                activeTrackId={activeTrack?.id}
                isPlaying={isPlaying}
                onPlayTrack={handlePlayTrack}
            />

            <AudioPlayer
                activeTrack={activeTrack}
                isPlaying={isPlaying}
                onTogglePlay={handleTogglePlay}
                onNextTrack={handleNextTrack}
            />
        </div>
    );
}

import { X, Play, Pause } from 'lucide-react';
import clsx from 'clsx';
import type { Category, Track } from '../useSoundboard';
import styles from './TracklistSidebar.module.css';

interface TracklistSidebarProps {
    category: Category | null;
    onClose: () => void;
    // Let pass active track down later if needed for highlighting play state
    activeTrackId?: string;
    isPlaying?: boolean;
    onPlayTrack?: (track: Track) => void;
}

export function TracklistSidebar({
    category,
    onClose,
    activeTrackId,
    isPlaying,
    onPlayTrack
}: TracklistSidebarProps) {

    if (!category) return null;

    return (
        <aside className={clsx(styles.sidebar, { [styles.open]: !!category })}>
            <header className={styles.header}>
                <div className={styles.titleRow}>
                    <h2>{category.title}</h2>
                    <button className={styles.closeBtn} onClick={onClose} aria-label="Close tracklist">
                        <X size={20} />
                    </button>
                </div>
                <p className={styles.subtitle}>{category.tracks.length} tracks</p>
            </header>

            <ul className={styles.trackList}>
                {category.tracks.map(track => {
                    const isTrackActive = activeTrackId === track.id;

                    return (
                        <li key={track.id} className={styles.trackItem}>
                            <button
                                className={clsx(styles.trackBtn, { [styles.activeTrack]: isTrackActive })}
                                onClick={() => onPlayTrack && onPlayTrack(track)}
                            >
                                <div className={styles.playIconWrapper}>
                                    {isTrackActive && isPlaying ? <Pause size={16} /> : <Play size={16} />}
                                </div>
                                <div className={styles.trackInfo}>
                                    <span className={styles.trackTitle}>{track.title}</span>
                                    <span className={styles.trackFile}>{track.filename}</span>
                                </div>
                            </button>
                        </li>
                    );
                })}
            </ul>
        </aside>
    );
}

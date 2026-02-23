import { useEffect, useRef, useState } from 'react';
import type { Track } from '../useSoundboard';
import { Play, Pause, Volume2, SkipForward, Repeat } from 'lucide-react';
import styles from './AudioPlayer.module.css';
import clsx from 'clsx';


// Refined props to receive commands from the parent
export interface ControlledAudioPlayerProps {
    activeTrack: Track | null;
    isPlaying: boolean;
    onTogglePlay: () => void;
    onNextTrack: () => void;
}

export function AudioPlayer({ activeTrack, isPlaying, onTogglePlay, onNextTrack }: ControlledAudioPlayerProps) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isLooping, setIsLooping] = useState(false);

    // Handle track changes
    useEffect(() => {
        if (audioRef.current && activeTrack) {
            audioRef.current.src = `/api/audio/${activeTrack.filename}`;
            audioRef.current.volume = volume;
            if (isPlaying) {
                audioRef.current.play().catch(e => console.error("Playback failed:", e));
            }
        }
    }, [activeTrack]); // Removed isPlaying from dep array to avoid re-triggering src assignment

    // Handle play/pause toggles
    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.play().catch(e => console.error("Playback failed:", e));
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying]);

    // Handle time update for progress bar
    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setProgress(audioRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    // Handle seek
    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTime = parseFloat(e.target.value);
        if (audioRef.current) {
            audioRef.current.currentTime = newTime;
            setProgress(newTime);
        }
    };

    // Handle volume change
    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (audioRef.current) {
            audioRef.current.volume = newVolume;
        }
    };

    // Handle track end
    const handleEnded = () => {
        if (!isLooping) {
            onNextTrack();
        }
    };

    if (!activeTrack) return null;

    return (
        <div className={clsx(styles.playerBar, { [styles.visible]: !!activeTrack })}>
            <audio
                ref={audioRef}
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleEnded}
                onLoadedMetadata={handleLoadedMetadata}
                loop={isLooping}
            />

            <div className={styles.trackInfo}>
                <div className={styles.playingIndicator}>
                    {isPlaying && (
                        <>
                            <div className={styles.bar} style={{ animationDelay: '0s' }} />
                            <div className={styles.bar} style={{ animationDelay: '0.2s' }} />
                            <div className={styles.bar} style={{ animationDelay: '0.4s' }} />
                        </>
                    )}
                </div>
                <div>
                    <h4 className={styles.title}>{activeTrack.title}</h4>
                    <span className={styles.filename}>{activeTrack.filename}</span>
                </div>
            </div>

            <div className={styles.controls}>
                <button className={styles.controlBtn} onClick={onTogglePlay} title={isPlaying ? "Pause" : "Play"}>
                    {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                </button>
                <button className={styles.controlBtn} onClick={onNextTrack} title="Next Track">
                    <SkipForward size={20} />
                </button>
                <button
                    className={clsx(styles.controlBtn, { [styles.activeControl]: isLooping })}
                    onClick={() => setIsLooping(!isLooping)}
                    title="Toggle Loop"
                >
                    <Repeat size={20} />
                </button>
            </div>

            <div className={styles.volume}>
                <Volume2 size={20} className={styles.volumeIcon} />
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                    className={styles.volumeSliderInput}
                    style={{ '--volume-progress': `${volume * 100}%` } as React.CSSProperties}
                    title="Volume"
                />
            </div>

            <input
                type="range"
                min="0"
                max={duration || 100}
                value={progress}
                onChange={handleSeek}
                className={styles.progressInput}
                style={{ '--progress': `${duration ? (progress / duration) * 100 : 0}%` } as React.CSSProperties}
                title="Seek"
            />
        </div>
    );
}

import { useState, useRef, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';

export default function AudioPlayer({ base64 }) {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);

    //Build the Audio object once per base64 value
    useEffect(() => {
        const audio = new Audio(`data:audio/mp3;base64,${base64}`);
        audioRef.current = audio;

        audio.ontimeupdate = () => {
            if (audio.duration) {
                setProgress((audio.currentTime / audio.duration) * 100);
            }
        };

        audio.onended = () => {
            setIsPlaying(false);
            setProgress(0);
        };

        return () => {
            audio.pause();
            audio.ontimeupdate = null;
            audio.onended = null;
        };
    }, [base64]);

    const seek = (e) => {
        const audio = audioRef.current;
        if (!audio || !audio.duration) return;
        const bar = e.currentTarget;
        const rect = bar.getBoundingClientRect();
        const ratio = (e.clientX - rect.left) / rect.width;
        audio.currentTime = ratio * audio.duration;
        setProgress(ratio * 100);
    };

    const toggle = () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isPlaying) {
            audio.pause();
            setIsPlaying(false);
        } else {
            audio.play().catch(() => {});
            setIsPlaying(true);
        }
    };

    return (
        <div className="audio-player">
          <button className="audio-toggle-btn" onClick={toggle} title={isPlaying ? 'Pause' : 'Play'}>
            {isPlaying ? <Pause size={12} /> : <Play size={12} />}
            {isPlaying ? 'Pause' : 'Play'}
          </button>
    
          <div className="audio-progress-bar" onClick={seek} title="Seek">
            <div className="audio-progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
    );
}
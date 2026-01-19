import { useCallback } from 'react';

// Simple synth sounds using Web Audio API to avoid external asset dependencies for now
// This ensures "pick up and play" without worrying about mp3 files missing
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

export const useSound = () => {

    const playTone = useCallback((freq, type, duration, vol = 0.1) => {
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

        gain.gain.setValueAtTime(vol, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + duration);
    }, []);

    const playHover = useCallback(() => {
        // Soft, glassy tick
        playTone(800, 'sine', 0.05, 0.02);
    }, [playTone]);

    const playClick = useCallback(() => {
        // Sharp, clean selection
        playTone(1200, 'sine', 0.1, 0.05);
    }, [playTone]);

    const playSuccess = useCallback(() => {
        // Ascending major chord (C - E - G)
        const now = audioCtx.currentTime;
        [523.25, 659.25, 783.99].forEach((freq, i) => {
            setTimeout(() => playTone(freq, 'sine', 0.3, 0.05), i * 50);
        });
    }, [playTone]);

    const playSwoosh = useCallback(() => {
        // White noise burst for modal open
        // (Simplified to a low sine sweep for now as noise buffer needs more code)
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.frequency.setValueAtTime(200, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(600, audioCtx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.3);

        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
    }, []);

    return { playHover, playClick, playSuccess, playSwoosh };
};

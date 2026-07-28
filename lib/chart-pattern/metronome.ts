export const DEFAULT_METRONOME_VOLUME = 70;
export const METRONOME_VOLUME_STORAGE_KEY = "noslog-metronome-volume";

const ACCENT_GAIN_AT_FULL_VOLUME = 0.4;
const BEAT_GAIN_AT_FULL_VOLUME = 0.22;

export function normalizeMetronomeVolume(volume: number) {
    if (!Number.isFinite(volume)) return DEFAULT_METRONOME_VOLUME;
    return Math.min(100, Math.max(0, Math.round(volume)));
}

export function getMetronomePeakGain(volume: number, accent: boolean) {
    const ratio = normalizeMetronomeVolume(volume) / 100;
    return (
        ratio * (accent ? ACCENT_GAIN_AT_FULL_VOLUME : BEAT_GAIN_AT_FULL_VOLUME)
    );
}

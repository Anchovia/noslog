import type { ChartTimingPoint } from "./schema";
import { getBeatMarkers } from "./timing";

export const DEFAULT_METRONOME_VOLUME = 70;
export const METRONOME_VOLUME_STORAGE_KEY = "noslog-metronome-volume";

const ACCENT_GAIN_AT_FULL_VOLUME = 0.4;
const BEAT_GAIN_AT_FULL_VOLUME = 0.22;

export const METRONOME_SCHEDULE_INTERVAL_MS = 40;

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

export function scheduleMetronomeClicks({
    context,
    timingPoints,
    ticksPerQuarter,
    currentMs,
    scheduledThroughMs,
    rate,
    volume,
}: {
    context: AudioContext;
    timingPoints: ChartTimingPoint[];
    ticksPerQuarter: number;
    currentMs: number;
    scheduledThroughMs: number;
    rate: number;
    volume: number;
}) {
    const lookAheadMs = 180 * rate;
    const startMs = Math.max(currentMs, scheduledThroughMs);
    const endMs = currentMs + lookAheadMs;
    const beats = getBeatMarkers(timingPoints, ticksPerQuarter, startMs, endMs);

    for (const beat of beats) {
        const peakGain = getMetronomePeakGain(volume, beat.accent);
        if (peakGain <= 0) continue;
        const delaySeconds = (beat.timeMs - currentMs) / 1_000 / rate;
        const scheduledTime = Math.max(
            context.currentTime,
            context.currentTime + delaySeconds
        );
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        oscillator.frequency.value = beat.accent ? 1_320 : 880;
        gain.gain.setValueAtTime(0.0001, scheduledTime);
        gain.gain.exponentialRampToValueAtTime(peakGain, scheduledTime + 0.002);
        gain.gain.exponentialRampToValueAtTime(0.0001, scheduledTime + 0.045);
        oscillator.connect(gain);
        gain.connect(context.destination);
        oscillator.start(scheduledTime);
        oscillator.stop(scheduledTime + 0.05);
    }
    return endMs + 0.001;
}

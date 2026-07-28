"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { getChartEditorNavigationDurationMs } from "@/lib/chart-pattern/editor";
import { getMetronomePeakGain } from "@/lib/chart-pattern/metronome";
import { getBeatMarkers } from "@/lib/chart-pattern/timing";

import {
    useChartEditorStore,
    useChartEditorStoreApi,
} from "./chartEditorStore";

const WAVEFORM_PEAK_COUNT = 1_600;

function calculateWaveformPeaks(
    buffer: AudioBuffer,
    peakCount = WAVEFORM_PEAK_COUNT
) {
    const peaks = new Float32Array(peakCount);
    const blockSize = Math.max(1, Math.floor(buffer.length / peakCount));

    for (let peakIndex = 0; peakIndex < peakCount; peakIndex += 1) {
        const start = peakIndex * blockSize;
        const end = Math.min(buffer.length, start + blockSize);
        let peak = 0;
        for (
            let channelIndex = 0;
            channelIndex < buffer.numberOfChannels;
            channelIndex += 1
        ) {
            const channel = buffer.getChannelData(channelIndex);
            for (let sampleIndex = start; sampleIndex < end; sampleIndex += 1) {
                peak = Math.max(peak, Math.abs(channel[sampleIndex]));
            }
        }
        peaks[peakIndex] = peak;
    }

    return peaks;
}

interface PlaybackAnchor {
    contextTime: number;
    offsetMs: number;
    rate: number;
}

export function useChartAudio(metronomeVolume: number) {
    const store = useChartEditorStoreApi();
    const playbackRate = useChartEditorStore((state) => state.playbackRate);
    const metronomeEnabled = useChartEditorStore(
        (state) => state.metronomeEnabled
    );
    const [fileName, setFileName] = useState<string | null>(null);
    const [waveformPeaks, setWaveformPeaks] = useState<Float32Array | null>(
        null
    );
    const [isDecoding, setIsDecoding] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const contextRef = useRef<AudioContext | null>(null);
    const bufferRef = useRef<AudioBuffer | null>(null);
    const sourceRef = useRef<AudioBufferSourceNode | null>(null);
    const anchorRef = useRef<PlaybackAnchor | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    const sourceGenerationRef = useRef(0);
    const scheduledThroughMsRef = useRef(0);

    const getContext = useCallback(() => {
        if (!contextRef.current) {
            contextRef.current = new AudioContext();
        }
        return contextRef.current;
    }, []);

    const readPlaybackTime = useCallback(() => {
        const anchor = anchorRef.current;
        const context = contextRef.current;
        if (!anchor || !context) {
            return store.getState().currentTimeMs;
        }
        return (
            anchor.offsetMs +
            (context.currentTime - anchor.contextTime) * 1_000 * anchor.rate
        );
    }, [store]);

    const stopSource = useCallback(
        (nextTimeMs?: number) => {
            sourceGenerationRef.current += 1;
            const source = sourceRef.current;
            sourceRef.current = null;
            anchorRef.current = null;
            if (source) {
                source.onended = null;
                try {
                    source.stop();
                } catch {
                    // 이미 종료된 소스는 다시 정지할 필요가 없음
                }
                source.disconnect();
            }
            if (animationFrameRef.current !== null) {
                cancelAnimationFrame(animationFrameRef.current);
                animationFrameRef.current = null;
            }
            if (nextTimeMs !== undefined) {
                store.getState().setCurrentTimeMs(nextTimeMs);
            }
        },
        [store]
    );

    const runPlayhead = useCallback(() => {
        const update = () => {
            const buffer = bufferRef.current;
            if (!anchorRef.current) return;

            const nextTime = readPlaybackTime();
            const durationMs =
                buffer?.duration === undefined
                    ? getChartEditorNavigationDurationMs(
                          store.getState().document
                      )
                    : buffer.duration * 1_000;
            if (nextTime >= durationMs) {
                stopSource(durationMs);
                setIsPlaying(false);
                return;
            }
            store.getState().setCurrentTimeMs(nextTime);
            animationFrameRef.current = requestAnimationFrame(update);
        };
        animationFrameRef.current = requestAnimationFrame(update);
    }, [readPlaybackTime, stopSource, store]);

    const startPlaybackAt = useCallback(
        async (timeMs: number, rate: number) => {
            const buffer = bufferRef.current;
            const context = getContext();
            await context.resume();
            stopSource();

            const durationMs =
                buffer?.duration === undefined
                    ? getChartEditorNavigationDurationMs(
                          store.getState().document
                      )
                    : buffer.duration * 1_000;
            const clampedTime = Math.min(Math.max(0, timeMs), durationMs);
            anchorRef.current = {
                contextTime: context.currentTime,
                offsetMs: clampedTime,
                rate,
            };
            scheduledThroughMsRef.current = clampedTime - 1;
            if (buffer) {
                const source = context.createBufferSource();
                source.buffer = buffer;
                source.playbackRate.value = rate;
                source.connect(context.destination);

                const generation = sourceGenerationRef.current + 1;
                sourceGenerationRef.current = generation;
                sourceRef.current = source;
                source.onended = () => {
                    if (sourceGenerationRef.current !== generation) return;
                    stopSource(durationMs);
                    setIsPlaying(false);
                };
                source.start(0, clampedTime / 1_000);
            }
            store.getState().setCurrentTimeMs(clampedTime);
            setIsPlaying(true);
            runPlayhead();
        },
        [getContext, runPlayhead, stopSource, store]
    );

    const loadFile = useCallback(
        async (file: File) => {
            setIsDecoding(true);
            setError(null);
            setIsPlaying(false);
            stopSource(0);
            try {
                const context = getContext();
                const arrayBuffer = await file.arrayBuffer();
                const audioBuffer = await context.decodeAudioData(arrayBuffer);
                bufferRef.current = audioBuffer;
                setFileName(file.name);
                setWaveformPeaks(calculateWaveformPeaks(audioBuffer));
                store
                    .getState()
                    .setDurationMs(Math.round(audioBuffer.duration * 1_000));
            } catch {
                bufferRef.current = null;
                setFileName(null);
                setWaveformPeaks(null);
                setError(
                    "이 음원 파일을 읽을 수 없습니다. MP3, OGG 또는 WAV 파일을 사용해주세요."
                );
            } finally {
                setIsDecoding(false);
            }
        },
        [getContext, stopSource, store]
    );

    const togglePlayback = useCallback(async () => {
        if (isPlaying) {
            const time = readPlaybackTime();
            stopSource(time);
            setIsPlaying(false);
            return;
        }
        await startPlaybackAt(
            store.getState().currentTimeMs,
            store.getState().playbackRate
        );
    }, [isPlaying, readPlaybackTime, startPlaybackAt, stopSource, store]);

    const seek = useCallback(
        async (timeMs: number) => {
            const buffer = bufferRef.current;
            const durationMs =
                buffer?.duration === undefined
                    ? getChartEditorNavigationDurationMs(
                          store.getState().document
                      )
                    : buffer.duration * 1_000;
            const clamped = Math.min(Math.max(0, timeMs), durationMs);
            if (isPlaying) {
                await startPlaybackAt(clamped, store.getState().playbackRate);
            } else {
                store.getState().setCurrentTimeMs(clamped);
            }
        },
        [isPlaying, startPlaybackAt, store]
    );

    useEffect(() => {
        if (!isPlaying) return;
        const currentTime = readPlaybackTime();
        const timer = window.setTimeout(() => {
            void startPlaybackAt(currentTime, playbackRate);
        }, 0);
        return () => window.clearTimeout(timer);
    }, [playbackRate]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (!isPlaying || !metronomeEnabled) return;

        const interval = window.setInterval(() => {
            const context = contextRef.current;
            const anchor = anchorRef.current;
            if (!context || !anchor) return;

            const currentMs = readPlaybackTime();
            const lookAheadMs = 180 * anchor.rate;
            const startMs = Math.max(currentMs, scheduledThroughMsRef.current);
            const endMs = currentMs + lookAheadMs;
            const state = store.getState();
            const beats = getBeatMarkers(
                state.document.timingPoints,
                state.document.ticksPerQuarter,
                startMs,
                endMs
            );

            for (const beat of beats) {
                const peakGain = getMetronomePeakGain(
                    metronomeVolume,
                    beat.accent
                );
                if (peakGain <= 0) continue;
                const delaySeconds =
                    (beat.timeMs - currentMs) / 1_000 / anchor.rate;
                const scheduledTime = Math.max(
                    context.currentTime,
                    context.currentTime + delaySeconds
                );
                const oscillator = context.createOscillator();
                const gain = context.createGain();
                oscillator.frequency.value = beat.accent ? 1_320 : 880;
                gain.gain.setValueAtTime(0.0001, scheduledTime);
                gain.gain.exponentialRampToValueAtTime(
                    peakGain,
                    scheduledTime + 0.002
                );
                gain.gain.exponentialRampToValueAtTime(
                    0.0001,
                    scheduledTime + 0.045
                );
                oscillator.connect(gain);
                gain.connect(context.destination);
                oscillator.start(scheduledTime);
                oscillator.stop(scheduledTime + 0.05);
            }
            scheduledThroughMsRef.current = endMs + 0.001;
        }, 40);

        return () => window.clearInterval(interval);
    }, [
        isPlaying,
        metronomeEnabled,
        metronomeVolume,
        readPlaybackTime,
        store,
        playbackRate,
    ]);

    useEffect(
        () => () => {
            stopSource();
            void contextRef.current?.close();
            contextRef.current = null;
        },
        [stopSource]
    );

    return {
        fileName,
        waveformPeaks,
        isDecoding,
        isPlaying,
        error,
        loadFile,
        togglePlayback,
        seek,
    };
}

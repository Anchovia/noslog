"use client";

import { Pause, Play, RotateCcw, Upload, Volume2 } from "lucide-react";
import { type ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import type { Application, Graphics } from "pixi.js";

import { useTranslations } from "@/components/i18n/localeProvider";
import Button from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/checkbox";
import CompactSelect from "@/components/ui/compactSelect";
import { getMetronomePeakGain } from "@/lib/chart-pattern/metronome";
import { chartPianoColors } from "@/lib/chart-pattern/piano";
import {
    getActivePlaybackPianoRanges,
    getApproachDurationMs,
    getChartPlaybackDurationMs,
    getPlaybackVisualScale,
    getPlaybackRibbonVisibleEndMs,
    prepareChartPlaybackNotes,
    projectPlaybackLane,
    projectPlaybackRange,
    type PlaybackPathPoint,
    type PlaybackTrillSegment,
    type PreparedPlaybackNote,
} from "@/lib/chart-pattern/playback";
import {
    CHART_LANE_COUNT,
    CHART_LANE_GROUP_BOUNDARIES,
    type ChartDocument,
    type ChartHand,
} from "@/lib/chart-pattern/schema";
import { formatEditorTime, getBeatMarkers } from "@/lib/chart-pattern/timing";

import { useMetronomeVolume } from "./useMetronomeVolume";
import { useStrictPerformance } from "./useStrictPerformance";
interface FallingChartViewerProps {
    document: ChartDocument;
    jacketUrl: string | null;
}

interface PlaybackClockAnchor {
    startedAt: number;
    offsetMs: number;
}

interface ProjectedRange {
    left: number;
    right: number;
    center: number;
    y: number;
    depth: number;
}

const colors = {
    left: 0x4fc8dc,
    right: 0xe85f5d,
    noteFace: 0xf8f7f1,
    judgment: 0xf2f0e9,
    judgmentEdge: 0x8f929d,
    guideStrong: 0x727786,
};

function colorForHand(hand: ChartHand) {
    return hand === "left" ? colors.left : colors.right;
}

function interpolate(start: number, end: number, progress: number) {
    return start + (end - start) * progress;
}

function interpolatePathPoint(
    first: PlaybackPathPoint,
    second: PlaybackPathPoint,
    timeMs: number
): PlaybackPathPoint {
    const progress =
        second.timeMs === first.timeMs
            ? 0
            : Math.min(
                  1,
                  Math.max(
                      0,
                      (timeMs - first.timeMs) / (second.timeMs - first.timeMs)
                  )
              );
    return {
        lane: interpolate(first.lane, second.lane, progress),
        width: interpolate(first.width, second.width, progress),
        timeMs,
        hand: progress < 0.5 ? first.hand : second.hand,
    };
}

function clipPathSegment(
    first: PlaybackPathPoint,
    second: PlaybackPathPoint,
    startTimeMs: number,
    endTimeMs: number
) {
    const clippedStart = Math.max(first.timeMs, startTimeMs);
    const clippedEnd = Math.min(second.timeMs, endTimeMs);
    if (clippedStart > clippedEnd) return null;
    return {
        first: interpolatePathPoint(first, second, clippedStart),
        second: interpolatePathPoint(first, second, clippedEnd),
    };
}

function trillPointAt(
    segment: PlaybackTrillSegment,
    timeMs: number,
    hand: ChartHand
): PlaybackPathPoint {
    const progress =
        segment.endTimeMs === segment.startTimeMs
            ? 0
            : Math.min(
                  1,
                  Math.max(
                      0,
                      (timeMs - segment.startTimeMs) /
                          (segment.endTimeMs - segment.startTimeMs)
                  )
              );
    return {
        lane: interpolate(segment.fromLane, segment.toLane, progress),
        width: interpolate(segment.fromWidth, segment.toWidth, progress),
        timeMs,
        hand,
    };
}

function capPolygon(
    left: number,
    right: number,
    centerY: number,
    height: number,
    visualScale: number
) {
    const width = Math.max(2, right - left);
    const bevel = Math.min(
        8 * visualScale,
        Math.max(2 * visualScale, width * 0.08)
    );
    return [
        left + bevel,
        centerY - height / 2,
        right - bevel,
        centerY - height / 2,
        right,
        centerY,
        right - bevel,
        centerY + height / 2,
        left + bevel,
        centerY + height / 2,
        left,
        centerY,
    ];
}

function drawPlaybackCap(
    graphics: Graphics,
    projected: ProjectedRange,
    hand: ChartHand,
    alpha: number,
    visualScale: number,
    small = false
) {
    const height =
        ((small ? 6 : 10) + projected.depth * (small ? 3 : 5)) * visualScale;
    const handColor = colorForHand(hand);
    graphics
        .poly(
            capPolygon(
                projected.left - 2 * visualScale,
                projected.right + 2 * visualScale,
                projected.y,
                height + 5 * visualScale,
                visualScale
            ),
            true
        )
        .fill({ color: handColor, alpha: alpha * 0.2 });
    graphics
        .poly(
            capPolygon(
                projected.left,
                projected.right,
                projected.y,
                height,
                visualScale
            ),
            true
        )
        .fill({ color: colors.noteFace, alpha })
        .stroke({ color: handColor, width: 1.5 * visualScale, alpha });
    graphics
        .moveTo(projected.left + 5 * visualScale, projected.y + visualScale)
        .lineTo(projected.right - 5 * visualScale, projected.y + visualScale)
        .stroke({
            color: handColor,
            width: visualScale,
            alpha: alpha * 0.45,
        });
}

function drawHitGlow(
    graphics: Graphics,
    projected: ProjectedRange,
    hand: ChartHand,
    distanceMs: number,
    visualScale: number
) {
    if (Math.abs(distanceMs) > 95) return;
    const strength = 1 - Math.abs(distanceMs) / 95;
    const noteWidth = projected.right - projected.left;
    const glowWidth = Math.min(
        48 * visualScale,
        Math.max(12 * visualScale, noteWidth * 0.45)
    );
    graphics
        .ellipse(
            projected.center,
            projected.y,
            glowWidth * (1 + strength * 0.15),
            (8 + strength * 10) * visualScale
        )
        .fill({
            color: colorForHand(hand),
            alpha: 0.1 + strength * 0.18,
        });
    graphics
        .circle(projected.center, projected.y, (3 + strength * 5) * visualScale)
        .fill({ color: colors.noteFace, alpha: strength * 0.42 });
}

function drawRibbon(
    graphics: Graphics,
    points: ProjectedRange[],
    hand: ChartHand,
    visualScale: number,
    alpha = 0.62
) {
    if (points.length < 2) return;
    const leftEdge = points.flatMap((point) => {
        const inset = Math.min(
            2 * visualScale,
            (point.right - point.left) * 0.08
        );
        return [point.left + inset, point.y];
    });
    const rightEdge = [...points].reverse().flatMap((point) => {
        const inset = Math.min(
            2 * visualScale,
            (point.right - point.left) * 0.08
        );
        return [point.right - inset, point.y];
    });
    const handColor = colorForHand(hand);
    graphics
        .poly([...leftEdge, ...rightEdge], true)
        .fill({ color: handColor, alpha })
        .stroke({
            color: handColor,
            width: visualScale,
            alpha: alpha * 0.9,
        });
    graphics.moveTo(points[0].center, points[0].y);
    for (let index = 1; index < points.length; index += 1) {
        graphics.lineTo(points[index].center, points[index].y);
    }
    graphics.stroke({
        color: colors.noteFace,
        width: 1.1 * visualScale,
        alpha: alpha * 0.72,
    });
}

function sampleProjectedSegment(
    first: PlaybackPathPoint,
    second: PlaybackPathPoint,
    project: (point: PlaybackPathPoint) => ProjectedRange
) {
    const durationMs = Math.abs(second.timeMs - first.timeMs);
    const steps = Math.min(32, Math.max(6, Math.ceil(durationMs / 90)));
    return Array.from({ length: steps + 1 }, (_, index) => {
        const progress = index / steps;
        return project(
            interpolatePathPoint(
                first,
                second,
                interpolate(first.timeMs, second.timeMs, progress)
            )
        );
    });
}

function drawPlayfield(
    graphics: Graphics,
    width: number,
    height: number,
    horizonY: number,
    judgmentY: number
) {
    graphics.rect(0, 0, width, height).fill({
        color: 0x070910,
        alpha: 0.74,
    });
    for (const lane of CHART_LANE_GROUP_BOUNDARIES) {
        for (let step = 0; step <= 48; step += 1) {
            const point = projectPlaybackLane({
                lane,
                progress: step / 48,
                canvasWidth: width,
                horizonY,
                judgmentY,
            });
            if (step === 0) {
                graphics.moveTo(point.x, point.y);
            } else {
                graphics.lineTo(point.x, point.y);
            }
        }
        graphics.stroke({
            color: colors.guideStrong,
            width: 1,
            alpha: 0.38,
        });
    }
}

function drawPiano(
    graphics: Graphics,
    width: number,
    height: number,
    judgmentY: number,
    currentTimeMs: number,
    notes: PreparedPlaybackNote[],
    strictPerformance: boolean
) {
    const left = width * 0.03;
    const right = width * 0.97;
    const pianoTop = judgmentY + 5;
    const pianoBottom = height;
    const laneWidth = (right - left) / CHART_LANE_COUNT;
    const activeLaneHands = new Map<number, ChartHand>();

    for (const range of getActivePlaybackPianoRanges(
        notes,
        currentTimeMs,
        strictPerformance
    )) {
        for (
            let lane = Math.floor(range.lane);
            lane < Math.ceil(range.lane + range.width);
            lane += 1
        ) {
            activeLaneHands.set(lane, range.hand);
        }
    }

    graphics
        .rect(left, pianoTop, right - left, pianoBottom - pianoTop)
        .fill({ color: 0xbfc2c4, alpha: 0.92 });
    for (let lane = 0; lane < CHART_LANE_COUNT; lane += 1) {
        const x = left + lane * laneWidth;
        const activeHand = activeLaneHands.get(lane);
        graphics
            .rect(x, pianoTop, laneWidth, pianoBottom - pianoTop)
            .fill({
                color:
                    activeHand === "left"
                        ? chartPianoColors.pressedLeft
                        : activeHand === "right"
                          ? chartPianoColors.pressedRight
                          : lane % 2 === 0
                            ? chartPianoColors.white
                            : chartPianoColors.whiteAlt,
                alpha: activeHand === undefined ? 0.96 : 0.9,
            })
            .stroke({ color: 0x565a63, width: 0.65, alpha: 0.7 });
    }

    const blackAfter = new Set([0, 1, 3, 4, 5]);
    for (let lane = 0; lane < CHART_LANE_COUNT - 1; lane += 1) {
        if (!blackAfter.has(lane % 7)) continue;
        const x = left + (lane + 1) * laneWidth;
        graphics
            .rect(
                x - laneWidth * 0.22,
                pianoTop,
                laneWidth * 0.44,
                (pianoBottom - pianoTop) * 0.56
            )
            .fill({ color: chartPianoColors.black, alpha: 0.98 });
    }
}

function drawJudgmentLine(
    graphics: Graphics,
    width: number,
    judgmentY: number
) {
    const left = width * 0.018;
    const lineWidth = width * 0.964;
    graphics
        .roundRect(left, judgmentY - 5, lineWidth, 10, 5)
        .fill({ color: 0x1c2029, alpha: 0.96 })
        .stroke({ color: colors.judgmentEdge, width: 2.5, alpha: 0.95 });
    graphics
        .moveTo(left + 7, judgmentY - 1.5)
        .lineTo(left + lineWidth - 7, judgmentY - 1.5)
        .stroke({ color: colors.judgment, width: 1.5, alpha: 0.95 });
}

function drawPreparedNote({
    graphics,
    note,
    currentTimeMs,
    approachDurationMs,
    width,
    horizonY,
    judgmentY,
    visualScale,
}: {
    graphics: Graphics;
    note: PreparedPlaybackNote;
    currentTimeMs: number;
    approachDurationMs: number;
    width: number;
    horizonY: number;
    judgmentY: number;
    visualScale: number;
}) {
    const visibleEnd =
        note.type === "standard"
            ? currentTimeMs + approachDurationMs
            : getPlaybackRibbonVisibleEndMs(currentTimeMs, approachDurationMs);
    if (note.endTimeMs < currentTimeMs - 130 || note.startTimeMs > visibleEnd) {
        return;
    }
    const project = (point: PlaybackPathPoint) =>
        projectPlaybackRange({
            lane: point.lane,
            width: point.width,
            timeMs: point.timeMs,
            currentTimeMs,
            approachDurationMs,
            canvasWidth: width,
            horizonY,
            judgmentY,
        });

    if (note.type === "standard") {
        const point = note.pathPoints[0];
        const projected = project(point);
        const alpha =
            point.timeMs >= currentTimeMs
                ? 0.98
                : Math.max(0, 1 - (currentTimeMs - point.timeMs) / 130);
        drawHitGlow(
            graphics,
            projected,
            point.hand,
            point.timeMs - currentTimeMs,
            visualScale
        );
        drawPlaybackCap(graphics, projected, point.hand, alpha, visualScale);
        return;
    }

    if (note.type === "trill") {
        for (
            let index = note.trillSegments.length - 1;
            index >= 0;
            index -= 1
        ) {
            const segment = note.trillSegments[index];
            const startTimeMs = Math.max(segment.startTimeMs, currentTimeMs);
            const endTimeMs = Math.min(segment.endTimeMs, visibleEnd);
            if (startTimeMs > endTimeMs) continue;
            const first = trillPointAt(segment, startTimeMs, note.hand);
            const second = trillPointAt(segment, endTimeMs, note.hand);
            drawRibbon(
                graphics,
                sampleProjectedSegment(first, second, project),
                note.hand,
                visualScale,
                0.74
            );
        }
        for (const point of [...note.pathPoints].reverse()) {
            if (
                point.timeMs < currentTimeMs - 90 ||
                point.timeMs > visibleEnd
            ) {
                continue;
            }
            const projected = project(point);
            drawHitGlow(
                graphics,
                projected,
                point.hand,
                point.timeMs - currentTimeMs,
                visualScale
            );
            drawPlaybackCap(graphics, projected, point.hand, 0.98, visualScale);
        }
        return;
    }

    for (let index = note.pathPoints.length - 2; index >= 0; index -= 1) {
        const clipped = clipPathSegment(
            note.pathPoints[index],
            note.pathPoints[index + 1],
            currentTimeMs,
            visibleEnd
        );
        if (!clipped) continue;
        drawRibbon(
            graphics,
            sampleProjectedSegment(clipped.first, clipped.second, project),
            clipped.first.hand,
            visualScale,
            note.type === "glissando" ? 0.7 : 0.62
        );
    }

    const capPoints =
        note.type === "glissando"
            ? note.pathPoints
            : [note.pathPoints[0], note.pathPoints.at(-1)!];
    for (let index = capPoints.length - 1; index >= 0; index -= 1) {
        const point = capPoints[index];
        if (point.timeMs < currentTimeMs - 90 || point.timeMs > visibleEnd) {
            continue;
        }
        const projected = project(point);
        drawHitGlow(
            graphics,
            projected,
            point.hand,
            point.timeMs - currentTimeMs,
            visualScale
        );
        drawPlaybackCap(
            graphics,
            projected,
            point.hand,
            0.98,
            visualScale,
            note.type === "glissando" &&
                point.timeMs !== note.startTimeMs &&
                point.timeMs !== note.endTimeMs
        );
    }
}

function renderPlaybackFrame({
    graphics,
    notes,
    currentTimeMs,
    approachDurationMs,
    width,
    height,
    strictPerformance,
}: {
    graphics: Graphics;
    notes: PreparedPlaybackNote[];
    currentTimeMs: number;
    approachDurationMs: number;
    width: number;
    height: number;
    strictPerformance: boolean;
}) {
    const horizonY = Math.max(40, height * 0.12);
    const judgmentY = height * 0.79;
    const visualScale = getPlaybackVisualScale(width);
    graphics.clear();
    drawPlayfield(graphics, width, height, horizonY, judgmentY);

    for (let index = notes.length - 1; index >= 0; index -= 1) {
        drawPreparedNote({
            graphics,
            note: notes[index],
            currentTimeMs,
            approachDurationMs,
            width,
            horizonY,
            judgmentY,
            visualScale,
        });
    }

    drawPiano(
        graphics,
        width,
        height,
        judgmentY,
        currentTimeMs,
        notes,
        strictPerformance
    );
    drawJudgmentLine(graphics, width, judgmentY);
}

export default function FallingChartViewer({
    document,
    jacketUrl,
}: FallingChartViewerProps) {
    const t = useTranslations();
    const hostRef = useRef<HTMLDivElement | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const objectUrlRef = useRef<string | null>(null);
    const isPlayingRef = useRef(false);
    const currentTimeRef = useRef(0);
    const durationRef = useRef(getChartPlaybackDurationMs(document));
    const noteSpeedRef = useRef(2);
    const strictPerformanceRef = useRef(false);
    const clockAnchorRef = useRef<PlaybackClockAnchor | null>(null);
    const lastUiUpdateRef = useRef(0);
    const metronomeContextRef = useRef<AudioContext | null>(null);
    const scheduledThroughMsRef = useRef(0);
    const [currentTimeMs, setCurrentTimeMs] = useState(0);
    const [audioDurationMs, setAudioDurationMs] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [noteSpeed, setNoteSpeed] = useState(2);
    const [metronomeEnabled, setMetronomeEnabled] = useState(false);
    const [metronomeVolume, setMetronomeVolume] = useMetronomeVolume();
    const [strictPerformance, setStrictPerformance] = useStrictPerformance();
    const [fileName, setFileName] = useState<string | null>(null);
    const [audioError, setAudioError] = useState<string | null>(null);
    const preparedNotes = useMemo(
        () => prepareChartPlaybackNotes(document),
        [document]
    );
    const chartDurationMs = useMemo(
        () => getChartPlaybackDurationMs(document),
        [document]
    );
    const durationMs = Math.max(chartDurationMs, audioDurationMs);

    useEffect(() => {
        durationRef.current = durationMs;
    }, [durationMs]);

    useEffect(() => {
        noteSpeedRef.current = noteSpeed;
    }, [noteSpeed]);

    useEffect(() => {
        strictPerformanceRef.current = strictPerformance;
    }, [strictPerformance]);

    useEffect(() => {
        const host = hostRef.current;
        if (!host) return;
        let disposed = false;
        let application: Application | null = null;
        let scene: Graphics | null = null;

        void (async () => {
            const pixi = await import("pixi.js");
            if (disposed) return;
            const nextApplication = new pixi.Application();
            await nextApplication.init({
                resizeTo: host,
                antialias: true,
                backgroundAlpha: 0,
                preference: "webgl",
                autoStart: true,
            });
            if (disposed) {
                nextApplication.destroy(true);
                return;
            }
            application = nextApplication;
            scene = new pixi.Graphics();
            nextApplication.stage.addChild(scene);
            host.replaceChildren(nextApplication.canvas);

            nextApplication.ticker.add(() => {
                if (!scene || !application) return;
                const now = performance.now();
                if (isPlayingRef.current) {
                    const audio = audioRef.current;
                    if (audio && fileName && !audio.paused) {
                        currentTimeRef.current = audio.currentTime * 1_000;
                    } else if (clockAnchorRef.current) {
                        currentTimeRef.current =
                            clockAnchorRef.current.offsetMs +
                            (now - clockAnchorRef.current.startedAt);
                    }
                    if (currentTimeRef.current >= durationRef.current) {
                        currentTimeRef.current = durationRef.current;
                        isPlayingRef.current = false;
                        clockAnchorRef.current = null;
                        setIsPlaying(false);
                    }
                    if (now - lastUiUpdateRef.current >= 60) {
                        lastUiUpdateRef.current = now;
                        setCurrentTimeMs(currentTimeRef.current);
                    }
                }
                renderPlaybackFrame({
                    graphics: scene,
                    notes: preparedNotes,
                    currentTimeMs: currentTimeRef.current,
                    approachDurationMs: getApproachDurationMs(
                        noteSpeedRef.current
                    ),
                    width: application.screen.width,
                    height: application.screen.height,
                    strictPerformance: strictPerformanceRef.current,
                });
            });
        })();

        return () => {
            disposed = true;
            application?.destroy(true);
            host.replaceChildren();
        };
    }, [fileName, preparedNotes]);

    useEffect(
        () => () => {
            if (objectUrlRef.current) {
                URL.revokeObjectURL(objectUrlRef.current);
            }
            void metronomeContextRef.current?.close();
            metronomeContextRef.current = null;
        },
        []
    );

    useEffect(() => {
        if (!isPlaying || !metronomeEnabled) return;

        const interval = window.setInterval(() => {
            const context = metronomeContextRef.current;
            if (!context) return;

            const audio = audioRef.current;
            let playbackTimeMs = currentTimeRef.current;
            if (audio && fileName && !audio.paused) {
                playbackTimeMs = audio.currentTime * 1_000;
            } else if (clockAnchorRef.current) {
                playbackTimeMs =
                    clockAnchorRef.current.offsetMs +
                    (performance.now() - clockAnchorRef.current.startedAt);
            }

            const startMs = Math.max(
                playbackTimeMs,
                scheduledThroughMsRef.current
            );
            const endMs = playbackTimeMs + 180;
            const beats = getBeatMarkers(
                document.timingPoints,
                document.ticksPerQuarter,
                startMs,
                endMs
            );

            for (const beat of beats) {
                const peakGain = getMetronomePeakGain(
                    metronomeVolume,
                    beat.accent
                );
                if (peakGain <= 0) continue;
                const scheduledTime = Math.max(
                    context.currentTime,
                    context.currentTime + (beat.timeMs - playbackTimeMs) / 1_000
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
        document.ticksPerQuarter,
        document.timingPoints,
        fileName,
        isPlaying,
        metronomeEnabled,
        metronomeVolume,
    ]);

    function getMetronomeContext() {
        if (!metronomeContextRef.current) {
            metronomeContextRef.current = new AudioContext();
        }
        return metronomeContextRef.current;
    }

    function pausePlayback() {
        const audio = audioRef.current;
        if (audio && fileName) {
            audio.pause();
            currentTimeRef.current = audio.currentTime * 1_000;
        } else if (clockAnchorRef.current) {
            currentTimeRef.current =
                clockAnchorRef.current.offsetMs +
                (performance.now() - clockAnchorRef.current.startedAt);
        }
        clockAnchorRef.current = null;
        isPlayingRef.current = false;
        setIsPlaying(false);
        setCurrentTimeMs(currentTimeRef.current);
    }

    async function startPlayback() {
        if (currentTimeRef.current >= durationRef.current - 10) {
            seek(0);
        }
        if (metronomeEnabled) {
            await getMetronomeContext().resume();
        }
        scheduledThroughMsRef.current = currentTimeRef.current - 1;
        const audio = audioRef.current;
        if (audio && fileName) {
            audio.currentTime = Math.min(
                currentTimeRef.current / 1_000,
                Number.isFinite(audio.duration) ? audio.duration : Infinity
            );
            try {
                await audio.play();
            } catch {
                setAudioError(t("chart.audioError"));
                return;
            }
        } else {
            clockAnchorRef.current = {
                startedAt: performance.now(),
                offsetMs: currentTimeRef.current,
            };
        }
        isPlayingRef.current = true;
        setIsPlaying(true);
    }

    function seek(nextTimeMs: number) {
        const next = Math.min(durationRef.current, Math.max(0, nextTimeMs));
        currentTimeRef.current = next;
        scheduledThroughMsRef.current = next - 1;
        setCurrentTimeMs(next);
        const audio = audioRef.current;
        if (audio && fileName && Number.isFinite(audio.duration)) {
            audio.currentTime = Math.min(next / 1_000, audio.duration);
        }
        if (isPlayingRef.current && !fileName) {
            clockAnchorRef.current = {
                startedAt: performance.now(),
                offsetMs: next,
            };
        }
    }

    async function updateMetronomeEnabled(enabled: boolean) {
        if (enabled) {
            await getMetronomeContext().resume();
            scheduledThroughMsRef.current = currentTimeRef.current - 1;
        }
        setMetronomeEnabled(enabled);
    }

    function loadAudio(event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        event.target.value = "";
        if (!file) return;
        pausePlayback();
        if (objectUrlRef.current) {
            URL.revokeObjectURL(objectUrlRef.current);
        }
        const url = URL.createObjectURL(file);
        objectUrlRef.current = url;
        setFileName(file.name);
        setAudioDurationMs(0);
        setAudioError(null);
        currentTimeRef.current = 0;
        setCurrentTimeMs(0);
        if (audioRef.current) {
            audioRef.current.src = url;
            audioRef.current.load();
        }
    }

    return (
        <section className="nl-chart-stage">
            <div className="nl-chart-stage__canvas">
                {jacketUrl ? (
                    <div
                        aria-hidden
                        className="nl-chart-stage__art"
                        style={{ backgroundImage: `url("${jacketUrl}")` }}
                    />
                ) : null}
                <div aria-hidden className="nl-chart-stage__scrim" />
                <div
                    ref={hostRef}
                    role="img"
                    aria-label={t("chart.fallingAria", {
                        time: formatEditorTime(currentTimeMs),
                    })}
                    className="nl-chart-stage__host"
                />
            </div>

            <div className="nl-chart-stage__controls">
                <div className="nl-chart-stage__transport">
                    <Button
                        appearance="foundation"
                        variant="primary"
                        size="icon"
                        onClick={() =>
                            isPlaying ? pausePlayback() : void startPlayback()
                        }
                        aria-label={
                            isPlaying ? t("chart.pause") : t("chart.play")
                        }
                    >
                        {isPlaying ? (
                            <Pause className="nl-icon" fill="currentColor" />
                        ) : (
                            <Play className="nl-icon" fill="currentColor" />
                        )}
                    </Button>
                    <Button
                        appearance="foundation"
                        variant="secondary"
                        size="icon"
                        onClick={() => {
                            pausePlayback();
                            seek(0);
                        }}
                        aria-label={t("chart.restart")}
                    >
                        <RotateCcw className="nl-icon" />
                    </Button>
                    <span className="nl-metric-value nl-chart-stage__time">
                        {formatEditorTime(currentTimeMs)}
                    </span>
                    <input
                        type="range"
                        min="0"
                        max={Math.max(1, durationMs)}
                        step="10"
                        value={Math.min(currentTimeMs, durationMs)}
                        onChange={(event) => seek(Number(event.target.value))}
                        aria-label={t("chart.position")}
                        className="nl-chart-stage__seek"
                    />
                    <span className="nl-metric-value nl-chart-stage__time">
                        {formatEditorTime(durationMs)}
                    </span>
                </div>

                <div className="nl-chart-stage__options">
                    <label className="nl-button nl-button--secondary">
                        <Upload className="nl-icon" aria-hidden />
                        {t("chart.localAudio")}
                        <input
                            type="file"
                            accept="audio/mpeg,audio/ogg,audio/wav,audio/flac,audio/mp4"
                            onChange={loadAudio}
                            className="sr-only"
                        />
                    </label>
                    <div className="nl-chart-stage__option">
                        <span className="nl-control nl-muted">
                            {t("chart.noteSpeed")}
                        </span>
                        <CompactSelect
                            label={t("chart.noteSpeed")}
                            value={noteSpeed.toFixed(1)}
                            onValueChange={(value) =>
                                setNoteSpeed(Number(value))
                            }
                            outlined
                            options={Array.from({ length: 31 }, (_, index) => {
                                const value = (1 + index * 0.1).toFixed(1);
                                return { value, label: value };
                            })}
                        />
                    </div>
                    <Checkbox
                        label={t("chart.metronome")}
                        checked={metronomeEnabled}
                        onChange={(event) =>
                            void updateMetronomeEnabled(event.target.checked)
                        }
                    />
                    <label className="nl-chart-stage__option nl-chart-stage__volume">
                        <Volume2 className="nl-icon nl-muted" aria-hidden />
                        <input
                            type="range"
                            min="0"
                            max="100"
                            step="5"
                            value={metronomeVolume}
                            onChange={(event) =>
                                setMetronomeVolume(Number(event.target.value))
                            }
                            aria-label={t("chart.metronomeVolume")}
                            className="nl-chart-stage__seek"
                        />
                        <span className="nl-metric-value nl-chart-stage__percent">
                            {metronomeVolume}%
                        </span>
                    </label>
                    <Checkbox
                        label={t("chart.strictPerformance")}
                        checked={strictPerformance}
                        onChange={(event) =>
                            setStrictPerformance(event.target.checked)
                        }
                    />
                </div>
                <p className="nl-metadata nl-muted nl-chart-stage__file">
                    {fileName ?? t("chart.audioHelp")}
                </p>
                {audioError ? (
                    <p className="nl-body-secondary nl-chart-stage__error">
                        {audioError}
                    </p>
                ) : null}
                <audio
                    ref={audioRef}
                    preload="metadata"
                    onLoadedMetadata={(event) =>
                        setAudioDurationMs(
                            Math.round(event.currentTarget.duration * 1_000)
                        )
                    }
                    onEnded={() => {
                        isPlayingRef.current = false;
                        clockAnchorRef.current = null;
                        setIsPlaying(false);
                    }}
                />
            </div>
        </section>
    );
}

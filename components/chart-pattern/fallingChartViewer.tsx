"use client";

import { Gauge, Pause, Play, RotateCcw, Upload } from "lucide-react";
import { type ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import type { Application, Graphics } from "pixi.js";

import {
    getApproachDurationMs,
    getChartPlaybackDurationMs,
    prepareChartPlaybackNotes,
    projectPlaybackRange,
    type PlaybackPathPoint,
    type PlaybackTrillSegment,
    type PreparedPlaybackNote,
} from "@/lib/chart-pattern/playback";
import {
    CHART_LANE_COUNT,
    type ChartDocument,
    type ChartHand,
} from "@/lib/chart-pattern/schema";
import { formatEditorTime } from "@/lib/chart-pattern/timing";

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
    guideWeak: 0x343946,
    pianoWhite: 0xe7e6e1,
    pianoWhiteAlt: 0xd2d4d4,
    pianoBlack: 0x161820,
    pianoPressed: 0x55d7c0,
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
    height: number
) {
    const width = Math.max(2, right - left);
    const bevel = Math.min(8, Math.max(2, width * 0.08));
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
    small = false
) {
    const height = (small ? 6 : 10) + projected.depth * (small ? 3 : 5);
    const handColor = colorForHand(hand);
    graphics
        .poly(
            capPolygon(
                projected.left - 2,
                projected.right + 2,
                projected.y,
                height + 5
            ),
            true
        )
        .fill({ color: handColor, alpha: alpha * 0.2 });
    graphics
        .poly(
            capPolygon(projected.left, projected.right, projected.y, height),
            true
        )
        .fill({ color: colors.noteFace, alpha })
        .stroke({ color: handColor, width: 1.5, alpha });
    graphics
        .moveTo(projected.left + 5, projected.y + 1)
        .lineTo(projected.right - 5, projected.y + 1)
        .stroke({ color: handColor, width: 1, alpha: alpha * 0.45 });
}

function drawHitGlow(
    graphics: Graphics,
    projected: ProjectedRange,
    hand: ChartHand,
    distanceMs: number
) {
    if (Math.abs(distanceMs) > 95) return;
    const strength = 1 - Math.abs(distanceMs) / 95;
    const noteWidth = projected.right - projected.left;
    const glowWidth = Math.min(48, Math.max(12, noteWidth * 0.45));
    graphics
        .ellipse(
            projected.center,
            projected.y,
            glowWidth * (1 + strength * 0.15),
            8 + strength * 10
        )
        .fill({
            color: colorForHand(hand),
            alpha: 0.1 + strength * 0.18,
        });
    graphics
        .circle(projected.center, projected.y, 3 + strength * 5)
        .fill({ color: colors.noteFace, alpha: strength * 0.42 });
}

function drawRibbon(
    graphics: Graphics,
    first: ProjectedRange,
    second: ProjectedRange,
    hand: ChartHand,
    alpha = 0.62
) {
    const insetFirst = Math.min(2, (first.right - first.left) * 0.08);
    const insetSecond = Math.min(2, (second.right - second.left) * 0.08);
    const polygon = [
        first.left + insetFirst,
        first.y,
        first.right - insetFirst,
        first.y,
        second.right - insetSecond,
        second.y,
        second.left + insetSecond,
        second.y,
    ];
    const handColor = colorForHand(hand);
    graphics
        .poly(polygon, true)
        .fill({ color: handColor, alpha })
        .stroke({ color: handColor, width: 1, alpha: alpha * 0.9 });
    graphics
        .moveTo(first.center, first.y)
        .lineTo(second.center, second.y)
        .stroke({ color: colors.noteFace, width: 1.1, alpha: alpha * 0.72 });
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
    const judgmentWidth = width * 0.94;
    const centerX = width / 2;

    for (let lane = 0; lane <= CHART_LANE_COUNT; lane += 1) {
        const isStrong = lane % 4 === 0;
        const bottomX =
            centerX + (lane / CHART_LANE_COUNT - 0.5) * judgmentWidth;
        const topX =
            centerX + (lane / CHART_LANE_COUNT - 0.5) * judgmentWidth * 0.58;
        graphics
            .moveTo(topX, horizonY)
            .bezierCurveTo(
                topX,
                horizonY + (judgmentY - horizonY) * 0.42,
                bottomX,
                horizonY + (judgmentY - horizonY) * 0.72,
                bottomX,
                judgmentY
            )
            .stroke({
                color: isStrong ? colors.guideStrong : colors.guideWeak,
                width: isStrong ? 0.9 : 0.45,
                alpha: isStrong ? 0.32 : 0.22,
            });
    }

    for (const progress of [0.18, 0.38, 0.6, 0.8]) {
        const depth = Math.pow(progress, 1.62);
        const horizontalDepth = Math.pow(progress, 0.92);
        const visibleWidth = judgmentWidth * (0.58 + horizontalDepth * 0.42);
        const y = horizonY + (judgmentY - horizonY) * depth;
        graphics
            .moveTo(centerX - visibleWidth / 2, y)
            .lineTo(centerX + visibleWidth / 2, y)
            .stroke({
                color: colors.guideStrong,
                width: 0.7,
                alpha: 0.24,
            });
    }
}

function drawPiano(
    graphics: Graphics,
    width: number,
    height: number,
    judgmentY: number,
    currentTimeMs: number,
    notes: PreparedPlaybackNote[]
) {
    const left = width * 0.03;
    const right = width * 0.97;
    const pianoTop = judgmentY + 5;
    const pianoBottom = height;
    const laneWidth = (right - left) / CHART_LANE_COUNT;
    const activeLanes = new Set<number>();

    for (const note of notes) {
        if (Math.abs(note.startTimeMs - currentTimeMs) > 95) continue;
        const point = note.pathPoints[0];
        if (!point) continue;
        for (
            let lane = Math.floor(point.lane);
            lane < Math.ceil(point.lane + point.width);
            lane += 1
        ) {
            activeLanes.add(lane);
        }
    }

    graphics
        .rect(left, pianoTop, right - left, pianoBottom - pianoTop)
        .fill({ color: 0xbfc2c4, alpha: 0.92 });
    for (let lane = 0; lane < CHART_LANE_COUNT; lane += 1) {
        const x = left + lane * laneWidth;
        graphics
            .rect(x, pianoTop, laneWidth, pianoBottom - pianoTop)
            .fill({
                color: activeLanes.has(lane)
                    ? colors.pianoPressed
                    : lane % 2 === 0
                      ? colors.pianoWhite
                      : colors.pianoWhiteAlt,
                alpha: activeLanes.has(lane) ? 0.82 : 0.96,
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
            .fill({ color: colors.pianoBlack, alpha: 0.98 });
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
}: {
    graphics: Graphics;
    note: PreparedPlaybackNote;
    currentTimeMs: number;
    approachDurationMs: number;
    width: number;
    horizonY: number;
    judgmentY: number;
}) {
    const visibleEnd = currentTimeMs + approachDurationMs;
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
            point.timeMs - currentTimeMs
        );
        drawPlaybackCap(graphics, projected, point.hand, alpha);
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
                project(first),
                project(second),
                note.hand,
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
                point.timeMs - currentTimeMs
            );
            drawPlaybackCap(graphics, projected, point.hand, 0.98);
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
            project(clipped.first),
            project(clipped.second),
            clipped.first.hand,
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
            point.timeMs - currentTimeMs
        );
        drawPlaybackCap(
            graphics,
            projected,
            point.hand,
            0.98,
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
}: {
    graphics: Graphics;
    notes: PreparedPlaybackNote[];
    currentTimeMs: number;
    approachDurationMs: number;
    width: number;
    height: number;
}) {
    const horizonY = Math.max(22, height * 0.055);
    const judgmentY = height * 0.79;
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
        });
    }

    drawPiano(graphics, width, height, judgmentY, currentTimeMs, notes);
    drawJudgmentLine(graphics, width, judgmentY);
}

export default function FallingChartViewer({
    document,
    jacketUrl,
}: FallingChartViewerProps) {
    const hostRef = useRef<HTMLDivElement | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const objectUrlRef = useRef<string | null>(null);
    const isPlayingRef = useRef(false);
    const currentTimeRef = useRef(0);
    const durationRef = useRef(getChartPlaybackDurationMs(document));
    const noteSpeedRef = useRef(2);
    const clockAnchorRef = useRef<PlaybackClockAnchor | null>(null);
    const lastUiUpdateRef = useRef(0);
    const [currentTimeMs, setCurrentTimeMs] = useState(0);
    const [audioDurationMs, setAudioDurationMs] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [noteSpeed, setNoteSpeed] = useState(2);
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
        },
        []
    );

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
        const audio = audioRef.current;
        if (audio && fileName) {
            audio.currentTime = Math.min(
                currentTimeRef.current / 1_000,
                Number.isFinite(audio.duration) ? audio.duration : Infinity
            );
            try {
                await audio.play();
            } catch {
                setAudioError("브라우저에서 이 음원을 재생할 수 없습니다.");
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
        <section className="border-border bg-surface overflow-hidden rounded-lg border">
            <div className="relative h-[min(68dvh,680px)] min-h-[440px] w-full overflow-hidden sm:min-h-[520px]">
                {jacketUrl ? (
                    <div
                        aria-hidden
                        className="absolute -inset-5 scale-110 bg-cover bg-center opacity-25 blur-xl"
                        style={{ backgroundImage: `url("${jacketUrl}")` }}
                    />
                ) : null}
                <div
                    aria-hidden
                    className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(70,74,96,0.22),rgba(5,7,12,0.96)_72%)]"
                />
                <div
                    ref={hostRef}
                    role="img"
                    aria-label={`28칸 낙하형 채보. 현재 ${formatEditorTime(currentTimeMs)}`}
                    className="absolute inset-0"
                />
            </div>

            <div className="border-divider bg-surface relative border-t p-3">
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() =>
                            isPlaying ? pausePlayback() : void startPlayback()
                        }
                        className="bg-text-primary text-bg flex size-10 shrink-0 items-center justify-center rounded-full"
                        aria-label={isPlaying ? "일시정지" : "재생"}
                    >
                        {isPlaying ? (
                            <Pause className="size-4" fill="currentColor" />
                        ) : (
                            <Play
                                className="ml-0.5 size-4"
                                fill="currentColor"
                            />
                        )}
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            pausePlayback();
                            seek(0);
                        }}
                        className="border-border hover:bg-surface-muted flex size-9 shrink-0 items-center justify-center rounded-md border"
                        aria-label="처음으로 이동"
                    >
                        <RotateCcw className="size-3.5" />
                    </button>
                    <span className="text-caption w-14 shrink-0 text-right font-mono tabular-nums">
                        {formatEditorTime(currentTimeMs)}
                    </span>
                    <input
                        type="range"
                        min="0"
                        max={Math.max(1, durationMs)}
                        step="10"
                        value={Math.min(currentTimeMs, durationMs)}
                        onChange={(event) => seek(Number(event.target.value))}
                        aria-label="채보 재생 위치"
                        className="accent-primary min-w-0 flex-1"
                    />
                    <span className="text-caption w-14 shrink-0 font-mono tabular-nums">
                        {formatEditorTime(durationMs)}
                    </span>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                    <label className="border-border hover:bg-surface-muted flex h-9 cursor-pointer items-center gap-1.5 rounded-md border px-3 text-xs font-semibold">
                        <Upload className="size-3.5" />
                        로컬 음원
                        <input
                            type="file"
                            accept="audio/mpeg,audio/ogg,audio/wav,audio/flac,audio/mp4"
                            onChange={loadAudio}
                            className="sr-only"
                        />
                    </label>
                    <label className="border-border flex h-9 items-center gap-2 rounded-md border px-3 text-xs">
                        <Gauge className="text-text-secondary size-3.5" />
                        <span className="text-text-secondary">노트 속도</span>
                        <select
                            value={noteSpeed}
                            onChange={(event) =>
                                setNoteSpeed(Number(event.target.value))
                            }
                            className="bg-transparent font-semibold outline-none"
                            aria-label="노트 속도"
                        >
                            {Array.from({ length: 21 }, (_, index) => {
                                const value = 1 + index * 0.1;
                                return (
                                    <option
                                        key={value.toFixed(1)}
                                        value={value}
                                        className="bg-surface"
                                    >
                                        {value.toFixed(1)}
                                    </option>
                                );
                            })}
                        </select>
                    </label>
                    <p className="text-micro min-w-0 flex-1 truncate sm:text-right">
                        {fileName ??
                            "음원 없이도 재생할 수 있습니다. 음원은 업로드되지 않습니다."}
                    </p>
                </div>
                {audioError ? (
                    <p className="text-danger mt-2 text-xs">{audioError}</p>
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

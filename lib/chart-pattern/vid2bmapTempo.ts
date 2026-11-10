import { CHART_TICKS_PER_QUARTER } from "./schema";
import type { ChartNote, ChartTimingPoint } from "./schema";
import {
    activeTimingPoint,
    beatTicksOf,
    sortTimingPoints,
    tickToMilliseconds,
} from "./timing";
import { convertVid2bmap, vid2bmapTickAt } from "./vid2bmapConvert";
import type { Vid2bmapOptions, Vid2bmapRawNote } from "./vid2bmapConvert";
import { diffChartNotes } from "./vid2bmapDiff";
import type { Vid2bmapResult } from "./vid2bmapFile";
import { beatFrameTimes, matchBeatFrames } from "./vid2bmapFile";
import { mean, median } from "./vid2bmapShared";

/** 박자선 간격 중앙값으로 본 곡 BPM(첫 타이밍 포인트 박자표 기준). fps 를 모르면 null */
export function estimateVid2bmapBpm(
    result: Vid2bmapResult,
    timingPoints: ChartTimingPoint[]
) {
    if (!result.fps || result.barRows.length < 3) return null;
    const rows = result.barRows;
    const intervals = rows.slice(1).map((row, index) => row - rows[index]);
    const origin = sortTimingPoints(timingPoints)[0];
    const bpm =
        ((60 * result.fps) / median(intervals)) *
        (beatTicksOf(origin) / CHART_TICKS_PER_QUARTER);
    return Math.round(bpm * 10) / 10;
}

/**
 * 초안에 노트가 있으면 첫 박자선을 초안과 가장 많이 맞는 곳으로 — 기본값에서 앞뒤 range 박을 시험해
 * 「같음 + 달라짐」(같은 틱 · 칸 겹침) 이 가장 많은 위치. 초안이 비었거나 하나도 안 맞으면 null
 */
export function alignVid2bmapFirstBarTick(
    result: Vid2bmapResult,
    notes: Vid2bmapRawNote[],
    options: Omit<Vid2bmapOptions, "firstBarTick" | "createId">,
    currentNotes: ChartNote[],
    startTick: number,
    range = 32
) {
    if (currentNotes.length === 0) return null;
    const sorted = sortTimingPoints(options.timingPoints);
    let best: { tick: number; matches: number } | null = null;
    for (let step = -range; step <= range; step += 1) {
        const tick = vid2bmapTickAt(step, startTick, sorted);
        let serial = 0;
        const { notes: converted } = convertVid2bmap(result, notes, {
            ...options,
            firstBarTick: tick,
            createId: () => `a${serial++}`,
        });
        const diff = diffChartNotes(currentNotes, converted);
        const matches = diff.same.length + diff.changed.length;
        if (!best || matches > best.matches) best = { tick, matches };
    }
    return best && best.matches > 0 ? best : null;
}

export interface Vid2bmapTempoPoint {
    tick: number;
    bpm: number;
}

/** 제안 카드 하나 — 템포가 바뀐 곳은 포인트 하나, 영상이 박마다 바뀌는 곳은 여럿을 한 카드로(2026-09-25 B) */
export interface Vid2bmapTempoChange {
    /** 첫 타이밍 포인트 자리 — 카드를 켜고 끄는 기준 */
    tick: number;
    /** 넣을 타이밍 포인트(차례대로) */
    points: Vid2bmapTempoPoint[];
    /** 마지막 포인트의 BPM */
    bpm: number;
    /** 구간 측정값(소수 둘째 자리) — 템포가 한 번 바뀐 곳만 */
    measuredBpm: number;
    /** 템포가 한 번 바뀐 곳이면 그 구간 박 수, 박 단위 묶음이면 박 단위로 맞춘 박 수 */
    beats: number;
    /** 이 자리 바로 앞의 BPM(타이밍 포인트 또는 앞 제안) */
    fromBpm: number;
    /** 정수가 아닌 값이면 정수로 뒀을 때 구간 안 가장 큰 어긋남(프레임) */
    integerDriftFrames: number;
    /** 박 단위로 맞춘 박들의 영상 간격(프레임, 0.5 단위) — 템포가 한 번 바뀐 곳이면 빈 배열 */
    beatFrames: number[];
}

export interface Vid2bmapTempo {
    changes: Vid2bmapTempoChange[];
    /**
     * 첫 구간(첫 템포 변화 전까지 전체) 측정 BPM 이 시작 타이밍과 다르면 — bpm 은 0.5 단위 제안값(2026-09-24 A:
     * 가져오기 창의 템포 제안 카드로 「시작 타이밍을 BPM ○ 로」, 초안이 비었으면 기본 켬)
     */
    startMismatch: {
        measuredBpm: number;
        chartBpm: number;
        bpm: number;
        beats: number;
        integerDriftFrames: number;
    } | null;
}

/** 박자선이 영상 흔들림보다 이만큼(프레임) 더 어긋나면 그 BPM 은 틀린 것으로 본다 */
const BPM_DRIFT_MARGIN_FRAMES = 0.5;
/** 시험할 BPM 자릿수 — 단순한 값부터 */
const BPM_STEPS = [1, 0.5, 0.1, 0.01];
/**
 * 박 위치가 한꺼번에 밀린 곳(계단) — 앞뒤 4박 평균이 1.5프레임 넘게 차이 나면 그 앞뒤를 따로 맞춘다(기울기는 함께).
 * 녹화 프레임 누락 · 구간 끝에서 템포가 막 바뀌기 시작한 박 같은 것. 정수 프레임 반올림 흔들림은 1프레임 안이라 걸리지 않는다
 */
const BPM_STEP_FRAMES = 1.5;
const BPM_STEP_WINDOW = 4;
/**
 * 직선 맞춤 · 계단 찾기를 할 만큼 긴 구간(박). 짧은 구간은 계단과 템포 변화를 구분할 수 없고 리타르단도처럼 고르지 않기도 해
 * 처음~끝 평균으로 잰다 — 다음 구간이 영상과 같은 시각에 시작하게(海神 느린 10박: 직선 108 이면 뒤가 140ms 늦고, 평균 110.8)
 */
const BPM_FIT_MIN_BEATS = 32;
const BPM_STEP_MAX = 4;

type BeatPiece = [start: number, end: number];

/** 조각마다 따로 평행 이동한 직선들의 공통 기울기(박 하나의 프레임 수) */
function sharedSlope(positions: number[], pieces: BeatPiece[]): number {
    let covariance = 0;
    let variance = 0;
    for (const [start, end] of pieces) {
        const meanX = (start + end - 1) / 2;
        const meanY = mean(positions.slice(start, end));
        for (let index = start; index < end; index += 1) {
            covariance += (index - meanX) * (positions[index] - meanY);
            variance += (index - meanX) ** 2;
        }
    }
    return variance > 0 ? covariance / variance : positions[1] - positions[0];
}

/** 박 하나가 period 프레임일 때 조각마다 가장 잘 맞춘 박 위치와의 차이 */
function beatResiduals(
    positions: number[],
    pieces: BeatPiece[],
    period: number
): number[] {
    const residuals = positions.map((value, index) => value - period * index);
    for (const [start, end] of pieces) {
        const offset = mean(residuals.slice(start, end));
        for (let index = start; index < end; index += 1)
            residuals[index] -= offset;
    }
    return residuals;
}

function beatPieces(positions: number[]): BeatPiece[] {
    const cuts: number[] = [];
    const piecesOf = (): BeatPiece[] =>
        [0, ...cuts].map((start, index) => [
            start,
            cuts[index] ?? positions.length,
        ]);
    if (positions.length < BPM_FIT_MIN_BEATS) return piecesOf();
    while (cuts.length < BPM_STEP_MAX) {
        const pieces = piecesOf();
        const residuals = beatResiduals(
            positions,
            pieces,
            sharedSlope(positions, pieces)
        );
        let best: { jump: number; at: number } | null = null;
        for (const [start, end] of pieces) {
            for (let at = start + 2; at < end - 1; at += 1) {
                const jump = Math.abs(
                    mean(
                        residuals.slice(at, Math.min(end, at + BPM_STEP_WINDOW))
                    ) -
                        mean(
                            residuals.slice(
                                Math.max(start, at - BPM_STEP_WINDOW),
                                at
                            )
                        )
                );
                if (jump >= BPM_STEP_FRAMES && (!best || jump > best.jump))
                    best = { jump, at };
            }
        }
        if (!best) break;
        cuts.push(best.at);
        cuts.sort((left, right) => left - right);
    }
    return piecesOf();
}

export interface Vid2bmapBpmChoice {
    /** 제안 값 — 정수 → 0.5 → 0.1 → 0.01 중 구간 끝까지 맞는 첫 값 */
    bpm: number;
    /** 구간 전체 직선 맞춤 측정값(소수 둘째 자리) */
    measuredBpm: number;
    /** 영상 자체의 흔들림(직선에서 가장 먼 박, 프레임) */
    noiseFrames: number;
    /** 정수로 뒀을 때 구간 안 가장 큰 어긋남(프레임) — 정수가 아닌 값을 고른 이유 */
    integerDriftFrames: number;
    /** 이 BPM 으로 계산한 박이 구간 안에서 가장 크게 어긋나는 프레임 */
    driftAt: (bpm: number) => number;
}

/**
 * 영상으로 잰 BPM → 제안 값(2026-09-25 B′, 사용자). 박마다 걸린 프레임 위치(positions, 박마다 하나)를 구간 전체로 직선에 맞춰 재고
 * (60fps 로도 0.01~0.02 BPM 정밀도 — Altale 89.983 · アルストロメリア 143.994 · GAIA 179.986),
 * 정수 → 0.5 → 0.1 → 0.01 순으로 그 값의 박 위치가 구간 끝까지 영상 흔들림 + 0.5프레임 안에 드는 첫 값을 고른다.
 * 222.22 곡은 300박이면 222.2(정수 222 는 끝에서 3.8프레임 어긋남), 짧은 구간이면 그 안에서 구분되지 않아 222.
 * 박 위치가 한꺼번에 밀린 계단은 앞뒤를 따로 맞춘다 — 海神 시작 구간은 70박째에서 3프레임 밀려 통째로 재면 159.84, 나눠 재면 160.01.
 * framesToBpm: 박 하나의 프레임 수 → BPM(박자표 분모 반영)
 */
export function chooseVid2bmapBpm(
    positions: number[],
    framesToBpm: (framesPerBeat: number) => number
): Vid2bmapBpmChoice {
    const pieces = beatPieces(positions);
    const slope =
        positions.length < BPM_FIT_MIN_BEATS
            ? (positions[positions.length - 1] - positions[0]) /
              (positions.length - 1)
            : sharedSlope(positions, pieces);
    const largest = (values: number[]) =>
        Math.max(...values.map((value) => Math.abs(value)));
    const noiseFrames = largest(beatResiduals(positions, pieces, slope));
    const measured = framesToBpm(slope);
    // BPM = K ÷ 박 하나의 프레임 수
    const scale = framesToBpm(1);
    const driftAt = (bpm: number) =>
        largest(beatResiduals(positions, pieces, scale / bpm));
    const limit = noiseFrames + BPM_DRIFT_MARGIN_FRAMES;
    const bpm =
        BPM_STEPS.map(
            (step) => Math.round(Math.round(measured / step) * step * 100) / 100
        ).find((candidate) => driftAt(candidate) <= limit) ??
        Math.round(measured * 100) / 100;
    return {
        bpm,
        measuredBpm: Math.round(measured * 100) / 100,
        noiseFrames,
        integerDriftFrames: driftAt(Math.round(measured)),
        driftAt,
    };
}

/** 템포가 바뀌었다고 볼 차이(비율) */
const TEMPO_TOLERANCE = 0.015;
/**
 * 박 단위로 맞출 박(2026-09-25 B) — 이어진 두 박의 합이 구간 BPM 보다 이만큼(프레임) 넘게 벗어난 곳.
 * 정수 프레임 흔들림(22 · 23 번갈아)은 두 박을 합치면 1프레임 안이라 걸리지 않는다
 */
const TEMPO_EVENT_PAIR_FRAMES = 2.5;
/** 박 단위로 맞출 때 모든 박이 영상 박자선에서 이 안(프레임, 60fps 25ms) */
const TEMPO_BEAT_TOLERANCE_FRAMES = 1.5;
/** 구간 BPM 으로 가는 박도 영상에서 이만큼(프레임, 60fps 42ms) 넘게 벌어지면 박 단위로 바로잡는다 — 정수 프레임 흔들림 1 + 박 단위 끝 1.5 */
const TEMPO_DRIFT_LIMIT_FRAMES = 2.5;
/** 박 단위 구간을 끝낼 BPM 은 뒤따르는 이만큼의 박까지 보고 고른다 */
const TEMPO_SETTLE_BEATS = 16;
/** 한 번에 보는 박 수 — 이만큼 이어져야 바뀐 것으로 본다 */
const TEMPO_WINDOW = 8;

/**
 * 템포 변화 → 타이밍 포인트 제안(2026-09-23 T2).
 * vid2bmap 보정 전 실제 프레임(beat_frames)으로 박 간격을 잰다 — 보정된 박자선(chart_bar)은 ±10% 흔들린다.
 * 놓친 박자선(간격 ≈ 2박)은 둘로 나누고, 8박 중앙값이 1.5% 넘게 바뀐 곳을 경계로(Altale: 2~62마디 90.00 · 63마디부터 83.06).
 * 첫 박자선은 beat_frames 의 격자 줄에서 판정선 줄까지 줄 수만큼(한 줄 = 한 프레임) 뒤의 박자선과 짝짓는다.
 */
/**
 * 박마다 걸린 원본 프레임 수(2026-09-25) — 박은 노트 배치와 같은 AI 박자선(barRows, 읽을 때 빈 곳을 메움)으로 세고,
 * 시각은 그 선마다 짝지은 원본 프레임 박자선(beat_frames, 프레임 빠짐 보정 전)으로. 짝이 없는 선은 앞뒤 짝의 차이로 채운다.
 * firstIndex · 끝 = 원본 프레임 박자선이 덮는 처음 · 마지막 박자선
 */
function readBeatTrack(result: Vid2bmapResult) {
    const fps = result.fps;
    const rows = result.barRows;
    if (!result.beatFrames || !fps || rows.length < 2) return null;
    const matched = matchBeatFrames(rows, result.beatFrames);
    const times = beatFrameTimes(rows, matched);
    const known = matched
        .map((frame, index) => (frame === null ? null : index))
        .filter((index): index is number => index !== null);
    if (!times || known.length < 2) return null;
    const firstIndex = known[0];
    const lastIndex = known[known.length - 1];
    const durations = times
        .slice(firstIndex + 1, lastIndex + 1)
        .map((time, index) => time - times[firstIndex + index]);
    if (durations.length < TEMPO_WINDOW * 2) return null;
    return { fps, durations, firstIndex };
}

/**
 * 지금 타이밍이 영상 박자선과 얼마나 어긋나는지(2026-09-25 B) — 박마다 (타이밍으로 계산한 시각 − 영상 시각)에서
 * 평균(음원 오프셋 몫)을 빼고 가장 큰 값. 템포 제안과 같은 한도(2.5프레임) 안이면 영상과 맞는 것으로 본다
 */
export function vid2bmapTimingDrift(
    result: Vid2bmapResult,
    firstBarTick: number,
    timingPoints: ChartTimingPoint[]
): { maxMs: number; onVideo: boolean } | null {
    const track = readBeatTrack(result);
    if (!track) return null;
    const sorted = sortTimingPoints(timingPoints);
    let position = 0;
    const errors = [0, ...track.durations].map((duration, beat) => {
        position += duration;
        const tick = vid2bmapTickAt(
            track.firstIndex + beat,
            firstBarTick,
            sorted
        );
        return (
            tickToMilliseconds(tick, sorted, CHART_TICKS_PER_QUARTER) -
            (position / track.fps) * 1000
        );
    });
    const offset = mean(errors);
    const maxMs = Math.max(...errors.map((error) => Math.abs(error - offset)));
    return {
        maxMs: Math.round(maxMs),
        onVideo: maxMs <= (TEMPO_DRIFT_LIMIT_FRAMES / track.fps) * 1000,
    };
}

export function detectVid2bmapTempoChanges(
    result: Vid2bmapResult,
    firstBarTick: number,
    timingPoints: ChartTimingPoint[]
): Vid2bmapTempo | null {
    const track = readBeatTrack(result);
    if (!track) return null;
    const { fps, durations, firstIndex } = track;

    // 박 간격은 정수 프레임이라 83 BPM(43.37프레임)이면 43 · 44 가 번갈아 나온다 — 중앙값은 한쪽으로 쏠려
    // 양 끝 하나씩 뺀 평균으로 본다
    const trimmedMean = (values: number[]) => {
        if (values.length <= 2) {
            return (
                values.reduce((sum, value) => sum + value, 0) /
                Math.max(1, values.length)
            );
        }
        const sortedValues = [...values].sort((a, b) => a - b).slice(1, -1);
        return (
            sortedValues.reduce((sum, value) => sum + value, 0) /
            sortedValues.length
        );
    };
    const windowMedian = (start: number) =>
        trimmedMean(durations.slice(start, start + TEMPO_WINDOW));
    const segments: { start: number; frames: number }[] = [
        { start: 0, frames: trimmedMean(durations.slice(0, TEMPO_WINDOW * 2)) },
    ];
    for (let beat = 1; beat + TEMPO_WINDOW <= durations.length; beat += 1) {
        const current = segments[segments.length - 1];
        const moved =
            Math.abs(windowMedian(beat) - current.frames) / current.frames >
            TEMPO_TOLERANCE;
        const settled =
            beat + TEMPO_WINDOW + 4 > durations.length ||
            Math.abs(windowMedian(beat + 4) - current.frames) / current.frames >
                TEMPO_TOLERANCE;
        if (!moved || !settled) continue;
        // 바뀐 박을 정확히 — 앞은 지금 템포, 뒤는 새 템포에 가장 잘 맞게 나누는 곳
        const next = trimmedMean(
            durations.slice(beat + 4, beat + 4 + TEMPO_WINDOW * 2)
        );
        let split = beat;
        let bestCost = Number.POSITIVE_INFINITY;
        for (
            let candidate = Math.max(current.start + 1, beat - TEMPO_WINDOW);
            candidate <= beat + TEMPO_WINDOW && candidate < durations.length;
            candidate += 1
        ) {
            let cost = 0;
            for (
                let index = beat - TEMPO_WINDOW;
                index < beat + TEMPO_WINDOW * 2;
                index += 1
            ) {
                if (index < 0 || index >= durations.length) continue;
                cost += Math.abs(
                    durations[index] -
                        (index < candidate ? current.frames : next)
                );
            }
            if (cost < bestCost) {
                bestCost = cost;
                split = candidate;
            }
        }
        segments.push({
            start: split,
            frames: trimmedMean(
                durations.slice(split, split + TEMPO_WINDOW * 2)
            ),
        });
        beat = split + TEMPO_WINDOW;
    }
    // 구간 값은 구간 전체로 다시 재고, 8박보다 짧거나 앞 구간과 사실상 같은 템포면 합친다
    const measure = (start: number, end: number) =>
        trimmedMean(durations.slice(start, end));
    let merged = true;
    while (merged && segments.length > 1) {
        merged = false;
        for (let index = 0; index < segments.length; index += 1) {
            const end = segments[index + 1]?.start ?? durations.length;
            segments[index].frames = measure(segments[index].start, end);
        }
        for (let index = 1; index < segments.length; index += 1) {
            const end = segments[index + 1]?.start ?? durations.length;
            const previous = segments[index - 1];
            const current = segments[index];
            if (
                end - current.start < TEMPO_WINDOW ||
                Math.abs(current.frames - previous.frames) / previous.frames <=
                    TEMPO_TOLERANCE
            ) {
                segments.splice(index, 1);
                merged = true;
                break;
            }
        }
    }

    // 구간이 하나여도 구간 전체로 — 처음 16박만 재면 흔들림이 남는다(アルストロメリア: 144.83 → 전체 144.0)
    segments.forEach((segment, index) => {
        segment.frames = measure(
            segment.start,
            segments[index + 1]?.start ?? durations.length
        );
    });

    const sorted = sortTimingPoints(timingPoints);
    const toBpm = (frameCount: number, point: ChartTimingPoint) =>
        ((60 * fps) / frameCount) *
        (beatTicksOf(point) / CHART_TICKS_PER_QUARTER);
    const origin = sorted[0];
    // 박마다 걸린 프레임을 이어 붙인 박 위치 — 구간마다 직선으로 맞춰 BPM 을 고른다(B′)
    const positions = [0];
    for (const duration of durations) {
        positions.push(positions[positions.length - 1] + duration);
    }
    const positionsOf = (index: number) =>
        positions.slice(
            segments[index].start,
            (segments[index + 1]?.start ?? durations.length) + 1
        );
    const first = chooseVid2bmapBpm(positionsOf(0), (frameCount) =>
        toBpm(frameCount, origin)
    );
    // 지금 시작 BPM 으로 구간 끝까지 영상과 맞으면 제안하지 않는다(사람이 넣은 222.22 를 222.2 로 바꾸지 않게)
    const startMismatch =
        first.driftAt(origin.bpm) > first.noiseFrames + BPM_DRIFT_MARGIN_FRAMES
            ? {
                  measuredBpm: first.measuredBpm,
                  chartBpm: origin.bpm,
                  bpm: first.bpm,
                  beats: segments[1]?.start ?? durations.length,
                  integerDriftFrames: first.integerDriftFrames,
              }
            : null;

    // 박마다 쓸 BPM(2026-09-25 B) — 꾸준한 곳은 구간 BPM(B′) 하나, 영상이 그 BPM 에서 벗어난 박만
    // 영상 박자선에서 1.5프레임 안에 드는 가장 긴 정수 BPM 으로 이어 붙이고 끝나면 구간 BPM 으로 돌아온다
    const beatCount = durations.length;
    const ticks = Array.from({ length: beatCount }, (_, beat) =>
        Math.round(vid2bmapTickAt(firstIndex + beat, firstBarTick, sorted))
    );
    const scaleAt = (beat: number) =>
        toBpm(1, activeTimingPoint(sorted, ticks[beat]));
    const segmentOf = (beat: number) =>
        segments.findLastIndex((segment) => segment.start <= beat);
    const startBpm = startMismatch?.bpm ?? origin.bpm;
    const choices = segments.map((_, index) =>
        index === 0
            ? first
            : chooseVid2bmapBpm(positionsOf(index), (frameCount) =>
                  toBpm(
                      frameCount,
                      activeTimingPoint(sorted, ticks[segments[index].start])
                  )
              )
    );
    const segmentBpm = segments.map((segment, index) => {
        if (index === 0) return startBpm;
        // 이미 그 자리에 타이밍 포인트가 있으면 그 값을 따른다
        const existing = sorted.find(
            (point) => point.tick === ticks[segment.start]
        );
        return existing ? existing.bpm : choices[index].bpm;
    });
    const periodAt = (beat: number) =>
        scaleAt(beat) / segmentBpm[segmentOf(beat)];
    // 짧은 구간(리타르단도 등)은 통째로, 꾸준한 구간은 벗어난 박만 박 단위로
    const event = durations.map((_, beat) => {
        const index = segmentOf(beat);
        const end = segments[index + 1]?.start ?? beatCount;
        return end - segments[index].start < BPM_FIT_MIN_BEATS;
    });
    for (let beat = 0; beat + 1 < beatCount; beat += 1) {
        const pair =
            durations[beat] +
            durations[beat + 1] -
            periodAt(beat) -
            periodAt(beat + 1);
        if (Math.abs(pair) >= TEMPO_EVENT_PAIR_FRAMES) {
            event[beat] = true;
            event[beat + 1] = true;
        }
    }
    const beatBpm: number[] = [];
    let model = positions[0];
    for (let beat = 0; beat < beatCount;) {
        // 첫 타이밍 자리까지의 박은 시작 BPM 그대로(그 앞엔 포인트를 둘 수 없다)
        if (ticks[beat] <= origin.tick) {
            event[beat] = false;
            beatBpm.push(startBpm);
            model += scaleAt(beat) / startBpm;
            beat += 1;
            continue;
        }
        if (!event[beat]) {
            const bpm = segmentBpm[segmentOf(beat)];
            const next = model + scaleAt(beat) / bpm;
            // 두 박씩 봐선 안 걸리는 완만한 흐름도 영상에서 2.5프레임 넘게 벌어지면 이 박부터 바로잡는다
            if (
                Math.abs(next - positions[beat + 1]) <= TEMPO_DRIFT_LIMIT_FRAMES
            ) {
                beatBpm.push(bpm);
                model = next;
                beat += 1;
                continue;
            }
            event[beat] = true;
        }
        const start = beat;
        const scale = scaleAt(start);
        // 박 하나 프레임 수가 [low, high] 면 start 뒤 박이 모두 영상 박에서 1.5프레임 안
        let low = 0;
        let high = Number.POSITIVE_INFINITY;
        let reach = start;
        let range: [number, number] | null = null;
        for (
            let next = start + 1;
            next <= beatCount && event[next - 1];
            next += 1
        ) {
            const span = next - start;
            low = Math.max(
                low,
                (positions[next] - TEMPO_BEAT_TOLERANCE_FRAMES - model) / span
            );
            high = Math.min(
                high,
                (positions[next] + TEMPO_BEAT_TOLERANCE_FRAMES - model) / span
            );
            if (high <= 0 || low > high) break;
            const slowest = Math.ceil(scale / high);
            const fastest =
                low > 0 ? Math.floor(scale / low) : Number.POSITIVE_INFINITY;
            if (slowest > fastest) break;
            reach = next;
            range = [slowest, fastest];
        }
        let bpm: number;
        if (range) {
            // 끝 박 하나(정수 프레임 ±1)가 아니라 뒤따르는 박들에 맞는 값 — 박 단위 구간이 끝날 때마다 치우침이 쌓이지 않게
            const settle = (candidate: number) => {
                let at = model + ((reach - start) * scale) / candidate;
                let worst = Math.abs(at - positions[reach]);
                for (
                    let index = reach;
                    index < Math.min(beatCount, reach + TEMPO_SETTLE_BEATS);
                    index += 1
                ) {
                    at += periodAt(index);
                    worst = Math.max(
                        worst,
                        Math.abs(at - positions[index + 1])
                    );
                }
                return worst;
            };
            bpm = range[0];
            for (
                let candidate = range[0] + 1;
                candidate <= Math.min(range[1], range[0] + 400);
                candidate += 1
            ) {
                if (settle(candidate) < settle(bpm)) bpm = candidate;
            }
        } else {
            // 정수로는 한 박도 못 맞추면 그 박만 정확히
            reach = start + 1;
            bpm = Math.round((scale / (positions[reach] - model)) * 100) / 100;
        }
        for (let index = start; index < reach; index += 1) beatBpm.push(bpm);
        model += ((reach - start) * scale) / bpm;
        beat = reach;
    }

    // BPM 이 바뀌는 박 = 타이밍 포인트. 박 단위로 맞춘 박 바로 뒤의 포인트는 같은 카드로 묶는다
    const changes: Vid2bmapTempoChange[] = [];
    let previousBpm = startBpm;
    for (let beat = 0; beat < beatCount; beat += 1) {
        const bpm = beatBpm[beat];
        const fromBpm = previousBpm;
        previousBpm = bpm;
        if (bpm === fromBpm) continue;
        const tick = ticks[beat];
        // 첫 타이밍 앞이거나 이미 그 자리에 타이밍 포인트가 있으면 넣지 않는다
        if (tick <= origin.tick || sorted.some((point) => point.tick === tick))
            continue;
        const index = segmentOf(beat);
        const segmentStart = segments[index].start === beat && index > 0;
        const group = changes.at(-1);
        if (group && beat > 0 && event[beat - 1]) {
            group.points.push({ tick, bpm });
            group.bpm = bpm;
            continue;
        }
        const beatFrames: number[] = [];
        for (let index = beat; index < beatCount && event[index]; index += 1)
            beatFrames.push(Math.round(durations[index] * 2) / 2);
        changes.push({
            tick,
            points: [{ tick, bpm }],
            bpm,
            measuredBpm: segmentStart ? choices[index].measuredBpm : bpm,
            beats:
                beatFrames.length > 0
                    ? beatFrames.length
                    : (segments[index + 1]?.start ?? beatCount) - beat,
            fromBpm,
            integerDriftFrames: segmentStart
                ? choices[index].integerDriftFrames
                : 0,
            beatFrames,
        });
    }
    return { changes, startMismatch };
}

/**
 * 시작 타이밍의 BPM · 박자 · 시각을 바꾼다 — 에디터에서 그 칸을 고치는 것과 같다(뒤 포인트의 박 위치는 그대로).
 * 박자는 x/4 로(영상 추정은 3/4 · 4/4 만). 시각을 바꾸면 음원 오프셋을 옮기는 것이라 모든 포인트의 시각을 같은 만큼 옮긴다(2026-09-25)
 */
export function applyVid2bmapStartTiming(
    timingPoints: ChartTimingPoint[],
    changes: {
        bpm?: number | null;
        numerator?: number | null;
        timeMs?: number | null;
    }
) {
    const origin = sortTimingPoints(timingPoints)[0];
    const shift = changes.timeMs == null ? 0 : changes.timeMs - origin.timeMs;
    return timingPoints.map((point) => {
        const moved =
            shift === 0
                ? point
                : {
                      ...point,
                      timeMs: Math.round((point.timeMs + shift) * 1000) / 1000,
                  };
        return point.id === origin.id
            ? {
                  ...moved,
                  ...(changes.bpm == null ? {} : { bpm: changes.bpm }),
                  ...(changes.numerator == null
                      ? {}
                      : {
                            numerator: changes.numerator,
                            denominator: 4 as const,
                        }),
              }
            : moved;
    });
}

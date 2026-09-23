/**
 * vid2bmap(김영훈 · 최성희, KAIST · MIT) 추출 결과 → NosLog 채보 노트.
 *
 * 영상 시각은 쓰지 않는다 — vid2bmap 의 프레임 드롭 보정이 시간축을 구간마다 늘였다 줄이기 때문(Altale 실측 ±0.3초).
 * 노트와 박자선은 같은 띠 위에서 함께 흔들리므로 「앞뒤 박자선 사이 어디쯤인가」 로 박 위치를 계산한다.
 * 게임은 박마다 선을 그린다(Altale: BPM 90 · 40프레임 간격 = 1박). 첫 박자선이 곡의 몇 번째 틱인지는 사람이 정한다.
 * Altale Real 앞부분 232개로 박 위치 · 칸 · 폭 · 종류가 모두 일치함을 확인(2026-09-23).
 */
import { CHART_LANE_COUNT, CHART_TICKS_PER_QUARTER } from "./schema";
import type { ChartNote, ChartNoteType, ChartTimingPoint } from "./schema";
import { sortTimingPoints } from "./timing";
import type { Vid2bmapResult } from "./vid2bmapFile";

/** 같은 칸 · 같은 종류가 이 프레임 이내로 겹치면 한 노트를 두 번 읽은 것 */
export const VID2BMAP_DUPLICATE_FRAMES = 3;
/** 한 박을 나누는 격자 후보 */
export const VID2BMAP_SNAP_DIVISORS = [2, 3, 4, 6, 8, 12, 16] as const;
/** 손 추정이 불확실한 가운데 구간(노트 가운데 칸 기준) */
const HAND_UNCERTAIN_MIN = 12;
const HAND_UNCERTAIN_MAX = 16;

export type Vid2bmapKind = "standard" | "tenuto" | "trill" | "glissando";

export interface Vid2bmapRawNote {
    kind: Vid2bmapKind;
    y: number;
    endY: number | null;
    lane: number;
    width: number;
}

export interface Vid2bmapCounts {
    standard: number;
    tenuto: number;
    trill: number;
    glissando: number;
    duplicates: number;
    bars: number;
}

export type Vid2bmapWarning =
    | { kind: "missingBar"; tick: number }
    | { kind: "extraBar"; tick: number }
    /** vid2bmap 은 첫 · 마지막 박자선 밖의 라벨을 스스로 지운다 — 늘 끝부분을 확인하게 한다 */
    | { kind: "endCheck"; lastBarTick: number }
    | {
          kind: "bpmMismatch";
          tick: number;
          estimatedBpm: number;
          chartBpm: number;
      }
    | { kind: "shortTenuto"; count: number }
    | { kind: "trillSplit"; count: number };

export interface Vid2bmapOptions {
    timingPoints: ChartTimingPoint[];
    /** 첫 박자선의 틱(박 단위로 옮긴다) */
    firstBarTick: number;
    /** 한 박을 몇으로 나눈 격자에 맞출지 */
    snapDivisor: number;
    include: Record<Exclude<Vid2bmapKind, "glissando">, boolean>;
    createId?: () => string;
}

export interface Vid2bmapConversion {
    notes: ChartNote[];
    /** 손을 칸 위치로 추정했는데 가운데라 확인이 필요한 노트 id */
    handUncertainIds: string[];
    warnings: Vid2bmapWarning[];
}

/** 결과 → 노트 목록(같은 노트를 두 번 읽은 것은 합침) */
export function collectVid2bmapNotes(result: Vid2bmapResult) {
    const all: Vid2bmapRawNote[] = [
        ...result.simple.map(([y, x1, x2]) => ({
            kind: "standard" as const,
            y,
            endY: null,
            lane: x1,
            width: x2 - x1 + 1,
        })),
        ...result.tenuto.map(([y1, y2, x1, x2]) => ({
            kind: "tenuto" as const,
            y: y1,
            endY: y2,
            lane: x1,
            width: x2 - x1 + 1,
        })),
        ...result.trill.map(([y1, y2, x1, x2]) => ({
            kind: "trill" as const,
            y: y1,
            endY: y2,
            lane: x1,
            width: x2 - x1 + 1,
        })),
        ...result.glissando.map(([y, x1, x2]) => ({
            kind: "glissando" as const,
            y,
            endY: null,
            lane: x1,
            width: x2 - x1 + 1,
        })),
    ].sort((a, b) => a.y - b.y || a.lane - b.lane);

    const kept: Vid2bmapRawNote[] = [];
    let duplicates = 0;
    for (const note of all) {
        const duplicate = kept.some(
            (other) =>
                other.kind === note.kind &&
                other.lane === note.lane &&
                other.width === note.width &&
                note.y - other.y <= VID2BMAP_DUPLICATE_FRAMES
        );
        if (duplicate) duplicates += 1;
        else kept.push(note);
    }
    const counts: Vid2bmapCounts = {
        standard: kept.filter((note) => note.kind === "standard").length,
        tenuto: kept.filter((note) => note.kind === "tenuto").length,
        trill: kept.filter((note) => note.kind === "trill").length,
        glissando: kept.filter((note) => note.kind === "glissando").length,
        duplicates,
        bars: result.barRows.length,
    };
    return { notes: kept, counts };
}

/** y 를 「첫 박자선부터 몇 번째 박」 으로. 박자선 밖은 가장 가까운 간격으로 늘인다 */
export function vid2bmapBeatPosition(barRows: number[], y: number) {
    if (barRows.length < 2) {
        throw new Error("박자선이 2개 이상 있어야 합니다.");
    }
    let index = 0;
    let low = 0;
    let high = barRows.length - 1;
    while (low <= high) {
        const middle = (low + high) >> 1;
        if (barRows[middle] <= y) {
            index = middle;
            low = middle + 1;
        } else high = middle - 1;
    }
    index = Math.min(Math.max(index, 0), barRows.length - 2);
    const start = barRows[index];
    const end = barRows[index + 1];
    return index + (y - start) / (end - start);
}

function activePoint(sorted: ChartTimingPoint[], tick: number) {
    let point = sorted[0];
    for (const candidate of sorted) {
        if (candidate.tick <= tick) point = candidate;
        else break;
    }
    return point;
}

const beatTicksOf = (point: ChartTimingPoint) =>
    (CHART_TICKS_PER_QUARTER * 4) / point.denominator;

/** 박 위치 → 틱. 박자선 사이 한 칸 = 그 자리 박자표의 한 박(분모 단위) */
export function vid2bmapTickAt(
    beatPosition: number,
    firstBarTick: number,
    timingPoints: ChartTimingPoint[]
) {
    const sorted = sortTimingPoints(timingPoints);
    let tick = firstBarTick;
    let remaining = beatPosition;
    while (remaining >= 1) {
        tick += beatTicksOf(activePoint(sorted, tick));
        remaining -= 1;
    }
    while (remaining < 0) {
        tick -= beatTicksOf(activePoint(sorted, tick - 1));
        remaining += 1;
    }
    return tick + remaining * beatTicksOf(activePoint(sorted, tick));
}

/** 그 자리 타이밍 포인트를 기준으로 한 박 / divisor 격자에 맞춘다 */
export function snapVid2bmapTick(
    tick: number,
    snapDivisor: number,
    timingPoints: ChartTimingPoint[]
) {
    const point = activePoint(sortTimingPoints(timingPoints), tick);
    const step = beatTicksOf(point) / snapDivisor;
    return Math.round(
        point.tick + Math.round((tick - point.tick) / step) * step
    );
}

/**
 * 격자 추천 — 오차 틱 수는 격자가 촘촘할수록 무조건 작아지므로, 「격자 한 칸 대비 평균 어긋남(0~0.5)」 이 가장 작은 격자.
 * Altale 곡 전체: 1/4 0.12 · 1/6 0.10 · 1/8 0.12 · 1/12 0.13 → 1/6(정답 비교에서도 1/6 만 전부 맞음)
 */
export function suggestVid2bmapSnap(
    barRows: number[],
    notes: Vid2bmapRawNote[]
) {
    const fractions = notes
        .filter((note) => note.kind !== "glissando")
        .map((note) => {
            const position = vid2bmapBeatPosition(barRows, note.y);
            return position - Math.floor(position);
        });
    const candidates = VID2BMAP_SNAP_DIVISORS.map((divisor) => {
        const offsets = fractions.map((fraction) => {
            const scaled = fraction * divisor;
            return Math.abs(scaled - Math.round(scaled));
        });
        const drift =
            offsets.length === 0
                ? 0
                : offsets.reduce((sum, value) => sum + value, 0) /
                  offsets.length;
        return { divisor, drift };
    });
    const best = candidates.reduce((a, b) => (b.drift < a.drift ? b : a));
    return { divisor: best.divisor, candidates };
}

/** 첫 박자선 기본값 — 첫 노트가 첫 타이밍 포인트 뒤 첫 박 안에 오도록(관리자가 박 단위로 옮겨 맞춘다) */
export function defaultVid2bmapFirstBarTick(
    barRows: number[],
    notes: Vid2bmapRawNote[],
    timingPoints: ChartTimingPoint[]
) {
    const first = notes[0];
    const origin = sortTimingPoints(timingPoints)[0];
    if (!first) return origin.tick;
    const beats = Math.floor(vid2bmapBeatPosition(barRows, first.y));
    return origin.tick - beats * beatTicksOf(origin);
}

function median(values: number[]) {
    const sorted = [...values].sort((a, b) => a - b);
    return sorted[Math.floor(sorted.length / 2)];
}

function barWarnings(
    result: Vid2bmapResult,
    options: Vid2bmapOptions
): Vid2bmapWarning[] {
    const warnings: Vid2bmapWarning[] = [];
    const rows = result.barRows;
    const sorted = sortTimingPoints(options.timingPoints);
    const intervals = rows.slice(1).map((row, index) => row - rows[index]);
    let lastBpmWarning: number | null = null;
    intervals.forEach((interval, index) => {
        const window = intervals.slice(Math.max(0, index - 4), index + 5);
        const local = median(window);
        const tick = vid2bmapTickAt(index, options.firstBarTick, sorted);
        // 주변보다 2배 가까이 길면 선을 하나 놓친 것, 절반쯤이면 하나 더 잡은 것 — 뒤 노트가 한 박씩 밀린다
        if (interval > local * 1.75)
            warnings.push({ kind: "missingBar", tick });
        else if (interval < local * 0.6)
            warnings.push({ kind: "extraBar", tick });
        if (!result.fps) return;
        // BPM 추정 — 프레임 드롭 보정으로 간격이 ±10% 흔들려 주변 9개 중앙값으로
        const point = activePoint(sorted, tick);
        const estimatedBpm =
            ((60 * result.fps) / local) *
            (beatTicksOf(point) / CHART_TICKS_PER_QUARTER);
        const off = Math.abs(estimatedBpm - point.bpm) / point.bpm > 0.05;
        if (off && (lastBpmWarning === null || index - lastBpmWarning > 8)) {
            warnings.push({
                kind: "bpmMismatch",
                tick,
                estimatedBpm: Math.round(estimatedBpm * 10) / 10,
                chartBpm: point.bpm,
            });
            lastBpmWarning = index;
        }
    });
    return warnings;
}

const defaultId = () => crypto.randomUUID();

/** 추출 결과 → 초안에 넣을 노트 · 손 확인 목록 · 경고 */
export function convertVid2bmap(
    result: Vid2bmapResult,
    notes: Vid2bmapRawNote[],
    options: Vid2bmapOptions
): Vid2bmapConversion {
    const { timingPoints, firstBarTick, snapDivisor, include } = options;
    const createId = options.createId ?? defaultId;
    const rows = result.barRows;
    const rawTickOf = (y: number) =>
        vid2bmapTickAt(
            vid2bmapBeatPosition(rows, y),
            firstBarTick,
            timingPoints
        );
    const output: ChartNote[] = [];
    const handUncertainIds: string[] = [];
    let shortTenuto = 0;
    let trillSplit = 0;

    for (const note of notes) {
        if (note.kind === "glissando" || !include[note.kind]) continue;
        const rawTick = rawTickOf(note.y);
        const tick = snapVid2bmapTick(rawTick, snapDivisor, timingPoints);
        const center = note.lane + note.width / 2;
        const hand = center <= CHART_LANE_COUNT / 2 ? "left" : "right";
        const base = {
            id: createId(),
            type: note.kind as ChartNoteType,
            hand: hand as ChartNote["hand"],
            tick,
            lane: note.lane,
            width: note.width,
            points: [],
        };
        let chartNote: ChartNote;
        if (note.kind === "standard") {
            chartNote = { ...base, durationTicks: 0 };
        } else {
            const step =
                beatTicksOf(activePoint(sortTimingPoints(timingPoints), tick)) /
                snapDivisor;
            // 끝 위치가 아니라 길이를 격자에 맞춘다(Altale 테누토 57개 중 50 정확 — 끝을 맞추면 48)
            let duration =
                Math.round((rawTickOf(note.endY ?? note.y) - rawTick) / step) *
                step;
            duration = Math.round(duration);
            if (duration <= 0) {
                duration = Math.round(step);
                shortTenuto += 1;
            }
            chartNote = { ...base, durationTicks: duration };
            if (note.kind === "trill") {
                // vid2bmap 은 트릴 전체 폭만 준다 — 가운데로 나눠 두 위치로(확인 필요)
                const firstWidth = Math.max(1, Math.floor(note.width / 2));
                chartNote = {
                    ...chartNote,
                    width: firstWidth,
                    pairLane: note.lane + firstWidth,
                    pairWidth: Math.max(1, note.width - firstWidth),
                };
                trillSplit += 1;
            }
        }
        if (center >= HAND_UNCERTAIN_MIN && center <= HAND_UNCERTAIN_MAX) {
            handUncertainIds.push(chartNote.id);
        }
        output.push(chartNote);
    }

    const warnings = barWarnings(result, options);
    warnings.push({
        kind: "endCheck",
        lastBarTick: vid2bmapTickAt(
            rows.length - 1,
            firstBarTick,
            timingPoints
        ),
    });
    if (shortTenuto > 0)
        warnings.push({ kind: "shortTenuto", count: shortTenuto });
    if (trillSplit > 0)
        warnings.push({ kind: "trillSplit", count: trillSplit });
    return { notes: output, handUncertainIds, warnings };
}

export type ChartNoteDiffField =
    "type" | "lane" | "width" | "duration" | "pair" | "hand";

export interface ChartNoteDiff {
    /** 틱 · 칸 · 폭 · 종류 · 길이가 같음(손은 추정이라 보지 않음) */
    same: [ChartNote, ChartNote][];
    /** 같은 틱에서 칸이 겹치지만 속성이 다름 */
    changed: {
        current: ChartNote;
        incoming: ChartNote;
        fields: ChartNoteDiffField[];
    }[];
    onlyCurrent: ChartNote[];
    onlyIncoming: ChartNote[];
}

const overlaps = (a: ChartNote, b: ChartNote) =>
    a.lane <= b.lane + b.width - 1 && b.lane <= a.lane + a.width - 1;

/** 지금 초안과 가져올 노트 비교 — 같은 틱에서 칸이 겹치는 것끼리, 칸이 가장 가까운 짝부터 */
export function diffChartNotes(
    current: ChartNote[],
    incoming: ChartNote[]
): ChartNoteDiff {
    const byTick = new Map<number, ChartNote[]>();
    for (const note of current) {
        byTick.set(note.tick, [...(byTick.get(note.tick) ?? []), note]);
    }
    const used = new Set<string>();
    const diff: ChartNoteDiff = {
        same: [],
        changed: [],
        onlyCurrent: [],
        onlyIncoming: [],
    };
    for (const note of incoming) {
        const match = (byTick.get(note.tick) ?? [])
            .filter(
                (candidate) =>
                    !used.has(candidate.id) && overlaps(candidate, note)
            )
            .sort(
                (a, b) =>
                    Math.abs(a.lane - note.lane) - Math.abs(b.lane - note.lane)
            )[0];
        if (!match) {
            diff.onlyIncoming.push(note);
            continue;
        }
        used.add(match.id);
        const fields: ChartNoteDiffField[] = [];
        if (match.type !== note.type) fields.push("type");
        if (match.lane !== note.lane) fields.push("lane");
        if (match.width !== note.width) fields.push("width");
        if (match.durationTicks !== note.durationTicks) fields.push("duration");
        if (
            match.pairLane !== note.pairLane ||
            match.pairWidth !== note.pairWidth
        ) {
            fields.push("pair");
        }
        if (fields.length === 0) {
            diff.same.push([match, note]);
            continue;
        }
        if (match.hand !== note.hand) fields.push("hand");
        diff.changed.push({ current: match, incoming: note, fields });
    }
    diff.onlyCurrent = current.filter((note) => !used.has(note.id));
    return diff;
}

/**
 * vid2bmap(김영훈 · 최성희, KAIST · MIT) 추출 결과 → NosLog 채보 노트.
 *
 * 영상 시각은 쓰지 않는다 — vid2bmap 의 프레임 드롭 보정이 시간축을 구간마다 늘였다 줄이기 때문(Altale 실측 ±0.3초).
 * 노트와 박자선은 같은 띠 위에서 함께 흔들리므로 「앞뒤 박자선 사이 어디쯤인가」 로 박 위치를 계산한다.
 * 게임은 박마다 선을 그린다(Altale: BPM 90 · 40프레임 간격 = 1박). 첫 박자선이 곡의 몇 번째 틱인지는 사람이 정한다.
 * Altale Real 앞부분 232개로 박 위치 · 칸 · 폭 · 종류가 모두 일치함을 확인(2026-09-23).
 * 손은 실행 스크립트가 LR_classification 브랜치 결과에서 붙여 온 것을 쓰고(Altale 232/232, 2026-09-24), 없으면 칸 위치로 추정한다.
 */
import { findChartNoteConflicts } from "./editor";
import { CHART_LANE_COUNT, CHART_TICKS_PER_QUARTER } from "./schema";
import type { ChartNote, ChartNoteType, ChartTimingPoint } from "./schema";
import { sortTimingPoints, tickToMilliseconds } from "./timing";
import type { Vid2bmapResult } from "./vid2bmapFile";

/** 같은 칸 · 같은 종류가 이 프레임 이내로 겹치면 한 노트를 두 번 읽은 것 */
export const VID2BMAP_DUPLICATE_FRAMES = 3;
/** 한 박을 나누는 격자 후보 */
export const VID2BMAP_SNAP_DIVISORS = [2, 3, 4, 6, 8, 12, 16] as const;
/**
 * 박마다 격자를 고를 때 허용하는 어긋남(영상 프레임). 박자선 · 노트 위치의 흔들림은 1프레임 안팎이다.
 * 곡 전체 격자로 이보다 크게 어긋나는 박만 다른 격자로 맞춘다.
 * Altale: 1.5 는 정답 232개 중 14개가 틀리고, 3 은 뭉친 곳이 10곳 남아 2.5(정답 그대로 · 뭉친 곳 12 → 3)
 */
export const VID2BMAP_LOCAL_GRID_TOLERANCE_FRAMES = 2.5;
/** 칸 위치로 손을 추정할 때 불확실한 가운데 구간(노트 가운데 칸 기준) */
const HAND_UNCERTAIN_MIN = 12;
const HAND_UNCERTAIN_MAX = 16;

export type Vid2bmapKind = "standard" | "tenuto" | "trill" | "glissando";

export interface Vid2bmapRawNote {
    kind: Vid2bmapKind;
    y: number;
    endY: number | null;
    lane: number;
    width: number;
    /** 영상에서 읽은 손. 손 열이 없거나 모르면 null */
    hand: ChartNote["hand"] | null;
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
          /** 박자선 간격이 타이밍과 다른 구간(이어진 곳은 하나로) */
          tick: number;
          endTick: number;
          estimatedBpm: number;
          chartBpm: number;
      }
    /** 곡 전체 격자로는 크게 어긋나 그 박만 다른 격자(예: 셋잇단 곡 안의 1/8박 연타)로 맞춘 박 수 */
    | { kind: "localGrid"; count: number; tick: number; divisors: number[] }
    /** 어느 격자에도 맞지 않아 영상 위치 그대로 넣은 노트 수 — 에디터 「스냅 확인」 에 걸린다 */
    | { kind: "offGrid"; count: number; tick: number }
    /** 기본 격자로는 한 자리로 뭉쳐 겹친 빠른 노트를 더 촘촘한 격자로 맞춘 수 */
    | { kind: "denseSnap"; count: number; tick: number }
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

/** 템포 제안이 있으면(beat_frames) 보정된 박자선으로 잰 BPM 경고는 내지 않는다 — 같은 내용을 더 정확히 제안이 말한다 */
const hasBeatFrames = (result: Vid2bmapResult) =>
    Boolean(
        result.fps && result.beatFrames && result.beatFrames.frames.length > 8
    );

export interface Vid2bmapConversion {
    notes: ChartNote[];
    /** 손을 영상에서 읽은 노트 id */
    handKnownIds: string[];
    /** 손을 칸 위치로 추정했는데 가운데라 확인이 필요한 노트 id */
    handUncertainIds: string[];
    /** 곡 전체 격자 대신 그 박의 격자로 맞춰 자리가 달라졌거나 영상 위치 그대로 둔 노트 id */
    gridCheckIds: string[];
    warnings: Vid2bmapWarning[];
}

/** 손 열(0 왼손 · 1 오른손 · -1 모름). 열이 없으면 모름 */
const handOf = (value: number | undefined): ChartNote["hand"] | null =>
    value === 0 ? "left" : value === 1 ? "right" : null;

/** 결과 → 노트 목록(같은 노트를 두 번 읽은 것은 합침) */
export function collectVid2bmapNotes(result: Vid2bmapResult) {
    const all: Vid2bmapRawNote[] = [
        ...result.simple.map(([y, x1, x2, hand]) => ({
            kind: "standard" as const,
            y,
            endY: null,
            lane: x1,
            width: x2 - x1 + 1,
            hand: handOf(hand),
        })),
        ...result.tenuto.map(([y1, y2, x1, x2, hand]) => ({
            kind: "tenuto" as const,
            y: y1,
            endY: y2,
            lane: x1,
            width: x2 - x1 + 1,
            hand: handOf(hand),
        })),
        ...result.trill.map(([y1, y2, x1, x2, hand]) => ({
            kind: "trill" as const,
            y: y1,
            endY: y2,
            lane: x1,
            width: x2 - x1 + 1,
            hand: handOf(hand),
        })),
        ...result.glissando.map(([y, x1, x2, hand]) => ({
            kind: "glissando" as const,
            y,
            endY: null,
            lane: x1,
            width: x2 - x1 + 1,
            hand: handOf(hand),
        })),
    ].sort((a, b) => a.y - b.y || a.lane - b.lane);

    const kept: Vid2bmapRawNote[] = [];
    let duplicates = 0;
    for (const note of all) {
        const duplicate = kept.find(
            (other) =>
                other.kind === note.kind &&
                other.lane === note.lane &&
                other.width === note.width &&
                note.y - other.y <= VID2BMAP_DUPLICATE_FRAMES
        );
        if (!duplicate) {
            kept.push(note);
            continue;
        }
        duplicates += 1;
        // 먼저 읽은 쪽이 손을 모르면 나중 쪽 손을 쓴다
        duplicate.hand ??= note.hand;
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
    let run: { tick: number; bpms: number[]; chartBpm: number } | null = null;
    const closeRun = (endTick: number) => {
        if (!run) return;
        warnings.push({
            kind: "bpmMismatch",
            tick: run.tick,
            endTick,
            estimatedBpm: Math.round(median(run.bpms) * 10) / 10,
            chartBpm: run.chartBpm,
        });
        run = null;
    };
    intervals.forEach((interval, index) => {
        const window = intervals.slice(Math.max(0, index - 4), index + 5);
        const local = median(window);
        const tick = vid2bmapTickAt(index, options.firstBarTick, sorted);
        // 주변보다 2배 가까이 길면 선을 하나 놓친 것, 절반쯤이면 하나 더 잡은 것 — 뒤 노트가 한 박씩 밀린다
        if (interval > local * 1.75)
            warnings.push({ kind: "missingBar", tick });
        else if (interval < local * 0.6)
            warnings.push({ kind: "extraBar", tick });
        if (!result.fps || hasBeatFrames(result)) return;
        // BPM 추정 — 프레임 드롭 보정으로 간격이 ±10% 흔들려 주변 9개 중앙값으로. 벗어난 박이 이어지면 한 구간
        const point = activePoint(sorted, tick);
        const estimatedBpm =
            ((60 * result.fps) / local) *
            (beatTicksOf(point) / CHART_TICKS_PER_QUARTER);
        const off = Math.abs(estimatedBpm - point.bpm) / point.bpm > 0.05;
        if (off) {
            if (!run) run = { tick, bpms: [], chartBpm: point.bpm };
            run.bpms.push(estimatedBpm);
        } else closeRun(tick);
    });
    closeRun(vid2bmapTickAt(rows.length - 1, options.firstBarTick, sorted));
    return warnings;
}

const defaultId = () => crypto.randomUUID();

/**
 * 박마다 격자 고르기 — 그 박의 노트가 곡 전체 격자(base)로 모두 허용 안에 들면 그대로,
 * 아니면 모두 들어오는 가장 성긴 격자(1/2 → 1/16). 그것도 없으면 base 로 허용 안에 드는 노트만 base,
 * 나머지는 영상 위치 그대로(격자 밖 — 에디터 「스냅 확인」 이 표시한다, 2026-09-24 C).
 * Altale 35 · 36마디: 1/6박 곡 안의 1/8박 오른손 연타(약 60틱 간격)가 1/6 격자에서 두 개씩 한 자리로 뭉쳐 겹노트가 됐다(2026-09-24).
 * frameTicks = 그 자리 영상 한 프레임의 틱 수(박자선 간격으로 잼)
 */
function snapByBeat(
    entries: { raw: number; frameTicks: number }[],
    baseDivisor: number,
    timingPoints: ChartTimingPoint[]
) {
    const sorted = sortTimingPoints(timingPoints);
    const placed = entries.map(({ raw, frameTicks }) => {
        const point = activePoint(sorted, raw);
        const beatTicks = beatTicksOf(point);
        const tolerance = VID2BMAP_LOCAL_GRID_TOLERANCE_FRAMES * frameTicks;
        // 박 끝에 조금 못 미친 노트는 다음 박의 첫 자리로 본다
        const beat = Math.floor((raw - point.tick + tolerance) / beatTicks);
        const start = point.tick + beat * beatTicks;
        return { raw, start, beatTicks, tolerance, key: `${point.id}:${beat}` };
    });
    const groups = new Map<string, number[]>();
    placed.forEach((entry, index) => {
        groups.set(entry.key, [...(groups.get(entry.key) ?? []), index]);
    });
    const slotOf = (index: number, divisor: number) => {
        const { raw, start, beatTicks } = placed[index];
        const step = beatTicks / divisor;
        return Math.round((raw - start) / step);
    };
    // 허용 안에 들고, 영상에서 허용보다 멀리 떨어진 두 노트를 한 자리로 합치지 않을 때만 맞는 격자
    // (Altale 35마디 3박: 1/6박으로도 허용 안이지만 4프레임 떨어진 연타 둘이 한 자리 → 1/8박)
    const fits = (indexes: number[], divisor: number) =>
        indexes.every((index) => {
            const { raw, start, beatTicks, tolerance } = placed[index];
            const step = beatTicks / divisor;
            return (
                Math.abs(raw - start - slotOf(index, divisor) * step) <=
                tolerance
            );
        }) &&
        indexes.every((first) =>
            indexes.every(
                (second) =>
                    slotOf(first, divisor) !== slotOf(second, divisor) ||
                    Math.abs(placed[first].raw - placed[second].raw) <=
                        Math.max(
                            placed[first].tolerance,
                            placed[second].tolerance
                        )
            )
        );
    /** null = 격자 밖(영상 위치 그대로) */
    const divisors = new Array<number | null>(entries.length).fill(baseDivisor);
    const changedBeats: { tick: number; divisor: number }[] = [];
    const changed = new Set<number>();
    for (const indexes of groups.values()) {
        if (fits(indexes, baseDivisor)) continue;
        const divisor = VID2BMAP_SNAP_DIVISORS.find((candidate) =>
            fits(indexes, candidate)
        );
        if (divisor) {
            for (const index of indexes) {
                divisors[index] = divisor;
                changed.add(index);
            }
            changedBeats.push({ tick: placed[indexes[0]].start, divisor });
            continue;
        }
        for (const index of indexes) {
            if (fits([index], baseDivisor)) continue;
            divisors[index] = null;
            changed.add(index);
        }
    }
    const ticks = placed.map(({ raw, start, beatTicks }, index) => {
        const divisor = divisors[index];
        if (divisor === null) return Math.round(raw);
        const step = beatTicks / divisor;
        return Math.round(start + Math.round((raw - start) / step) * step);
    });
    // 확인 대상은 곡 전체 격자로 맞췄을 때와 자리가 달라진 노트만(같은 박의 나머지는 그대로라 볼 필요 없음)
    for (const index of [...changed]) {
        const { raw, start, beatTicks } = placed[index];
        const step = beatTicks / baseDivisor;
        const base = Math.round(
            start + Math.round((raw - start) / step) * step
        );
        if (ticks[index] === base) changed.delete(index);
    }
    const offGrid = divisors.flatMap((divisor, index) =>
        divisor === null ? [index] : []
    );
    const beatDivisors = new Map<string, number>();
    for (const { tick, divisor } of changedBeats) {
        const point = activePoint(sorted, tick);
        beatDivisors.set(
            `${point.id}:${Math.round((tick - point.tick) / beatTicksOf(point))}`,
            divisor
        );
    }
    /** 그 자리 박에서 고른 격자(시작 노트가 없는 박은 곡 전체 격자) — 테누토 · 트릴 끝 박에 쓴다 */
    const divisorAt = (raw: number, frameTicks: number) => {
        const point = activePoint(sorted, raw);
        const tolerance = VID2BMAP_LOCAL_GRID_TOLERANCE_FRAMES * frameTicks;
        const beat = Math.floor(
            (raw - point.tick + tolerance) / beatTicksOf(point)
        );
        return beatDivisors.get(`${point.id}:${beat}`) ?? baseDivisor;
    };
    return { ticks, changedBeats, changed, offGrid, divisorAt };
}

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
    let output: ChartNote[] = [];
    const rawTicks = new Map<string, number>();
    const handKnownIds: string[] = [];
    const handUncertainIds: string[] = [];
    let shortTenuto = 0;
    let trillSplit = 0;

    const included = notes.filter(
        (note) => note.kind !== "glissando" && include[note.kind]
    );
    const snapped = snapByBeat(
        included.map((note) => {
            const raw = rawTickOf(note.y);
            return { raw, frameTicks: rawTickOf(note.y + 1) - raw };
        }),
        snapDivisor,
        timingPoints
    );

    const gridCheckIds: string[] = [];
    const offGridTicks: number[] = [];
    for (const [index, note] of included.entries()) {
        const rawTick = rawTickOf(note.y);
        const tick = snapped.ticks[index];
        const center = note.lane + note.width / 2;
        const hand: ChartNote["hand"] =
            note.hand ?? (center <= CHART_LANE_COUNT / 2 ? "left" : "right");
        const base = {
            id: createId(),
            type: note.kind as ChartNoteType,
            hand,
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
            const endY = note.endY ?? note.y;
            const endRaw = rawTickOf(endY);
            // 끝 위치가 아니라 길이를 격자에 맞춘다(Altale 테누토 57개 중 50 정확 — 끝을 맞추면 48).
            // 격자 단위는 끝이 떨어지는 박에서 고른 격자 — 1/6박 곡 안의 1/8박 구간에서 끝이 ⅙ · ⅓ 사이로 갈리지 않게(2026-09-24, 여전히 50)
            const endPoint = activePoint(
                sortTimingPoints(timingPoints),
                endRaw
            );
            const endStep =
                beatTicksOf(endPoint) /
                snapped.divisorAt(endRaw, rawTickOf(endY + 1) - endRaw);
            const lengthStep =
                (step * snapDivisor * endStep) / beatTicksOf(endPoint);
            let duration = Math.round(
                Math.round((endRaw - rawTick) / lengthStep) * lengthStep
            );
            // 시작과 끝 박의 격자가 달라 끝이 그 박 격자 밖이면(1/12박 시작 + 1/8박 길이 → 23/24 같은 자리) 끝을 그 박 격자에 맞춘다
            const endOffset = tick + duration - endPoint.tick;
            if (
                Math.abs(
                    endOffset / endStep - Math.round(endOffset / endStep)
                ) > 1e-6
            ) {
                duration =
                    Math.round(
                        endPoint.tick +
                            Math.round((endRaw - endPoint.tick) / endStep) *
                                endStep
                    ) - tick;
            }
            if (duration <= 0) {
                duration = Math.round(lengthStep);
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
        if (note.hand) {
            handKnownIds.push(chartNote.id);
        } else if (
            center >= HAND_UNCERTAIN_MIN &&
            center <= HAND_UNCERTAIN_MAX
        ) {
            handUncertainIds.push(chartNote.id);
        }
        if (snapped.changed.has(index)) gridCheckIds.push(chartNote.id);
        if (snapped.offGrid.includes(index)) offGridTicks.push(tick);
        rawTicks.set(chartNote.id, rawTick);
        output.push(chartNote);
    }

    // 빠른 구간(Altale 후반 약 0.1박 간격): 기본 격자로 같은 자리에 뭉쳐 칸이 겹친 노트만 ×2 · ×4 격자로 다시 맞춘다.
    // 이미 겹치지 않는 노트는 건드리지 않는다(앞부분 232개 정답 그대로)
    const refined = new Set<string>();
    for (const factor of [2, 4]) {
        const clashing = new Set(
            findChartNoteConflicts(output, CHART_TICKS_PER_QUARTER).flatMap(
                ({ firstId, secondId }) => [firstId, secondId]
            )
        );
        if (clashing.size === 0) break;
        output = output.map((note) => {
            const raw = rawTicks.get(note.id);
            if (!clashing.has(note.id) || raw === undefined) return note;
            const tick = snapVid2bmapTick(
                raw,
                snapDivisor * factor,
                timingPoints
            );
            if (tick === note.tick) return note;
            refined.add(note.id);
            return { ...note, tick };
        });
    }

    const warnings = barWarnings(result, options);
    if (snapped.changedBeats.length > 0) {
        warnings.push({
            kind: "localGrid",
            count: snapped.changedBeats.length,
            tick: Math.min(...snapped.changedBeats.map((beat) => beat.tick)),
            divisors: [
                ...new Set(snapped.changedBeats.map((beat) => beat.divisor)),
            ].sort((x, y) => x - y),
        });
    }
    if (offGridTicks.length > 0) {
        warnings.push({
            kind: "offGrid",
            count: offGridTicks.length,
            tick: Math.min(...offGridTicks),
        });
    }
    warnings.push({
        kind: "endCheck",
        lastBarTick: vid2bmapTickAt(
            rows.length - 1,
            firstBarTick,
            timingPoints
        ),
    });
    if (refined.size > 0) {
        warnings.push({
            kind: "denseSnap",
            count: refined.size,
            tick: Math.min(
                ...output
                    .filter((note) => refined.has(note.id))
                    .map((note) => note.tick)
            ),
        });
    }
    if (shortTenuto > 0)
        warnings.push({ kind: "shortTenuto", count: shortTenuto });
    if (trillSplit > 0)
        warnings.push({ kind: "trillSplit", count: trillSplit });
    return {
        notes: output,
        handKnownIds,
        handUncertainIds,
        gridCheckIds,
        warnings,
    };
}

export type ChartNoteDiffField =
    "tick" | "type" | "lane" | "width" | "duration" | "pair" | "hand";

/**
 * 같은 틱에 짝이 없을 때, 같은 칸 · 폭 · 종류로 이만큼 안에 있으면 박 위치만 옮겨진 같은 노트로 본다(1/8 사분음표 = 60틱).
 * 예전 1/6박 한 격자로 넣은 초안(¼ 자리가 ⅙ · ⅓ 로 갈림)을 박마다 격자로 다시 가져올 때 「내 초안에만 + 가져온 것에만」 으로 갈리지 않게
 */
export const VID2BMAP_NEARBY_TICKS = CHART_TICKS_PER_QUARTER / 8;

export interface ChartNoteDiff {
    /** 틱 · 칸 · 폭 · 종류 · 길이가 같음(손은 영상에서 읽은 노트만 본다 — 칸 위치 추정은 보지 않음) */
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

/**
 * 지금 초안과 가져올 노트 비교 — 같은 틱에서 칸이 겹치는 것끼리, 칸이 가장 가까운 짝부터.
 * handKnownIds: 손을 영상에서 읽은 가져올 노트 — 손만 달라도 「달라짐」
 */
export function diffChartNotes(
    current: ChartNote[],
    incoming: ChartNote[],
    handKnownIds: ReadonlySet<string> = new Set()
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
        const fields = noteDiffFields(match, note, handKnownIds);
        if (fields.length === 0) {
            diff.same.push([match, note]);
            continue;
        }
        diff.changed.push({ current: match, incoming: note, fields });
    }
    // 남은 것끼리: 같은 칸 · 폭 · 종류가 가까운 박에 있으면 박 위치만 옮겨진 것(가장 가까운 짝부터)
    const pairs = diff.onlyIncoming
        .flatMap((note) =>
            current
                .filter(
                    (candidate) =>
                        !used.has(candidate.id) &&
                        candidate.lane === note.lane &&
                        candidate.width === note.width &&
                        candidate.type === note.type &&
                        Math.abs(candidate.tick - note.tick) <=
                            VID2BMAP_NEARBY_TICKS
                )
                .map((candidate) => ({ candidate, note }))
        )
        .sort(
            (a, b) =>
                Math.abs(a.candidate.tick - a.note.tick) -
                Math.abs(b.candidate.tick - b.note.tick)
        );
    const paired = new Set<string>();
    for (const { candidate, note } of pairs) {
        if (used.has(candidate.id) || paired.has(note.id)) continue;
        used.add(candidate.id);
        paired.add(note.id);
        diff.changed.push({
            current: candidate,
            incoming: note,
            fields: ["tick", ...noteDiffFields(candidate, note, handKnownIds)],
        });
    }
    diff.onlyIncoming = diff.onlyIncoming.filter(
        (note) => !paired.has(note.id)
    );
    diff.onlyCurrent = current.filter((note) => !used.has(note.id));
    return diff;
}

/** 틱 말고 달라진 속성. 손은 다른 속성이 다르거나 영상에서 읽은 노트일 때만 */
function noteDiffFields(
    current: ChartNote,
    incoming: ChartNote,
    handKnownIds: ReadonlySet<string>
) {
    const fields: ChartNoteDiffField[] = [];
    if (current.type !== incoming.type) fields.push("type");
    if (current.lane !== incoming.lane) fields.push("lane");
    if (current.width !== incoming.width) fields.push("width");
    if (current.durationTicks !== incoming.durationTicks) {
        fields.push("duration");
    }
    if (
        current.pairLane !== incoming.pairLane ||
        current.pairWidth !== incoming.pairWidth
    ) {
        fields.push("pair");
    }
    if (
        current.hand !== incoming.hand &&
        (fields.length > 0 || handKnownIds.has(incoming.id))
    ) {
        fields.push("hand");
    }
    return fields;
}

const FRACTION_GLYPHS: Record<string, string> = {
    "1/2": "½",
    "1/3": "⅓",
    "2/3": "⅔",
    "1/4": "¼",
    "3/4": "¾",
    "1/6": "⅙",
    "5/6": "⅚",
    "1/8": "⅛",
    "3/8": "⅜",
    "5/8": "⅝",
    "7/8": "⅞",
};

function gcd(a: number, b: number): number {
    return b === 0 ? a : gcd(b, a % b);
}

/**
 * 틱 → 「N마디 M박」(박 안 위치는 분수 글자). 타이밍 포인트마다 새 마디가 시작한다고 본다(에디터 마디 번호와 같음).
 * 첫 포인트보다 앞은 0마디 · 음수 마디.
 */
export function chartPositionLabel(
    tick: number,
    timingPoints: ChartTimingPoint[]
) {
    const sorted = sortTimingPoints(timingPoints);
    let measureOffset = 0;
    let point = sorted[0];
    for (let index = 0; index < sorted.length; index += 1) {
        const candidate = sorted[index];
        if (candidate.tick > tick && index > 0) break;
        if (index > 0) {
            const previous = sorted[index - 1];
            const measureTicks = beatTicksOf(previous) * previous.numerator;
            measureOffset += Math.ceil(
                (candidate.tick - previous.tick) / measureTicks
            );
        }
        point = candidate;
    }
    const beatTicks = beatTicksOf(point);
    const measureTicks = beatTicks * point.numerator;
    const measureIndex = Math.floor((tick - point.tick) / measureTicks);
    const inMeasure = tick - point.tick - measureIndex * measureTicks;
    const beat = Math.floor(inMeasure / beatTicks);
    const remainder = Math.round(inMeasure - beat * beatTicks);
    let fraction = "";
    if (remainder > 0) {
        const divisor = gcd(remainder, beatTicks);
        const key = `${remainder / divisor}/${beatTicks / divisor}`;
        fraction = FRACTION_GLYPHS[key] ?? ` ${key}`;
    }
    return `${measureOffset + measureIndex + 1}마디 ${beat + 1}${fraction}박`;
}

export type Vid2bmapMergeKind =
    "changed" | "moved" | "onlyCurrent" | "onlyIncoming";

export interface Vid2bmapMergeItem {
    key: string;
    kind: Vid2bmapMergeKind;
    tick: number;
    current: ChartNote[];
    incoming: ChartNote[];
    fields: ChartNoteDiffField[];
}

export interface Vid2bmapMergePlan {
    items: Vid2bmapMergeItem[];
    /** 지금 초안의 마지막 노트 뒤 — 목록 대신 한꺼번에 넣거나 뺀다 */
    newSection: ChartNote[];
    sameCount: number;
}

/**
 * 비교 결과 → 고를 항목. 같은 틱에서 칸이 안 겹쳐 「내 초안에만 + 가져온 것에만」 으로 갈린 것은 한 항목(moved)으로 묶는다.
 * 기본 선택(defaultVid2bmapChoice): 달라짐 · 옮겨짐 · 초안 범위 안 새 노트 = 가져온 것, 내 초안에만 = 내 것.
 */
export function planVid2bmapMerge(
    current: ChartNote[],
    diff: ChartNoteDiff
): Vid2bmapMergePlan {
    const lastCurrentTick = current.reduce(
        (max, note) => Math.max(max, note.tick + note.durationTicks),
        Number.NEGATIVE_INFINITY
    );
    const items: Vid2bmapMergeItem[] = diff.changed.map((change) => ({
        key: `c:${change.current.id}`,
        kind: "changed",
        tick: change.current.tick,
        current: [change.current],
        incoming: [change.incoming],
        fields: change.fields,
    }));
    const byTick = new Map<
        number,
        { current: ChartNote[]; incoming: ChartNote[] }
    >();
    const group = (tick: number) => {
        const entry = byTick.get(tick) ?? { current: [], incoming: [] };
        byTick.set(tick, entry);
        return entry;
    };
    for (const note of diff.onlyCurrent) group(note.tick).current.push(note);
    const newSection: ChartNote[] = [];
    for (const note of diff.onlyIncoming) {
        if (note.tick > lastCurrentTick) newSection.push(note);
        else group(note.tick).incoming.push(note);
    }
    for (const [tick, entry] of byTick) {
        const kind: Vid2bmapMergeKind =
            entry.current.length > 0 && entry.incoming.length > 0
                ? "moved"
                : entry.current.length > 0
                  ? "onlyCurrent"
                  : "onlyIncoming";
        items.push({
            key: `t:${tick}`,
            kind,
            tick,
            current: entry.current,
            incoming: entry.incoming,
            fields: [],
        });
    }
    items.sort((a, b) => a.tick - b.tick || a.key.localeCompare(b.key));
    return { items, newSection, sameCount: diff.same.length };
}

export type Vid2bmapChoice = "current" | "incoming";

export function defaultVid2bmapChoice(item: Vid2bmapMergeItem): Vid2bmapChoice {
    return item.kind === "onlyCurrent" ? "current" : "incoming";
}

/** 고른 대로 합친 노트 목록과 새로 들어간 노트 id. 같은 노트는 내 것을 그대로 둔다 */
export function applyVid2bmapMerge(
    current: ChartNote[],
    plan: Vid2bmapMergePlan,
    choices: Record<string, Vid2bmapChoice>,
    includeNewSection: boolean
) {
    const removed = new Set<string>();
    const added: ChartNote[] = [];
    for (const item of plan.items) {
        const choice = choices[item.key] ?? defaultVid2bmapChoice(item);
        if (choice !== "incoming") continue;
        for (const note of item.current) removed.add(note.id);
        added.push(...item.incoming);
    }
    if (includeNewSection) added.push(...plan.newSection);
    return {
        notes: [...current.filter((note) => !removed.has(note.id)), ...added],
        removedIds: [...removed],
        addedIds: added.map((note) => note.id),
    };
}

/** 틱 길이 → 「⅙박」 · 「1½박」 · 「2박」 (그 자리 박자표의 한 박 기준) */
export function beatLengthLabel(ticks: number, beatTicks: number) {
    const whole = Math.floor(ticks / beatTicks);
    const remainder = Math.round(ticks - whole * beatTicks);
    let fraction = "";
    if (remainder > 0) {
        const divisor = gcd(remainder, beatTicks);
        const key = `${remainder / divisor}/${beatTicks / divisor}`;
        fraction = FRACTION_GLYPHS[key] ?? `${whole > 0 ? " " : ""}${key}`;
    }
    return `${whole > 0 || !fraction ? whole : ""}${fraction}박`;
}

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

export interface Vid2bmapTempoChange {
    /** 새 타이밍 포인트를 둘 박(박자선 위치) */
    tick: number;
    /** 0.5 단위로 다듬은 BPM */
    bpm: number;
    /** 측정값(소수 둘째 자리) */
    measuredBpm: number;
    /** 이 템포로 잰 박 수 */
    beats: number;
    /** 이 자리 바로 앞의 BPM(타이밍 포인트 또는 앞 제안) */
    fromBpm: number;
}

export interface Vid2bmapTempo {
    changes: Vid2bmapTempoChange[];
    /** 첫 구간 측정 BPM 이 시작 타이밍과 다르면 그 값(제안하지 않고 알리기만) */
    startMismatch: { measuredBpm: number; chartBpm: number } | null;
}

/** 템포가 바뀌었다고 볼 차이(비율) */
const TEMPO_TOLERANCE = 0.015;
/** 한 번에 보는 박 수 — 이만큼 이어져야 바뀐 것으로 본다 */
const TEMPO_WINDOW = 8;

/**
 * 템포 변화 → 타이밍 포인트 제안(2026-09-23 T2).
 * vid2bmap 보정 전 실제 프레임(beat_frames)으로 박 간격을 잰다 — 보정된 박자선(chart_bar)은 ±10% 흔들린다.
 * 놓친 박자선(간격 ≈ 2박)은 둘로 나누고, 8박 중앙값이 1.5% 넘게 바뀐 곳을 경계로(Altale: 2~62마디 90.00 · 63마디부터 83.06).
 * 첫 박자선은 beat_frames 의 격자 줄에서 판정선 줄까지 줄 수만큼(한 줄 = 한 프레임) 뒤의 박자선과 짝짓는다.
 */
export function detectVid2bmapTempoChanges(
    result: Vid2bmapResult,
    firstBarTick: number,
    timingPoints: ChartTimingPoint[]
): Vid2bmapTempo | null {
    const beatFrames = result.beatFrames;
    const fps = result.fps;
    if (!beatFrames || !fps || beatFrames.frames.length < TEMPO_WINDOW * 2) {
        return null;
    }
    const rows = result.barRows;
    if (rows.length < 2) return null;
    const frames = beatFrames.frames;
    const intervals = frames
        .slice(1)
        .map((frame, index) => frame - frames[index]);
    // 박마다 걸린 프레임 수 — 놓친 박자선은 주변 간격으로 나눠 박 수를 되살린다
    const durations: number[] = [];
    intervals.forEach((interval, index) => {
        const local = median(
            intervals.slice(Math.max(0, index - 4), index + 5)
        );
        const beats = Math.max(1, Math.round(interval / local));
        for (let beat = 0; beat < beats; beat += 1) {
            durations.push(interval / beats);
        }
    });
    if (durations.length < TEMPO_WINDOW * 2) return null;

    // beat_frames 첫 박자선 ↔ 보정된 박자선 몇 번째(격자 줄 → 판정선 줄 = 한 줄 한 프레임)
    const expected = frames[0] + (beatFrames.gridRows - 1 - beatFrames.row);
    let firstIndex = 0;
    for (let index = 1; index < rows.length; index += 1) {
        if (
            Math.abs(rows[index] - expected) <
            Math.abs(rows[firstIndex] - expected)
        ) {
            firstIndex = index;
        }
    }
    if (Math.abs(rows[firstIndex] - expected) > 20) return null;

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

    const sorted = sortTimingPoints(timingPoints);
    const toBpm = (frameCount: number, point: ChartTimingPoint) =>
        ((60 * fps) / frameCount) *
        (beatTicksOf(point) / CHART_TICKS_PER_QUARTER);
    const origin = sorted[0];
    const firstMeasured = toBpm(segments[0].frames, origin);
    const startMismatch =
        Math.abs(firstMeasured - origin.bpm) / origin.bpm > TEMPO_TOLERANCE
            ? {
                  measuredBpm: Math.round(firstMeasured * 100) / 100,
                  chartBpm: origin.bpm,
              }
            : null;

    const changes: Vid2bmapTempoChange[] = [];
    segments.forEach((segment, index) => {
        const end = segments[index + 1]?.start ?? durations.length;
        if (index === 0) {
            return;
        }
        const tick = Math.round(
            vid2bmapTickAt(firstIndex + segment.start, firstBarTick, sorted)
        );
        const point = activePoint(sorted, tick);
        const measured = toBpm(segment.frames, point);
        const bpm = Math.round(measured * 2) / 2;
        const fromBpm =
            changes.length > 0 && changes[changes.length - 1].tick > point.tick
                ? changes[changes.length - 1].bpm
                : point.bpm;
        // 이미 그 자리에 타이밍 포인트가 있거나, 앞 BPM 과 같으면 제안하지 않는다
        if (
            point.tick === tick ||
            Math.abs(bpm - fromBpm) / fromBpm <= TEMPO_TOLERANCE
        ) {
            return;
        }
        changes.push({
            tick,
            bpm,
            measuredBpm: Math.round(measured * 100) / 100,
            beats: end - segment.start,
            fromBpm,
        });
    });
    return { changes, startMismatch };
}

/** 제안을 타이밍 포인트로 — 시각(ms)은 앞 타이밍(앞 제안 포함)에서 이어 계산, 박자표는 앞 구간을 잇는다 */
export function applyVid2bmapTempoChanges(
    timingPoints: ChartTimingPoint[],
    changes: Vid2bmapTempoChange[],
    createId: () => string = () => `timing-${crypto.randomUUID()}`
) {
    let points = sortTimingPoints(timingPoints);
    for (const change of [...changes].sort((a, b) => a.tick - b.tick)) {
        const previous = activePoint(points, change.tick);
        // 에디터와 같은 계산(앞 타이밍 · 앞 제안 기준)
        const timeMs = tickToMilliseconds(
            change.tick,
            points,
            CHART_TICKS_PER_QUARTER
        );
        points = sortTimingPoints([
            ...points,
            {
                id: createId(),
                tick: change.tick,
                timeMs: Math.round(timeMs * 1000) / 1000,
                bpm: change.bpm,
                numerator: previous.numerator,
                denominator: previous.denominator,
            },
        ]);
    }
    return points;
}

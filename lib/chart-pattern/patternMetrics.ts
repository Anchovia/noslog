/**
 * 패턴 경향 원점수 — 공개 채보 문서에서 계단 · 연타 · 폴리리듬 · 즈레 · 변박의 처리 부담을 잰다.
 * max-scouter 패턴 경향의 집계를 노스 노트에 맞춰 옮겼다: 손마다 처리량을 1초로 줄여 가며 쌓고,
 * 가장 센 누적 8초의 RMS 와 최고점을 0.8 : 0.2 로 합친다. 0–100% 변환은 patternStrength 가 한다.
 * 손은 채보 문서의 hand 칸을 그대로 쓴다(건반 위치로 나누지 않는다).
 */
import type { ChartDocument, ChartHand } from "./schema";
import { sortTimingPoints, tickToMilliseconds } from "./timing";

/** 식이나 계수를 바꾸면 올린다 — 다른 버전 값끼리는 비교하지 않는다 */
export const PATTERN_METRICS_VERSION = 1;

/** 칸 이름은 패턴 투표와 같다 — offset = 즈레, chords = 변박 */
export interface PatternMetrics {
    stairs: number;
    repetition: number;
    polyrhythm: number;
    offset: number;
    /** 박자표를 믿을 수 없는 채보(영상 추출 그대로)는 null */
    chords: number | null;
}

export type PatternMetricAxis = keyof PatternMetrics;

const NEAR_MS = 250;
const RECOVERY_MS = 1000;
const TOP_MS = 8000;
const ROW_MS = 1;
/** 계단 한 걸음 = 1–2건반(레인 3개가 건반 하나) */
const STAIR_MAX_STEP = 7;
/** 즈레 = 32분 이내로 어긋난 2–4개 시각, 앞뒤 노트와는 16분 이상 떨어짐 */
const OFFSET_MAX_TICKS = 60;
const OFFSET_ISOLATION_TICKS = 120;

interface Head {
    tick: number;
    t: number;
    hand: ChartHand;
    lo: number;
    hi: number;
    center: number;
}

interface Row {
    t: number;
    heads: Head[];
}

interface Load {
    t: number;
    hand: ChartHand;
    value: number;
}

// 간격이 짧을수록 부담이 커지고 50ms 아래에서는 더 오르지 않는다(max-scouter 와 같은 곡선)
function speed(gapMs: number) {
    const ratio = Math.min(1, Math.max(0, (300 - gapMs) / 250));
    return 0.1 + 2.9 * ratio ** 3;
}

function repeatRate(gapMs: number) {
    return 1000 / Math.max(50, gapMs);
}

function overlaps(a: Head, b: Head) {
    return a.lo < b.hi && b.lo < a.hi;
}

/** 손마다 1초 감쇠로 쌓은 부담에서 최고점 · 누적 8초 RMS 를 합친다 */
function summarize(loads: Load[]) {
    if (!loads.length) return 0;
    loads.sort((a, b) => a.t - b.t);
    const state: Record<ChartHand, number> = { left: 0, right: 0 };
    const segments: { start: number; gap: number }[] = [];
    let last = loads[0].t;
    let peak = 0;
    for (let index = 0; index < loads.length;) {
        const t = loads[index].t;
        const decay = Math.exp(-(t - last) / RECOVERY_MS);
        if (segments.length) segments[segments.length - 1].gap = t - last;
        state.left *= decay;
        state.right *= decay;
        while (index < loads.length && loads[index].t === t) {
            state[loads[index].hand] += loads[index].value;
            index++;
        }
        const pressure =
            Math.max(state.left, state.right) +
            Math.min(state.left, state.right) / 2;
        peak = Math.max(peak, pressure);
        segments.push({ start: pressure, gap: Infinity });
        last = t;
    }
    const spanAbove = (start: number, gap: number, threshold: number) =>
        start <= threshold
            ? 0
            : Math.min(gap, RECOVERY_MS * Math.log(start / threshold));
    const timeAbove = (threshold: number) =>
        segments.reduce(
            (sum, { start, gap }) => sum + spanAbove(start, gap, threshold),
            0
        );
    let low = 0;
    let high = peak;
    for (let step = 0; step < 48; step++) {
        const middle = (low + high) / 2;
        if (timeAbove(middle) > TOP_MS) low = middle;
        else high = middle;
    }
    let area = 0;
    for (const { start, gap } of segments) {
        const span = spanAbove(start, gap, Math.max(low, 1e-12));
        area +=
            start *
            start *
            (RECOVERY_MS / 2) *
            (1 - Math.exp((-2 * span) / RECOVERY_MS));
    }
    return 0.2 * peak + 0.8 * Math.sqrt(area / TOP_MS);
}

function handRows(heads: Head[]) {
    const rows: Record<ChartHand, Row[]> = { left: [], right: [] };
    for (const head of heads) {
        const list = rows[head.hand];
        const row = list.at(-1);
        if (row && head.t - row.t <= ROW_MS) row.heads.push(head);
        else list.push({ t: head.t, heads: [head] });
    }
    return rows;
}

function stairsAndRepetition(rows: Record<ChartHand, Row[]>) {
    const stairs: Load[] = [];
    const repetition: Load[] = [];
    for (const hand of ["left", "right"] as const) {
        const list = rows[hand];
        for (let index = 1; index < list.length; index++) {
            const row = list[index];
            const previous = list[index - 1];
            const gap = row.t - previous.t;
            if (gap > NEAR_MS) continue;
            const repeated = row.heads.filter((head) =>
                previous.heads.some((other) => overlaps(head, other))
            ).length;
            if (repeated) {
                repetition.push({
                    t: row.t,
                    hand,
                    value: Math.sqrt(repeated) * repeatRate(gap),
                });
            }
            const before = list[index - 2];
            if (
                !before ||
                row.heads.length !== 1 ||
                previous.heads.length !== 1 ||
                before.heads.length !== 1 ||
                previous.t - before.t > NEAR_MS
            ) {
                continue;
            }
            const first = previous.heads[0].center - before.heads[0].center;
            const second = row.heads[0].center - previous.heads[0].center;
            if (
                first !== 0 &&
                Math.sign(first) === Math.sign(second) &&
                Math.abs(first) <= STAIR_MAX_STEP &&
                Math.abs(second) <= STAIR_MAX_STEP
            ) {
                stairs.push({ t: row.t, hand, value: speed(gap) });
            }
        }
    }
    return { stairs, repetition };
}

/** 한 박 안에서 한 손은 2분할(8 · 16분), 다른 손은 3분할(셋잇단)만 칠 때 */
function polyrhythm(heads: Head[], ticksPerQuarter: number) {
    const beats = new Map<
        number,
        Record<ChartHand, { two: number; three: number; count: number }>
    >();
    const sixteenth = ticksPerQuarter / 4;
    const tripletEighth = ticksPerQuarter / 3;
    const tripletSixteenth = ticksPerQuarter / 6;
    for (const head of heads) {
        const beat = Math.floor(head.tick / ticksPerQuarter);
        const offset = head.tick - beat * ticksPerQuarter;
        const entry = beats.get(beat) ?? {
            left: { two: 0, three: 0, count: 0 },
            right: { two: 0, three: 0, count: 0 },
        };
        const side = entry[head.hand];
        side.count++;
        if (offset !== 0 && offset % sixteenth === 0) side.two++;
        else if (
            offset % tripletEighth === 0 ||
            offset % tripletSixteenth === 0
        ) {
            if (offset !== 0) side.three++;
        }
        beats.set(beat, entry);
    }
    const loads: Load[] = [];
    for (const [beat, { left, right }] of beats) {
        const crossed =
            (left.two && !left.three && right.three && !right.two) ||
            (right.two && !right.three && left.three && !left.two);
        if (!crossed) continue;
        const t = heads.find(
            (head) => Math.floor(head.tick / ticksPerQuarter) === beat
        )!.t;
        loads.push(
            { t, hand: "left", value: Math.sqrt(left.count) },
            { t, hand: "right", value: Math.sqrt(right.count) }
        );
    }
    return loads;
}

/** 동시치기처럼 모였지만 시각이 조금씩 어긋난 묶음(微ズレ) */
function offset(heads: Head[]) {
    const byTick = new Map<number, Head[]>();
    for (const head of heads) {
        const list = byTick.get(head.tick);
        if (list) list.push(head);
        else byTick.set(head.tick, [head]);
    }
    const ticks = [...byTick.keys()].sort((a, b) => a - b);
    const loads: Load[] = [];
    for (let start = 0; start < ticks.length; start++) {
        let end = start;
        while (
            end + 1 < ticks.length &&
            ticks[end + 1] - ticks[end] <= OFFSET_MAX_TICKS
        ) {
            end++;
        }
        const before =
            start > 0
                ? ticks[start] - ticks[start - 1]
                : Number.POSITIVE_INFINITY;
        const after =
            end + 1 < ticks.length
                ? ticks[end + 1] - ticks[end]
                : Number.POSITIVE_INFINITY;
        const group = ticks
            .slice(start, end + 1)
            .flatMap((tick) => byTick.get(tick)!);
        if (
            end > start &&
            end - start <= 3 &&
            group.length <= 6 &&
            before >= OFFSET_ISOLATION_TICKS &&
            after >= OFFSET_ISOLATION_TICKS
        ) {
            loads.push({
                t: group[0].t,
                hand: group.at(-1)!.hand,
                value: Math.sqrt(group.length),
            });
        }
        start = end;
    }
    return loads;
}

/** 마디 수로 센, 가장 많이 쓰인 박자표가 아닌 마디의 비율 */
function meterChanges(document: ChartDocument) {
    const points = sortTimingPoints(document.timingPoints);
    const end = Math.max(
        points.at(-1)!.tick,
        ...document.notes.map((note) => note.tick + note.durationTicks)
    );
    const measures = new Map<string, number>();
    points.forEach((point, index) => {
        const until = points[index + 1]?.tick ?? end;
        const length =
            (document.ticksPerQuarter * 4 * point.numerator) /
            point.denominator;
        const count = Math.max(1, Math.ceil((until - point.tick) / length));
        const key = `${point.numerator}/${point.denominator}`;
        measures.set(key, (measures.get(key) ?? 0) + count);
    });
    const counts = [...measures.values()];
    const total = counts.reduce((sum, count) => sum + count, 0);
    return (total - Math.max(...counts)) / total;
}

/**
 * 영상 추출은 박자선만 잡고 마디선을 따로 읽지 않아 박자표가 늘 기본값이다 — 공개본 직전 편집(공개 버전 제외)이
 * 영상 추출 가져오기면 변박을 계산하지 않는다. 직전 편집이 없으면 처음부터 사람이 쓴 채보다.
 */
export function isMeterKnown(lastEditKind: string | undefined) {
    return lastEditKind !== "vid2bmap";
}

export function computePatternMetrics(
    document: ChartDocument,
    { meterKnown }: { meterKnown: boolean }
): PatternMetrics {
    const points = sortTimingPoints(document.timingPoints);
    const heads: Head[] = document.notes
        .map((note) => ({
            tick: note.tick,
            t: tickToMilliseconds(note.tick, points, document.ticksPerQuarter),
            hand: note.hand,
            lo: note.lane,
            hi: note.lane + note.width,
            center: note.lane + note.width / 2,
        }))
        .sort((a, b) => a.t - b.t || a.center - b.center);
    const { stairs, repetition } = stairsAndRepetition(handRows(heads));
    return {
        stairs: summarize(stairs),
        repetition: summarize(repetition),
        polyrhythm: summarize(polyrhythm(heads, document.ticksPerQuarter)),
        offset: summarize(offset(heads)),
        chords: meterKnown ? meterChanges(document) : null,
    };
}

/**
 * 같은 기준(난이도 · 전곡) 채보 가운데 상위 1% 의 중앙값을 100% 로 둔 비율(0–1, 넘으면 1).
 * 가장 센 채보 하나가 기준을 끌고 가지 않게 한 개가 아니라 상위 1% 중앙값을 쓴다(max-scouter 와 같다).
 */
export function patternReference(values: number[]) {
    const sorted = values
        .filter((value) => Number.isFinite(value) && value > 0)
        .sort((a, b) => b - a);
    if (!sorted.length) return null;
    const top = sorted.slice(0, Math.max(1, Math.ceil(sorted.length * 0.01)));
    const middle = Math.floor(top.length / 2);
    return top.length % 2 ? top[middle] : (top[middle - 1] + top[middle]) / 2;
}

export function patternStrength(
    value: number | null,
    reference: number | null
) {
    if (value === null) return null;
    if (value === 0) return 0;
    if (reference === null) return null;
    return Math.min(1, value / reference);
}

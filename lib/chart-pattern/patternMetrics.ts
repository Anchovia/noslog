/**
 * 패턴 경향 원점수 — 공개 채보 문서에서 계단 · 연타 · 폴리리듬 · 즈레의 처리 부담을 재고, 변박은 단계로 정하고, 변속은 횟수를 센다.
 * 집계는 max-scouter 패턴 경향과 같다: 손마다 처리량을 1초로 줄여 가며 쌓고, 가장 센 누적 8초의 RMS 와 최고점을
 * 0.8 : 0.2 로 합친다. 0–100% 변환은 patternStrength 가 한다. 무엇을 셀지는 NOSTALGIA 손 영상과
 * ノスしるべ · 나무위키 공략 글의 쓰임에 맞췄다(레인 하나 = 흰건반 하나, hand 칸 = 실제로 치는 손).
 */
import type { ChartDocument, ChartHand, ChartNoteType } from "./schema";
import { sortTimingPoints, tickToMilliseconds } from "./timing";

/** 식이나 계수를 바꾸면 올린다 — 다른 버전 값끼리는 비교하지 않는다 */
export const PATTERN_METRICS_VERSION = 2;

/** 변박 단계 0 없음 · 1 적음 · 2 보통 · 3 많음 */
export type MeterLevel = 0 | 1 | 2 | 3;

/** 칸 이름은 패턴 투표와 같다 — offset = 즈레, chords = 변박 */
export interface PatternMetrics {
    stairs: number;
    repetition: number;
    polyrhythm: number;
    offset: number;
    /** 곡별 기록도 사람이 넣은 박자표도 없으면 null */
    chords: MeterLevel | null;
    /** 변속 횟수 — 세기로 바꾸지 않고 횟수 그대로 보인다 */
    tempoChanges: number;
    tenutoCount: number;
    glissandoCount: number;
    trillCount: number;
}

/** 0–100% 로 보이는 축 — 변박은 단계라 빠진다 */
export const PATTERN_STRENGTH_AXES = [
    "stairs",
    "repetition",
    "polyrhythm",
    "offset",
] as const;

export type PatternStrengthAxis = (typeof PATTERN_STRENGTH_AXES)[number];

const RECOVERY_MS = 1000;
const TOP_MS = 8000;
const ROW_MS = 1;
/** 계단 한 걸음 = 1–3건반, 걸음 사이 0.3초까지, 서로 다른 자리 3곳부터(用語集 「最低3つ」) */
const STAIR_MAX_STEP = 3;
const STAIR_MAX_GAP_MS = 300;
const STAIR_MIN_POSITIONS = 3;
/** 연타 = 같은 손이 0.25초 안에 같은 건반을 다시 치는 일이 두 번 이상 이어질 때 */
const REPEAT_MAX_GAP_MS = 250;
const REPEAT_MIN_RUN = 2;
/** 즈레 = 8–120ms 차로 붙은 두 시각, 앞뒤 간격은 그 차의 두 배 이상 */
const OFFSET_MIN_MS = 8;
const OFFSET_MAX_MS = 120;
const OFFSET_ISOLATION = 2;
const TEMPO_TOLERANCE = 0.02;

interface Head {
    tick: number;
    t: number;
    hand: ChartHand;
    type: ChartNoteType;
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

const sliding = (head: Head) =>
    head.type === "glissando" || head.type === "trill";

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

/**
 * 한 손의 1–2음 줄이 같은 방향으로 1–3건반씩 옮겨 가는 구간. 같은 자리를 다시 치는 줄은 한 칸으로 접어
 * 칸마다 2연타 계단도 계단으로 센다. 글리산도 · 트릴은 손을 미끄러뜨리는 동작이라 뺀다.
 * 빠른 계단은 미끄러뜨려 치고 느린 계단이 더 어렵다는 평이 많아 속도로 가중하지 않는다.
 */
function stairs(rows: Record<ChartHand, Row[]>) {
    const loads: Load[] = [];
    for (const hand of ["left", "right"] as const) {
        let run: { t: number; size: number; center: number }[] = [];
        let positions = 0;
        let direction = 0;
        const flush = () => {
            if (positions >= STAIR_MIN_POSITIONS) {
                for (const row of run.slice(1)) {
                    loads.push({ t: row.t, hand, value: 1 });
                }
            }
            run = [];
            positions = 0;
            direction = 0;
        };
        for (const row of rows[hand]) {
            if (row.heads.some(sliding)) continue;
            const size = row.heads.length;
            const center =
                row.heads.reduce((sum, head) => sum + head.center, 0) / size;
            const entry = { t: row.t, size, center };
            if (size > 2) {
                flush();
                continue;
            }
            const previous = run.at(-1);
            if (!previous || row.t - previous.t > STAIR_MAX_GAP_MS) {
                flush();
                run = [entry];
                positions = 1;
                continue;
            }
            const step = center - previous.center;
            if (size !== previous.size) {
                flush();
                run = [entry];
                positions = 1;
            } else if (Math.abs(step) < 0.5) {
                run.push(entry);
            } else if (
                Math.abs(step) <= STAIR_MAX_STEP &&
                (direction === 0 || Math.sign(step) === direction)
            ) {
                direction = Math.sign(step);
                positions++;
                run.push(entry);
            } else {
                flush();
                run = [entry];
                positions = 1;
            }
        }
        flush();
    }
    return loads;
}

/** 같은 손이 앞 줄과 겹치는 건반을 다시 치는 일이 이어진 구간. 간격이 짧을수록, 겹친 음이 많을수록 크다 */
function repetition(rows: Record<ChartHand, Row[]>) {
    const loads: Load[] = [];
    for (const hand of ["left", "right"] as const) {
        const list = rows[hand].filter((row) => !row.heads.every(sliding));
        let run: Load[] = [];
        const flush = () => {
            if (run.length >= REPEAT_MIN_RUN) loads.push(...run);
            run = [];
        };
        for (let index = 1; index < list.length; index++) {
            const row = list[index];
            const previous = list[index - 1];
            const gap = row.t - previous.t;
            const repeated = row.heads.filter((head) =>
                previous.heads.some(
                    (other) => head.lo < other.hi && other.lo < head.hi
                )
            ).length;
            if (gap <= REPEAT_MAX_GAP_MS && repeated) {
                run.push({
                    t: row.t,
                    hand,
                    value: (Math.sqrt(repeated) * 1000) / Math.max(50, gap),
                });
            } else {
                flush();
            }
        }
        flush();
    }
    return loads;
}

/**
 * 두 박 안에서 한 손은 2분할 계열(8 · 16분), 다른 손은 3분할 계열(셋잇단)을 칠 때(8分 대 12分).
 * 두 손을 함께 보는 축이라 한 흐름으로 쌓는다.
 */
function polyrhythm(heads: Head[], ticksPerQuarter: number) {
    const span = ticksPerQuarter * 2;
    const windows = new Map<
        number,
        { t: number; left: Set<number>; right: Set<number> }
    >();
    for (const head of heads) {
        if (sliding(head)) continue;
        const index = Math.floor(head.tick / span);
        let entry = windows.get(index);
        if (!entry) {
            entry = { t: head.t, left: new Set(), right: new Set() };
            windows.set(index, entry);
        }
        entry[head.hand].add(head.tick - index * span);
    }
    const split = (offset: number) => {
        const inBeat = offset % ticksPerQuarter;
        if (inBeat === 0) return 0;
        if (inBeat % (ticksPerQuarter / 4) === 0) return 2;
        if (inBeat % (ticksPerQuarter / 6) === 0) return 3;
        return null;
    };
    const loads: Load[] = [];
    for (const { t, left, right } of windows.values()) {
        const leftSplits = [...left].map(split);
        const rightSplits = [...right].map(split);
        if (
            (leftSplits.includes(2) && rightSplits.includes(3)) ||
            (leftSplits.includes(3) && rightSplits.includes(2))
        ) {
            loads.push({
                t,
                hand: "left",
                value: Math.sqrt(left.size + right.size),
            });
        }
    }
    return loads;
}

/**
 * 동시치기처럼 붙었지만 조금 어긋난 두 시각(微ズレ). 손을 가리지 않고 한 흐름으로 쌓는다.
 * 영상 추출 채보는 2.5프레임(약 42ms) 안의 어긋남을 박 격자에 붙여 그보다 작은 즈레는 남지 않는다.
 */
function offset(heads: Head[]) {
    const times: number[] = [];
    for (const head of heads) {
        const t = Math.round(head.t);
        if (times.at(-1) !== t) times.push(t);
    }
    const loads: Load[] = [];
    for (let index = 1; index < times.length; index++) {
        const gap = times[index] - times[index - 1];
        if (gap < OFFSET_MIN_MS || gap > OFFSET_MAX_MS) continue;
        const before =
            index >= 2
                ? times[index - 1] - times[index - 2]
                : Number.POSITIVE_INFINITY;
        const after =
            index + 1 < times.length
                ? times[index + 1] - times[index]
                : Number.POSITIVE_INFINITY;
        if (Math.min(before, after) >= OFFSET_ISOLATION * gap) {
            loads.push({ t: times[index], hand: "left", value: 1 });
        }
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
 * 한 박 넘게 이어진 BPM 구간끼리 2% 넘게 바뀐 횟수. 한 박이 안 되는 구간은 박 보정이라 세지 않고,
 * 2배 · 절반은 영상 추출이 박자선을 두 배로 잡은 것과 구분되지 않아 세지 않는다.
 */
function tempoChanges(document: ChartDocument) {
    const points = sortTimingPoints(document.timingPoints);
    const end = Math.max(
        points.at(-1)!.tick,
        ...document.notes.map((note) => note.tick + note.durationTicks)
    );
    const near = (ratio: number, target: number) =>
        Math.abs(ratio / target - 1) <= TEMPO_TOLERANCE;
    const sections = points.filter(
        (point, index) =>
            (points[index + 1]?.tick ?? end) - point.tick >=
            document.ticksPerQuarter
    );
    return sections.filter((point, index) => {
        if (index === 0) return false;
        const ratio = point.bpm / sections[index - 1].bpm;
        return !near(ratio, 1) && !near(ratio, 2) && !near(ratio, 0.5);
    }).length;
}

/** 사람이 넣은 박자표가 둘 이상일 때의 단계 — 주 박자가 아닌 마디 10% 미만 적음 · 30% 미만 보통 · 그 위 많음 */
function meterLevel(ratio: number): MeterLevel {
    if (ratio < 0.1) return 1;
    if (ratio < 0.3) return 2;
    return 3;
}

/**
 * 영상 추출은 박자선만 잡고 마디선을 따로 읽지 않아 박자표가 늘 기본값이다 — 공개본 직전 편집(공개 버전 제외)이
 * 영상 추출 가져오기면 채보의 박자표를 쓰지 않는다. 직전 편집이 없으면 처음부터 사람이 쓴 채보다.
 */
export function isMeterKnown(lastEditKind: string | undefined) {
    return lastEditKind !== "vid2bmap";
}

/**
 * songMeter = 곡별 변박 기록(meterRecord). 공개 채보는 거의 영상 추출이라 박자표가 하나뿐이고,
 * 노트 강세 · BPM 변화 · 분할 전환으로는 변박 곡을 가려내지 못해 사람이 넣은 박자표가 둘 이상일 때만 채보에서 센다.
 */
export function computePatternMetrics(
    document: ChartDocument,
    {
        meterKnown,
        songMeter,
    }: { meterKnown: boolean; songMeter: MeterLevel | null }
): PatternMetrics {
    const points = sortTimingPoints(document.timingPoints);
    const heads: Head[] = document.notes
        .map((note) => ({
            tick: note.tick,
            t: tickToMilliseconds(note.tick, points, document.ticksPerQuarter),
            hand: note.hand,
            type: note.type,
            lo: note.lane,
            hi: note.lane + note.width,
            center: note.lane + note.width / 2,
        }))
        .sort((a, b) => a.t - b.t || a.center - b.center);
    const rows = handRows(heads);
    const ratio = meterKnown ? meterChanges(document) : 0;
    const countType = (type: ChartNoteType) =>
        document.notes.filter((note) => note.type === type).length;
    return {
        stairs: summarize(stairs(rows)),
        repetition: summarize(repetition(rows)),
        polyrhythm: summarize(polyrhythm(heads, document.ticksPerQuarter)),
        offset: summarize(offset(heads)),
        chords: ratio > 0 ? meterLevel(ratio) : songMeter,
        tempoChanges: tempoChanges(document),
        tenutoCount: countType("tenuto"),
        glissandoCount: countType("glissando"),
        trillCount: countType("trill"),
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

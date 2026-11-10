/**
 * vid2bmap(김영훈 · 최성희, KAIST · MIT) 추출 결과 → NosLog 채보 노트.
 *
 * 영상 시각은 쓰지 않는다 — vid2bmap 의 프레임 드롭 보정이 시간축을 구간마다 늘였다 줄이기 때문(Altale 실측 ±0.3초).
 * 노트와 박자선은 같은 띠 위에서 함께 흔들리므로 「앞뒤 박자선 사이 어디쯤인가」 로 박 위치를 계산한다.
 * 게임은 박마다 선을 그린다(Altale: BPM 90 · 40프레임 간격 = 1박). 첫 박자선이 곡의 몇 번째 틱인지는 사람이 정한다.
 * Altale Real 앞부분 232개로 박 위치 · 칸 · 폭 · 종류가 모두 일치함을 확인(2026-09-23).
 * 손은 실행 스크립트가 LR_classification 브랜치 결과에서 붙여 온 것을 쓰고(Altale 232/232, 2026-09-24), 없으면 칸 위치로 추정한다.
 */
import { chartNotesOverlap, findChartNoteConflicts } from "./editor";
import { CHART_LANE_COUNT, CHART_TICKS_PER_QUARTER } from "./schema";
import type { ChartNote, ChartNoteType, ChartTimingPoint } from "./schema";
import { activeTimingPoint, beatTicksOf, sortTimingPoints } from "./timing";
import type { Vid2bmapResult } from "./vid2bmapFile";
import { FIRST_NOTE_EARLY_BEATS, median } from "./vid2bmapShared";

/** 같은 칸 · 같은 종류가 이 프레임 이내로 겹치면 한 노트를 두 번 읽은 것 */
export const VID2BMAP_DUPLICATE_FRAMES = 3;
/** 한 박을 나누는 격자 후보 */
const VID2BMAP_SNAP_DIVISORS = [2, 3, 4, 6, 8, 12, 16] as const;
/**
 * 박마다 격자를 고를 때 허용하는 어긋남(영상 프레임). 박자선 · 노트 위치의 흔들림은 1프레임 안팎이다.
 * 곡 전체 격자로 이보다 크게 어긋나는 박만 다른 격자로 맞춘다.
 * Altale: 1.5 는 정답 232개 중 14개가 틀리고, 3 은 뭉친 곳이 10곳 남아 2.5(정답 그대로 · 뭉친 곳 12 → 3)
 */
const VID2BMAP_LOCAL_GRID_TOLERANCE_FRAMES = 2.5;
/** 칸 위치로 손을 추정할 때 불확실한 가운데 구간(노트 가운데 칸 기준) */
const HAND_UNCERTAIN_MIN = 12;
const HAND_UNCERTAIN_MAX = 16;
/**
 * 손을 읽지 못한 테누토가 이 박 이상 이어지며 다른 노트와 겹치면 영상에 없던 테누토로 본다(2026-09-25 F1′).
 * 영상 대조: 幻想即興曲 47마디 115박 · 64마디 50박, 平均律 30마디 32.5박, パヴァーヌ 37마디 8박 — 그 자리엔 일반 노트만 지나감
 */
const PHANTOM_TENUTO_BEATS = 8;
/**
 * 손을 읽지 못한 일반 노트가 테누토 머리 뒤 이 박 안, 그 테누토 칸 안에 있으면 테누토 몸통을 다시 읽은 것으로 본다(2026-09-25 F1′).
 * 영상 대조: 확인한 곳 모두 누르는 동안 콤보 그대로(ピアノ協奏曲 7마디 3박 +⅜박 등, 0.3–0.6박). 1박 뒤는 진짜 노트였다(かぞへうた 9마디 3박)
 */
const PHANTOM_HEAD_BEATS = 0.75;

type Vid2bmapKind = "standard" | "tenuto" | "trill" | "glissando";

export interface Vid2bmapRawNote {
    kind: Vid2bmapKind;
    y: number;
    endY: number | null;
    lane: number;
    width: number;
    /** 영상에서 읽은 손. 손 열이 없거나 모르면 null */
    hand: ChartNote["hand"] | null;
}

interface Vid2bmapCounts {
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
    /** 읽을 때 바로잡은 박자선(2026-09-25) — ticks 는 자리, 확인하라고 알린다 */
    | {
          kind: "barRepaired";
          inserted: number;
          removed: number;
          ticks: number[];
      }
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
    | { kind: "trillSplit"; count: number }
    /** 손을 읽지 못해 영상에 없던 것으로 보고 뺀 긴 테누토 · 테누토 안 머리의 자리(틱) */
    | { kind: "phantomDropped"; tenutoTicks: number[]; headTicks: number[] }
    /** 같은 칸의 다음 노트를 가로질러 그 노트 한 격자 앞에서 끝낸 테누토의 자리(틱) */
    | { kind: "tenutoTrimmed"; ticks: number[] }
    /** 글리산도 조각을 이어 만든 수 · 이어지지 않아 버린 조각 수 · 가로대를 일반 노트로도 읽어 뺀 수 */
    | {
          kind: "glissandoJoined";
          count: number;
          dropped: number;
          rungNotes: number;
      };

export interface Vid2bmapOptions {
    timingPoints: ChartTimingPoint[];
    /** 첫 박자선의 틱(박 단위로 옮긴다) */
    firstBarTick: number;
    /** 한 박을 몇으로 나눈 격자에 맞출지 */
    snapDivisor: number;
    include: Record<Exclude<Vid2bmapKind, "glissando">, boolean> & {
        /** 조각을 이어 글리산도 노트로(없으면 넣지 않음) */
        glissando?: boolean;
    };
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
    /** 조각을 이어 만든 글리산도 id — 경로는 확인 필요 */
    glissandoIds: string[];
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
        const contains = (outer: Vid2bmapRawNote, inner: Vid2bmapRawNote) =>
            outer.lane <= inner.lane &&
            inner.lane + inner.width <= outer.lane + outer.width;
        // 같은 칸 · 폭이거나, 글리산도가 아니면서 한쪽 칸 범위가 다른 쪽 안에 들어가면 같은 노트
        // (Altale 37마디: 10~12 를 한 프레임 뒤에 11~12 로 한 번 더 읽음 — 같은 순간 칸이 겹치는 두 노트는 채보에 없다)
        const duplicate = kept.find(
            (other) =>
                other.kind === note.kind &&
                note.y - other.y <= VID2BMAP_DUPLICATE_FRAMES &&
                ((other.lane === note.lane && other.width === note.width) ||
                    (note.kind !== "glissando" &&
                        (contains(other, note) || contains(note, other))))
        );
        if (!duplicate) {
            kept.push(note);
            continue;
        }
        duplicates += 1;
        // 넓게 읽은 쪽을 남긴다
        if (note.width > duplicate.width) {
            duplicate.lane = note.lane;
            duplicate.width = note.width;
            duplicate.endY = note.endY;
        }
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
        tick += beatTicksOf(activeTimingPoint(sorted, tick));
        remaining -= 1;
    }
    while (remaining < 0) {
        tick -= beatTicksOf(activeTimingPoint(sorted, tick - 1));
        remaining += 1;
    }
    return tick + remaining * beatTicksOf(activeTimingPoint(sorted, tick));
}

/** 그 자리 타이밍 포인트를 기준으로 한 박 / divisor 격자에 맞춘다 */
export function snapVid2bmapTick(
    tick: number,
    snapDivisor: number,
    timingPoints: ChartTimingPoint[]
) {
    const point = activeTimingPoint(sortTimingPoints(timingPoints), tick);
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
    // 박자선 바로 앞(0.1박 이내)에 찍힌 첫 노트는 그 박자선의 박 — 내림하면 한 박 앞으로 잡혀 첫 노트가 1마디 2박이 된다
    // (アルストロメリア Real: 첫 노트가 박자선보다 1프레임 앞, 2.96박)
    const beats = Math.floor(
        vid2bmapBeatPosition(barRows, first.y) + FIRST_NOTE_EARLY_BEATS
    );
    return origin.tick - beats * beatTicksOf(origin);
}

function barWarnings(
    result: Vid2bmapResult,
    options: Vid2bmapOptions
): Vid2bmapWarning[] {
    const warnings: Vid2bmapWarning[] = [];
    const rows = result.barRows;
    const sortedPoints = sortTimingPoints(options.timingPoints);
    const repairs = result.barRepairs ?? [];
    if (repairs.length > 0) {
        warnings.push({
            kind: "barRepaired",
            inserted: repairs.filter((repair) => repair.kind === "inserted")
                .length,
            removed: repairs.filter((repair) => repair.kind === "removed")
                .length,
            ticks: repairs.map((repair) =>
                Math.round(
                    vid2bmapTickAt(
                        vid2bmapBeatPosition(rows, repair.row),
                        options.firstBarTick,
                        sortedPoints
                    )
                )
            ),
        });
    }
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
        const point = activeTimingPoint(sorted, tick);
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
        const point = activeTimingPoint(sorted, raw);
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
        const point = activeTimingPoint(sorted, tick);
        beatDivisors.set(
            `${point.id}:${Math.round((tick - point.tick) / beatTicksOf(point))}`,
            divisor
        );
    }
    /** 그 자리 박에서 고른 격자(시작 노트가 없는 박은 곡 전체 격자) — 테누토 · 트릴 끝 박에 쓴다 */
    const divisorAt = (raw: number, frameTicks: number) => {
        const point = activeTimingPoint(sorted, raw);
        const tolerance = VID2BMAP_LOCAL_GRID_TOLERANCE_FRAMES * frameTicks;
        const beat = Math.floor(
            (raw - point.tick + tolerance) / beatTicksOf(point)
        );
        return beatDivisors.get(`${point.id}:${beat}`) ?? baseDivisor;
    };
    return { ticks, changedBeats, changed, offGrid, divisorAt };
}

/** 글리산도 조각 사이 최대 간격(영상 프레임) · 한 조각에서 다음 조각까지 최대 칸 이동 — Altale 은 약 5프레임 · 1~2칸, 빠진 조각이 있어도 11프레임 */
const VID2BMAP_GLISSANDO_GAP_FRAMES = 12;
const VID2BMAP_GLISSANDO_LANE_STEP = 4;
/**
 * AI 가 가로대를 건너뛰었다고 보는 조건 — 가로대 간격이 이만큼(프레임) 이상인 느린 글리산도에서, 간격의 RATIO 배 넘게 벌어진 곳만.
 * 빠른 글리산도(2~3프레임)는 간격이 원래 들쭉날쭉해 채우면 판정 수가 넘쳤다(2026-10-19 — 연구실 데이터셋 글리산도 곡
 * 114곡 중 83 → 104곡, 우리 추출 35곡 중 26 → 31곡이 공식 · 콤보와 일치. Altale 34마디 11 · 4프레임은 그대로 채움)
 */
const VID2BMAP_GLISSANDO_SKIP_MIN_FRAMES = 4;
const VID2BMAP_GLISSANDO_SKIP_RATIO = 2.5;

/**
 * 글리산도 조각 → 줄기. vid2bmap 은 대각선 노트를 가로대(조각)마다 [y, x1, x2] 로 준다(Altale 42조각 = 6줄기).
 * y 순으로 간격 · 칸 이동이 한도 안이면 같은 줄기. 조각 하나뿐인 줄기는 버린다(길이 · 방향을 알 수 없음).
 */
export function groupVid2bmapGlissando(pieces: Vid2bmapRawNote[]) {
    const sorted = pieces
        .filter((piece) => piece.kind === "glissando")
        .sort((a, b) => a.y - b.y || a.lane - b.lane);
    const chains: Vid2bmapRawNote[][] = [];
    for (const piece of sorted) {
        const chain = chains.find((candidate) => {
            const last = candidate[candidate.length - 1];
            return (
                piece.y > last.y &&
                piece.y - last.y <= VID2BMAP_GLISSANDO_GAP_FRAMES &&
                Math.abs(piece.lane - last.lane) <= VID2BMAP_GLISSANDO_LANE_STEP
            );
        });
        if (chain) chain.push(piece);
        else chains.push([piece]);
    }
    return {
        chains: chains.filter((chain) => chain.length > 1),
        dropped: chains.filter((chain) => chain.length === 1).length,
    };
}

/** 경로 점 줄이기 — 앞뒤 점을 이은 직선에서 1칸 넘게 벗어나는 점만 남긴다(Ramer–Douglas–Peucker) */
function simplifyPath<T extends { tick: number; lane: number }>(
    points: T[]
): T[] {
    if (points.length <= 2) return points;
    const first = points[0];
    const last = points[points.length - 1];
    let farthest = 0;
    let distance = 0;
    for (let index = 1; index < points.length - 1; index += 1) {
        const point = points[index];
        const ratio =
            last.tick === first.tick
                ? 0
                : (point.tick - first.tick) / (last.tick - first.tick);
        const gap = Math.abs(
            point.lane - (first.lane + (last.lane - first.lane) * ratio)
        );
        if (gap > distance) {
            distance = gap;
            farthest = index;
        }
    }
    if (distance <= 1) return [first, last];
    return [
        ...simplifyPath(points.slice(0, farthest + 1)).slice(0, -1),
        ...simplifyPath(points.slice(farthest)),
    ];
}

/** 뒤에 시작하는 노트와 겹치는 테누토를 그 노트 한 격자 앞에서 끝낸다(겹침이 여럿이면 가장 앞 노트 기준) */
function trimVid2bmapTenutos(
    notes: ChartNote[],
    timingPoints: ChartTimingPoint[],
    snapDivisor: number
) {
    const sorted = sortTimingPoints(timingPoints);
    const byId = new Map(notes.map((note) => [note.id, note]));
    const durations = new Map<string, number>();
    for (const { firstId, secondId } of findChartNoteConflicts(
        notes,
        CHART_TICKS_PER_QUARTER
    )) {
        for (const [tenutoId, otherId] of [
            [firstId, secondId],
            [secondId, firstId],
        ]) {
            const tenuto = byId.get(tenutoId);
            const other = byId.get(otherId);
            if (
                tenuto?.type !== "tenuto" ||
                !other ||
                other.tick <= tenuto.tick
            )
                continue;
            const step =
                beatTicksOf(activeTimingPoint(sorted, other.tick)) /
                snapDivisor;
            const duration = Math.round(other.tick - step - tenuto.tick);
            if (duration <= 0) continue;
            durations.set(
                tenuto.id,
                Math.min(
                    durations.get(tenuto.id) ?? tenuto.durationTicks,
                    duration
                )
            );
        }
    }
    return {
        notes: notes.map((note) =>
            durations.has(note.id)
                ? { ...note, durationTicks: durations.get(note.id)! }
                : note
        ),
        ticks: notes
            .filter((note) => durations.has(note.id))
            .map((note) => note.tick)
            .sort((a, b) => a - b),
    };
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
                beatTicksOf(
                    activeTimingPoint(sortTimingPoints(timingPoints), tick)
                ) / snapDivisor;
            const endY = note.endY ?? note.y;
            const endRaw = rawTickOf(endY);
            // 끝 위치가 아니라 길이를 격자에 맞춘다(Altale 테누토 57개 중 50 정확 — 끝을 맞추면 48).
            // 격자 단위는 끝이 떨어지는 박에서 고른 격자 — 1/6박 곡 안의 1/8박 구간에서 끝이 ⅙ · ⅓ 사이로 갈리지 않게(2026-09-24, 여전히 50)
            const endPoint = activeTimingPoint(
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
                // vid2bmap 은 트릴 머리 폭만 준다. 영상의 육각형은 머리 안에서 한 칸씩 겹쳐 번갈아 간다
                // (Altale 머리 15~18 · 24~27: 두 자리 중심이 약 1칸 차이 — 폭 w-1 두 자리, 2026-09-24). 반으로 나누면 2칸 차이라 어긋남(확인 필요)
                const pairWidth = Math.max(1, note.width - 1);
                chartNote = {
                    ...chartNote,
                    width: pairWidth,
                    pairLane: note.lane + (note.width - pairWidth),
                    pairWidth,
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

    // 손을 읽지 못한 가짜 노트 빼기 — 겹침 재맞춤 전에(가짜와 겹친 노트를 옮기지 않게)
    const phantom = dropVid2bmapPhantoms(
        output,
        new Set(handKnownIds),
        timingPoints
    );
    output = phantom.notes;

    // 빠른 구간(Altale 후반 약 0.1박 간격): 기본 격자로 같은 자리에 뭉쳐 칸이 겹친 노트만 ×2 · ×4 격자로 다시 맞춘다.
    // 이미 겹치지 않는 노트는 건드리지 않는다(앞부분 232개 정답 그대로)
    const refined = new Set<string>();
    // ×6 · ×8 까지(Gaia 1마디: 1프레임 간격 계단 17 → 19 → 21 이 1/16박으로도 뭉침 — 1/24박이면 떨어진다)
    for (const factor of [2, 4, 6, 8]) {
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
    if (phantom.tenutoTicks.length + phantom.headTicks.length > 0) {
        // 노트를 지우는 경고라 맨 앞에(처음 3개만 보인다)
        warnings.unshift({
            kind: "phantomDropped",
            tenutoTicks: phantom.tenutoTicks,
            headTicks: phantom.headTicks,
        });
    }
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
    // 글리산도: 조각을 이어 시작 · 끝 · 꺾이는 점만 남긴 경로로(가로대 간격은 조각 간격, 2026-09-24).
    // 겹침 재맞춤 뒤에 넣는다 — 경로가 다른 노트를 옮기게 하지 않는다
    const glissandoIds: string[] = [];
    let rungNotes = 0;
    const glissando = groupVid2bmapGlissando(notes);
    if (include.glissando) {
        const sortedPoints = sortTimingPoints(timingPoints);
        const snapAt = (y: number) => {
            const raw = rawTickOf(y);
            const point = activeTimingPoint(sortedPoints, raw);
            const step =
                beatTicksOf(point) /
                snapped.divisorAt(raw, rawTickOf(y + 1) - raw);
            return Math.round(
                point.tick + Math.round((raw - point.tick) / step) * step
            );
        };
        for (const chain of glissando.chains) {
            const first = chain[0];
            const tick = snapAt(first.y);
            const path = simplifyPath(
                chain.map((piece) => ({
                    tick: Math.max(tick, snapAt(piece.y)),
                    lane: piece.lane,
                    width: piece.width,
                }))
            );
            // 가로대 하나 = 판정 하나(アルストロメリア 6 · Gaia 10 모두 조각 수 = 판정 수와 맞음, 2026-09-25).
            // 가로대 수 = 조각 수 + AI 가 건너뛴 자리(느린 글리산도에서 보통 간격의 2.5배 넘게 벌어진 곳을 내림으로 — Altale 34마디 11 · 4 · 11 · 4프레임은 하나씩).
            // 세 곡 판정 수와 모두 일치: Altale 1,604 · アルストロメリア 1,394 · Gaia 1,539
            // 게임의 가로대 간격은 표준 격자에 딱 맞지 않아(Gaia 180 BPM: 약 1/9박) 첫 · 끝 조각 사이를 그 수로 나눈다
            const frameGaps = chain
                .slice(1)
                .map((piece, index) => piece.y - chain[index].y);
            const regular = frameGaps
                .filter((frames) => frames >= 2)
                .sort((a, b) => a - b);
            const shortest = regular.filter(
                (frames) => frames <= (regular[0] ?? 0) * 1.5
            );
            const typical =
                shortest[Math.floor(shortest.length / 2)] ?? regular[0] ?? 1;
            const missing =
                typical >= VID2BMAP_GLISSANDO_SKIP_MIN_FRAMES
                    ? frameGaps.reduce(
                          (sum, frames) =>
                              sum +
                              (frames >= typical * VID2BMAP_GLISSANDO_SKIP_RATIO
                                  ? Math.floor(frames / typical) - 1
                                  : 0),
                          0
                      )
                    : 0;
            const rungCount = chain.length + missing;
            const spanTicks = Math.max(
                rungCount - 1,
                snapAt(chain[chain.length - 1].y) - tick
            );
            // 에디터가 그리는 가로대(점 간격 = 온음표 ÷ 연결 간격, 반올림)와 같아지도록 간격 → 연결 간격 → 간격 순으로 맞춘다
            const rungDivisor = Math.min(
                64,
                Math.max(
                    1,
                    Math.round(
                        (CHART_TICKS_PER_QUARTER * 4 * (rungCount - 1)) /
                            spanTicks
                    )
                )
            );
            const rungTicks = Math.round(
                (CHART_TICKS_PER_QUARTER * 4) / rungDivisor
            );
            const endTick = tick + rungTicks * Math.max(1, rungCount - 1);
            const hands = chain.map((piece) => piece.hand).filter(Boolean);
            const left = hands.filter((hand) => hand === "left").length;
            const hand: ChartNote["hand"] =
                hands.length > 0
                    ? left * 2 >= hands.length
                        ? "left"
                        : "right"
                    : first.lane + first.width / 2 <= CHART_LANE_COUNT / 2
                      ? "left"
                      : "right";
            const note: ChartNote = {
                id: createId(),
                type: "glissando",
                hand,
                tick,
                durationTicks: endTick - tick,
                lane: first.lane,
                width: first.width,
                glissandoSnapDivisor: rungDivisor,
                points: [
                    ...new Map(
                        path.slice(1).map((point, index, rest) => {
                            // 꺾이는 점도 가로대 칸에 — 칸 밖이면 가로대가 하나 더 그려진다(가로대 수 = 판정 수)
                            const tickOffset =
                                index === rest.length - 1
                                    ? endTick - tick
                                    : Math.round(
                                          (point.tick - tick) / rungTicks
                                      ) * rungTicks;
                            return [
                                tickOffset,
                                {
                                    tickOffset,
                                    lane: point.lane,
                                    width: point.width,
                                },
                            ] as const;
                        })
                    ).values(),
                ].filter(
                    (point) =>
                        point.tickOffset > 0 &&
                        point.tickOffset <= endTick - tick
                ),
            };
            if (hands.length > 0) handKnownIds.push(note.id);
            glissandoIds.push(note.id);
            // vid2bmap 은 가로대를 일반 노트로도 읽는다(Altale 34마디 3박: 영상엔 띠 하나, 일반 노트 2개가 경로 위에 겹침) — 경로와 겹치는 일반 노트는 뺀다
            const before = output.length;
            output = output.filter(
                (other) =>
                    other.type !== "standard" ||
                    !chartNotesOverlap(note, other, CHART_TICKS_PER_QUARTER)
            );
            rungNotes += before - output.length;
            output.push(note);
        }
    }

    if (include.glissando && glissando.chains.length + glissando.dropped > 0) {
        warnings.push({
            kind: "glissandoJoined",
            count: glissando.chains.length,
            dropped: glissando.dropped,
            rungNotes,
        });
    }
    // 같은 칸의 다음 노트를 가로지르는 테누토 — 건반을 누른 채 같은 건반을 다시 칠 수 없으니 AI 가 끝을 한참 뒤의 끝 모양과
    // 짝지은 것(Field of Hopes and Dreams 16 · Pink Rose 40곳, 2026-09-27). 그 노트 한 격자 앞에서 끝낸다 — 판정 수는 그대로
    const trimmed = trimVid2bmapTenutos(output, timingPoints, snapDivisor);
    output = trimmed.notes;
    if (trimmed.ticks.length > 0)
        warnings.push({ kind: "tenutoTrimmed", ticks: trimmed.ticks });
    if (shortTenuto > 0)
        warnings.push({ kind: "shortTenuto", count: shortTenuto });
    if (trillSplit > 0)
        warnings.push({ kind: "trillSplit", count: trillSplit });
    const kept = new Set(output.map((note) => note.id));
    return {
        notes: output,
        handKnownIds,
        handUncertainIds: handUncertainIds.filter((id) => kept.has(id)),
        gridCheckIds: gridCheckIds.filter((id) => kept.has(id)),
        glissandoIds,
        warnings,
    };
}

/**
 * 손 열이 있는 zip(절반 넘게 손을 읽음)에서 손을 읽지 못한 노트 중 영상에 없던 것으로 보이는 것을 뺀다(2026-09-25 F1′).
 * LR 실행이 손을 못 읽었다 = 그 자리에 노트가 보이지 않았다는 뜻이 많다 — 겹침 10곡 영상 대조에서 가짜 58개 중 50개가 손 없음.
 * 손 열이 없는 옛 zip 은 모두 손이 없으므로 건드리지 않는다
 */
function dropVid2bmapPhantoms(
    notes: ChartNote[],
    handRead: Set<string>,
    timingPoints: ChartTimingPoint[]
) {
    const tenutoTicks: number[] = [];
    const headTicks: number[] = [];
    if (handRead.size * 2 < notes.length) {
        return { notes, tenutoTicks, headTicks };
    }
    const sorted = sortTimingPoints(timingPoints);
    const beatAt = (tick: number) =>
        beatTicksOf(activeTimingPoint(sorted, tick));
    const dropped = new Set<string>();
    for (const note of notes) {
        if (
            note.type !== "tenuto" ||
            handRead.has(note.id) ||
            note.durationTicks < beatAt(note.tick) * PHANTOM_TENUTO_BEATS ||
            !notes.some(
                (other) =>
                    other.id !== note.id &&
                    chartNotesOverlap(note, other, CHART_TICKS_PER_QUARTER)
            )
        ) {
            continue;
        }
        dropped.add(note.id);
        tenutoTicks.push(note.tick);
    }
    const tenutos = notes.filter(
        (note) => note.type === "tenuto" && !dropped.has(note.id)
    );
    for (const note of notes) {
        if (note.type !== "standard" || handRead.has(note.id)) continue;
        const inside = tenutos.some(
            (tenuto) =>
                note.tick > tenuto.tick &&
                note.tick < tenuto.tick + tenuto.durationTicks &&
                note.tick - tenuto.tick <=
                    beatAt(tenuto.tick) * PHANTOM_HEAD_BEATS &&
                note.lane < tenuto.lane + tenuto.width &&
                note.lane + note.width > tenuto.lane
        );
        if (!inside) continue;
        dropped.add(note.id);
        headTicks.push(note.tick);
    }
    return {
        notes: notes.filter((note) => !dropped.has(note.id)),
        tenutoTicks: tenutoTicks.sort((a, b) => a - b),
        headTicks: headTicks.sort((a, b) => a - b),
    };
}

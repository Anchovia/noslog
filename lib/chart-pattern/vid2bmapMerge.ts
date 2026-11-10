import { chartNotesOverlap } from "./editor";
import { CHART_TICKS_PER_QUARTER } from "./schema";
import type { ChartNote, ChartTimingPoint } from "./schema";
import { beatTicksOf, greatestCommonDivisor, sortTimingPoints } from "./timing";
import type { ChartNoteDiff, ChartNoteDiffField } from "./vid2bmapDiff";

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
        const divisor = greatestCommonDivisor(remainder, beatTicks);
        const key = `${remainder / divisor}/${beatTicks / divisor}`;
        fraction = FRACTION_GLYPHS[key] ?? ` ${key}`;
    }
    return `${measureOffset + measureIndex + 1}마디 ${beat + 1}${fraction}박`;
}

type Vid2bmapMergeKind = "changed" | "moved" | "onlyCurrent" | "onlyIncoming";

export interface Vid2bmapMergeItem {
    key: string;
    kind: Vid2bmapMergeKind;
    tick: number;
    current: ChartNote[];
    incoming: ChartNote[];
    fields: ChartNoteDiffField[];
    /** 내 초안에만 있는 노트가 가져올 노트와 겹침 — 남기면 넣을 수 없으니 기본은 빼기 */
    blocksIncoming?: boolean;
}

export interface Vid2bmapMergePlan {
    items: Vid2bmapMergeItem[];
    /** 지금 초안의 마지막 노트 뒤 — 목록 대신 한꺼번에 넣거나 뺀다 */
    newSection: ChartNote[];
    sameCount: number;
}

/**
 * 비교 결과 → 고를 항목. 같은 틱에서 칸이 안 겹쳐 「내 초안에만 + 가져온 것에만」 으로 갈린 것은 한 항목(moved)으로 묶는다.
 * 기본 선택(defaultVid2bmapChoice): 달라짐 · 옮겨짐 · 초안 범위 안 새 노트 = 가져온 것, 내 초안에만 = 내 것
 * (가져올 노트와 겹치면 빼기 — 예: 글리산도 가로대를 일반 노트로 두 번 읽어 초안에 들어가 있던 것).
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
    const incomingNotes = [
        ...diff.same.map(([, note]) => note),
        ...diff.changed.map((change) => change.incoming),
        ...diff.onlyIncoming,
    ];
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
            ...(kind === "onlyCurrent" &&
            entry.current.some((note) =>
                incomingNotes.some((other) =>
                    chartNotesOverlap(note, other, CHART_TICKS_PER_QUARTER)
                )
            )
                ? { blocksIncoming: true }
                : {}),
        });
    }
    items.sort((a, b) => a.tick - b.tick || a.key.localeCompare(b.key));
    return { items, newSection, sameCount: diff.same.length };
}

export type Vid2bmapChoice = "current" | "incoming";

export function defaultVid2bmapChoice(item: Vid2bmapMergeItem): Vid2bmapChoice {
    return item.kind === "onlyCurrent" && !item.blocksIncoming
        ? "current"
        : "incoming";
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
        const divisor = greatestCommonDivisor(remainder, beatTicks);
        const key = `${remainder / divisor}/${beatTicks / divisor}`;
        fraction = FRACTION_GLYPHS[key] ?? `${whole > 0 ? " " : ""}${key}`;
    }
    return `${whole > 0 || !fraction ? whole : ""}${fraction}박`;
}

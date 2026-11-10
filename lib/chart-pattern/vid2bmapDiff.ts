import { CHART_TICKS_PER_QUARTER } from "./schema";
import type { ChartNote } from "./schema";

export type ChartNoteDiffField =
    "tick" | "type" | "lane" | "width" | "duration" | "pair" | "path" | "hand";

/**
 * 같은 틱에 짝이 없을 때, 같은 칸 · 폭 · 종류로 이만큼 안에 있으면 박 위치만 옮겨진 같은 노트로 본다(1/8 사분음표 = 60틱).
 * 예전 1/6박 한 격자로 넣은 초안(¼ 자리가 ⅙ · ⅓ 로 갈림)을 박마다 격자로 다시 가져올 때 「내 초안에만 + 가져온 것에만」 으로 갈리지 않게
 */
const VID2BMAP_NEARBY_TICKS = CHART_TICKS_PER_QUARTER / 8;

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
        current.pairWidth !== incoming.pairWidth ||
        current.trillSnapDivisor !== incoming.trillSnapDivisor
    ) {
        fields.push("pair");
    }
    const pathOf = (note: ChartNote) =>
        JSON.stringify(
            note.points.map(({ tickOffset, lane, width }) => [
                tickOffset,
                lane,
                width,
            ])
        );
    // 가로대 간격도 경로의 일부(2026-09-24 — 빠져서 가로대만 바뀐 글리산도가 「같음」 으로 남았다)
    if (
        pathOf(current) !== pathOf(incoming) ||
        current.glissandoSnapDivisor !== incoming.glissandoSnapDivisor
    ) {
        fields.push("path");
    }
    if (
        current.hand !== incoming.hand &&
        (fields.length > 0 || handKnownIds.has(incoming.id))
    ) {
        fields.push("hand");
    }
    return fields;
}

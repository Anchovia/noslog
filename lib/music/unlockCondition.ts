import type { Difficulty } from "@/components/music/musicDetailTypes";

/**
 * 해금 조건 원문(BEMANIWiki 「Op.3での解禁方法」 · 일본어) 해석 (2026-09-18).
 * 줄마다 「이벤트 이름 (별조각 수)」. 「→」 로 시작하는 줄은 앞 이벤트가 끝난 뒤 옮겨 간 곳.
 * 괄호 숫자 4개 = Normal/Hard/Expert/Real, 3개 = Normal/Hard/Expert, 1개 = 곡 전체.
 * 숫자 3개 줄과 1개 줄이 같이 있으면 1개 줄이 Real 몫이다(예: 第四章 (19/29/33) · 第八章 (20)).
 * 괄호 설명문은 버린다(解禁不要(誰でもプレー可能) → 解禁不要). 줄 전체가 「곡」[난이도]解禁で出現 이면 앞 곡 조건.
 */
export interface UnlockStep {
    /** 이벤트 · 곡 묶음 이름(원문) — 번역 사전의 source_text */
    name: string;
    /** 이 난이도의 필요 별조각 수 — 원문에 없으면 null */
    stardust: number | null;
    /** 앞 이벤트가 끝난 뒤 옮겨 간 곳 */
    moved: boolean;
    /** 다른 곡의 이 난이도를 해금해야 나타남 */
    requires: { title: string; difficulty: string } | null;
}

interface ParsedLine {
    name: string;
    counts: number[] | null;
    moved: boolean;
    requires: UnlockStep["requires"];
}

const DIFFICULTY_INDEX: Record<Difficulty, number> = {
    Normal: 0,
    Hard: 1,
    Expert: 2,
    Real: 3,
};

function parseLine(line: string): ParsedLine | null {
    let text = line.trim();
    if (!text) return null;
    const moved = text.startsWith("→");
    if (moved) text = text.slice(1).trim();
    const match = text.match(/^(.*?)\s*\(([^()]*)\)\s*$/);
    if (!match) return { name: text, counts: null, moved, requires: null };
    const name = match[1].trim();
    const inside = match[2].trim();
    if (/^\d+(\s*\/\s*\d+)*$/.test(inside))
        return {
            name,
            counts: inside.split("/").map((value) => Number(value.trim())),
            moved,
            requires: null,
        };
    const requires = inside.match(/^「(.+)」\[(\w+)\]解禁で出現$/);
    if (!name && requires)
        return {
            name: "",
            counts: null,
            moved,
            requires: { title: requires[1], difficulty: requires[2] },
        };
    // 모르는 설명문 — 이름이 없으면 원문 그대로 이름으로
    return { name: name || text, counts: null, moved, requires: null };
}

/** 이 난이도에 해당하는 해금 단계 — 원문이 없으면 빈 배열 */
export function unlockStepsFor(
    raw: string | null | undefined,
    difficulty: Difficulty
): UnlockStep[] {
    if (!raw?.trim()) return [];
    const lines = raw
        .split("\n")
        .map(parseLine)
        .filter((line): line is ParsedLine => line !== null);
    const index = DIFFICULTY_INDEX[difficulty];
    const splitReal =
        lines.some((line) => line.counts?.length === 3) &&
        lines.some((line) => line.counts?.length === 1);
    return lines
        .filter((line) => {
            if (!splitReal || !line.counts) return true;
            if (line.counts.length === 3) return index < 3;
            if (line.counts.length === 1) return index === 3;
            return true;
        })
        .map((line) => ({
            name: line.name,
            stardust: !line.counts
                ? null
                : line.counts.length === 1
                  ? line.counts[0]
                  : (line.counts[index] ?? null),
            moved: line.moved,
            requires: line.requires,
        }));
}

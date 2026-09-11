import { getJacketUrl } from "@/lib/musicJackets";

export interface BingoProgressCell {
    id: number;
    position: number;
    isCompleted: boolean;
}

const BINGO_LINES = [
    [1, 2, 3, 4, 5],
    [6, 7, 8, 9, 10],
    [11, 12, 13, 14, 15],
    [16, 17, 18, 19, 20],
    [21, 22, 23, 24, 25],
    [1, 6, 11, 16, 21],
    [2, 7, 12, 17, 22],
    [3, 8, 13, 18, 23],
    [4, 9, 14, 19, 24],
    [5, 10, 15, 20, 25],
    [1, 7, 13, 19, 25],
    [5, 9, 13, 17, 21],
] as const;

/** 줄의 종류 — 상세 카드의 「이 칸만 채우면 {줄} 완성」 문구용 */
export type BingoLineKind =
    | { kind: "row"; label: string }
    | { kind: "column"; index: number }
    | { kind: "diagonal" };

export function describeBingoLine(line: readonly number[]): BingoLineKind {
    const first = line[0];
    if (line[1] === first + 1)
        return {
            kind: "row",
            label: String.fromCharCode(65 + Math.floor((first - 1) / 5)),
        };
    if (line[1] === first + 5) return { kind: "column", index: first };
    return { kind: "diagonal" };
}

/** 이 칸을 채우면 완성되는 줄들 (빙고 찬스 칸에서만 비어 있지 않음) */
export function getBingoLinesCompletedBy(
    position: number,
    completedPositions: ReadonlySet<number>
) {
    return BINGO_LINES.map((line): readonly number[] => line)
        .filter(
            (line) =>
                line.includes(position) &&
                line.every(
                    (item) => item === position || completedPositions.has(item)
                )
        )
        .map(describeBingoLine);
}

/** 행(A~E) 단위 진행 — 목록 묶음 헤더용 */
export function getBingoRowProgress(completedPositions: ReadonlySet<number>) {
    return BINGO_LINES.slice(0, 5).map((line: readonly number[], index) => {
        const done = line.filter((position) =>
            completedPositions.has(position)
        ).length;
        return {
            label: String.fromCharCode(65 + index),
            positions: [...line],
            done,
            chance: done === 4,
            complete: done === 5,
        };
    });
}

// 빙고판의 완료 칸, 완성 줄, 빙고 찬스 칸을 한곳에서 계산함
export function getBingoProgress(cells: BingoProgressCell[]) {
    const completedPositions = new Set(
        cells.filter((cell) => cell.isCompleted).map((cell) => cell.position)
    );
    const richPositions = new Set<number>();
    const completedLinePositions: number[][] = [];
    let completedLines = 0;
    let richLines = 0;

    for (const line of BINGO_LINES) {
        const incomplete = line.filter(
            (position) => !completedPositions.has(position)
        );

        if (incomplete.length === 0) {
            completedLines += 1;
            completedLinePositions.push([...line]);
        } else if (incomplete.length === 1) {
            richLines += 1;
            richPositions.add(incomplete[0]);
        }
    }

    return {
        completedCells: completedPositions.size,
        completedLines,
        completedLinePositions,
        richLines,
        richPositions,
        progressPercent: Math.round((completedPositions.size / 25) * 100),
    };
}

export function getBingoJacketUrl(
    musicIndex: string,
    background: string | null
) {
    return getJacketUrl(musicIndex, background);
}

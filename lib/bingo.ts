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
    return (
        background ||
        `https://p.eagate.573.jp/game/nostalgia/op3/img/jacket.html?c=${musicIndex}`
    );
}

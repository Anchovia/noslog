import BingoPlate from "@/components/bingo/bingoPlate";
import db from "@/lib/db";
import getSession from "@/lib/session";

export default async function BingoDetail({
    params,
}: {
    params: { id: string };
}) {
    const cells = await db.bingoCell.findMany({
        where: {
            bingo_id: Number(params.id),
        },
        select: {
            id: true,
            challenge: true,
            music_idx: true,
            position: true,
            category_short: true,
            level: true,
        },
        orderBy: {
            position: "asc",
        },
    });

    const session = await getSession();
    const userClear = await db.userBingoCellData.findMany({
        where: {
            user_id: session.id,
        },
        select: {
            bingo_cell_id: true,
            isCompleted: true,
        },
        orderBy: {
            bingo_cell_id: "asc",
        },
    });

    const bingo = await db.bingo.findUnique({
        where: {
            id: Number(params.id),
        },
        select: {
            music_idx: true,
            line: true,
            nos: true,
            music: {
                select: {
                    title: true,
                    background: true,
                    description: true,
                },
            },
        },
    });

    // userClear를 Map으로 변환
    const userClearMap = new Map(
        userClear.map((clear) => [clear.bingo_cell_id, clear.isCompleted])
    );

    // 빙고 라인 수 계산 함수
    const calculateBingoLines = (
        cells: any[],
        userClearMap: Map<number, boolean>
    ) => {
        // 5x5 그리드로 정렬 (position 기준)
        const grid = Array(5)
            .fill(null)
            .map(() => Array(5).fill(false));

        cells.forEach((cell) => {
            const row = Math.floor((cell.position - 1) / 5);
            const col = (cell.position - 1) % 5;
            grid[row][col] = userClearMap.get(cell.id) === true;
        });

        let lineCount = 0;

        // 가로 라인 체크 (5줄)
        for (let row = 0; row < 5; row++) {
            if (grid[row].every((cell) => cell === true)) {
                lineCount++;
            }
        }

        // 세로 라인 체크 (5줄)
        for (let col = 0; col < 5; col++) {
            if (grid.every((row) => row[col] === true)) {
                lineCount++;
            }
        }

        // 대각선 라인 체크 (좌상->우하)
        if (
            grid[0][0] &&
            grid[1][1] &&
            grid[2][2] &&
            grid[3][3] &&
            grid[4][4]
        ) {
            lineCount++;
        }

        // 대각선 라인 체크 (우상->좌하)
        if (
            grid[0][4] &&
            grid[1][3] &&
            grid[2][2] &&
            grid[3][1] &&
            grid[4][0]
        ) {
            lineCount++;
        }

        return lineCount;
    };

    const currentLines = calculateBingoLines(cells, userClearMap);

    return (
        <main className="p-8 flex flex-col max-w-screen-sm mx-auto items-center justify-center">
            <section className="w-full">
                <div
                    style={{
                        backgroundImage: `${
                            bingo?.music.background
                                ? `url(${bingo.music.background})`
                                : `url(https://p.eagate.573.jp/game/nostalgia/op3/img/jacket.html?c=${bingo?.music_idx})`
                        }`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                    className="relative flex w-full h-32 items-center justify-center"
                >
                    <div className="absolute w-full h-full bg-black/50 backdrop-blur-sm" />
                    <div className="absolute w-full h-full flex flex-col items-center justify-center">
                        <h1 className="bg-black/30 py-3 w-full text-center text-primary">
                            {bingo?.music.title}
                        </h1>
                    </div>
                </div>
                <div className="bg-dark-secondary border-b border-dark-tertiary flex flex-col p-4 gap-4">
                    <div className="flex flex-col gap-1">
                        <span className="text-quinary">Description</span>
                        <span className="text-secondary">
                            {bingo?.music.description}
                        </span>
                    </div>
                    <div className="flex justify-between items-end">
                        <span className="text-tertiary">
                            보상: {bingo?.nos}nos
                        </span>
                        <div className="flex flex-col text-right text-quaternary">
                            <span>필요 줄 수: {bingo?.line}</span>
                            <span>현재 줄 수: {currentLines}</span>
                        </div>
                    </div>
                </div>
            </section>
            <BingoPlate
                cells={cells}
                userClearMap={userClearMap}
                user_id={session.id}
            />
        </main>
    );
}

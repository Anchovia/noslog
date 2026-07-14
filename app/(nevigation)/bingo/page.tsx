import BingoList, { type BingoListItem } from "@/components/bingo/bingoList";
import { getBingoProgress } from "@/lib/bingo";
import db from "@/lib/db";
import getSession from "@/lib/session";

export default async function BingoPage() {
    const session = await getSession();
    const now = new Date();
    const bingos = await db.bingo.findMany({
        where: {
            status: "published",
            AND: [
                { OR: [{ startsAt: null }, { startsAt: { lte: now } }] },
                { OR: [{ endsAt: null }, { endsAt: { gte: now } }] },
            ],
        },
        select: {
            id: true,
            title: true,
            coverMusicIndex: true,
            rewardNos: true,
            requiredLines: true,
            coverMusic: {
                select: {
                    title: true,
                    background: true,
                },
            },
            cells: {
                select: {
                    id: true,
                    position: true,
                    progress: {
                        where: { userId: session.id ?? -1 },
                        select: { isCompleted: true },
                    },
                },
            },
        },
        orderBy: { id: "asc" },
    });

    const items: BingoListItem[] = bingos.map((bingo) => {
        const cells = bingo.cells.map((cell) => ({
            id: cell.id,
            position: cell.position,
            isCompleted: cell.progress.some((data) => data.isCompleted),
        }));
        const progress = getBingoProgress(cells);

        return {
            id: bingo.id,
            title: bingo.title || bingo.coverMusic.title,
            musicIndex: bingo.coverMusicIndex,
            background: bingo.coverMusic.background,
            reward: bingo.rewardNos,
            requiredLines: bingo.requiredLines,
            completedPositions: cells
                .filter((cell) => cell.isCompleted)
                .map((cell) => cell.position),
            richPositions: [...progress.richPositions],
            completedCells: progress.completedCells,
            completedLines: progress.completedLines,
            richLines: progress.richLines,
            progressPercent: progress.progressPercent,
            isCompleted: progress.completedLines >= bingo.requiredLines,
        };
    });

    return <BingoList bingos={items} />;
}

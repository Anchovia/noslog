import BingoList, { type BingoListItem } from "@/components/bingo/bingoList";
import { getBingoProgress } from "@/lib/bingo";
import getSession from "@/lib/session";
import {
    getCachedPublishedBingos,
    getUserBingoCellProgress,
    isBingoAvailable,
} from "./data";

export default async function BingoPage() {
    const [session, publishedBingos] = await Promise.all([
        getSession(),
        getCachedPublishedBingos(),
    ]);
    const bingos = publishedBingos.filter((bingo) => isBingoAvailable(bingo));
    const cellIds = bingos.flatMap((bingo) =>
        bingo.cells.map((cell) => cell.id)
    );
    const userProgress = session.id
        ? await getUserBingoCellProgress(session.id, cellIds)
        : [];
    const completedCellIdSet = new Set(
        userProgress
            .filter((item) => item.isCompleted)
            .map((item) => item.bingoCellId)
    );
    const progressByCellId = new Map(
        userProgress.map((item) => [item.bingoCellId, item])
    );

    const items: BingoListItem[] = bingos.map((bingo) => {
        const cells = bingo.cells.map((cell) => ({
            id: cell.id,
            position: cell.position,
            isCompleted: completedCellIdSet.has(cell.id),
        }));
        const progress = getBingoProgress(cells);
        const lastModifiedAt = bingo.cells.reduce<string | null>(
            (latest, cell) => {
                const updatedAt = progressByCellId.get(cell.id)?.updatedAt;
                return updatedAt && (!latest || updatedAt > latest)
                    ? updatedAt
                    : latest;
            },
            null
        );

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
            lastModifiedAt,
        };
    });

    return <BingoList bingos={items} />;
}

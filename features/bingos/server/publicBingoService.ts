import "server-only";
import {
    getCachedPublishedBingos,
    getCachedBingoDetail,
    isBingoAvailable,
    getUserBingoCellProgress,
} from "@/features/bingos/server/bingoData";
import {
    bingoCatalogItemSchema,
    bingoDetailSchema,
} from "@/features/bingos/schemas/publicBingoSchema";
import { getBingoProgress } from "@/lib/bingo";
import { getUser } from "@/lib/user";

export async function getPublicBingoCatalog() {
    const [user, bingos] = await Promise.all([
        getUser(),
        getCachedPublishedBingos(),
    ]);
    const progress = user
        ? await getUserBingoCellProgress(
              user.id,
              bingos.flatMap((bingo) => bingo.cells.map((cell) => cell.id))
          )
        : [];
    const completed = new Map(
        progress
            .filter((item) => item.isCompleted)
            .map((item) => [item.bingoCellId, item.updatedAt])
    );
    const modified = new Map(
        progress.map((item) => [item.bingoCellId, item.updatedAt])
    );
    return {
        isAuthenticated: Boolean(user),
        items: bingos
            .filter((bingo) => isBingoAvailable(bingo))
            .map((bingo) => {
                const cells = bingo.cells.map((cell) => ({
                    ...cell,
                    isCompleted: completed.has(cell.id),
                }));
                const state = getBingoProgress(cells);
                const times = cells
                    .flatMap((cell) =>
                        modified.get(cell.id) ? [modified.get(cell.id)!] : []
                    )
                    .sort();
                return bingoCatalogItemSchema.parse({
                    id: bingo.id,
                    title: bingo.title || bingo.coverMusic.title,
                    musicIndex: bingo.coverMusicIndex,
                    background: bingo.coverMusic.background,
                    sourceVersion: bingo.sourceVersion,
                    rewardNos: bingo.rewardNos,
                    requiredLines: bingo.requiredLines,
                    completedPositions: cells
                        .filter((cell) => cell.isCompleted)
                        .map((cell) => cell.position),
                    completedLines: state.completedLines,
                    chanceLines: state.richLines,
                    lastModifiedAt: times.at(-1) ?? null,
                });
            }),
    };
}

export async function getPublicBingoDetail(id: number) {
    const [user, bingo] = await Promise.all([
        getUser(),
        getCachedBingoDetail(id),
    ]);
    if (!bingo || !isBingoAvailable(bingo)) return null;
    const progress = user
        ? await getUserBingoCellProgress(
              user.id,
              bingo.cells.map((cell) => cell.id)
          )
        : [];
    return bingoDetailSchema.parse({
        id: bingo.id,
        title: bingo.title || bingo.coverMusic.title,
        musicIndex: bingo.coverMusicIndex,
        background: bingo.coverMusic.background,
        sourceVersion: bingo.sourceVersion,
        requiredLines: bingo.requiredLines,
        rewardNos: bingo.rewardNos,
        lineRewardNos: bingo.lineRewardNos,
        completionRewardNos: bingo.completionRewardNos,
        isAuthenticated: Boolean(user),
        completedCellIds: progress
            .filter((item) => item.isCompleted)
            .map((item) => item.bingoCellId),
        cells: bingo.cells.map((cell) => ({
            id: cell.id,
            position: cell.position,
            challenge: cell.title,
            // The legacy import is Korean. Do not mislabel a reverse translation as an official Japanese source.
            language: "ko",
            missionType: cell.missionType,
            musicIndex: cell.musicIndex,
            categoryShort: cell.categoryShort,
        })),
    });
}

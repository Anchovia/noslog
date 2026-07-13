import { notFound } from "next/navigation";

import BingoPlate, { type BingoCellItem } from "@/components/bingo/bingoPlate";
import { getBingoJacketUrl, getBingoProgress } from "@/lib/bingo";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { formatToComma } from "@/lib/utils";

export default async function BingoDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const bingoId = Number(id);

    if (!Number.isInteger(bingoId)) notFound();

    const session = await getSession();
    const now = new Date();
    const bingo = await db.bingo.findFirst({
        where: {
            id: bingoId,
            status: "published",
            AND: [
                { OR: [{ startsAt: null }, { startsAt: { lte: now } }] },
                { OR: [{ endsAt: null }, { endsAt: { gte: now } }] },
            ],
        },
        select: {
            id: true,
            title: true,
            description: true,
            coverMusicIndex: true,
            requiredLines: true,
            rewardNos: true,
            coverMusic: {
                select: {
                    title: true,
                    background: true,
                    description: true,
                },
            },
            cells: {
                select: {
                    id: true,
                    title: true,
                    missionType: true,
                    musicIndex: true,
                    position: true,
                    categoryShort: true,
                    progress: {
                        where: { userId: session.id ?? -1 },
                        select: { isCompleted: true },
                    },
                },
                orderBy: { position: "asc" },
            },
        },
    });

    if (!bingo) notFound();

    const cells: BingoCellItem[] = bingo.cells.map((cell) => ({
        id: cell.id,
        challenge: cell.title,
        missionType: cell.missionType,
        musicIndex: cell.musicIndex,
        position: cell.position,
        categoryShort: cell.categoryShort,
    }));
    const completedCellIds = bingo.cells
        .filter((cell) => cell.progress.some((data) => data.isCompleted))
        .map((cell) => cell.id);
    const progress = getBingoProgress(
        bingo.cells.map((cell) => ({
            id: cell.id,
            position: cell.position,
            isCompleted: completedCellIds.includes(cell.id),
        }))
    );

    return (
        <div className="flex flex-col gap-4 px-4 py-4">
            <section className="flex items-center gap-3">
                <div
                    className="bg-surface-muted size-12 shrink-0 rounded-md bg-cover bg-center"
                    style={{
                        backgroundImage: `url(${getBingoJacketUrl(bingo.coverMusicIndex, bingo.coverMusic.background)})`,
                    }}
                />
                <div className="min-w-0 flex-1">
                    <h1 className="text-section truncate font-bold">
                        {bingo.title || bingo.coverMusic.title}
                    </h1>
                    <p className="text-caption mt-1 truncate">
                        {bingo.description ||
                            bingo.coverMusic.description ||
                            `${bingo.requiredLines}줄 완성 시 보상 획득`}
                    </p>
                </div>
                <div className="text-caption shrink-0 text-right">
                    <p>줄</p>
                    <p>
                        <strong className="text-text-primary">
                            {progress.completedLines}
                        </strong>{" "}
                        / {bingo.requiredLines}
                    </p>
                </div>
            </section>

            <section>
                <div className="bg-surface-muted h-1 overflow-hidden rounded-full">
                    <div
                        className="bg-chart h-full rounded-full transition-[width]"
                        style={{ width: `${progress.progressPercent}%` }}
                    />
                </div>
                <div className="text-caption mt-2 flex items-center justify-between">
                    <span>
                        줄 {progress.completedLines}/{bingo.requiredLines} · 칸{" "}
                        {progress.completedCells}/25
                    </span>
                    <span className="text-score">
                        보상 {formatToComma(bingo.rewardNos)}nos
                    </span>
                </div>
            </section>

            <BingoPlate
                cells={cells}
                initialCompletedCellIds={completedCellIds}
                canEdit={Boolean(session.id)}
            />
        </div>
    );
}

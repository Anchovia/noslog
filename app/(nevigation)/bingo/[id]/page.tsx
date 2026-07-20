import { notFound } from "next/navigation";

import BingoPlate, { type BingoCellItem } from "@/components/bingo/bingoPlate";
import { getBingoJacketUrl, getBingoProgress } from "@/lib/bingo";
import { createPageMetadata } from "@/lib/metadata/site";
import getSession from "@/lib/session";
import { formatToComma } from "@/lib/utils";
import type { Metadata } from "next";
import {
    getCachedBingoDetail,
    getUserBingoCellProgress,
    isBingoAvailable,
} from "../data";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>;
}): Promise<Metadata> {
    const { id } = await params;
    const bingoId = Number(id);
    const bingo = Number.isInteger(bingoId)
        ? await getCachedBingoDetail(bingoId)
        : null;

    if (!bingo || !isBingoAvailable(bingo)) {
        return createPageMetadata({
            title: "빙고를 찾을 수 없습니다",
            path: "/bingo",
            noIndex: true,
        });
    }

    const title = bingo.title || bingo.coverMusic.title;
    return createPageMetadata({
        title: `${title} 빙고`,
        description:
            bingo.description ||
            `${title} 미션 빙고의 25개 과제와 ${bingo.requiredLines}줄 완성 보상을 확인합니다.`,
        path: `/bingo/${bingo.id}`,
    });
}

export default async function BingoDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const bingoId = Number(id);

    if (!Number.isInteger(bingoId)) notFound();

    const [session, bingo] = await Promise.all([
        getSession(),
        getCachedBingoDetail(bingoId),
    ]);

    if (!bingo || !isBingoAvailable(bingo)) notFound();

    const cells: BingoCellItem[] = bingo.cells.map((cell) => ({
        id: cell.id,
        challenge: cell.title,
        missionType: cell.missionType,
        musicIndex: cell.musicIndex,
        position: cell.position,
        categoryShort: cell.categoryShort,
    }));
    const userProgress = session.id
        ? await getUserBingoCellProgress(
              session.id,
              bingo.cells.map((cell) => cell.id)
          )
        : [];
    const completedCellIdSet = new Set(
        userProgress
            .filter((item) => item.isCompleted)
            .map((item) => item.bingoCellId)
    );
    const progress = getBingoProgress(
        bingo.cells.map((cell) => ({
            id: cell.id,
            position: cell.position,
            isCompleted: completedCellIdSet.has(cell.id),
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
                initialCompletedCellIds={[...completedCellIdSet]}
                canEdit={Boolean(session.id)}
            />
        </div>
    );
}

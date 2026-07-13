import { notFound } from "next/navigation";

import BingoEditor, {
    type BingoEditorData,
} from "@/components/admin/bingoEditor";
import db from "@/lib/db";
import { formatDateInput } from "@/lib/utils";

export default async function EditBingoPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const bingoId = Number(id);
    if (!Number.isInteger(bingoId)) notFound();

    const [bingo, musics] = await Promise.all([
        db.bingo.findUnique({
            where: { id: bingoId },
            include: { cells: { orderBy: { position: "asc" } } },
        }),
        db.music.findMany({
            select: { index: true, title: true },
            orderBy: { title: "asc" },
        }),
    ]);
    if (!bingo) notFound();

    const cellsByPosition = new Map(
        bingo.cells.map((cell) => [cell.position, cell])
    );
    const data: BingoEditorData = {
        id: bingo.id,
        title: bingo.title ?? "",
        description: bingo.description ?? "",
        rewardNos: bingo.rewardNos,
        requiredLines: bingo.requiredLines,
        status: bingo.status,
        startsAt: formatDateInput(bingo.startsAt),
        endsAt: formatDateInput(bingo.endsAt),
        coverMusicIndex: bingo.coverMusicIndex,
        cells: Array.from({ length: 25 }, (_, offset) => {
            const position = offset + 1;
            const cell = cellsByPosition.get(position);
            return {
                position,
                title: cell?.title ?? "",
                missionType: cell?.missionType ?? "record",
                ruleType: cell?.ruleType ?? "manual",
                ruleConfig: cell?.ruleConfig
                    ? JSON.stringify(cell.ruleConfig)
                    : "",
                categoryShort: cell?.categoryShort ?? "",
                targetDifficulty: cell?.targetDifficulty ?? "",
                targetLevel: cell?.targetLevel?.toString() ?? "",
                musicIndex: cell?.musicIndex ?? "",
            };
        }),
    };

    return <BingoEditor bingo={data} musics={musics} />;
}

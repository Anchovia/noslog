import BingoEditor, {
    type BingoEditorData,
} from "@/features/bingos/components/bingoEditor";
import db from "@/lib/db";

export default async function NewBingoPage() {
    const musics = await db.music.findMany({
        select: { index: true, title: true },
        orderBy: { title: "asc" },
    });
    const bingo: BingoEditorData = {
        title: "",
        description: "",
        rewardNos: "0",
        requiredLines: "1",
        status: "draft",
        startsAt: "",
        endsAt: "",
        coverMusicIndex: "",
        cells: Array.from({ length: 25 }, (_, offset) => ({
            position: offset + 1,
            title: "",
            missionType: "record",
            ruleType: "manual",
            ruleConfig: "",
            categoryShort: "",
            targetDifficulty: "",
            targetLevel: "",
            musicIndex: "",
        })),
    };
    return <BingoEditor bingo={bingo} musics={musics} />;
}

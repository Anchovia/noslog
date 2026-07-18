import { saveBingo } from "@/app/admin/bingos/actions";
import BingoBasicFields from "./bingo/bingoBasicFields";
import { DeleteBingoForm, SaveBingoButton } from "./bingo/bingoEditorActions";
import type {
    BingoEditorData,
    BingoMusicOption,
} from "./bingo/bingoEditorTypes";
import BingoMissionList from "./bingo/bingoMissionList";

export type { BingoEditorData } from "./bingo/bingoEditorTypes";

interface BingoEditorProps {
    bingo: BingoEditorData;
    musics: BingoMusicOption[];
}

export default function BingoEditor({ bingo, musics }: BingoEditorProps) {
    return (
        <div className="flex flex-col gap-4 px-4 py-5">
            <section>
                <h1 className="text-title">
                    {bingo.id ? "빙고 수정" : "빙고 추가"}
                </h1>
                <p className="text-caption mt-1">
                    빙고 정보와 25개 미션을 한곳에서 관리합니다.
                </p>
            </section>
            <form action={saveBingo} className="flex flex-col gap-4">
                {bingo.id ? (
                    <input type="hidden" name="id" value={bingo.id} />
                ) : null}
                <BingoBasicFields bingo={bingo} musics={musics} />
                <BingoMissionList cells={bingo.cells} musics={musics} />
                <SaveBingoButton />
            </form>
            {bingo.id ? <DeleteBingoForm bingoId={bingo.id} /> : null}
        </div>
    );
}

import type { BingoEditorData, BingoMusicOption } from "./bingoEditorTypes";
import { BINGO_EDITOR_INPUT_CLASS } from "./bingoEditorUtils";

interface BingoBasicFieldsProps {
    bingo: BingoEditorData;
    musics: BingoMusicOption[];
}

export default function BingoBasicFields({
    bingo,
    musics,
}: BingoBasicFieldsProps) {
    return (
        <section className="bg-surface rounded-card grid grid-cols-2 gap-3 p-3">
            <label className="text-caption col-span-2 flex flex-col gap-1">
                제목
                <input
                    name="title"
                    required
                    defaultValue={bingo.title}
                    className={BINGO_EDITOR_INPUT_CLASS}
                />
            </label>
            <label className="text-caption col-span-2 flex flex-col gap-1">
                설명
                <textarea
                    name="description"
                    rows={2}
                    defaultValue={bingo.description}
                    className="border-border bg-bg text-input w-full resize-none rounded-md border px-3 py-2"
                />
            </label>
            <label className="text-caption col-span-2 flex flex-col gap-1">
                표지 악곡
                <select
                    name="coverMusicIndex"
                    required
                    defaultValue={bingo.coverMusicIndex}
                    className={BINGO_EDITOR_INPUT_CLASS}
                >
                    <option value="">악곡 선택</option>
                    {musics.map((music) => (
                        <option key={music.index} value={music.index}>
                            {music.title}
                        </option>
                    ))}
                </select>
            </label>
            <label className="text-caption flex flex-col gap-1">
                보상 nos
                <input
                    name="rewardNos"
                    type="number"
                    min="0"
                    step="1"
                    defaultValue={bingo.rewardNos}
                    className={BINGO_EDITOR_INPUT_CLASS}
                />
            </label>
            <label className="text-caption flex flex-col gap-1">
                필요 줄 수
                <input
                    name="requiredLines"
                    type="number"
                    min="1"
                    max="12"
                    step="1"
                    defaultValue={bingo.requiredLines}
                    className={BINGO_EDITOR_INPUT_CLASS}
                />
            </label>
            <label className="text-caption flex flex-col gap-1">
                상태
                <select
                    name="status"
                    defaultValue={bingo.status}
                    className={BINGO_EDITOR_INPUT_CLASS}
                >
                    <option value="draft">임시 저장</option>
                    <option value="published">공개</option>
                    <option value="archived">보관</option>
                </select>
            </label>
            <span />
            <label className="text-caption flex flex-col gap-1">
                시작일
                <input
                    name="startsAt"
                    type="date"
                    defaultValue={bingo.startsAt}
                    className={BINGO_EDITOR_INPUT_CLASS}
                />
            </label>
            <label className="text-caption flex flex-col gap-1">
                종료일
                <input
                    name="endsAt"
                    type="date"
                    defaultValue={bingo.endsAt}
                    className={BINGO_EDITOR_INPUT_CLASS}
                />
            </label>
        </section>
    );
}

import type { BingoEditorCellData, BingoMusicOption } from "./bingoEditorTypes";
import {
    BINGO_EDITOR_INPUT_CLASS,
    getBingoEditorCellLabel,
    getBingoEditorCellPrefix,
} from "./bingoEditorUtils";

interface BingoMissionCardProps {
    cell: BingoEditorCellData;
    musics: BingoMusicOption[];
}

export default function BingoMissionCard({
    cell,
    musics,
}: BingoMissionCardProps) {
    const label = getBingoEditorCellLabel(cell.position);
    const prefix = getBingoEditorCellPrefix(cell.position);

    return (
        <details
            className="bg-surface rounded-card group p-3"
            open={cell.position === 1}
        >
            <summary className="flex cursor-pointer list-none items-center gap-3">
                <span className="bg-surface-muted flex size-9 shrink-0 items-center justify-center rounded-md text-sm font-bold">
                    {label}
                </span>
                <strong className="text-body min-w-0 flex-1 truncate font-bold">
                    {cell.title || "미션 입력"}
                </strong>
                <span className="text-caption">{cell.missionType}</span>
            </summary>
            <div className="border-divider mt-3 grid grid-cols-2 gap-2 border-t pt-3">
                <label className="text-caption col-span-2 flex flex-col gap-1">
                    미션 내용
                    <input
                        name={`${prefix}-title`}
                        required
                        defaultValue={cell.title}
                        className={BINGO_EDITOR_INPUT_CLASS}
                    />
                </label>
                <label className="text-caption flex flex-col gap-1">
                    미션 종류
                    <select
                        name={`${prefix}-missionType`}
                        defaultValue={cell.missionType}
                        className={BINGO_EDITOR_INPUT_CLASS}
                    >
                        <option value="record">기록</option>
                        <option value="music">악곡</option>
                        <option value="category">카테고리</option>
                        <option value="exam">검정</option>
                    </select>
                </label>
                <label className="text-caption flex flex-col gap-1">
                    판정 규칙
                    <select
                        name={`${prefix}-ruleType`}
                        defaultValue={cell.ruleType}
                        className={BINGO_EDITOR_INPUT_CLASS}
                    >
                        <option value="manual">수동</option>
                        <option value="score">스코어</option>
                        <option value="play_count">플레이 횟수</option>
                        <option value="rank">랭크</option>
                        <option value="full_combo">풀콤보</option>
                    </select>
                </label>
                <label className="text-caption col-span-2 flex flex-col gap-1">
                    대상 악곡
                    <select
                        name={`${prefix}-musicIndex`}
                        defaultValue={cell.musicIndex}
                        className={BINGO_EDITOR_INPUT_CLASS}
                    >
                        <option value="">없음</option>
                        {musics.map((music) => (
                            <option key={music.index} value={music.index}>
                                {music.title}
                            </option>
                        ))}
                    </select>
                </label>
                <label className="text-caption flex flex-col gap-1">
                    카테고리
                    <input
                        name={`${prefix}-categoryShort`}
                        defaultValue={cell.categoryShort}
                        className={BINGO_EDITOR_INPUT_CLASS}
                    />
                </label>
                <label className="text-caption flex flex-col gap-1">
                    난이도
                    <select
                        name={`${prefix}-targetDifficulty`}
                        defaultValue={cell.targetDifficulty}
                        className={BINGO_EDITOR_INPUT_CLASS}
                    >
                        <option value="">전체</option>
                        <option value="normal">Normal</option>
                        <option value="hard">Hard</option>
                        <option value="expert">Expert</option>
                        <option value="real">Real</option>
                    </select>
                </label>
                <label className="text-caption flex flex-col gap-1">
                    레벨
                    <input
                        name={`${prefix}-targetLevel`}
                        type="number"
                        min="1"
                        max="14"
                        defaultValue={cell.targetLevel}
                        className={BINGO_EDITOR_INPUT_CLASS}
                    />
                </label>
                <label className="text-caption flex flex-col gap-1">
                    규칙 값(JSON)
                    <input
                        name={`${prefix}-ruleConfig`}
                        defaultValue={cell.ruleConfig}
                        placeholder='{"score": 950000}'
                        className={BINGO_EDITOR_INPUT_CLASS}
                    />
                </label>
            </div>
        </details>
    );
}

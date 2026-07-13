import { Save, Trash2 } from "lucide-react";

import { deleteBingo, saveBingo } from "@/app/admin/bingos/actions";

export interface BingoEditorData {
    id?: number;
    title: string;
    description: string;
    rewardNos: number;
    requiredLines: number;
    status: string;
    startsAt: string;
    endsAt: string;
    coverMusicIndex: string;
    cells: Array<{
        position: number;
        title: string;
        missionType: string;
        ruleType: string;
        ruleConfig: string;
        categoryShort: string;
        targetDifficulty: string;
        targetLevel: string;
        musicIndex: string;
    }>;
}

export default function BingoEditor({
    bingo,
    musics,
}: {
    bingo: BingoEditorData;
    musics: Array<{ index: string; title: string }>;
}) {
    const inputClass =
        "border-border bg-bg text-input h-10 w-full rounded-md border px-3";

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
                <section className="bg-surface rounded-card grid grid-cols-2 gap-3 p-3">
                    <label className="text-caption col-span-2 flex flex-col gap-1">
                        제목
                        <input
                            name="title"
                            required
                            defaultValue={bingo.title}
                            className={inputClass}
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
                            className={inputClass}
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
                            className={inputClass}
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
                            className={inputClass}
                        />
                    </label>
                    <label className="text-caption flex flex-col gap-1">
                        상태
                        <select
                            name="status"
                            defaultValue={bingo.status}
                            className={inputClass}
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
                            className={inputClass}
                        />
                    </label>
                    <label className="text-caption flex flex-col gap-1">
                        종료일
                        <input
                            name="endsAt"
                            type="date"
                            defaultValue={bingo.endsAt}
                            className={inputClass}
                        />
                    </label>
                </section>

                <section className="flex flex-col gap-2">
                    <h2 className="text-section font-bold">미션 25칸</h2>
                    {bingo.cells.map((cell) => {
                        const row = String.fromCharCode(
                            65 + Math.floor((cell.position - 1) / 5)
                        );
                        const column = ((cell.position - 1) % 5) + 1;
                        const prefix = `cell-${cell.position}`;
                        return (
                            <details
                                key={cell.position}
                                className="bg-surface rounded-card group p-3"
                                open={cell.position === 1}
                            >
                                <summary className="flex cursor-pointer list-none items-center gap-3">
                                    <span className="bg-surface-muted flex size-9 shrink-0 items-center justify-center rounded-md text-sm font-bold">
                                        {row}
                                        {column}
                                    </span>
                                    <strong className="text-body min-w-0 flex-1 truncate font-bold">
                                        {cell.title || "미션 입력"}
                                    </strong>
                                    <span className="text-caption">
                                        {cell.missionType}
                                    </span>
                                </summary>
                                <div className="border-divider mt-3 grid grid-cols-2 gap-2 border-t pt-3">
                                    <label className="text-caption col-span-2 flex flex-col gap-1">
                                        미션 내용
                                        <input
                                            name={`${prefix}-title`}
                                            required
                                            defaultValue={cell.title}
                                            className={inputClass}
                                        />
                                    </label>
                                    <label className="text-caption flex flex-col gap-1">
                                        미션 종류
                                        <select
                                            name={`${prefix}-missionType`}
                                            defaultValue={cell.missionType}
                                            className={inputClass}
                                        >
                                            <option value="record">기록</option>
                                            <option value="music">악곡</option>
                                            <option value="category">
                                                카테고리
                                            </option>
                                            <option value="exam">검정</option>
                                        </select>
                                    </label>
                                    <label className="text-caption flex flex-col gap-1">
                                        판정 규칙
                                        <select
                                            name={`${prefix}-ruleType`}
                                            defaultValue={cell.ruleType}
                                            className={inputClass}
                                        >
                                            <option value="manual">수동</option>
                                            <option value="score">
                                                스코어
                                            </option>
                                            <option value="play_count">
                                                플레이 횟수
                                            </option>
                                            <option value="rank">랭크</option>
                                            <option value="full_combo">
                                                풀콤보
                                            </option>
                                        </select>
                                    </label>
                                    <label className="text-caption col-span-2 flex flex-col gap-1">
                                        대상 악곡
                                        <select
                                            name={`${prefix}-musicIndex`}
                                            defaultValue={cell.musicIndex}
                                            className={inputClass}
                                        >
                                            <option value="">없음</option>
                                            {musics.map((music) => (
                                                <option
                                                    key={music.index}
                                                    value={music.index}
                                                >
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
                                            className={inputClass}
                                        />
                                    </label>
                                    <label className="text-caption flex flex-col gap-1">
                                        난이도
                                        <select
                                            name={`${prefix}-targetDifficulty`}
                                            defaultValue={cell.targetDifficulty}
                                            className={inputClass}
                                        >
                                            <option value="">전체</option>
                                            <option value="normal">
                                                Normal
                                            </option>
                                            <option value="hard">Hard</option>
                                            <option value="expert">
                                                Expert
                                            </option>
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
                                            className={inputClass}
                                        />
                                    </label>
                                    <label className="text-caption flex flex-col gap-1">
                                        규칙 값(JSON)
                                        <input
                                            name={`${prefix}-ruleConfig`}
                                            defaultValue={cell.ruleConfig}
                                            placeholder='{"score": 950000}'
                                            className={inputClass}
                                        />
                                    </label>
                                </div>
                            </details>
                        );
                    })}
                </section>
                <button className="bg-text-primary text-bg sticky bottom-3 z-10 flex h-11 items-center justify-center gap-2 rounded-md text-sm font-bold shadow-lg">
                    <Save className="size-4" /> 빙고 저장
                </button>
            </form>
            {bingo.id ? (
                <form action={deleteBingo}>
                    <input type="hidden" name="id" value={bingo.id} />
                    <button className="border-danger/50 text-danger flex h-10 w-full items-center justify-center gap-2 rounded-md border text-sm font-bold">
                        <Trash2 className="size-4" /> 진행 기록이 없을 때 삭제
                    </button>
                </form>
            ) : null}
        </div>
    );
}

import { useState } from "react";
import type { Control, FieldErrors, UseFormRegister } from "react-hook-form";
import { useWatch } from "react-hook-form";

import type {
    BingoFormValues,
    BingoValues,
} from "@/features/bingos/schemas/bingo-editor-schema";

import type { BingoMusicOption } from "./bingo-editor-types";
import {
    BINGO_EDITOR_INPUT_CLASS,
    getBingoEditorCellLabel,
} from "./bingo-editor-utils";
import BingoFieldError from "./bingo-field-error";

interface BingoMissionCardProps {
    control: Control<BingoFormValues, unknown, BingoValues>;
    errors: FieldErrors<BingoFormValues>;
    index: number;
    musics: BingoMusicOption[];
    position: number;
    register: UseFormRegister<BingoFormValues>;
    shouldOpen: boolean;
}

export default function BingoMissionCard({
    control,
    errors,
    index,
    musics,
    position,
    register,
    shouldOpen,
}: BingoMissionCardProps) {
    const [isOpen, setIsOpen] = useState(position === 1);
    const fieldPrefix = `cells.${index}` as const;
    const cellErrors = errors.cells?.[index];
    const title = useWatch({
        control,
        name: `${fieldPrefix}.title`,
    });
    const missionType = useWatch({
        control,
        name: `${fieldPrefix}.missionType`,
    });

    return (
        <details
            className="group rounded-nl-control bg-nl-surface p-nl-12"
            open={isOpen || shouldOpen}
            onToggle={(event) => setIsOpen(event.currentTarget.open)}
        >
            <summary className="flex cursor-pointer list-none items-center gap-nl-12">
                <span className="nl-emphasis-label flex size-nl-32 shrink-0 items-center justify-center rounded-nl-control bg-nl-control">
                    {getBingoEditorCellLabel(position)}
                </span>
                <strong className="nl-emphasis-label min-w-0 flex-1 truncate text-nl-content">
                    {title || "미션 입력"}
                </strong>
                <span className="nl-metadata text-nl-subdued">
                    {missionType}
                </span>
            </summary>
            <div className="mt-nl-12 grid grid-cols-2 gap-nl-8 border-t-nl-stroke border-nl-divider pt-nl-12">
                <input
                    type="hidden"
                    {...register(`${fieldPrefix}.position`, {
                        valueAsNumber: true,
                    })}
                />
                <label className="nl-metadata col-span-2 flex flex-col gap-nl-4 text-nl-subdued">
                    미션 내용
                    <input
                        aria-invalid={Boolean(cellErrors?.title)}
                        className={BINGO_EDITOR_INPUT_CLASS}
                        {...register(`${fieldPrefix}.title`)}
                    />
                    <BingoFieldError message={cellErrors?.title?.message} />
                </label>
                <label className="nl-metadata flex flex-col gap-nl-4 text-nl-subdued">
                    미션 종류
                    <select
                        aria-invalid={Boolean(cellErrors?.missionType)}
                        className={BINGO_EDITOR_INPUT_CLASS}
                        {...register(`${fieldPrefix}.missionType`)}
                    >
                        <option value="record">기록</option>
                        <option value="music">악곡</option>
                        <option value="category">카테고리</option>
                        <option value="exam">검정</option>
                    </select>
                    <BingoFieldError
                        message={cellErrors?.missionType?.message}
                    />
                </label>
                <label className="nl-metadata flex flex-col gap-nl-4 text-nl-subdued">
                    판정 규칙
                    <select
                        aria-invalid={Boolean(cellErrors?.ruleType)}
                        className={BINGO_EDITOR_INPUT_CLASS}
                        {...register(`${fieldPrefix}.ruleType`)}
                    >
                        <option value="manual">수동</option>
                        <option value="score">스코어</option>
                        <option value="play_count">플레이 횟수</option>
                        <option value="rank">랭크</option>
                        <option value="full_combo">풀콤보</option>
                    </select>
                    <BingoFieldError message={cellErrors?.ruleType?.message} />
                </label>
                <label className="nl-metadata col-span-2 flex flex-col gap-nl-4 text-nl-subdued">
                    대상 악곡
                    <select
                        aria-invalid={Boolean(cellErrors?.musicIndex)}
                        className={BINGO_EDITOR_INPUT_CLASS}
                        {...register(`${fieldPrefix}.musicIndex`)}
                    >
                        <option value="">없음</option>
                        {musics.map((music) => (
                            <option key={music.index} value={music.index}>
                                {music.title}
                            </option>
                        ))}
                    </select>
                    <BingoFieldError
                        message={cellErrors?.musicIndex?.message}
                    />
                </label>
                <label className="nl-metadata flex flex-col gap-nl-4 text-nl-subdued">
                    카테고리
                    <input
                        aria-invalid={Boolean(cellErrors?.categoryShort)}
                        className={BINGO_EDITOR_INPUT_CLASS}
                        {...register(`${fieldPrefix}.categoryShort`)}
                    />
                    <BingoFieldError
                        message={cellErrors?.categoryShort?.message}
                    />
                </label>
                <label className="nl-metadata flex flex-col gap-nl-4 text-nl-subdued">
                    난이도
                    <select
                        aria-invalid={Boolean(cellErrors?.targetDifficulty)}
                        className={BINGO_EDITOR_INPUT_CLASS}
                        {...register(`${fieldPrefix}.targetDifficulty`)}
                    >
                        <option value="">전체</option>
                        <option value="normal">Normal</option>
                        <option value="hard">Hard</option>
                        <option value="expert">Expert</option>
                        <option value="real">Real</option>
                    </select>
                    <BingoFieldError
                        message={cellErrors?.targetDifficulty?.message}
                    />
                </label>
                <label className="nl-metadata flex flex-col gap-nl-4 text-nl-subdued">
                    레벨
                    <input
                        type="number"
                        min="1"
                        max="14"
                        inputMode="numeric"
                        aria-invalid={Boolean(cellErrors?.targetLevel)}
                        className={BINGO_EDITOR_INPUT_CLASS}
                        {...register(`${fieldPrefix}.targetLevel`)}
                    />
                    <BingoFieldError
                        message={cellErrors?.targetLevel?.message}
                    />
                </label>
                <label className="nl-metadata flex flex-col gap-nl-4 text-nl-subdued">
                    규칙 값(JSON)
                    <input
                        placeholder='{"score": 950000}'
                        aria-invalid={Boolean(cellErrors?.ruleConfig)}
                        className={BINGO_EDITOR_INPUT_CLASS}
                        {...register(`${fieldPrefix}.ruleConfig`)}
                    />
                    <BingoFieldError
                        message={cellErrors?.ruleConfig?.message}
                    />
                </label>
            </div>
        </details>
    );
}

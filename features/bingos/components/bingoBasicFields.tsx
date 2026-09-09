import type { FieldErrors, UseFormRegister } from "react-hook-form";

import type { BingoFormValues } from "@/features/bingos/schemas/bingoEditorSchema";

import BingoFieldError from "./bingoFieldError";
import type { BingoMusicOption } from "./bingoEditorTypes";
import { BINGO_EDITOR_INPUT_CLASS } from "./bingoEditorUtils";

interface BingoBasicFieldsProps {
    errors: FieldErrors<BingoFormValues>;
    musics: BingoMusicOption[];
    register: UseFormRegister<BingoFormValues>;
}

export default function BingoBasicFields({
    errors,
    musics,
    register,
}: BingoBasicFieldsProps) {
    return (
        <section className="bg-surface rounded-card grid grid-cols-2 gap-3 p-3">
            <label className="text-caption col-span-2 flex flex-col gap-1">
                제목
                <input
                    aria-invalid={Boolean(errors.title)}
                    className={BINGO_EDITOR_INPUT_CLASS}
                    {...register("title")}
                />
                <BingoFieldError message={errors.title?.message} />
            </label>
            <label className="text-caption col-span-2 flex flex-col gap-1">
                설명
                <textarea
                    rows={2}
                    aria-invalid={Boolean(errors.description)}
                    className="border-border bg-bg text-input focus:border-focus w-full resize-none rounded-md border px-3 py-2 outline-none"
                    {...register("description")}
                />
                <BingoFieldError message={errors.description?.message} />
            </label>
            <label className="text-caption col-span-2 flex flex-col gap-1">
                표지 악곡
                <select
                    aria-invalid={Boolean(errors.coverMusicIndex)}
                    className={BINGO_EDITOR_INPUT_CLASS}
                    {...register("coverMusicIndex")}
                >
                    <option value="">악곡 선택</option>
                    {musics.map((music) => (
                        <option key={music.index} value={music.index}>
                            {music.title}
                        </option>
                    ))}
                </select>
                <BingoFieldError message={errors.coverMusicIndex?.message} />
            </label>
            <label className="text-caption flex flex-col gap-1">
                보상 nos
                <input
                    type="number"
                    min="0"
                    step="1"
                    inputMode="numeric"
                    aria-invalid={Boolean(errors.rewardNos)}
                    className={BINGO_EDITOR_INPUT_CLASS}
                    {...register("rewardNos")}
                />
                <BingoFieldError message={errors.rewardNos?.message} />
            </label>
            <label className="text-caption flex flex-col gap-1">
                필요 줄 수
                <input
                    type="number"
                    min="1"
                    max="12"
                    step="1"
                    inputMode="numeric"
                    aria-invalid={Boolean(errors.requiredLines)}
                    className={BINGO_EDITOR_INPUT_CLASS}
                    {...register("requiredLines")}
                />
                <BingoFieldError message={errors.requiredLines?.message} />
            </label>
            <label className="text-caption flex flex-col gap-1">
                상태
                <select
                    aria-invalid={Boolean(errors.status)}
                    className={BINGO_EDITOR_INPUT_CLASS}
                    {...register("status")}
                >
                    <option value="draft">임시 저장</option>
                    <option value="published">공개</option>
                    <option value="archived">보관</option>
                </select>
                <BingoFieldError message={errors.status?.message} />
            </label>
            <span />
            <label className="text-caption flex flex-col gap-1">
                시작일
                <input
                    type="date"
                    aria-invalid={Boolean(errors.startsAt)}
                    className={BINGO_EDITOR_INPUT_CLASS}
                    {...register("startsAt")}
                />
                <BingoFieldError message={errors.startsAt?.message} />
            </label>
            <label className="text-caption flex flex-col gap-1">
                종료일
                <input
                    type="date"
                    aria-invalid={Boolean(errors.endsAt)}
                    className={BINGO_EDITOR_INPUT_CLASS}
                    {...register("endsAt")}
                />
                <BingoFieldError message={errors.endsAt?.message} />
            </label>
        </section>
    );
}

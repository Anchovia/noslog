import type { FieldErrors, UseFormRegister } from "react-hook-form";

import type { BingoFormValues } from "@/features/bingos/schemas/bingo-editor-schema";

import type { BingoMusicOption } from "./bingo-editor-types";
import { BINGO_EDITOR_INPUT_CLASS } from "./bingo-editor-utils";
import BingoFieldError from "./bingo-field-error";

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
        <section className="grid grid-cols-2 gap-3 rounded-card bg-surface p-3">
            <label className="col-span-2 flex flex-col gap-1 text-caption">
                제목
                <input
                    aria-invalid={Boolean(errors.title)}
                    className={BINGO_EDITOR_INPUT_CLASS}
                    {...register("title")}
                />
                <BingoFieldError message={errors.title?.message} />
            </label>
            <label className="col-span-2 flex flex-col gap-1 text-caption">
                설명
                <textarea
                    rows={2}
                    aria-invalid={Boolean(errors.description)}
                    className="w-full resize-none rounded-md border border-border bg-bg px-3 py-2 text-input outline-none focus:border-focus"
                    {...register("description")}
                />
                <BingoFieldError message={errors.description?.message} />
            </label>
            <label className="col-span-2 flex flex-col gap-1 text-caption">
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
            <label className="flex flex-col gap-1 text-caption">
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
            <label className="flex flex-col gap-1 text-caption">
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
            <label className="flex flex-col gap-1 text-caption">
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
            <label className="flex flex-col gap-1 text-caption">
                시작일
                <input
                    type="date"
                    aria-invalid={Boolean(errors.startsAt)}
                    className={BINGO_EDITOR_INPUT_CLASS}
                    {...register("startsAt")}
                />
                <BingoFieldError message={errors.startsAt?.message} />
            </label>
            <label className="flex flex-col gap-1 text-caption">
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

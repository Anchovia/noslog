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
        <section className="grid grid-cols-2 gap-nl-12 rounded-nl-control bg-nl-surface p-nl-12">
            <label className="nl-metadata col-span-2 flex flex-col gap-nl-4 text-nl-subdued">
                제목
                <input
                    aria-invalid={Boolean(errors.title)}
                    className={BINGO_EDITOR_INPUT_CLASS}
                    {...register("title")}
                />
                <BingoFieldError message={errors.title?.message} />
            </label>
            <label className="nl-metadata col-span-2 flex flex-col gap-nl-4 text-nl-subdued">
                설명
                <textarea
                    rows={2}
                    aria-invalid={Boolean(errors.description)}
                    className="nl-input resize-none"
                    {...register("description")}
                />
                <BingoFieldError message={errors.description?.message} />
            </label>
            <label className="nl-metadata col-span-2 flex flex-col gap-nl-4 text-nl-subdued">
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
            <label className="nl-metadata flex flex-col gap-nl-4 text-nl-subdued">
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
            <label className="nl-metadata flex flex-col gap-nl-4 text-nl-subdued">
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
            <label className="nl-metadata flex flex-col gap-nl-4 text-nl-subdued">
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
            <label className="nl-metadata flex flex-col gap-nl-4 text-nl-subdued">
                시작일
                <input
                    type="date"
                    aria-invalid={Boolean(errors.startsAt)}
                    className={BINGO_EDITOR_INPUT_CLASS}
                    {...register("startsAt")}
                />
                <BingoFieldError message={errors.startsAt?.message} />
            </label>
            <label className="nl-metadata flex flex-col gap-nl-4 text-nl-subdued">
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

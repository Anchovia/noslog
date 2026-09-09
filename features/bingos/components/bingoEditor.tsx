"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { saveBingo } from "@/app/admin/bingos/actions";
import {
    bingoFormSchema,
    createBingoFormData,
    type BingoFormValues,
    type BingoValues,
} from "@/features/bingos/schemas/bingoEditorSchema";
import { applyFormFieldErrors } from "@/lib/forms/errors";

import BingoBasicFields from "./bingoBasicFields";
import { DeleteBingoButton, SaveBingoButton } from "./bingoEditorActions";
import type { BingoEditorData, BingoMusicOption } from "./bingoEditorTypes";
import BingoMissionList from "./bingoMissionList";

export type { BingoEditorData } from "./bingoEditorTypes";

interface BingoEditorProps {
    bingo: BingoEditorData;
    musics: BingoMusicOption[];
}

export default function BingoEditor({ bingo, musics }: BingoEditorProps) {
    const router = useRouter();
    const {
        control,
        register,
        handleSubmit,
        setError,
        clearErrors,
        formState: { errors, isSubmitting },
    } = useForm<BingoFormValues, unknown, BingoValues>({
        resolver: zodResolver(bingoFormSchema),
        defaultValues: bingo,
        shouldFocusError: false,
    });

    async function handleBingoSubmit(values: BingoValues) {
        clearErrors();

        try {
            const result = await saveBingo(
                createBingoFormData(values, bingo.id)
            );
            if (!result.success) {
                applyFormFieldErrors(setError, result.fieldErrors);
                setError("root.server", {
                    type: "server",
                    message: result.message,
                });
                toast.error(result.message);
                return;
            }

            toast.success(result.message);
            if (bingo.id === undefined) {
                router.replace(`/admin/bingos/${result.id}`);
            } else {
                router.refresh();
            }
        } catch {
            const message = "빙고를 저장하지 못했습니다.";
            setError("root.server", { type: "server", message });
            toast.error(message);
        }
    }

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
            <form
                noValidate
                onSubmit={handleSubmit(handleBingoSubmit, () =>
                    toast.error("빙고 입력을 확인해주세요.")
                )}
                className="flex flex-col gap-4"
            >
                <BingoBasicFields
                    errors={errors}
                    musics={musics}
                    register={register}
                />
                <BingoMissionList
                    cells={bingo.cells}
                    control={control}
                    errors={errors}
                    musics={musics}
                    register={register}
                />
                {errors.root?.server?.message ? (
                    <p className="text-danger text-xs" role="alert">
                        {errors.root.server.message}
                    </p>
                ) : null}
                <SaveBingoButton isSubmitting={isSubmitting} />
            </form>
            {bingo.id ? <DeleteBingoButton bingoId={bingo.id} /> : null}
        </div>
    );
}

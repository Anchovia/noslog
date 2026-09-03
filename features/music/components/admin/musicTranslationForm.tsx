"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { saveMusicTranslation } from "@/app/admin/music/actions";
import {
    createMusicTranslationFormData,
    MUSIC_TRANSLATION_TITLE_MAX_LENGTH,
    musicTranslationFormSchema,
    type MusicTranslationFormValues,
    type MusicTranslationLocale,
    type MusicTranslationStatus,
    type MusicTranslationValues,
} from "@/features/music/schemas/musicTranslationAdminSchema";
import { applyFormFieldErrors } from "@/lib/forms/errors";

const inputClass =
    "border-border bg-bg text-input h-11 w-full rounded-md border px-3";

interface MusicTranslationFormProps {
    label: string;
    locale: MusicTranslationLocale;
    musicIndex: string;
    status: MusicTranslationStatus;
    title: string;
}

export default function MusicTranslationForm({
    label,
    locale,
    musicIndex,
    status,
    title,
}: MusicTranslationFormProps) {
    const router = useRouter();
    const {
        clearErrors,
        formState: { errors, isSubmitting },
        handleSubmit,
        register,
        reset,
        setError,
    } = useForm<MusicTranslationFormValues, unknown, MusicTranslationValues>({
        resolver: zodResolver(musicTranslationFormSchema),
        defaultValues: {
            musicIndex,
            locale,
            title,
            status,
        },
        shouldFocusError: false,
    });

    async function handleMusicTranslationSubmit(
        values: MusicTranslationValues
    ) {
        clearErrors();

        try {
            const result = await saveMusicTranslation(
                createMusicTranslationFormData(values)
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

            reset(values);
            toast.success(result.message);
            router.refresh();
        } catch {
            const message = "악곡 번역을 저장하지 못했습니다.";
            setError("root.server", { type: "server", message });
            toast.error(message);
        }
    }

    return (
        <form
            noValidate
            onSubmit={handleSubmit(handleMusicTranslationSubmit, () =>
                toast.error("악곡 번역 입력을 확인해주세요.")
            )}
            className="border-divider flex flex-col gap-2 border-t pt-3 first:border-t-0 first:pt-0"
        >
            <input type="hidden" {...register("musicIndex")} />
            <input type="hidden" {...register("locale")} />
            <label className="text-caption flex flex-col gap-1">
                {label} 제목
                <input
                    maxLength={MUSIC_TRANSLATION_TITLE_MAX_LENGTH}
                    aria-invalid={Boolean(errors.title)}
                    className={inputClass}
                    {...register("title")}
                />
            </label>
            {errors.title?.message ? (
                <p className="text-danger text-xs" role="alert">
                    {errors.title.message}
                </p>
            ) : null}
            <label className="text-caption flex flex-col gap-1">
                검수 상태
                <select
                    aria-invalid={Boolean(errors.status)}
                    className={inputClass}
                    {...register("status")}
                >
                    <option value="draft">초안</option>
                    <option value="approved">승인</option>
                </select>
            </label>
            {errors.status?.message ? (
                <p className="text-danger text-xs" role="alert">
                    {errors.status.message}
                </p>
            ) : null}
            {errors.root?.server?.message ? (
                <p className="text-danger text-xs" role="alert">
                    {errors.root.server.message}
                </p>
            ) : null}
            <button
                type="submit"
                disabled={isSubmitting}
                className="bg-text-primary text-bg ml-auto flex h-10 cursor-pointer items-center gap-1 rounded-md px-3 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-60"
            >
                <Save className="size-4" aria-hidden />
                {isSubmitting ? "저장 중..." : label + " 번역 저장"}
            </button>
        </form>
    );
}

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { saveMusicTranslation } from "@/app/admin/music/actions";
import {
    AdminCard,
    AdminCardHead,
    AdminReadRow,
    AdminReadRows,
    AdminStatus,
} from "@/components/admin/admin-card";
import AdminDrawer from "@/components/admin/admin-drawer";
import {
    AdminFieldError,
    adminInputClass as inputClass,
} from "@/components/admin/admin-form";
import ActionMenu from "@/components/ui/action-menu";
import { DrawerFooter } from "@/features/music/components/admin/music-metadata-forms";
import {
    createMusicTranslationFormData,
    MUSIC_TRANSLATION_TITLE_MAX_LENGTH,
    musicTranslationFormSchema,
    type MusicTranslationFormValues,
    type MusicTranslationLocale,
    type MusicTranslationStatus,
    type MusicTranslationValues,
} from "@/features/music/schemas/music-translation-admin-schema";
import { applyFormActionFailure, applyFormRootError } from "@/lib/forms/errors";

const LANGUAGES = [
    { locale: "ko", label: "한국어" },
    { locale: "en", label: "영어" },
] as const;

const STATUS_LABEL: Record<MusicTranslationStatus, string> = {
    draft: "초안",
    approved: "승인",
};

interface MusicTranslationFormProps {
    musicIndex: string;
    translations: {
        locale: MusicTranslationLocale;
        status: MusicTranslationStatus;
        title: string;
    }[];
}

export default function MusicTranslationForm({
    musicIndex,
    translations,
}: MusicTranslationFormProps) {
    const [editing, setEditing] = useState<MusicTranslationLocale | null>(null);
    const rows = LANGUAGES.map((language) => {
        const translation = translations.find(
            (item) => item.locale === language.locale
        );
        return {
            ...language,
            title: translation?.title ?? "",
            status: translation?.status ?? "draft",
        };
    });

    return (
        <AdminCard>
            <AdminCardHead
                title="번역 제목"
                level="h2"
                actions={
                    <ActionMenu
                        label="번역 제목 메뉴"
                        items={rows.map((row) => ({
                            label: row.label + " 고치기",
                            onSelect: () => setEditing(row.locale),
                        }))}
                    />
                }
            />
            <AdminReadRows>
                {rows.map((row) => (
                    <AdminReadRow key={row.locale} label={row.label}>
                        <span className="flex flex-wrap items-center gap-nl-8">
                            {row.title || "-"}
                            <AdminStatus
                                tone={
                                    row.status === "approved"
                                        ? "success"
                                        : "empty"
                                }
                            >
                                {STATUS_LABEL[row.status]}
                            </AdminStatus>
                        </span>
                    </AdminReadRow>
                ))}
            </AdminReadRows>
            {rows.map((row) => (
                <MusicTranslationEditor
                    key={row.locale}
                    open={editing === row.locale}
                    onOpenChange={(open) =>
                        setEditing(open ? row.locale : null)
                    }
                    musicIndex={musicIndex}
                    locale={row.locale}
                    label={row.label}
                    title={row.title}
                    status={row.status}
                />
            ))}
        </AdminCard>
    );
}

function MusicTranslationEditor({
    open,
    onOpenChange,
    label,
    locale,
    musicIndex,
    status,
    title,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    label: string;
    locale: MusicTranslationLocale;
    musicIndex: string;
    status: MusicTranslationStatus;
    title: string;
}) {
    const router = useRouter();
    const formId = useId();
    const savedValues = { musicIndex, locale, title, status };
    const {
        clearErrors,
        formState: { errors, isSubmitting },
        handleSubmit,
        register,
        reset,
        setError,
    } = useForm<MusicTranslationFormValues, unknown, MusicTranslationValues>({
        resolver: zodResolver(musicTranslationFormSchema),
        defaultValues: savedValues,
        shouldFocusError: false,
    });

    // 서랍을 열 때마다 저장된 값에서 시작한다 — 취소한 입력이 다음에 남지 않게
    function changeOpen(next: boolean) {
        if (next) reset(savedValues);
        onOpenChange(next);
    }

    async function handleMusicTranslationSubmit(
        values: MusicTranslationValues
    ) {
        clearErrors();

        try {
            const result = await saveMusicTranslation(
                createMusicTranslationFormData(values)
            );
            if (!result.success) {
                applyFormActionFailure(setError, result, toast.error);
                return;
            }

            reset(values);
            toast.success(result.message);
            onOpenChange(false);
            router.refresh();
        } catch {
            const message = "악곡 번역을 저장하지 못했습니다.";
            applyFormRootError(setError, message, toast.error);
        }
    }

    return (
        <AdminDrawer
            open={open}
            onOpenChange={changeOpen}
            title={label + " 번역 고치기"}
            footer={
                <DrawerFooter
                    formId={formId}
                    isSubmitting={isSubmitting}
                    submitLabel={label + " 번역 저장"}
                    onCancel={() => onOpenChange(false)}
                />
            }
        >
            <form
                id={formId}
                noValidate
                onSubmit={handleSubmit(handleMusicTranslationSubmit, () =>
                    toast.error("악곡 번역 입력을 확인해주세요.")
                )}
                className="flex flex-col gap-nl-16"
            >
                <p className="nl-metadata text-nl-subdued">
                    승인 상태인 제목만 사용자 화면에 표시됩니다. 제목을 비우고
                    저장하면 삭제됩니다.
                </p>
                <input type="hidden" {...register("musicIndex")} />
                <input type="hidden" {...register("locale")} />
                <label className="nl-metadata flex flex-col gap-nl-4 text-nl-subdued">
                    {label} 제목
                    <input
                        maxLength={MUSIC_TRANSLATION_TITLE_MAX_LENGTH}
                        aria-invalid={Boolean(errors.title)}
                        className={inputClass}
                        {...register("title")}
                    />
                </label>
                <AdminFieldError
                    message={errors.title?.message}
                    className="nl-metadata text-nl-error"
                />
                <label className="nl-metadata flex flex-col gap-nl-4 text-nl-subdued">
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
                <AdminFieldError
                    message={errors.status?.message}
                    className="nl-metadata text-nl-error"
                />
                <AdminFieldError
                    message={errors.root?.server?.message}
                    className="nl-metadata text-nl-error"
                />
            </form>
        </AdminDrawer>
    );
}

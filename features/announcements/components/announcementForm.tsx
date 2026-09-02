"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Megaphone, Plus, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
    createAnnouncement,
    updateAnnouncement,
} from "@/app/admin/announcements/actions";
import {
    ANNOUNCEMENT_CONTENT_MAX_LENGTH,
    ANNOUNCEMENT_TITLE_MAX_LENGTH,
    announcementFormSchema,
    createAnnouncementFormData,
    type AnnouncementFormValues,
    type AnnouncementValues,
} from "@/features/announcements/schemas/announcementSchema";
import { applyFormFieldErrors } from "@/lib/forms/errors";

const inputClass =
    "border-border bg-bg text-input placeholder:text-text-disabled w-full rounded-md border px-3 outline-none focus:border-focus";

interface AnnouncementFormProps {
    mode: "create" | "update";
    announcement?: {
        id: number;
        title: string;
        content: string;
        isPublished: boolean;
    };
}

function FieldError({ message }: { message?: string }) {
    return message ? (
        <p className="text-danger mt-1 text-xs">{message}</p>
    ) : null;
}

export default function AnnouncementForm({
    mode,
    announcement,
}: AnnouncementFormProps) {
    const router = useRouter();
    const isCreate = mode === "create";
    const defaultValues: AnnouncementFormValues = {
        title: announcement?.title ?? "",
        content: announcement?.content ?? "",
        isPublished: announcement?.isPublished ?? false,
    };
    const {
        register,
        handleSubmit,
        reset,
        setError,
        clearErrors,
        formState: { errors, isSubmitting },
    } = useForm<AnnouncementFormValues, unknown, AnnouncementValues>({
        resolver: zodResolver(announcementFormSchema),
        defaultValues,
    });

    async function handleAnnouncementSubmit(values: AnnouncementValues) {
        clearErrors();

        try {
            const formData = createAnnouncementFormData(
                values,
                announcement?.id
            );
            const result = isCreate
                ? await createAnnouncement(formData)
                : await updateAnnouncement(formData);

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
            if (isCreate) reset(defaultValues);
            router.refresh();
        } catch {
            const message = isCreate
                ? "공지사항을 등록하지 못했습니다."
                : "공지사항을 저장하지 못했습니다.";
            setError("root.server", { type: "server", message });
            toast.error(message);
        }
    }

    const submit = handleSubmit(handleAnnouncementSubmit);

    return (
        <form
            onSubmit={submit}
            noValidate
            className={
                isCreate
                    ? "bg-surface rounded-card grid gap-3 p-3"
                    : "grid gap-3"
            }
        >
            {isCreate ? (
                <h2 className="text-section flex items-center gap-2">
                    <Plus className="size-4" aria-hidden /> 공지 추가
                </h2>
            ) : null}
            <label
                className="sr-only"
                htmlFor={`announcement-title-${announcement?.id ?? "new"}`}
            >
                공지 제목
            </label>
            <input
                id={`announcement-title-${announcement?.id ?? "new"}`}
                maxLength={ANNOUNCEMENT_TITLE_MAX_LENGTH}
                placeholder="공지 제목"
                aria-invalid={Boolean(errors.title)}
                className={`${inputClass} h-10 ${isCreate ? "" : "font-semibold"}`}
                {...register("title")}
            />
            <FieldError message={errors.title?.message} />
            <label
                className="sr-only"
                htmlFor={`announcement-content-${announcement?.id ?? "new"}`}
            >
                공지 내용
            </label>
            <textarea
                id={`announcement-content-${announcement?.id ?? "new"}`}
                maxLength={ANNOUNCEMENT_CONTENT_MAX_LENGTH}
                rows={5}
                placeholder="공지 내용"
                aria-invalid={Boolean(errors.content)}
                className={`${inputClass} resize-y py-2`}
                {...register("content")}
            />
            <FieldError message={errors.content?.message} />
            {errors.root?.server?.message ? (
                <p className="text-danger text-xs" role="alert">
                    {errors.root.server.message}
                </p>
            ) : null}
            <div className="flex items-center justify-between gap-3">
                <label className="text-body-muted flex cursor-pointer items-center gap-2">
                    <input type="checkbox" {...register("isPublished")} />
                    {isCreate ? "바로 공개" : "홈에 공개"}
                </label>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={
                        isCreate
                            ? "bg-text-primary text-bg flex h-10 cursor-pointer items-center gap-1.5 rounded-md px-3 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-50"
                            : "border-border hover:bg-surface-muted flex h-9 cursor-pointer items-center gap-1.5 rounded-md border px-3 text-sm font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                    }
                >
                    {isCreate ? (
                        <Megaphone className="size-4" aria-hidden />
                    ) : (
                        <Save className="size-4" aria-hidden />
                    )}
                    {isSubmitting
                        ? isCreate
                            ? "등록 중"
                            : "저장 중"
                        : isCreate
                          ? "등록"
                          : "저장"}
                </button>
            </div>
        </form>
    );
}

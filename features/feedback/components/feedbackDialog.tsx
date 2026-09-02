"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { put } from "@vercel/blob/client";
import { ImagePlus, MessageSquareWarning, X } from "lucide-react";
import Link from "next/link";
import { useMemo, useState, type ChangeEvent } from "react";
import { useForm, useWatch } from "react-hook-form";

import {
    discardFeedbackImage,
    requestFeedbackImageUpload,
    submitFeedbackReport,
} from "@/app/(nevigation)/(home)/feedbackActions";
import {
    useLocale,
    useLocalizedHref,
    useTranslations,
} from "@/components/i18n/localeProvider";
import {
    createFeedbackReportFormData,
    createFeedbackReportSchema,
    type FeedbackReportFormValues,
    type FeedbackReportValues,
} from "@/features/feedback/schemas/feedbackReportSchema";
import { applyFormFieldErrors } from "@/lib/forms/errors";

export default function FeedbackDialog({
    isAuthenticated,
}: {
    isAuthenticated: boolean;
}) {
    const localizedHref = useLocalizedHref();
    const locale = useLocale();
    const t = useTranslations();
    const feedbackReportSchema = useMemo(
        () => createFeedbackReportSchema(t),
        [t]
    );
    const [open, setOpen] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [submitted, setSubmitted] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const {
        register,
        handleSubmit,
        setError,
        clearErrors,
        reset,
        control,
        formState: { errors, isSubmitting },
    } = useForm<FeedbackReportFormValues, unknown, FeedbackReportValues>({
        resolver: zodResolver(feedbackReportSchema),
        defaultValues: {
            content: "",
            imageUrl: "",
        },
    });
    const content = useWatch({ control, name: "content" });
    const errorMessage =
        errors.content?.message ??
        errors.imageUrl?.message ??
        errors.root?.file?.message ??
        errors.root?.server?.message;

    function changeFile(event: ChangeEvent<HTMLInputElement>) {
        const nextFile = event.target.files?.[0] ?? null;
        if (!nextFile) return;
        if (
            !["image/jpeg", "image/png", "image/webp"].includes(nextFile.type)
        ) {
            setError("root.file", {
                type: "file",
                message: t("feedback.invalidImage"),
            });
            event.target.value = "";
            return;
        }
        if (nextFile.size > 4 * 1024 * 1024) {
            setError("root.file", {
                type: "file",
                message: t("feedback.imageTooLarge"),
            });
            event.target.value = "";
            return;
        }
        setFile(nextFile);
        clearErrors("root");
    }

    async function handleFeedbackSubmit(values: FeedbackReportValues) {
        clearErrors();
        let uploadedUrl = "";

        try {
            if (file) {
                const upload = await requestFeedbackImageUpload(
                    file.type,
                    locale
                );
                if (!upload.success) {
                    setError("root.server", {
                        type: "server",
                        message: upload.message,
                    });
                    return;
                }
                const blob = await put(upload.pathname, file, {
                    access: "private",
                    token: upload.token,
                    contentType: file.type,
                });
                uploadedUrl = blob.url;
            }

            const result = await submitFeedbackReport(
                createFeedbackReportFormData(
                    { ...values, imageUrl: uploadedUrl || null },
                    locale
                )
            );
            if (!result.success) {
                if (uploadedUrl) {
                    await discardFeedbackImage(uploadedUrl).catch(() => null);
                }
                applyFormFieldErrors(setError, result.fieldErrors);
                setError("root.server", {
                    type: "server",
                    message: result.message,
                });
                return;
            }

            setSuccessMessage(result.message);
            setSubmitted(true);
            reset({ content: "", imageUrl: "" });
            setFile(null);
        } catch {
            if (uploadedUrl) {
                await discardFeedbackImage(uploadedUrl).catch(() => null);
            }
            setError("root.server", {
                type: "server",
                message: t("feedback.error"),
            });
        }
    }

    const submit = handleSubmit(handleFeedbackSubmit);

    return (
        <Dialog.Root
            open={open}
            onOpenChange={(nextOpen) => {
                setOpen(nextOpen);
                if (nextOpen) {
                    clearErrors();
                    setSubmitted(false);
                    setSuccessMessage("");
                }
            }}
        >
            <Dialog.Trigger asChild>
                <button className="border-border text-text-secondary hover:bg-surface-muted hover:text-text-primary focus-visible:ring-focus/40 rounded-card flex h-10 w-full cursor-pointer items-center justify-center gap-2 border text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:outline-none">
                    <MessageSquareWarning className="size-4" aria-hidden />
                    {t("feedback.title")}
                </button>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-40 bg-black/75" />
                <Dialog.Content className="border-border bg-bg fixed top-1/2 left-1/2 z-50 w-[calc(100vw-2rem)] max-w-90 -translate-x-1/2 -translate-y-1/2 rounded-lg border p-4 shadow-2xl focus:outline-none">
                    <div className="flex items-center justify-between gap-3">
                        <Dialog.Title className="text-section">
                            {t("feedback.title")}
                        </Dialog.Title>
                        <Dialog.Close className="text-text-secondary hover:text-text-primary flex size-9 cursor-pointer items-center justify-center rounded-md">
                            <X className="size-5" aria-hidden />
                            <span className="sr-only">{t("common.close")}</span>
                        </Dialog.Close>
                    </div>

                    {!isAuthenticated ? (
                        <div className="mt-5 flex flex-col gap-4 text-center">
                            <p className="text-body-muted">
                                {t("feedback.loginRequired")}
                            </p>
                            <Link
                                href={localizedHref("/login")}
                                className="bg-text-primary text-bg rounded-card flex h-11 items-center justify-center text-sm font-bold"
                            >
                                {t("common.login")}
                            </Link>
                        </div>
                    ) : submitted ? (
                        <div className="mt-5 flex flex-col gap-4 text-center">
                            <p className="text-success text-sm font-semibold">
                                {successMessage}
                            </p>
                            <Dialog.Close className="bg-text-primary text-bg rounded-card h-11 cursor-pointer text-sm font-bold">
                                {t("common.confirm")}
                            </Dialog.Close>
                        </div>
                    ) : (
                        <form
                            onSubmit={submit}
                            noValidate
                            className="mt-4 flex flex-col gap-3"
                        >
                            <p className="text-caption">
                                {t("feedback.description")}
                            </p>
                            <textarea
                                maxLength={1000}
                                rows={6}
                                placeholder={t("feedback.placeholder")}
                                aria-invalid={Boolean(errors.content)}
                                className="border-border bg-surface text-input placeholder:text-text-disabled focus:border-focus focus:ring-focus/20 rounded-card w-full resize-none border px-3 py-2 outline-none focus:ring-2"
                                {...register("content")}
                            />
                            <input type="hidden" {...register("imageUrl")} />
                            <label className="border-border hover:bg-surface-muted rounded-card flex h-10 cursor-pointer items-center justify-center gap-2 border text-sm font-semibold transition-colors">
                                <ImagePlus className="size-4" aria-hidden />
                                {file ? file.name : t("feedback.attachImage")}
                                <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    onChange={changeFile}
                                    className="sr-only"
                                />
                            </label>
                            {errorMessage ? (
                                <p className="text-danger text-xs">
                                    {errorMessage}
                                </p>
                            ) : null}
                            <button
                                type="submit"
                                disabled={
                                    isSubmitting ||
                                    (content?.trim().length ?? 0) < 10
                                }
                                className="bg-text-primary text-bg rounded-card h-11 cursor-pointer text-sm font-bold disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isSubmitting
                                    ? t("feedback.submitting")
                                    : t("feedback.submit")}
                            </button>
                        </form>
                    )}
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}

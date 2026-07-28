"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { put } from "@vercel/blob/client";
import { ImagePlus, MessageSquareWarning, X } from "lucide-react";
import Link from "next/link";
import { ChangeEvent, useRef, useState } from "react";

import {
    useLocale,
    useLocalizedHref,
    useTranslations,
} from "@/components/i18n/localeProvider";
import {
    discardFeedbackImage,
    requestFeedbackImageUpload,
    submitFeedbackReport,
} from "@/app/(nevigation)/(home)/feedbackActions";

export default function FeedbackDialog({
    isAuthenticated,
}: {
    isAuthenticated: boolean;
}) {
    const localizedHref = useLocalizedHref();
    const locale = useLocale();
    const t = useTranslations();
    const [open, setOpen] = useState(false);
    const [content, setContent] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [message, setMessage] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    function changeFile(event: ChangeEvent<HTMLInputElement>) {
        const nextFile = event.target.files?.[0] ?? null;
        if (!nextFile) return;
        if (
            !["image/jpeg", "image/png", "image/webp"].includes(nextFile.type)
        ) {
            setMessage(t("feedback.invalidImage"));
            event.target.value = "";
            return;
        }
        if (nextFile.size > 4 * 1024 * 1024) {
            setMessage(t("feedback.imageTooLarge"));
            event.target.value = "";
            return;
        }
        setFile(nextFile);
        setMessage("");
    }

    async function submit() {
        if (isSubmitting) return;
        setIsSubmitting(true);
        setMessage("");
        let uploadedUrl = "";

        try {
            if (file) {
                const upload = await requestFeedbackImageUpload(
                    file.type,
                    locale
                );
                if (!upload.success) {
                    setMessage(upload.message);
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
                content,
                uploadedUrl,
                locale
            );
            if (!result.success && uploadedUrl) {
                await discardFeedbackImage(uploadedUrl).catch(() => null);
            }
            setMessage(result.message);
            if (result.success) {
                setSubmitted(true);
                setContent("");
                setFile(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
            }
        } catch {
            if (uploadedUrl) {
                await discardFeedbackImage(uploadedUrl).catch(() => null);
            }
            setMessage(t("feedback.error"));
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Dialog.Root
            open={open}
            onOpenChange={(nextOpen) => {
                setOpen(nextOpen);
                if (nextOpen) {
                    setMessage("");
                    setSubmitted(false);
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
                                {message}
                            </p>
                            <Dialog.Close className="bg-text-primary text-bg rounded-card h-11 cursor-pointer text-sm font-bold">
                                {t("common.confirm")}
                            </Dialog.Close>
                        </div>
                    ) : (
                        <div className="mt-4 flex flex-col gap-3">
                            <p className="text-caption">
                                {t("feedback.description")}
                            </p>
                            <textarea
                                value={content}
                                onChange={(event) =>
                                    setContent(event.target.value)
                                }
                                maxLength={1000}
                                rows={6}
                                placeholder={t("feedback.placeholder")}
                                className="border-border bg-surface text-input placeholder:text-text-disabled focus:border-focus focus:ring-focus/20 rounded-card w-full resize-none border px-3 py-2 outline-none focus:ring-2"
                            />
                            <label className="border-border hover:bg-surface-muted rounded-card flex h-10 cursor-pointer items-center justify-center gap-2 border text-sm font-semibold transition-colors">
                                <ImagePlus className="size-4" aria-hidden />
                                {file ? file.name : t("feedback.attachImage")}
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    onChange={changeFile}
                                    className="sr-only"
                                />
                            </label>
                            {message ? (
                                <p className="text-danger text-xs">{message}</p>
                            ) : null}
                            <button
                                type="button"
                                onClick={() => void submit()}
                                disabled={
                                    isSubmitting || content.trim().length < 10
                                }
                                className="bg-text-primary text-bg rounded-card h-11 cursor-pointer text-sm font-bold disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isSubmitting
                                    ? t("feedback.submitting")
                                    : t("feedback.submit")}
                            </button>
                        </div>
                    )}
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}

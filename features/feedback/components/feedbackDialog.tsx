"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { put } from "@vercel/blob/client";
import { ImagePlus, MessageSquare } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { ChangeEvent, ReactNode } from "react";
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
import ActionButton from "@/components/ui/actionButton";
import { foundationButtonClass } from "@/components/ui/Button";
import {
    FormField,
    TextArea,
    fieldDescription,
} from "@/components/ui/formField";
import ModalDialog from "@/components/ui/modalDialog";
import { StatusMessage } from "@/components/ui/statusMessage";

export default function FeedbackDialog({
    isAuthenticated,
    open: controlledOpen,
    onOpenChange,
    onCloseAutoFocus,
    trigger,
}: {
    isAuthenticated: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    onCloseAutoFocus?: (event: Event) => void;
    trigger?: ReactNode;
}) {
    const localizedHref = useLocalizedHref();
    const locale = useLocale();
    const t = useTranslations();
    const feedbackReportSchema = useMemo(
        () => createFeedbackReportSchema(t),
        [t]
    );
    const [internalOpen, setInternalOpen] = useState(false);
    const open = controlledOpen ?? internalOpen;
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

    function changeOpen(nextOpen: boolean) {
        setInternalOpen(nextOpen);
        onOpenChange?.(nextOpen);
        if (!nextOpen) {
            clearErrors();
            setSubmitted(false);
            setSuccessMessage("");
        }
    }

    return (
        <ModalDialog
            open={open}
            onOpenChange={changeOpen}
            title={t("feedback.title")}
            onCloseAutoFocus={onCloseAutoFocus}
            trigger={
                trigger === null
                    ? undefined
                    : (trigger ?? (
                          <button
                              className={foundationButtonClass({
                                  variant: "secondary",
                              })}
                          >
                              <MessageSquare className="nl-icon" aria-hidden />
                              {t("shell.feedback")}
                          </button>
                      ))
            }
        >
            {!isAuthenticated ? (
                <div className="nl-stack">
                    <p className="nl-body-secondary nl-muted">
                        {t("feedback.loginRequired")}
                    </p>
                    <Link
                        href={localizedHref("/login")}
                        className={foundationButtonClass()}
                    >
                        {t("common.login")}
                    </Link>
                </div>
            ) : submitted ? (
                <div className="nl-stack">
                    <StatusMessage
                        severity="success"
                        title={successMessage}
                        role="status"
                    />
                    <ActionButton onClick={() => changeOpen(false)}>
                        {t("common.confirm")}
                    </ActionButton>
                </div>
            ) : (
                <form onSubmit={submit} noValidate className="nl-stack">
                    <FormField
                        id="feedback-content"
                        label={t("feedback.title")}
                        help={t("feedback.description")}
                        error={errors.content?.message}
                    >
                        <TextArea
                            id="feedback-content"
                            maxLength={1000}
                            rows={6}
                            placeholder={t("feedback.placeholder")}
                            aria-invalid={Boolean(errors.content)}
                            aria-describedby={fieldDescription(
                                "feedback-content",
                                { help: true, error: Boolean(errors.content) }
                            )}
                            {...register("content")}
                        />
                        <span className="nl-metadata nl-muted">
                            {content?.length ?? 0} / 1000
                        </span>
                    </FormField>
                    <input type="hidden" {...register("imageUrl")} />
                    <label
                        className={foundationButtonClass({
                            variant: "secondary",
                        })}
                    >
                        <ImagePlus className="nl-icon" aria-hidden />
                        {file ? file.name : t("feedback.attachImage")}
                        <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={changeFile}
                            className="sr-only"
                        />
                    </label>
                    {errorMessage && !errors.content ? (
                        <p className="nl-metadata nl-error-text" role="alert">
                            {errorMessage}
                        </p>
                    ) : null}
                    <ActionButton
                        type="submit"
                        busy={isSubmitting}
                        busyLabel={t("feedback.submitting")}
                        disabled={(content?.trim().length ?? 0) < 10}
                    >
                        {t("feedback.submit")}
                    </ActionButton>
                </form>
            )}
        </ModalDialog>
    );
}

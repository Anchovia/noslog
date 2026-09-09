"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import { useForm, useWatch } from "react-hook-form";

import { useLocale, useTranslations } from "@/components/i18n/localeProvider";
import type { ExamDashboardItem } from "@/components/exams/dashboard/examDashboardTypes";
import Button from "@/components/ui/Button";
import {
    createExamProofFileSchema,
    EXAM_PROOF_CONTENT_TYPES,
    type ExamProofFileFormValues,
    type ExamProofFileValues,
} from "@/features/exams/schemas/examProofSchema";
import { localizePath } from "@/lib/i18n/routing";

interface ExamProofUploadProps {
    exam: ExamDashboardItem;
    isAuthenticated: boolean;
    disabled: boolean;
    message: string | null;
    requiresLogin?: boolean;
    onUpload: (file: File) => Promise<boolean>;
    onClearMessage?: () => void;
}

export default function ExamProofUpload({
    exam,
    isAuthenticated,
    disabled,
    message,
    requiresLogin = false,
    onUpload,
    onClearMessage,
}: ExamProofUploadProps) {
    const t = useTranslations();
    const locale = useLocale();
    const inputId = `exam-proof-${exam.id}`;
    const inputRef = useRef<HTMLInputElement | null>(null);
    const previewRef = useRef<string | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [submitted, setSubmitted] = useState(false);
    const proofFileSchema = useMemo(() => createExamProofFileSchema(t), [t]);
    const {
        register,
        control,
        setValue,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<ExamProofFileFormValues, unknown, ExamProofFileValues>({
        resolver: zodResolver(proofFileSchema),
        defaultValues: { proofFile: null },
    });
    const proofFile = useWatch({ control, name: "proofFile" });
    const fileRegistration = register("proofFile");
    const complete = exam.isAchieved;
    const pending = submitted || exam.submissionStatus === "pending";
    const displayedMessage = errors.proofFile?.message ?? message;
    const returnPath = localizePath(`/exams/${exam.slug}`, locale);

    useEffect(
        () => () => {
            if (previewRef.current) URL.revokeObjectURL(previewRef.current);
        },
        []
    );

    function clearFile() {
        onClearMessage?.();
        if (previewRef.current) URL.revokeObjectURL(previewRef.current);
        previewRef.current = null;
        setPreview(null);
        reset({ proofFile: null });
    }

    function changeFile(event: ChangeEvent<HTMLInputElement>) {
        const file = event.currentTarget.files?.[0];
        event.currentTarget.value = "";
        if (!file) return;
        onClearMessage?.();
        if (previewRef.current) URL.revokeObjectURL(previewRef.current);
        const valid = proofFileSchema.safeParse({ proofFile: file }).success;
        const url = valid ? URL.createObjectURL(file) : null;
        previewRef.current = url;
        setPreview(url);
        setValue("proofFile", file, {
            shouldDirty: true,
            shouldValidate: true,
        });
    }

    async function submitFile({ proofFile: file }: ExamProofFileValues) {
        if (await onUpload(file)) {
            setSubmitted(true);
            clearFile();
        }
    }

    return (
        <section className="nl-exam-proof" aria-labelledby={`${inputId}-title`}>
            <h3 id={`${inputId}-title`} className="nl-component-title">
                {t("exams.proof.title")}
            </h3>
            {!isAuthenticated ? (
                <Link
                    className="nl-button nl-button--primary"
                    href={localizePath(
                        `/login?returnTo=${encodeURIComponent(returnPath)}`,
                        locale
                    )}
                >
                    {t("exams.proof.login")}
                </Link>
            ) : complete || pending ? (
                <p className="nl-body-secondary" role="status">
                    {t(
                        complete
                            ? "exams.proof.completed"
                            : "exams.proof.reviewing"
                    )}
                </p>
            ) : disabled ? (
                <div className="nl-exam-proof__guidance">
                    <p className="nl-body-secondary nl-muted">
                        {t(
                            exam.playerGrade === null || !exam.hasSyncedIdentity
                                ? "exams.proof.syncRequired"
                                : "exams.simulation.notEligible"
                        )}
                    </p>
                    <Link
                        className="nl-button"
                        href={localizePath("/bookmarklet", locale)}
                    >
                        {t("sync.title")}
                    </Link>
                </div>
            ) : (
                <form
                    onSubmit={(event) => void handleSubmit(submitFile)(event)}
                    noValidate
                    aria-busy={isSubmitting}
                >
                    <input
                        {...fileRegistration}
                        ref={(element) => {
                            fileRegistration.ref(element);
                            inputRef.current = element;
                        }}
                        id={inputId}
                        type="file"
                        accept={EXAM_PROOF_CONTENT_TYPES.join(",")}
                        hidden
                        disabled={isSubmitting}
                        onChange={changeFile}
                    />
                    {exam.submissionStatus === "rejected" ? (
                        <div className="nl-exam-proof__guidance" role="status">
                            <p className="nl-emphasis-label">
                                {t("exams.proof.rejected")}
                            </p>
                            <p className="nl-body-secondary">
                                {exam.submissionReviewerNote ||
                                    t("exams.proof.defaultReason")}
                            </p>
                        </div>
                    ) : null}
                    {preview && proofFile instanceof File ? (
                        <>
                            {/* Browser-local preview; no upload occurs on file selection. */}
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                className="nl-exam-proof__preview"
                                src={preview}
                                alt={t("exams.proof.preview")}
                            />
                            <p className="nl-metadata nl-muted">
                                {proofFile.name} ·{" "}
                                {proofFile.type
                                    .replace("image/", "")
                                    .toUpperCase()}{" "}
                                ·{" "}
                                {(proofFile.size / 1024 / 1024).toLocaleString(
                                    locale,
                                    { maximumFractionDigits: 2 }
                                )}{" "}
                                MB
                            </p>
                            <div className="nl-exam-proof__guidance">
                                <p className="nl-control">
                                    {t("exams.proof.checklist")}
                                </p>
                                <ul className="nl-body-secondary">
                                    {(
                                        [
                                            "finalResult",
                                            "mode",
                                            "grade",
                                            "passLabel",
                                            "playerName",
                                        ] as const
                                    ).map((key) => (
                                        <li key={key}>
                                            {t(`exams.proof.${key}`)}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <p className="nl-metadata nl-muted">
                                {t("exams.proof.retention")}
                            </p>
                            <p className="nl-metadata nl-muted">
                                {t("exams.proof.nameSync")}
                            </p>
                            <Button
                                appearance="foundation"
                                type="submit"
                                variant="primary"
                                disabled={isSubmitting}
                            >
                                {t(
                                    isSubmitting
                                        ? "exams.proof.uploading"
                                        : "exams.proof.submit"
                                )}
                            </Button>
                            <div className="nl-exam-proof__secondary">
                                <Button
                                    appearance="foundation"
                                    variant="secondary"
                                    type="button"
                                    disabled={isSubmitting}
                                    onClick={() => inputRef.current?.click()}
                                >
                                    {t("exams.proof.replace")}
                                </Button>
                                <Button
                                    appearance="foundation"
                                    variant="secondary"
                                    type="button"
                                    disabled={isSubmitting}
                                    onClick={clearFile}
                                >
                                    {t("exams.proof.cancel")}
                                </Button>
                            </div>
                        </>
                    ) : (
                        <Button
                            appearance="foundation"
                            type="button"
                            variant="primary"
                            onClick={() => inputRef.current?.click()}
                        >
                            {t(
                                exam.submissionStatus === "rejected"
                                    ? "exams.proof.resubmit"
                                    : "exams.proof.upload"
                            )}
                        </Button>
                    )}
                    {isSubmitting ? (
                        <p className="nl-body-secondary" role="status">
                            {t("exams.proof.uploading")}
                        </p>
                    ) : null}
                    {displayedMessage ? (
                        <p className="nl-body-secondary" role="alert">
                            {displayedMessage}
                        </p>
                    ) : null}
                    {requiresLogin ? (
                        <Link
                            className="nl-button nl-button--primary"
                            href={localizePath(
                                `/login?returnTo=${encodeURIComponent(returnPath)}`,
                                locale
                            )}
                        >
                            {t("exams.proof.login")}
                        </Link>
                    ) : null}
                </form>
            )}
        </section>
    );
}

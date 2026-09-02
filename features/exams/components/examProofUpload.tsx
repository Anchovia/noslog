"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Upload } from "lucide-react";
import { useMemo, type ChangeEvent } from "react";
import { useForm } from "react-hook-form";

import { useTranslations } from "@/components/i18n/localeProvider";
import type { ExamDashboardItem } from "@/components/exams/dashboard/examDashboardTypes";
import {
    createExamProofFileSchema,
    EXAM_PROOF_CONTENT_TYPES,
    type ExamProofFileFormValues,
    type ExamProofFileValues,
} from "@/features/exams/schemas/examProofSchema";
import { cn } from "@/lib/utils";

interface ExamProofUploadProps {
    exam: ExamDashboardItem;
    isAuthenticated: boolean;
    disabled: boolean;
    message: string | null;
    onUpload: (file: File) => Promise<void>;
}

// 검정 합격 인증 이미지 선택과 업로드 상태를 표시함
export default function ExamProofUpload({
    exam,
    isAuthenticated,
    disabled,
    message,
    onUpload,
}: ExamProofUploadProps) {
    const t = useTranslations();
    const inputId = `exam-proof-${exam.id}`;
    const proofFileSchema = useMemo(() => createExamProofFileSchema(t), [t]);
    const {
        register,
        setValue,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<ExamProofFileFormValues, unknown, ExamProofFileValues>({
        resolver: zodResolver(proofFileSchema),
        defaultValues: { proofFile: null },
    });
    const uploadDisabled = disabled || isSubmitting;
    const displayedMessage = errors.proofFile?.message ?? message;

    const submit = handleSubmit(async ({ proofFile }) => {
        await onUpload(proofFile);
        reset({ proofFile: null });
    });

    function changeFile(event: ChangeEvent<HTMLInputElement>) {
        const file = event.currentTarget.files?.[0] ?? null;
        event.currentTarget.value = "";
        setValue("proofFile", file, {
            shouldDirty: true,
            shouldValidate: true,
        });
        if (file) void submit();
    }

    return (
        <section>
            <form onSubmit={submit} noValidate>
                <input
                    id={inputId}
                    type="file"
                    accept={EXAM_PROOF_CONTENT_TYPES.join(",")}
                    className="sr-only"
                    disabled={uploadDisabled}
                    {...register("proofFile", { onChange: changeFile })}
                />
                {exam.submissionStatus === "rejected" ? (
                    <div className="border-danger/40 bg-danger/5 mb-2 rounded-md border px-3 py-2">
                        <p className="text-danger text-xs font-semibold">
                            {t("exams.proof.rejected")}
                        </p>
                        <p className="text-text-secondary mt-1 text-xs leading-relaxed whitespace-pre-wrap">
                            {t("exams.proof.reason", {
                                reason:
                                    exam.submissionReviewerNote ||
                                    t("exams.proof.defaultReason"),
                            })}
                        </p>
                    </div>
                ) : null}
                <label
                    htmlFor={inputId}
                    aria-disabled={uploadDisabled}
                    className={cn(
                        "border-text-disabled flex h-10 items-center justify-center gap-2 rounded-lg border border-dashed text-xs font-semibold",
                        exam.isAchieved
                            ? "border-success/40 text-success"
                            : uploadDisabled
                              ? "cursor-not-allowed opacity-50"
                              : "hover:bg-surface cursor-pointer"
                    )}
                >
                    {exam.isAchieved ? null : (
                        <Upload className="size-4" aria-hidden />
                    )}
                    {isSubmitting
                        ? t("exams.proof.uploading")
                        : exam.isAchieved
                          ? t("exams.proof.completed")
                          : exam.submissionStatus === "pending"
                            ? t("exams.proof.reviewing")
                            : exam.submissionStatus === "rejected"
                              ? t("exams.proof.resubmit")
                              : isAuthenticated
                                ? t("exams.proof.upload")
                                : t("exams.proof.login")}
                </label>
                {displayedMessage ? (
                    <p
                        className={cn(
                            "mt-2 text-xs",
                            displayedMessage === t("exams.proof.submitted")
                                ? "text-success"
                                : "text-danger"
                        )}
                    >
                        {displayedMessage}
                    </p>
                ) : null}
            </form>
        </section>
    );
}

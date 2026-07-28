import { Upload } from "lucide-react";

import { useTranslations } from "@/components/i18n/localeProvider";
import { cn } from "@/lib/utils";

import type { ExamDashboardItem } from "./examDashboardTypes";

interface ExamProofUploadProps {
    exam: ExamDashboardItem;
    isAuthenticated: boolean;
    isUploading: boolean;
    disabled: boolean;
    message: string | null;
    onUpload: (file: File | undefined) => void;
}

// 검정 합격 인증 이미지 선택과 업로드 상태를 표시함
export default function ExamProofUpload({
    exam,
    isAuthenticated,
    isUploading,
    disabled,
    message,
    onUpload,
}: ExamProofUploadProps) {
    const t = useTranslations();
    const inputId = `exam-proof-${exam.id}`;

    return (
        <section>
            <input
                id={inputId}
                type="file"
                accept="image/*"
                className="sr-only"
                disabled={disabled}
                onChange={(event) => {
                    const file = event.currentTarget.files?.[0];
                    event.currentTarget.value = "";
                    onUpload(file);
                }}
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
                aria-disabled={disabled}
                className={cn(
                    "border-text-disabled flex h-10 items-center justify-center gap-2 rounded-lg border border-dashed text-xs font-semibold",
                    exam.isAchieved
                        ? "border-success/40 text-success"
                        : disabled
                          ? "cursor-not-allowed opacity-50"
                          : "hover:bg-surface cursor-pointer"
                )}
            >
                {exam.isAchieved ? null : <Upload className="size-4" />}
                {isUploading
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
            {message ? (
                <p
                    className={cn(
                        "mt-2 text-xs",
                        message === t("exams.proof.submitted")
                            ? "text-success"
                            : "text-danger"
                    )}
                >
                    {message}
                </p>
            ) : null}
        </section>
    );
}

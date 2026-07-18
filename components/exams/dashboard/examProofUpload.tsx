import { Upload } from "lucide-react";

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
                        인증이 반려되었습니다.
                    </p>
                    <p className="text-text-secondary mt-1 text-xs leading-relaxed whitespace-pre-wrap">
                        {`사유: "${
                            exam.submissionReviewerNote ||
                            "등록된 반려 사유가 없습니다. 증빙 이미지를 확인한 뒤 다시 제출해주세요."
                        }"`}
                    </p>
                </div>
            ) : null}
            <label
                htmlFor={inputId}
                aria-disabled={disabled}
                className={cn(
                    "border-text-disabled flex h-10 items-center justify-center gap-2 rounded-lg border border-dashed text-xs font-semibold",
                    disabled
                        ? "cursor-not-allowed opacity-50"
                        : "hover:bg-surface cursor-pointer"
                )}
            >
                <Upload className="size-4" />
                {isUploading
                    ? "업로드 중..."
                    : exam.isAchieved
                      ? "합격 인증 완료"
                      : exam.submissionStatus === "pending"
                        ? "인증 심사 중"
                        : exam.submissionStatus === "rejected"
                          ? "합격 스크린샷 다시 제출"
                          : isAuthenticated
                            ? "합격 스크린샷 업로드"
                            : "로그인 후 인증 가능"}
            </label>
            {message ? (
                <p
                    className={cn(
                        "mt-2 text-xs",
                        message.includes("제출")
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

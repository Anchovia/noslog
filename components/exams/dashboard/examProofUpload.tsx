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

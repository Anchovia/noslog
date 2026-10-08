import type { ExamStatus } from "@/features/exams/schemas/exam-editor-schema";
import { cn } from "@/lib/cn";

import ExamFieldError from "./exam-field-error";

interface ExamPublicationSectionProps {
    error?: string;
    onChange: (status: ExamStatus) => void;
    status: ExamStatus;
}

export default function ExamPublicationSection({
    error,
    onChange,
    status,
}: ExamPublicationSectionProps) {
    const isPublished = status === "published";

    return (
        <section className="border-t border-divider pt-5">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h2 className="text-body font-bold">공개 상태</h2>
                    <p className="mt-0.5 text-caption">
                        공개하려면 과제곡 세 곡과 필수 정보를 입력해야 합니다.
                    </p>
                </div>
                <button
                    type="button"
                    role="switch"
                    aria-label="검정 공개 상태"
                    aria-checked={isPublished}
                    aria-invalid={Boolean(error)}
                    onClick={() =>
                        onChange(isPublished ? "draft" : "published")
                    }
                    className={cn(
                        "relative h-7 w-12 shrink-0 rounded-full bg-surface-muted",
                        isPublished && "bg-success"
                    )}
                >
                    <span
                        className={cn(
                            "absolute top-1 left-1 size-5 rounded-full transition-transform",
                            isPublished
                                ? "translate-x-5 bg-switch-thumb-active"
                                : "bg-switch-thumb"
                        )}
                    />
                </button>
            </div>
            <ExamFieldError message={error} />
        </section>
    );
}

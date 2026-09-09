import type { ExamStatus } from "@/features/exams/schemas/examEditorSchema";
import { cn } from "@/lib/utils";

import ExamFieldError from "./examFieldError";

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
        <section className="border-divider border-t pt-5">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h2 className="text-body font-bold">공개 상태</h2>
                    <p className="text-caption mt-0.5">
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
                        "bg-surface-muted relative h-7 w-12 shrink-0 rounded-full",
                        isPublished && "bg-success"
                    )}
                >
                    <span
                        className={cn(
                            "absolute top-1 left-1 size-5 rounded-full transition-transform",
                            isPublished
                                ? "bg-switch-thumb-active translate-x-5"
                                : "bg-switch-thumb"
                        )}
                    />
                </button>
            </div>
            <ExamFieldError message={error} />
        </section>
    );
}

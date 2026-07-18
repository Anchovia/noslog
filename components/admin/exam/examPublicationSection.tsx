import { cn } from "@/lib/utils";

import type { ExamStatus } from "./examEditorTypes";

interface ExamPublicationSectionProps {
    status: ExamStatus;
    onChange: (status: ExamStatus) => void;
}

// 검정 공개 상태를 한곳에서 관리함
export default function ExamPublicationSection({
    status,
    onChange,
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
                    aria-checked={isPublished}
                    onClick={() =>
                        onChange(isPublished ? "draft" : "published")
                    }
                    className={cn(
                        "bg-surface-muted relative h-7 w-12 rounded-full",
                        isPublished && "bg-success"
                    )}
                >
                    <span
                        className={cn(
                            "bg-text-primary absolute top-1 left-1 size-5 rounded-full transition-transform",
                            isPublished && "translate-x-5"
                        )}
                    />
                </button>
            </div>
        </section>
    );
}

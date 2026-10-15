import { Switch } from "@/components/ui/switch";
import type { ExamStatus } from "@/features/exams/schemas/exam-editor-schema";

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
        <section className="border-t-nl-stroke border-nl-divider pt-nl-24">
            <div className="flex items-center justify-between gap-nl-16">
                <div>
                    <h2 className="nl-emphasis-label text-nl-content">
                        공개 상태
                    </h2>
                    <p className="nl-metadata mt-nl-4 text-nl-subdued">
                        공개하려면 과제곡 세 곡과 필수 정보를 입력해야 합니다.
                    </p>
                </div>
                <Switch
                    aria-label="검정 공개 상태"
                    aria-invalid={Boolean(error)}
                    checked={isPublished}
                    onCheckedChange={(checked) =>
                        onChange(checked ? "published" : "draft")
                    }
                />
            </div>
            <ExamFieldError message={error} />
        </section>
    );
}

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { reviewEvent } from "@/app/admin/events/actions";
import ActionButton from "@/components/ui/actionButton";
import {
    FormField,
    TextArea,
    fieldDescription,
} from "@/components/ui/formField";
import { SegmentedControl } from "@/components/ui/segmentedControl";
import {
    EVENT_REVIEW_NOTE_MAX_LENGTH,
    type EventReviewDecision,
} from "@/features/events/schemas/eventSchema";

const OPTIONS: { value: EventReviewDecision; label: string }[] = [
    { value: "approve", label: "승인" },
    { value: "requestChanges", label: "수정 요청" },
    { value: "reject", label: "반려" },
];

// 검토 결과 — 기존 관리자 폼 모양(nl-admin-form). 수정 요청 · 반려는 사유 필수
export default function EventReviewForm({ id }: { id: number }) {
    const router = useRouter();
    const [decision, setDecision] = useState<EventReviewDecision>("approve");
    const [note, setNote] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [busy, setBusy] = useState(false);

    async function send() {
        setBusy(true);
        setError(null);
        const formData = new FormData();
        formData.set("id", String(id));
        formData.set("decision", decision);
        formData.set("note", note);
        try {
            const result = await reviewEvent(formData);
            if (!result.success) {
                setError(result.fieldErrors?.note?.[0] ?? result.message);
                toast.error(result.message);
                return;
            }
            toast.success(result.message);
            router.push("/admin/events");
            router.refresh();
        } catch {
            setError("검토 결과를 저장하지 못했습니다.");
        } finally {
            setBusy(false);
        }
    }

    return (
        <section className="nl-admin-form" aria-labelledby="event-review-title">
            <div className="nl-admin-form__section">
                <h2 id="event-review-title" className="nl-component-title">
                    검토 결과
                </h2>
                <SegmentedControl
                    label="검토 결과"
                    value={decision}
                    onValueChange={setDecision}
                    options={OPTIONS}
                />
                <FormField
                    id="event-review-note"
                    label={decision === "approve" ? "사유 (선택)" : "사유"}
                    help="작성자의 편집 화면 맨 위에 그대로 보입니다."
                    error={error ?? undefined}
                >
                    <TextArea
                        id="event-review-note"
                        rows={4}
                        maxLength={EVENT_REVIEW_NOTE_MAX_LENGTH}
                        value={note}
                        aria-invalid={Boolean(error)}
                        aria-describedby={fieldDescription(
                            "event-review-note",
                            {
                                help: true,
                                error: Boolean(error),
                            }
                        )}
                        onChange={(event) => setNote(event.target.value)}
                    />
                </FormField>
            </div>
            <div className="nl-admin-form__actions">
                <div />
                <div>
                    <ActionButton
                        busy={busy}
                        busyLabel="보내는 중"
                        onClick={send}
                    >
                        보내기
                    </ActionButton>
                </div>
            </div>
        </section>
    );
}

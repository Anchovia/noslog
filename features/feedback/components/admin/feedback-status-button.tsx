"use client";

import { Check, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";

import { updateFeedbackStatus } from "@/app/admin/feedback/actions";
import { foundationButtonClass } from "@/components/ui/button";
import {
    createFeedbackStatusUpdateFormData,
    type FeedbackStatus,
} from "@/features/feedback/schemas/feedback-admin-schema";
import { cn } from "@/lib/cn";
import useActionToast from "@/lib/hooks/use-action-toast";

interface FeedbackStatusButtonProps {
    feedbackId: number;
    status: FeedbackStatus;
}

export default function FeedbackStatusButton({
    feedbackId,
    status,
}: FeedbackStatusButtonProps) {
    const router = useRouter();
    const { isPending, run } = useActionToast();
    const [reply, setReply] = useState("");
    const replyId = useId();
    const nextStatus = status === "open" ? "resolved" : "open";

    function handleStatusUpdate() {
        run(
            () =>
                updateFeedbackStatus(
                    createFeedbackStatusUpdateFormData(
                        feedbackId,
                        nextStatus,
                        nextStatus === "resolved" ? reply : ""
                    )
                ),
            {
                errorMessage: "피드백 상태를 변경하지 못했습니다.",
                onSuccess: () => {
                    router.refresh();
                },
            }
        );
    }

    const button = (
        <button
            type="button"
            disabled={isPending}
            onClick={handleStatusUpdate}
            className={cn(
                foundationButtonClass({ variant: "secondary" }),
                "w-full"
            )}
        >
            {status === "open" ? (
                <Check className="nl-icon-small" aria-hidden />
            ) : (
                <RotateCcw className="nl-icon-small" aria-hidden />
            )}
            {isPending
                ? "처리 중"
                : status === "open"
                  ? "처리 완료"
                  : "다시 열기"}
        </button>
    );
    // 접수 상태에서만 답변 칸 — 쓰고 「처리 완료」 를 누르면 제보한 사람에게 보인다(2026-09-18)
    if (status !== "open") return button;
    return (
        <div className="flex flex-col gap-nl-8">
            <label htmlFor={replyId} className="nl-metadata text-nl-subdued">
                답변 (선택) — 쓰면 제보한 사람의 「내 제보」 에 보입니다
            </label>
            <textarea
                id={replyId}
                value={reply}
                maxLength={1000}
                rows={3}
                disabled={isPending}
                onChange={(event) => setReply(event.target.value)}
                className="nl-input"
            />
            {button}
        </div>
    );
}

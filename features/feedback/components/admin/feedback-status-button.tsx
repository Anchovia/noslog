"use client";

import { Check, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useId, useState, useTransition } from "react";
import { toast } from "sonner";

import { updateFeedbackStatus } from "@/app/admin/feedback/actions";
import {
    createFeedbackStatusUpdateFormData,
    type FeedbackStatus,
} from "@/features/feedback/schemas/feedback-admin-schema";

interface FeedbackStatusButtonProps {
    feedbackId: number;
    status: FeedbackStatus;
}

export default function FeedbackStatusButton({
    feedbackId,
    status,
}: FeedbackStatusButtonProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [reply, setReply] = useState("");
    const replyId = useId();
    const nextStatus = status === "open" ? "resolved" : "open";

    function handleStatusUpdate() {
        startTransition(async () => {
            try {
                const result = await updateFeedbackStatus(
                    createFeedbackStatusUpdateFormData(
                        feedbackId,
                        nextStatus,
                        nextStatus === "resolved" ? reply : ""
                    )
                );
                if (!result.success) {
                    toast.error(result.message);
                    return;
                }

                toast.success(result.message);
                router.refresh();
            } catch {
                toast.error("피드백 상태를 변경하지 못했습니다.");
            }
        });
    }

    const button = (
        <button
            type="button"
            disabled={isPending}
            onClick={handleStatusUpdate}
            className="flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-border text-sm font-bold transition-colors hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-50"
        >
            {status === "open" ? (
                <Check className="size-4 text-success" aria-hidden />
            ) : (
                <RotateCcw className="size-4" aria-hidden />
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
        <div className="flex flex-col gap-2">
            <label htmlFor={replyId} className="text-caption">
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

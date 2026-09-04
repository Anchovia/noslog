"use client";

import { Check, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { updateFeedbackStatus } from "@/app/admin/feedback/actions";
import {
    createFeedbackStatusUpdateFormData,
    type FeedbackStatus,
} from "@/features/feedback/schemas/feedbackAdminSchema";

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
    const nextStatus = status === "open" ? "resolved" : "open";

    function handleStatusUpdate() {
        startTransition(async () => {
            try {
                const result = await updateFeedbackStatus(
                    createFeedbackStatusUpdateFormData(feedbackId, nextStatus)
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

    return (
        <button
            type="button"
            disabled={isPending}
            onClick={handleStatusUpdate}
            className="border-border hover:bg-surface-muted flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-md border text-sm font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-50"
        >
            {status === "open" ? (
                <Check className="text-success size-4" aria-hidden />
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
}

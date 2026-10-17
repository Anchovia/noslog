"use client";

import { Check, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { updateOpinionReportStatus } from "@/app/admin/feedback/actions";
import { foundationButtonClass } from "@/components/ui/button";
import {
    createOpinionReportStatusUpdateFormData,
    type OpinionReportStatus,
} from "@/features/feedback/schemas/opinion-report-admin-schema";
import { cn } from "@/lib/cn";

export default function OpinionReportStatusButton({
    reportId,
    status,
}: {
    reportId: number;
    status: OpinionReportStatus;
}) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const nextStatus = status === "pending" ? "resolved" : "pending";

    function handleStatusUpdate() {
        startTransition(async () => {
            try {
                const result = await updateOpinionReportStatus(
                    createOpinionReportStatusUpdateFormData(
                        reportId,
                        nextStatus
                    )
                );
                if (!result.success) {
                    toast.error(result.message);
                    return;
                }
                toast.success(result.message);
                router.refresh();
            } catch {
                toast.error("신고 상태를 변경하지 못했습니다.");
            }
        });
    }

    return (
        <button
            type="button"
            disabled={isPending}
            onClick={handleStatusUpdate}
            className={cn(
                foundationButtonClass({ variant: "secondary" }),
                "w-full"
            )}
        >
            {status === "pending" ? (
                <Check className="nl-icon-small text-nl-success" aria-hidden />
            ) : (
                <RotateCcw className="nl-icon-small" aria-hidden />
            )}
            {isPending
                ? "처리 중"
                : status === "pending"
                  ? "처리 완료"
                  : "다시 열기"}
        </button>
    );
}

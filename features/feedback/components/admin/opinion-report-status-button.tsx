"use client";

import { Check, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";

import { updateOpinionReportStatus } from "@/app/admin/feedback/actions";
import { foundationButtonClass } from "@/components/ui/button";
import {
    createOpinionReportStatusUpdateFormData,
    type OpinionReportStatus,
} from "@/features/feedback/schemas/opinion-report-admin-schema";
import { cn } from "@/lib/cn";
import useActionToast from "@/lib/hooks/use-action-toast";

export default function OpinionReportStatusButton({
    reportId,
    status,
}: {
    reportId: number;
    status: OpinionReportStatus;
}) {
    const router = useRouter();
    const { isPending, run } = useActionToast();
    const nextStatus = status === "pending" ? "resolved" : "pending";

    function handleStatusUpdate() {
        run(
            () =>
                updateOpinionReportStatus(
                    createOpinionReportStatusUpdateFormData(
                        reportId,
                        nextStatus
                    )
                ),
            {
                errorMessage: "신고 상태를 변경하지 못했습니다.",
                onSuccess: () => {
                    router.refresh();
                },
            }
        );
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
                <Check className="nl-icon-small" aria-hidden />
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

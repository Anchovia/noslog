"use client";

import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

import { setOpinionReportTargetHidden } from "@/app/admin/feedback/actions";
import { foundationButtonClass } from "@/components/ui/button";
import { createOpinionReportHiddenUpdateFormData } from "@/features/feedback/schemas/opinion-report-admin-schema";
import { cn } from "@/lib/cn";
import useActionToast from "@/lib/hooks/use-action-toast";

export default function OpinionReportHideButton({
    reportId,
    hidden,
}: {
    reportId: number;
    hidden: boolean;
}) {
    const router = useRouter();
    const { isPending, run } = useActionToast();

    function handleToggle() {
        run(
            () =>
                setOpinionReportTargetHidden(
                    createOpinionReportHiddenUpdateFormData(reportId, !hidden)
                ),
            {
                errorMessage: "글 상태를 변경하지 못했습니다.",
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
            onClick={handleToggle}
            className={cn(
                foundationButtonClass({ variant: "secondary" }),
                "w-full"
            )}
        >
            {hidden ? (
                <Eye className="nl-icon-small" aria-hidden />
            ) : (
                <EyeOff className="nl-icon-small" aria-hidden />
            )}
            {isPending ? "처리 중" : hidden ? "다시 보이기" : "글 가리기"}
        </button>
    );
}

"use client";

import { Check, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { reviewMusicCatalogCandidate } from "@/app/admin/catalog/actions";
import { foundationButtonClass } from "@/components/ui/button";
import {
    createMusicCatalogReviewFormData,
    type MusicCatalogDecision,
} from "@/features/music/schemas/music-catalog-admin-schema";

export default function MusicCatalogReviewActions({
    candidateId,
}: {
    candidateId: number;
}) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    function review(decision: MusicCatalogDecision) {
        startTransition(async () => {
            try {
                const result = await reviewMusicCatalogCandidate(
                    createMusicCatalogReviewFormData(candidateId, decision)
                );
                if (!result.success) {
                    toast.error(result.message);
                    return;
                }

                toast.success(result.message);
                router.refresh();
            } catch {
                toast.error("악곡 업데이트를 처리하지 못했습니다.");
            }
        });
    }

    return (
        <div className="grid grid-cols-2 gap-nl-8">
            <button
                type="button"
                disabled={isPending}
                onClick={() => review("reject")}
                className={foundationButtonClass({ variant: "secondary" })}
            >
                <X className="nl-icon-small" aria-hidden />
                {isPending ? "처리 중" : "반려"}
            </button>
            <button
                type="button"
                disabled={isPending}
                onClick={() => review("approve")}
                className={foundationButtonClass()}
            >
                <Check className="nl-icon-small" aria-hidden />
                {isPending ? "처리 중" : "반영"}
            </button>
        </div>
    );
}

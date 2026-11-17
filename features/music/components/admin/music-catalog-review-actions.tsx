"use client";

import { useRouter } from "next/navigation";

import { reviewMusicCatalogCandidate } from "@/app/admin/catalog/actions";
import ActionMenu from "@/components/ui/action-menu";
import {
    createMusicCatalogReviewFormData,
    type MusicCatalogDecision,
} from "@/features/music/schemas/music-catalog-admin-schema";
import useActionToast from "@/lib/hooks/use-action-toast";

export default function MusicCatalogReviewActions({
    candidateId,
}: {
    candidateId: number;
}) {
    const router = useRouter();
    const { isPending, run } = useActionToast();

    function review(decision: MusicCatalogDecision) {
        run(
            () =>
                reviewMusicCatalogCandidate(
                    createMusicCatalogReviewFormData(candidateId, decision)
                ),
            {
                errorMessage: "악곡 업데이트를 처리하지 못했습니다.",
                onSuccess: () => {
                    router.refresh();
                },
            }
        );
    }

    return (
        <ActionMenu
            label="악곡 업데이트 메뉴"
            disabled={isPending}
            items={[
                { label: "반영", onSelect: () => review("approve") },
                { label: "반려", onSelect: () => review("reject") },
            ]}
        />
    );
}

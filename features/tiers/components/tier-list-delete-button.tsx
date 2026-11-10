"use client";

import { useRouter } from "next/navigation";

import { deleteTierList } from "@/app/admin/tiers/actions";
import Button from "@/components/ui/button";
import { createTierIdFormData } from "@/features/tiers/schemas/tier-admin-schema";
import useActionToast from "@/lib/hooks/use-action-toast";

export default function TierListDeleteButton({
    tierListId,
}: {
    tierListId: number;
}) {
    const router = useRouter();
    const { isPending, run } = useActionToast();

    function handleDelete() {
        run(() => deleteTierList(createTierIdFormData(tierListId)), {
            errorMessage: "서열표를 삭제하지 못했습니다.",
            onSuccess: () => {
                router.replace("/admin/tiers");
                router.refresh();
            },
        });
    }

    return (
        <Button
            variant="danger"
            className="w-full"
            disabled={isPending}
            onClick={handleDelete}
        >
            {isPending ? "삭제 중..." : "보관 서열표 삭제"}
        </Button>
    );
}

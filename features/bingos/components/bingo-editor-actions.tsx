"use client";

import { Save, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { deleteBingo } from "@/app/admin/bingos/actions";
import Button, { foundationButtonClass } from "@/components/ui/button";
import { createBingoDeleteFormData } from "@/features/bingos/schemas/bingo-editor-schema";
import { cn } from "@/lib/cn";
import useActionToast from "@/lib/hooks/use-action-toast";

export function SaveBingoButton({ isSubmitting }: { isSubmitting: boolean }) {
    return (
        <button
            type="submit"
            disabled={isSubmitting}
            className={cn(
                foundationButtonClass(),
                "sticky bottom-nl-12 z-nl-sticky shadow-nl-overlay"
            )}
        >
            <Save className="nl-icon-small" aria-hidden />
            {isSubmitting ? "저장 중" : "빙고 저장"}
        </button>
    );
}

export function DeleteBingoButton({ bingoId }: { bingoId: number }) {
    const router = useRouter();
    const { isPending, run } = useActionToast();

    function handleDelete() {
        run(() => deleteBingo(createBingoDeleteFormData(bingoId)), {
            errorMessage: "빙고를 삭제하지 못했습니다.",
            onSuccess: () => {
                router.replace("/admin/bingos");
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
            <Trash2 className="nl-icon-small" aria-hidden />
            {isPending ? "삭제 중" : "진행 기록이 없을 때 삭제"}
        </Button>
    );
}

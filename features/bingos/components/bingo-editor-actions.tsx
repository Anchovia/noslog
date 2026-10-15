"use client";

import { Save, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { deleteBingo } from "@/app/admin/bingos/actions";
import Button, { foundationButtonClass } from "@/components/ui/button";
import { createBingoDeleteFormData } from "@/features/bingos/schemas/bingo-editor-schema";
import { cn } from "@/lib/cn";

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
    const [isPending, startTransition] = useTransition();

    function handleDelete() {
        startTransition(async () => {
            try {
                const result = await deleteBingo(
                    createBingoDeleteFormData(bingoId)
                );
                if (!result.success) {
                    toast.error(result.message);
                    return;
                }

                toast.success(result.message);
                router.replace("/admin/bingos");
                router.refresh();
            } catch {
                toast.error("빙고를 삭제하지 못했습니다.");
            }
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

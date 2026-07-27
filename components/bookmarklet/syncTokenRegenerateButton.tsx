"use client";

import { regenerateSyncToken } from "@/app/(nevigation)/bookmarklet/action";
import Button from "@/components/ui/Button";
import { KeyRound, LoaderCircle } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

export default function SyncTokenRegenerateButton() {
    const [isPending, startTransition] = useTransition();

    function handleRegenerate() {
        startTransition(async () => {
            const result = await regenerateSyncToken();

            if (result.success) {
                toast.success(result.message);
                return;
            }

            toast.error(result.message);
        });
    }

    return (
        <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={isPending ? "연동 토큰 재발급 중" : "연동 토큰 재발급"}
            title="연동 토큰 재발급"
            disabled={isPending}
            onClick={handleRegenerate}
        >
            {isPending ? (
                <LoaderCircle className="size-4 animate-spin" aria-hidden />
            ) : (
                <KeyRound size={16} aria-hidden />
            )}
        </Button>
    );
}

"use client";

import { KeyRound } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

import { resetUserSyncToken } from "@/app/admin/users/actions";
import { foundationButtonClass } from "@/components/ui/button";
import { createUserSyncTokenResetFormData } from "@/features/users/schemas/user-admin-schema";
import { cn } from "@/lib/cn";

interface ResetUserSyncTokenButtonProps {
    syncTokenVersion: number;
    userId: number;
}

export default function ResetUserSyncTokenButton({
    syncTokenVersion,
    userId,
}: ResetUserSyncTokenButtonProps) {
    const [isPending, startTransition] = useTransition();

    function handleReset() {
        startTransition(async () => {
            try {
                const result = await resetUserSyncToken(
                    createUserSyncTokenResetFormData(userId)
                );
                if (!result.success) {
                    toast.error(result.message);
                    if ("reauthenticationRequired" in result)
                        window.location.assign(
                            new URL(
                                "/discord/start?mode=admin",
                                window.location.origin
                            ).href
                        );
                    return;
                }

                // 액션의 revalidatePath 가 같은 응답에 목록을 다시 그려 보낸다 — router.refresh 를 또 부르면 목록 조회가 두 번(2026-10-15 HOME-19)
                toast.success(result.message);
            } catch {
                toast.error("연동 토큰을 초기화하지 못했습니다.");
            }
        });
    }

    return (
        <button
            type="button"
            disabled={isPending}
            onClick={handleReset}
            className={cn(
                foundationButtonClass({ variant: "secondary", size: "sm" }),
                "w-full"
            )}
        >
            <KeyRound className="nl-icon-small" aria-hidden />
            {isPending ? "초기화 중" : `연동 토큰 초기화 (${syncTokenVersion})`}
        </button>
    );
}

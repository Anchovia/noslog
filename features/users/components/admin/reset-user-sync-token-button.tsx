"use client";

import { KeyRound } from "lucide-react";

import { resetUserSyncToken } from "@/app/admin/users/actions";
import { foundationButtonClass } from "@/components/ui/button";
import { createUserSyncTokenResetFormData } from "@/features/users/schemas/user-admin-schema";
import { cn } from "@/lib/cn";
import useActionToast from "@/lib/hooks/use-action-toast";

interface ResetUserSyncTokenButtonProps {
    syncTokenVersion: number;
    userId: number;
}

export default function ResetUserSyncTokenButton({
    syncTokenVersion,
    userId,
}: ResetUserSyncTokenButtonProps) {
    const { isPending, run } = useActionToast();

    function handleReset() {
        // 액션의 revalidatePath 가 같은 응답에 목록을 다시 그려 보낸다 — router.refresh 를 또 부르면 목록 조회가 두 번(2026-10-15 HOME-19)
        run(
            () => resetUserSyncToken(createUserSyncTokenResetFormData(userId)),
            {
                errorMessage: "연동 토큰을 초기화하지 못했습니다.",
                onFailure: (result) => {
                    if ("reauthenticationRequired" in result)
                        window.location.assign(
                            new URL(
                                "/discord/start?mode=admin",
                                window.location.origin
                            ).href
                        );
                },
            }
        );
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

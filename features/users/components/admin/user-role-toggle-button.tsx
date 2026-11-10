"use client";

import { ShieldCheck } from "lucide-react";

import { updateUserRole } from "@/app/admin/users/actions";
import { foundationButtonClass } from "@/components/ui/button";
import { createUserRoleUpdateFormData } from "@/features/users/schemas/user-admin-schema";
import { cn } from "@/lib/cn";
import useActionToast from "@/lib/hooks/use-action-toast";

interface UserRoleToggleButtonProps {
    isAdmin: boolean;
    userId: number;
    userLabel: string;
}

export default function UserRoleToggleButton({
    isAdmin,
    userId,
    userLabel,
}: UserRoleToggleButtonProps) {
    const { isPending, run } = useActionToast();
    const role = isAdmin ? "user" : "admin";
    const actionLabel = isAdmin ? "권한 해제" : "관리자 지정";

    function handleRoleUpdate() {
        const message = isAdmin
            ? `${userLabel}님의 관리자 권한을 해제하시겠습니까?`
            : `${userLabel}님에게 관리자 권한을 부여하시겠습니까?`;
        if (!window.confirm(message)) return;

        // 액션의 revalidatePath 가 같은 응답에 목록을 다시 그려 보낸다 — router.refresh 를 또 부르면 목록 조회가 두 번(2026-10-15 HOME-19)
        run(() => updateUserRole(createUserRoleUpdateFormData(userId, role)), {
            errorMessage: "사용자 권한을 변경하지 못했습니다.",
            onFailure: (result) => {
                if ("reauthenticationRequired" in result)
                    window.location.assign(
                        new URL(
                            "/discord/start?mode=admin",
                            window.location.origin
                        ).href
                    );
            },
        });
    }

    return (
        <button
            type="button"
            disabled={isPending}
            onClick={handleRoleUpdate}
            className={cn(
                foundationButtonClass({ variant: "secondary", size: "sm" }),
                "w-full"
            )}
        >
            <ShieldCheck className="nl-icon-small" aria-hidden />
            {isPending ? "처리 중" : actionLabel}
        </button>
    );
}

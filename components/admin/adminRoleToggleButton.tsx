"use client";

import { ShieldCheck } from "lucide-react";

export default function AdminRoleToggleButton({
    isAdmin,
    userLabel,
}: {
    isAdmin: boolean;
    userLabel: string;
}) {
    const actionLabel = isAdmin ? "권한 해제" : "관리자 지정";

    return (
        <button
            type="submit"
            onClick={(event) => {
                const message = isAdmin
                    ? `${userLabel}님의 관리자 권한을 해제하시겠습니까?`
                    : `${userLabel}님에게 관리자 권한을 부여하시겠습니까?`;

                if (!window.confirm(message)) {
                    event.preventDefault();
                }
            }}
            className="border-border flex h-9 w-full items-center justify-center gap-1 rounded-md border text-xs font-bold"
        >
            <ShieldCheck className="size-3.5" />
            {actionLabel}
        </button>
    );
}

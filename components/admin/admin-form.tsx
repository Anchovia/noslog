import { Save } from "lucide-react";
import type { AriaRole } from "react";

import ActionButton from "@/components/ui/action-button";
import { foundationButtonClass } from "@/components/ui/button";

// 관리자 폼도 공용 입력 · 버튼 규격을 쓴다(2026-10-15 B5 2단계 — 공개 화면과 같은 nl-input · nl-button)
export const adminInputClass = "nl-input";

export const adminCompactInputClass = "nl-input min-w-0";

export const adminSecondaryButtonClass = foundationButtonClass({
    variant: "secondary",
    size: "sm",
});

export const adminCompactPrimaryButtonClass = foundationButtonClass({
    size: "sm",
});

export const adminTextareaClass = "nl-input resize-none";

export function AdminSubmitButton({
    idleLabel,
    isSubmitting,
}: {
    idleLabel: string;
    isSubmitting: boolean;
}) {
    // 바쁨은 비활성이 아니다 — 스피너 + 진행형 라벨, 다시 누르지 못하게만 막는다
    return (
        <ActionButton
            type="submit"
            busy={isSubmitting}
            busyLabel="저장 중"
            className="ml-auto"
        >
            <Save className="nl-icon-small" aria-hidden />
            {idleLabel}
        </ActionButton>
    );
}

export function AdminFieldError({
    message,
    as: Tag = "p",
    className = "text-nl-error mt-nl-4 nl-metadata",
    role = "alert",
}: {
    message?: string;
    as?: "p" | "span";
    className?: string;
    role?: AriaRole | null;
}) {
    return message ? (
        <Tag className={className} {...(role ? { role } : {})}>
            {message}
        </Tag>
    ) : null;
}

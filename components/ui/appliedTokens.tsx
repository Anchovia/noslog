"use client";

import { X } from "lucide-react";
import type { ReactNode } from "react";

import ActionButton from "@/components/ui/actionButton";

export interface AppliedToken {
    key: string;
    label: ReactNode;
    /** 접근 이름 — "{조건} 조건 해제" 처럼 완결된 문장 */
    removeLabel: string;
    onRemove: () => void;
}

/**
 * 적용 조건 개요 행(Baymard "applied filters overview") — 토큰마다 × 로 개별 제거, 끝에 전체 지우기.
 * 필터 그릇을 다시 열지 않고도 무엇이 걸려 있는지 보이고 풀 수 있게 한다.
 */
export default function AppliedTokens({
    label,
    tokens,
    clearLabel,
    onClear,
}: {
    label: string;
    tokens: AppliedToken[];
    clearLabel: string;
    onClear: () => void;
}) {
    if (!tokens.length) return null;
    return (
        <div className="nl-applied" role="group" aria-label={label}>
            {tokens.map((token) => (
                <button
                    key={token.key}
                    type="button"
                    className="nl-applied__token nl-control"
                    aria-label={token.removeLabel}
                    onClick={token.onRemove}
                >
                    {token.label}
                    <X className="nl-icon-small" aria-hidden />
                </button>
            ))}
            <ActionButton variant="ghost" size="sm" onClick={onClear}>
                {clearLabel}
            </ActionButton>
        </div>
    );
}

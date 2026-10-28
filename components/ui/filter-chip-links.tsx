import { Check } from "lucide-react";
import type { ReactNode } from "react";

import IntentLink from "@/components/ui/intent-link";
import { cn } from "@/lib/cn";

/**
 * 주소로 거르는 필터 칩 — 모양은 FilterChips(작은 컨트롤 높이 · 선택 = 고른 면 · 선 없음 · 체크)와 같고 항목이 링크다.
 * 주소가 곧 상태라 새로고침 · 공유 · 뒤로 가기에 그대로 남는다. 하나만 고른다. 미리 불러오기는 공용 링크(IntentLink) 규칙.
 */
export default function FilterChipLinks({
    label,
    options,
    className,
}: {
    label: string;
    options: readonly {
        key: string;
        label: ReactNode;
        href: string;
        selected: boolean;
    }[];
    className?: string;
}) {
    return (
        <nav aria-label={label} className={cn("nl-chips", className)}>
            {options.map((option) => (
                <IntentLink
                    key={option.key}
                    href={option.href}
                    className="nl-chip nl-control"
                    aria-current={option.selected ? "page" : undefined}
                >
                    {option.selected ? (
                        <Check className="nl-icon-small" aria-hidden />
                    ) : null}
                    <span>{option.label}</span>
                </IntentLink>
            ))}
        </nav>
    );
}

import { Check } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * 주소로 거르는 필터 칩 — 모양은 FilterChips(높이 36 · 선택 = 면 · 경계 · 체크 · 굵기)와 같고 항목이 링크다.
 * 서버에서 그려지고 주소가 곧 상태라 새로고침 · 공유 · 뒤로 가기에 그대로 남는다. 하나만 고른다.
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
                <Link
                    key={option.key}
                    prefetch={false}
                    href={option.href}
                    className="nl-chip nl-control"
                    aria-current={option.selected ? "page" : undefined}
                >
                    {option.selected ? (
                        <Check className="nl-icon-small" aria-hidden />
                    ) : null}
                    <span>{option.label}</span>
                </Link>
            ))}
        </nav>
    );
}

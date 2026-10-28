import type { LucideIcon } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/cn";

/**
 * 정보 줄 목록(2026-10-21 전면 대조 ① — Google 지도 · 카카오맵 · 네이버 장소 화면).
 * 줄 사이 구분선. 줄 = 아이콘 20(흐림) →12→ 본문 16(+ 보조 14 줄) → 끝 동작(고스트 M 등). 값은 모두 토큰(foundation.css)
 */
export function IconRows({ className, ...props }: ComponentProps<"ul">) {
    return <ul className={cn("nl-icon-rows", className)} {...props} />;
}

export default function IconRow({
    icon: Icon,
    children,
    detail,
    action,
    className,
    ...props
}: Omit<ComponentProps<"li">, "children"> & {
    icon: LucideIcon;
    /** 본문 한 줄(주소 · 오늘 영업시간 · 계정) */
    children: ReactNode;
    /** 본문 아래 보조 줄(노선 · 걸어서 몇 분) */
    detail?: ReactNode;
    /** 끝 동작 — 복사 · 펼치기 · 바깥 링크 */
    action?: ReactNode;
}) {
    return (
        <li className={cn("nl-icon-row", className)} {...props}>
            <Icon className="nl-icon nl-icon-row__icon" aria-hidden />
            <div className="nl-icon-row__copy">
                <div className="nl-body">{children}</div>
                {detail ? (
                    <div className="nl-body-secondary nl-muted">{detail}</div>
                ) : null}
            </div>
            {action ? (
                <div className="nl-icon-row__action">{action}</div>
            ) : null}
        </li>
    );
}

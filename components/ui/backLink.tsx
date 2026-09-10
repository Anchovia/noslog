import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

// 상위 페이지로 돌아가는 링크 (SET-42 규격): chevron-left 16 + 라벨 `control` · 타겟 44 · gap 8 · muted.
// 라벨은 목적지 페이지의 제목을 그대로 쓴다. 히스토리 back 이 아니라 계층 위로의 이동이다.
export default function BackLink({
    href,
    children,
    className,
    plain = false,
}: {
    href: string;
    children: ReactNode;
    className?: string;
    /** 클라이언트 라우팅 없이 전체 이동해야 할 때 (`<a>`) */
    plain?: boolean;
}) {
    const props = {
        href,
        className: cn("nl-back-link nl-control nl-muted", className),
    };
    const content = (
        <>
            <ChevronLeft aria-hidden />
            {children}
        </>
    );
    return plain ? (
        <a {...props}>{content}</a>
    ) : (
        <Link {...props}>{content}</Link>
    );
}

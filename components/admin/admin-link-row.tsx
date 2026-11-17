"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

import { adminRowOpenProps } from "@/components/admin/admin-card";

// 제목 링크가 있는 표 줄 — 줄 어디를 눌러도 제목 링크와 같은 곳으로 간다(「자세히 보기」 줄과 같은 규칙)
export default function AdminLinkRow({
    href,
    children,
}: {
    href: string;
    children: ReactNode;
}) {
    const router = useRouter();
    return (
        <tr
            {...adminRowOpenProps(() => router.push(href))}
            aria-haspopup={undefined}
        >
            {children}
        </tr>
    );
}

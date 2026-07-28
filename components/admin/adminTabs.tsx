"use client";

import { ChevronDown, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

const tabs = [
    { href: "/admin", label: "관리 홈" },
    { href: "/admin/exams", label: "검정" },
    { href: "/admin/submissions", label: "인증" },
    { href: "/admin/music", label: "악곡" },
    { href: "/admin/catalog", label: "업데이트" },
    { href: "/admin/tiers", label: "서열표" },
    { href: "/admin/bingos", label: "빙고" },
    { href: "/admin/arcades", label: "오락실" },
    { href: "/admin/users", label: "유저" },
    { href: "/admin/community", label: "의견" },
    { href: "/admin/feedback", label: "피드백" },
    { href: "/admin/announcements", label: "공지" },
    { href: "/admin/syncs", label: "동기화" },
];

// 현재 관리자 경로에 맞춰 활성 탭을 표시함
export default function AdminTabs() {
    const pathname = usePathname();
    const detailsRef = useRef<HTMLDetailsElement>(null);
    const activeTab =
        tabs.find((tab) =>
            tab.href === "/admin"
                ? pathname === tab.href
                : pathname.startsWith(tab.href)
        ) ?? tabs[0];

    useEffect(() => {
        if (detailsRef.current) detailsRef.current.open = false;
    }, [pathname]);

    return (
        <div className="border-divider bg-bg relative z-30 border-b px-4 py-2">
            <details ref={detailsRef} className="group relative">
                <summary className="bg-surface flex h-10 cursor-pointer list-none items-center gap-2 rounded-md px-3 [&::-webkit-details-marker]:hidden">
                    <ShieldCheck className="text-basic size-4" />
                    <span className="text-text-secondary text-xs font-semibold">
                        관리자
                    </span>
                    <strong className="text-sm font-bold">
                        {activeTab.label}
                    </strong>
                    <ChevronDown className="text-text-secondary ml-auto size-4 transition-transform group-open:rotate-180" />
                </summary>
                <nav className="border-border bg-surface absolute top-12 right-0 left-0 grid grid-cols-3 gap-1 rounded-md border p-2 shadow-xl">
                    {tabs.map((tab) => {
                        const isActive = tab.href === activeTab.href;

                        return (
                            <Link
                                key={tab.href}
                                href={tab.href}
                                onClick={() => {
                                    if (detailsRef.current) {
                                        detailsRef.current.open = false;
                                    }
                                }}
                                className={cn(
                                    "text-text-secondary flex h-10 items-center justify-center rounded-md text-xs font-semibold",
                                    isActive &&
                                        "bg-text-primary text-bg font-bold"
                                )}
                            >
                                {tab.label}
                            </Link>
                        );
                    })}
                </nav>
            </details>
        </div>
    );
}

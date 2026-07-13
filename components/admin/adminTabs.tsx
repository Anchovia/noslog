"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const tabs = [
    { href: "/admin", label: "관리 홈" },
    { href: "/admin/exams", label: "검정" },
];

// 현재 관리자 경로에 맞춰 활성 탭을 표시함
export default function AdminTabs() {
    const pathname = usePathname();

    return (
        <nav className="border-divider bg-bg flex h-11 items-end gap-1 overflow-x-auto border-b px-4">
            {tabs.map((tab) => {
                const isActive =
                    tab.href === "/admin"
                        ? pathname === tab.href
                        : pathname.startsWith(tab.href);

                return (
                    <Link
                        key={tab.href}
                        href={tab.href}
                        className={cn(
                            "text-text-secondary flex h-10 shrink-0 items-center border-b-2 border-transparent px-3 text-sm font-semibold",
                            isActive && "border-text-primary text-text-primary"
                        )}
                    >
                        {tab.label}
                    </Link>
                );
            })}
        </nav>
    );
}

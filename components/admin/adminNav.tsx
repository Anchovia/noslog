"use client";

import { ShieldUser } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

export const adminSections = [
    { href: "/admin/announcements", label: "공지" },
    { href: "/admin/feedback", label: "피드백" },
    { href: "/admin/users", label: "유저" },
    { href: "/admin/syncs", label: "동기화" },
    { href: "/admin/music", label: "악곡" },
    { href: "/admin/catalog", label: "업데이트" },
    { href: "/admin/tiers", label: "서열표" },
    { href: "/admin/exams", label: "검정" },
    { href: "/admin/submissions", label: "인증" },
    { href: "/admin/bingos", label: "빙고" },
    { href: "/admin/arcades", label: "오락실" },
    { href: "/admin/community", label: "의견" },
] as const;

// 헤더 아래 가로 스크롤 탭으로 관리 구역을 오가며, 현재 구역을 화면 안으로 끌어옴
export default function AdminNav() {
    const pathname = usePathname();
    const currentRef = useRef<HTMLAnchorElement>(null);
    const current = adminSections.find((section) =>
        pathname.startsWith(section.href)
    );

    useEffect(() => {
        currentRef.current?.scrollIntoView({
            block: "nearest",
            inline: "center",
        });
    }, [pathname]);

    return (
        <nav className="nl-admin-nav" aria-label="관리자 메뉴">
            <div className="nl-admin-nav__content">
                <span className="nl-admin-nav__badge nl-control">
                    <ShieldUser className="nl-icon-small" aria-hidden />
                    관리자
                </span>
                <div className="nl-admin-nav__tabs">
                    {adminSections.map((section) => {
                        const active = section.href === current?.href;
                        return (
                            <Link
                                key={section.href}
                                ref={active ? currentRef : undefined}
                                href={section.href}
                                aria-current={active ? "page" : undefined}
                                className={cn(
                                    "nl-admin-nav__tab nl-control",
                                    active && "nl-admin-nav__tab--current"
                                )}
                            >
                                {section.label}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}

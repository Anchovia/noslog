"use client";

import { Grid3X3, MapPin, Menu, RefreshCw, Trophy, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

const primaryItems = [
    { href: "/music", label: "악곡" },
    { href: "/rankings", label: "랭킹" },
    { href: "/tiers", label: "서열" },
];

const secondaryItems = [
    { href: "/bingo", label: "빙고", icon: Grid3X3 },
    { href: "/exams", label: "검정", icon: Trophy },
    { href: "/gamecenter", label: "오락실", icon: MapPin },
    { href: "/bookmarklet", label: "데이터 연동", icon: RefreshCw },
];

function isActiveRoute(pathname: string, href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
}

export function HeaderPrimaryNavigation() {
    const pathname = usePathname();

    return (
        <nav
            className="flex min-w-0 items-center gap-2 min-[390px]:gap-3"
            aria-label="주요 메뉴"
        >
            {primaryItems.map((item) => {
                const isActive = isActiveRoute(pathname, item.href);
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        aria-current={isActive ? "page" : undefined}
                        className={cn(
                            "text-section text-text-secondary hover:text-text-primary flex h-10 shrink-0 items-center border-b-2 border-transparent transition-colors",
                            isActive && "border-chart text-text-primary"
                        )}
                    >
                        {item.label}
                    </Link>
                );
            })}
        </nav>
    );
}

export default function HeaderMenu() {
    const pathname = usePathname();
    const menuButtonRef = useRef<HTMLButtonElement>(null);
    const [openPathname, setOpenPathname] = useState<string | null>(null);
    const isOpen = openPathname === pathname;
    const hasActiveSecondaryItem = secondaryItems.some((item) =>
        isActiveRoute(pathname, item.href)
    );

    useEffect(() => {
        if (!isOpen) return;

        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key !== "Escape") return;
            setOpenPathname(null);
            menuButtonRef.current?.focus();
        }

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            document.body.style.overflow = originalOverflow;
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen]);

    return (
        <>
            <button
                ref={menuButtonRef}
                type="button"
                aria-label={isOpen ? "전체 메뉴 닫기" : "전체 메뉴 열기"}
                aria-expanded={isOpen}
                aria-controls="header-secondary-menu"
                onClick={() =>
                    setOpenPathname((current) =>
                        current === pathname ? null : pathname
                    )
                }
                className={cn(
                    "text-text-secondary hover:bg-surface-muted hover:text-text-primary focus-visible:ring-focus/40 flex size-10 shrink-0 items-center justify-center rounded-md transition-colors focus-visible:ring-2 focus-visible:outline-none",
                    (isOpen || hasActiveSecondaryItem) &&
                        "bg-surface-muted text-text-primary"
                )}
            >
                {isOpen ? (
                    <X className="size-5" aria-hidden="true" />
                ) : (
                    <Menu className="size-5" aria-hidden="true" />
                )}
            </button>

            {isOpen ? (
                <>
                    <button
                        type="button"
                        aria-label="전체 메뉴 닫기"
                        onClick={() => setOpenPathname(null)}
                        className="fixed inset-x-0 top-14 bottom-0 bg-black/40"
                    />
                    <nav
                        id="header-secondary-menu"
                        aria-label="전체 메뉴"
                        className="border-divider bg-surface fixed top-14 left-1/2 grid w-full max-w-97.5 -translate-x-1/2 grid-cols-2 gap-2 border-b p-3 shadow-xl"
                    >
                        {secondaryItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = isActiveRoute(pathname, item.href);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    aria-current={isActive ? "page" : undefined}
                                    onClick={() => setOpenPathname(null)}
                                    className={cn(
                                        "border-border bg-bg text-text-secondary hover:bg-surface-muted hover:text-text-primary flex h-11 items-center gap-2 rounded-md border px-3 transition-colors",
                                        isActive &&
                                            "border-chart bg-surface-muted text-text-primary"
                                    )}
                                >
                                    <Icon
                                        className="text-text-primary size-4 shrink-0"
                                        aria-hidden="true"
                                    />
                                    <span className="text-section">
                                        {item.label}
                                    </span>
                                </Link>
                            );
                        })}
                    </nav>
                </>
            ) : null}
        </>
    );
}

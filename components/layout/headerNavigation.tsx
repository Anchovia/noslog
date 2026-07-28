"use client";

import {
    Grid3X3,
    MapPin,
    Menu,
    RefreshCw,
    ShieldCheck,
    Trophy,
    X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import {
    useLocalizedHref,
    useTranslations,
    type MessageKey,
} from "@/components/i18n/localeProvider";
import { stripLocaleFromPath } from "@/lib/i18n/routing";
import { cn } from "@/lib/utils";

const primaryItems: {
    href: string;
    labelKey: MessageKey;
}[] = [
    { href: "/music", labelKey: "header.music" },
    { href: "/rankings", labelKey: "header.rankings" },
    { href: "/tiers", labelKey: "header.tiers" },
];

const secondaryItems = [
    { href: "/bingo", labelKey: "header.bingo", icon: Grid3X3 },
    { href: "/exams", labelKey: "header.exams", icon: Trophy },
    { href: "/gamecenter", labelKey: "header.arcades", icon: MapPin },
    {
        href: "/bookmarklet",
        labelKey: "header.dataSync",
        icon: RefreshCw,
    },
] satisfies {
    href: string;
    labelKey: MessageKey;
    icon: typeof Grid3X3;
}[];

const adminItem = {
    href: "/admin",
    labelKey: "header.admin",
    icon: ShieldCheck,
} satisfies {
    href: string;
    labelKey: MessageKey;
    icon: typeof ShieldCheck;
};

function isActiveRoute(pathname: string, href: string) {
    const barePathname = stripLocaleFromPath(pathname);
    return barePathname === href || barePathname.startsWith(`${href}/`);
}

function useNavigationI18n() {
    return {
        localizedHref: useLocalizedHref(),
        t: useTranslations(),
    };
}

export function HeaderPrimaryNavigation() {
    const pathname = usePathname();
    const { localizedHref, t } = useNavigationI18n();

    return (
        <nav
            className="flex min-w-0 items-center"
            aria-label={t("header.primaryNav")}
        >
            {primaryItems.map((item) => {
                const isActive = isActiveRoute(pathname, item.href);
                return (
                    <Link
                        key={item.href}
                        href={localizedHref(item.href)}
                        aria-current={isActive ? "page" : undefined}
                        className={cn(
                            "text-text-secondary hover:text-text-primary flex size-11 shrink-0 items-center justify-center text-xs font-semibold whitespace-nowrap transition-colors",
                            isActive && "text-text-primary"
                        )}
                    >
                        {t(item.labelKey)}
                    </Link>
                );
            })}
        </nav>
    );
}

export default function HeaderMenu({ isAdmin = false }: { isAdmin?: boolean }) {
    const pathname = usePathname();
    const { localizedHref, t } = useNavigationI18n();
    const menuButtonRef = useRef<HTMLButtonElement>(null);
    const [openPathname, setOpenPathname] = useState<string | null>(null);
    const isOpen = openPathname === pathname;
    const menuItems = isAdmin ? [...secondaryItems, adminItem] : secondaryItems;
    const hasActiveSecondaryItem = menuItems.some((item) =>
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
                aria-label={
                    isOpen ? t("header.closeMenu") : t("header.openMenu")
                }
                aria-expanded={isOpen}
                aria-controls="header-secondary-menu"
                onClick={() =>
                    setOpenPathname((current) =>
                        current === pathname ? null : pathname
                    )
                }
                className={cn(
                    "text-text-secondary hover:text-text-primary focus-visible:ring-focus/40 flex size-11 shrink-0 items-center justify-center rounded-md transition-colors focus-visible:ring-2 focus-visible:outline-none",
                    (isOpen || hasActiveSecondaryItem) && "text-text-primary"
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
                        aria-label={t("header.closeMenu")}
                        onClick={() => setOpenPathname(null)}
                        className="fixed inset-x-0 top-14 bottom-0 bg-black/40"
                    />
                    <nav
                        id="header-secondary-menu"
                        aria-label={t("header.fullMenu")}
                        className="border-divider bg-surface fixed top-14 left-1/2 grid w-full max-w-97.5 -translate-x-1/2 grid-cols-2 gap-2 border-b p-3 shadow-xl"
                    >
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = isActiveRoute(pathname, item.href);
                            return (
                                <Link
                                    key={item.href}
                                    href={localizedHref(item.href)}
                                    aria-current={isActive ? "page" : undefined}
                                    onClick={() => setOpenPathname(null)}
                                    className={cn(
                                        "border-border bg-bg text-text-secondary hover:bg-surface-muted hover:text-text-primary flex h-11 items-center gap-2 rounded-md border px-3 transition-colors",
                                        isActive &&
                                            "border-chart bg-surface-muted text-text-primary",
                                        item.href === "/admin" && "col-span-2"
                                    )}
                                >
                                    <Icon
                                        className="text-text-primary size-4 shrink-0"
                                        aria-hidden="true"
                                    />
                                    <span className="text-section">
                                        {t(item.labelKey)}
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

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
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import {
    type MessageKey,
    useLocalizedHref,
    useTranslations,
} from "@/components/i18n/locale-provider";
import LocaleSwitcher from "@/components/i18n/locale-switcher";
import { foundationButtonClass } from "@/components/ui/button";
import IntentLink from "@/components/ui/intent-link";
import { cn } from "@/lib/cn";
import { stripLocaleFromPath } from "@/lib/i18n/routing";

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
                    <IntentLink
                        key={item.href}
                        href={localizedHref(item.href)}
                        aria-current={isActive ? "page" : undefined}
                        className={cn(
                            "nl-metadata flex min-h-nl-control shrink-0 items-center justify-center px-nl-8 whitespace-nowrap text-nl-subdued transition-colors duration-nl-state hover:text-nl-content",
                            isActive && "text-nl-content"
                        )}
                    >
                        {t(item.labelKey)}
                    </IntentLink>
                );
            })}
        </nav>
    );
}

export default function HeaderMenu({
    isAdmin = false,
    showLocaleSwitcher = false,
}: {
    isAdmin?: boolean;
    showLocaleSwitcher?: boolean;
}) {
    const pathname = usePathname();
    const { localizedHref, t } = useNavigationI18n();
    const menuButtonRef = useRef<HTMLButtonElement>(null);
    const [openPathname, setOpenPathname] = useState<string | null>(null);
    const isOpen = openPathname === pathname;
    const menuItems = isAdmin ? [...secondaryItems, adminItem] : secondaryItems;

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
                className={foundationButtonClass({
                    variant: "ghost",
                    size: "icon",
                })}
            >
                {isOpen ? (
                    <X className="nl-icon" aria-hidden="true" />
                ) : (
                    <Menu className="nl-icon" aria-hidden="true" />
                )}
            </button>

            {isOpen ? (
                <>
                    <button
                        type="button"
                        aria-label={t("header.closeMenu")}
                        onClick={() => setOpenPathname(null)}
                        className="fixed inset-x-0 top-nl-header bottom-0 bg-nl-scrim"
                    />
                    <nav
                        id="header-secondary-menu"
                        aria-label={t("header.fullMenu")}
                        className="nl-admin-phone-frame fixed top-nl-header left-1/2 grid w-full -translate-x-1/2 grid-cols-2 gap-nl-8 border-b-nl-stroke border-nl-divider bg-nl-surface p-nl-12 shadow-nl-overlay"
                    >
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = isActiveRoute(pathname, item.href);
                            return (
                                <IntentLink
                                    key={item.href}
                                    href={localizedHref(item.href)}
                                    aria-current={isActive ? "page" : undefined}
                                    onClick={() => setOpenPathname(null)}
                                    className={cn(
                                        "nl-hover-layer flex min-h-nl-control items-center gap-nl-8 rounded-nl-field border-nl-stroke border-nl-divider bg-nl-canvas px-nl-12 text-nl-subdued transition-colors duration-nl-state hover:text-nl-content",
                                        isActive &&
                                            "border-nl-chart bg-nl-surface text-nl-content",
                                        item.href === "/admin" && "col-span-2"
                                    )}
                                >
                                    <Icon
                                        className="nl-icon-small shrink-0 text-nl-content"
                                        aria-hidden="true"
                                    />
                                    <span className="nl-component-title text-nl-content">
                                        {t(item.labelKey)}
                                    </span>
                                </IntentLink>
                            );
                        })}
                        {showLocaleSwitcher ? (
                            <LocaleSwitcher
                                onNavigate={() => setOpenPathname(null)}
                            />
                        ) : null}
                    </nav>
                </>
            ) : null}
        </>
    );
}

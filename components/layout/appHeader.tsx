"use client";

import { Menu, MessageSquare, Settings, ShieldUser, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";

import {
    useLocalizedHref,
    useTranslations,
} from "@/components/i18n/localeProvider";
import {
    isDestinationActive,
    productDestinations,
} from "@/components/layout/destinations";
import Avatar from "@/components/ui/avatar";
import FeedbackDialog from "@/features/feedback/components/feedbackDialog";
import useMediaQuery from "@/lib/hooks/useMediaQuery";
import { stripLocaleFromPath } from "@/lib/i18n/routing";

export interface ShellAccount {
    id: number;
    username: string | null;
    avatar: string | null;
    role: string;
}

export default function AppHeader({
    account,
}: {
    account: ShellAccount | null;
}) {
    const pathname = usePathname();
    const query = useSearchParams().toString();
    return <HeaderContent key={`${pathname}?${query}`} account={account} />;
}

function HeaderContent({ account }: { account: ShellAccount | null }) {
    const t = useTranslations();
    const href = useLocalizedHref();
    const pathname = stripLocaleFromPath(usePathname());
    const chartScope = useSearchParams().get("scope") === "chart";
    const wide = useMediaQuery("(min-width: 672px)");
    const desktop = useMediaQuery("(min-width: 1056px)");
    const [open, setOpen] = useState(false);
    const [feedbackOpen, setFeedbackOpen] = useState(false);
    const [visible, setVisible] = useState(true);
    const headerRef = useRef<HTMLElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const panelRef = useRef<HTMLElement>(null);

    useEffect(() => {
        if (!open) return;
        const previousOverflow = document.body.style.overflow;
        const background = Array.from(
            document.querySelectorAll<HTMLElement>(
                ".nl-app > main, .nl-app > footer"
            )
        );
        const previousInert = background.map((element) => element.inert);
        if (!wide) {
            document.body.style.overflow = "hidden";
            background.forEach((element) => {
                element.inert = true;
            });
        }
        panelRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();

        function closeOutside(event: PointerEvent) {
            if (
                event.target instanceof Node &&
                !headerRef.current?.contains(event.target)
            )
                setOpen(false);
        }
        function closeOnEscape(event: globalThis.KeyboardEvent) {
            if (event.key !== "Escape") return;
            event.preventDefault();
            setOpen(false);
            triggerRef.current?.focus();
        }
        document.addEventListener("pointerdown", closeOutside);
        document.addEventListener("keydown", closeOnEscape);
        return () => {
            document.body.style.overflow = previousOverflow;
            background.forEach((element, index) => {
                element.inert = previousInert[index];
            });
            document.removeEventListener("pointerdown", closeOutside);
            document.removeEventListener("keydown", closeOnEscape);
        };
    }, [open, wide]);

    useEffect(() => {
        if (desktop || open) return;
        let previous = window.scrollY;
        let frame = 0;
        function onScroll() {
            if (frame) return;
            frame = requestAnimationFrame(() => {
                const current = Math.max(0, window.scrollY);
                if (
                    headerRef.current?.contains(document.activeElement) ||
                    current <= 8
                )
                    setVisible(true);
                else if (current > 60 && current - previous > 4)
                    setVisible(false);
                else if (current - previous < -4) setVisible(true);
                previous = current;
                frame = 0;
            });
        }
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => {
            window.removeEventListener("scroll", onScroll);
            cancelAnimationFrame(frame);
        };
    }, [desktop, open]);

    function containFocus(event: KeyboardEvent<HTMLElement>) {
        if (!open || wide || event.key !== "Tab") return;
        const controls = Array.from(
            headerRef.current?.querySelectorAll<HTMLElement>(
                "a[href], button:not(:disabled)"
            ) ?? []
        ).filter((element) => element.getClientRects().length);
        const first = controls[0];
        const last = controls.at(-1);
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first?.focus();
        }
    }

    return (
        <>
            <header
                ref={headerRef}
                className="nl-header"
                data-scroll-state={
                    visible || desktop || open ? "visible" : "hidden"
                }
                onFocusCapture={() => setVisible(true)}
                onKeyDown={containFocus}
            >
                <div
                    className="nl-header__interaction"
                    role={open && !wide ? "dialog" : undefined}
                    aria-modal={open && !wide ? true : undefined}
                    aria-label={
                        open && !wide ? t("header.fullMenu") : undefined
                    }
                >
                    <div className="nl-header__bar">
                        <Link
                            href={href("/")}
                            className="nl-wordmark nl-section-title"
                            lang="en"
                        >
                            NosLog
                        </Link>
                        <div className="nl-header__controls">
                            {account ? (
                                <Link
                                    href={href(`/profile/${account.id}`)}
                                    className="nl-account"
                                    aria-label={t("header.profileLabel", {
                                        name:
                                            account.username ??
                                            t("common.unknownUser"),
                                    })}
                                >
                                    <Avatar src={account.avatar} />
                                </Link>
                            ) : (
                                <Link
                                    href={href("/login")}
                                    className="nl-login nl-control"
                                >
                                    {t("common.login")}
                                </Link>
                            )}
                            <button
                                ref={triggerRef}
                                className="nl-nav-trigger"
                                aria-label={t(
                                    open
                                        ? "header.closeMenu"
                                        : "header.openMenu"
                                )}
                                aria-expanded={open}
                                aria-controls="app-destinations"
                                onClick={() => setOpen(!open)}
                            >
                                {open ? (
                                    <X aria-hidden />
                                ) : (
                                    <Menu aria-hidden />
                                )}
                            </button>
                        </div>
                    </div>
                    {open ? (
                        <>
                            {!wide ? (
                                <div
                                    className="nl-nav-scrim"
                                    aria-hidden
                                    onPointerDown={() => {
                                        setOpen(false);
                                        triggerRef.current?.focus();
                                    }}
                                />
                            ) : null}
                            <nav
                                ref={panelRef}
                                id="app-destinations"
                                className="nl-destinations"
                                aria-label={t("header.fullMenu")}
                            >
                                {productDestinations.map(
                                    ({
                                        href: destination,
                                        labelKey,
                                        icon: Icon,
                                    }) => (
                                        <Link
                                            key={destination}
                                            href={href(destination)}
                                            className="nl-destination nl-control"
                                            aria-current={
                                                isDestinationActive(
                                                    pathname,
                                                    chartScope,
                                                    destination
                                                )
                                                    ? "page"
                                                    : undefined
                                            }
                                            onClick={() => setOpen(false)}
                                        >
                                            <Icon
                                                className="nl-icon"
                                                aria-hidden
                                            />
                                            <span>{t(labelKey)}</span>
                                        </Link>
                                    )
                                )}
                                <div className="nl-destinations__divider" />
                                <Link
                                    href={href("/settings")}
                                    className="nl-destination nl-control"
                                    aria-current={
                                        pathname === "/settings" ||
                                        pathname === "/profile/settings"
                                            ? "page"
                                            : undefined
                                    }
                                    onClick={() => setOpen(false)}
                                >
                                    <Settings className="nl-icon" aria-hidden />
                                    <span>{t("shell.settings")}</span>
                                </Link>
                                <button
                                    className="nl-destination nl-control"
                                    onClick={() => {
                                        setOpen(false);
                                        setFeedbackOpen(true);
                                    }}
                                >
                                    <MessageSquare
                                        className="nl-icon"
                                        aria-hidden
                                    />
                                    <span>{t("shell.feedback")}</span>
                                </button>
                                {account?.role === "admin" ? (
                                    <Link
                                        href="/admin"
                                        className="nl-destination nl-control"
                                        onClick={() => setOpen(false)}
                                    >
                                        <ShieldUser
                                            className="nl-icon"
                                            aria-hidden
                                        />
                                        <span>{t("header.admin")}</span>
                                    </Link>
                                ) : null}
                            </nav>
                        </>
                    ) : null}
                </div>
            </header>
            <FeedbackDialog
                isAuthenticated={Boolean(account)}
                open={feedbackOpen}
                onOpenChange={setFeedbackOpen}
                trigger={null}
                onCloseAutoFocus={(event) => {
                    event.preventDefault();
                    triggerRef.current?.focus();
                }}
            />
        </>
    );
}

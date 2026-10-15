"use client";

import { Menu, MessageSquare, Settings, ShieldUser, X } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import type { KeyboardEvent } from "react";
import { useEffect, useRef, useState } from "react";

import {
    useLocalizedHref,
    useTranslations,
} from "@/components/i18n/locale-provider";
import {
    isDestinationActive,
    productDestinations,
} from "@/components/layout/destinations";
import Avatar from "@/components/ui/avatar";
import IntentLink from "@/components/ui/intent-link";
import { useFeedbackUnread } from "@/features/feedback/components/feedback-unread";
import LazyFeedbackDialog, {
    preloadFeedbackDialog,
} from "@/features/feedback/components/lazy-feedback-dialog";
import { readTokenPixels } from "@/lib/design-tokens";
import useMediaQuery from "@/lib/hooks/use-media-query";
import { stripLocaleFromPath } from "@/lib/i18n/routing";

export interface ShellAccount {
    id: number;
    username: string | null;
    avatar: string | null;
    role: string;
    /** 읽지 않은 피드백 답변 수 — 메뉴 「피드백 · 오류 제보」 줄의 점(2026-09-18 F1) */
    feedbackUnread?: number;
}

export default function AppHeader({
    account,
}: {
    account: ShellAccount | null;
}) {
    const t = useTranslations();
    const href = useLocalizedHref();
    const fullPathname = usePathname();
    const searchParams = useSearchParams();
    const pathname = stripLocaleFromPath(fullPathname);
    const chartScope = searchParams.get("scope") === "chart";
    const wide = useMediaQuery("(min-width: 672px)");
    const desktop = useMediaQuery("(min-width: 1056px)");
    const [open, setOpen] = useState(false);
    const [feedbackOpen, setFeedbackOpen] = useState(false);
    const { count: feedbackUnread } = useFeedbackUnread();
    const [visible, setVisible] = useState(true);
    // 이동하면 메뉴 · 창을 닫고 숨김 상태를 처음으로 — 헤더를 통째로 다시 마운트하지 않고 상태만 되돌린다
    const route = `${fullPathname}?${searchParams.toString()}`;
    const [seenRoute, setSeenRoute] = useState(route);
    if (seenRoute !== route) {
        setSeenRoute(route);
        setOpen(false);
        setFeedbackOpen(false);
        setVisible(true);
    }
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
        // 메뉴 안 「피드백」 을 누르기 전에 창 코드를 받아 둔다
        preloadFeedbackDialog();

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
        // 헤더 높이만큼 내려간 뒤부터 숨긴다
        const hideAfter = headerRef.current
            ? readTokenPixels(headerRef.current, "--nl-header-height")
            : 0;
        function onScroll() {
            if (frame) return;
            frame = requestAnimationFrame(() => {
                const current = Math.max(0, window.scrollY);
                if (
                    headerRef.current?.contains(document.activeElement) ||
                    current <= 8
                )
                    setVisible(true);
                else if (current > hideAfter && current - previous > 4)
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
    }, [desktop, open, route]);

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
                        <IntentLink
                            href={href("/")}
                            className="nl-wordmark nl-section-title"
                            lang="en"
                        >
                            NosLog
                        </IntentLink>
                        {/* 1056 이상에서만 보인다(CSS) — 그 아래 폭은 ≡ 안(2026-09-30 A1 · P1) */}
                        <nav
                            className="nl-header__nav"
                            aria-label={t("header.primaryNav")}
                        >
                            {productDestinations.map(
                                ({ href: destination, labelKey }) => (
                                    <IntentLink
                                        key={destination}
                                        href={href(destination)}
                                        className="nl-header__nav-item nl-control"
                                        aria-current={
                                            isDestinationActive(
                                                pathname,
                                                chartScope,
                                                destination
                                            )
                                                ? "page"
                                                : undefined
                                        }
                                    >
                                        {t(labelKey)}
                                    </IntentLink>
                                )
                            )}
                        </nav>
                        <div className="nl-header__controls">
                            {account ? (
                                <IntentLink
                                    href={href(`/profile/${account.id}`)}
                                    className="nl-account"
                                    aria-label={t("header.profileLabel", {
                                        name:
                                            account.username ??
                                            t("common.unknownUser"),
                                    })}
                                >
                                    <Avatar src={account.avatar} />
                                </IntentLink>
                            ) : (
                                <IntentLink
                                    href={href("/login")}
                                    className="nl-login nl-control"
                                >
                                    {t("common.login")}
                                </IntentLink>
                            )}
                            <button
                                ref={triggerRef}
                                className="nl-nav-trigger"
                                aria-label={t(
                                    desktop
                                        ? open
                                            ? "header.closeMore"
                                            : "header.openMore"
                                        : open
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
                                aria-label={t(
                                    desktop
                                        ? "header.moreMenu"
                                        : "header.fullMenu"
                                )}
                            >
                                {/* 1056 이상은 이동 메뉴가 헤더에 나와 있어 나머지(설정 · 피드백 · 관리자)만 담는다(S1) */}
                                {desktop
                                    ? null
                                    : productDestinations.map(
                                          ({
                                              href: destination,
                                              labelKey,
                                              icon: Icon,
                                          }) => (
                                              <IntentLink
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
                                              </IntentLink>
                                          )
                                      )}
                                {desktop ? null : (
                                    <div className="nl-destinations__divider" />
                                )}
                                <IntentLink
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
                                </IntentLink>
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
                                    {feedbackUnread ? (
                                        <span
                                            className="nl-unread-dot"
                                            role="img"
                                            aria-label={t("feedback.newReply")}
                                        />
                                    ) : null}
                                </button>
                                {account?.role === "admin" ? (
                                    <IntentLink
                                        href="/admin"
                                        className="nl-destination nl-control"
                                        onClick={() => setOpen(false)}
                                    >
                                        <ShieldUser
                                            className="nl-icon"
                                            aria-hidden
                                        />
                                        <span>{t("header.admin")}</span>
                                    </IntentLink>
                                ) : null}
                            </nav>
                        </>
                    ) : null}
                </div>
            </header>
            {/* 이동하면 쓰던 내용도 처음으로(전에 헤더를 다시 마운트하던 동작 그대로) */}
            <LazyFeedbackDialog
                key={route}
                isAuthenticated={Boolean(account)}
                open={feedbackOpen}
                onOpenChange={setFeedbackOpen}
                onCloseAutoFocus={(event) => {
                    event.preventDefault();
                    triggerRef.current?.focus();
                }}
            />
        </>
    );
}

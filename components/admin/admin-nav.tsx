"use client";

import {
    AlignLeft,
    Award,
    Calendar,
    ChevronRight,
    Download,
    Grid3x3,
    LayoutGrid,
    MapPin,
    Megaphone,
    Menu,
    MessageSquare,
    Music,
    Pencil,
    RefreshCw,
    SquareCheck,
    User,
    X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import { type ReactNode, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

import {
    useLocalizedHref,
    useTranslations,
} from "@/components/i18n/locale-provider";
import type { ShellAccount } from "@/components/layout/app-header";
import Avatar from "@/components/ui/avatar";
import IconButton from "@/components/ui/icon-button";
import IntentLink from "@/components/ui/intent-link";

const adminSections = [
    { href: "/admin", label: "대시보드", icon: LayoutGrid },
    { href: "/admin/announcements", label: "공지", icon: Megaphone },
    { href: "/admin/events", label: "이벤트", icon: Calendar },
    { href: "/admin/feedback", label: "피드백", icon: MessageSquare },
    { href: "/admin/users", label: "유저", icon: User },
    { href: "/admin/syncs", label: "동기화", icon: RefreshCw },
    { href: "/admin/music", label: "악곡", icon: Music },
    { href: "/admin/catalog", label: "업데이트", icon: Download },
    { href: "/admin/contributions", label: "기여", icon: Pencil },
    { href: "/admin/tiers", label: "서열표", icon: AlignLeft },
    { href: "/admin/exams", label: "검정", icon: Award },
    { href: "/admin/submissions", label: "인증", icon: SquareCheck },
    { href: "/admin/bingos", label: "빙고", icon: Grid3x3 },
    { href: "/admin/arcades", label: "오락실", icon: MapPin },
] as const;

// 대시보드(/admin)는 모든 관리 주소의 앞부분이라 정확히 같을 때만 현재 구역이다
export function currentAdminSection(pathname: string) {
    return adminSections.find((section) =>
        section.href === "/admin"
            ? pathname === "/admin" || pathname === "/admin/"
            : pathname.startsWith(section.href)
    );
}

// 메뉴 항목 — 1056 이상 사이드바와 좁은 폭 서랍이 같은 목록을 쓴다(판 1 · 판 9)
function AdminNavList({ onNavigate }: { onNavigate?: () => void }) {
    const current = currentAdminSection(usePathname());
    return (
        <nav aria-label="관리자 메뉴" className="nl-admin-sidebar__list">
            {adminSections.map((section) => {
                const Icon = section.icon;
                return (
                    <Link
                        key={section.href}
                        href={section.href}
                        onClick={onNavigate}
                        aria-current={
                            section.href === current?.href ? "page" : undefined
                        }
                        className="nl-admin-sidebar__item nl-control nl-focus-inset"
                    >
                        <Icon className="nl-icon-small" aria-hidden />
                        {section.label}
                    </Link>
                );
            })}
        </nav>
    );
}

// 사이드바 · 메뉴 서랍 맨 아래 계정 — 사이트 헤더의 계정 링크(아바타 → 프로필)를 옮긴 것
function AdminAccount({
    account,
    onNavigate,
}: {
    account: ShellAccount;
    onNavigate?: () => void;
}) {
    const t = useTranslations();
    const name = account.username ?? t("common.unknownUser");
    return (
        <div className="nl-admin-sidebar__account">
            <Link
                href={`/profile/${account.id}`}
                onClick={onNavigate}
                aria-label={t("header.profileLabel", { name })}
                className="nl-admin-sidebar__item nl-control nl-focus-inset"
            >
                <Avatar src={account.avatar} size="small" />
                <span className="nl-truncate">{name}</span>
            </Link>
        </div>
    );
}

// 1056 이상 왼쪽 사이드바(판 1) — 묶음 제목 없이 14개를 한 줄씩, 현재 항목은 면
export function AdminSidebar({ account }: { account: ShellAccount }) {
    const href = useLocalizedHref();
    return (
        <aside className="nl-admin-sidebar">
            {/* 사이트 헤더 로고처럼 누르면 메인 홈 */}
            <IntentLink
                href={href("/")}
                className="nl-admin-sidebar__brand nl-control nl-focus-inset"
            >
                <span className="nl-admin-sidebar__mark" aria-hidden>
                    N
                </span>
                NosLog 관리자
            </IntentLink>
            <AdminNavList />
            <AdminAccount account={account} />
        </aside>
    );
}

// 1056 미만 메뉴(판 9 Medusa) — 위 막대 왼쪽 버튼이 화면 가장자리 8 에 붙은 왼쪽 서랍을 연다. 나타날 때 페이드만
function AdminMenuDrawer({ account }: { account: ShellAccount }) {
    const [open, setOpen] = useState(false);
    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
                <IconButton
                    className="nl-admin-topbar__menu"
                    size="compact"
                    label="관리자 메뉴 열기"
                >
                    <Menu className="nl-icon" aria-hidden />
                </IconButton>
            </Dialog.Trigger>
            <Dialog.Portal>
                <div className="noslog-ui">
                    <Dialog.Overlay className="nl-dialog-overlay" />
                    <Dialog.Content
                        className="nl-admin-menu-drawer"
                        aria-describedby={undefined}
                    >
                        <Dialog.Title className="sr-only">
                            관리자 메뉴
                        </Dialog.Title>
                        <div className="nl-admin-menu-drawer__head">
                            <Dialog.Close asChild>
                                <IconButton label="관리자 메뉴 닫기">
                                    <X className="nl-icon" aria-hidden />
                                </IconButton>
                            </Dialog.Close>
                        </div>
                        <AdminNavList onNavigate={() => setOpen(false)} />
                        <AdminAccount
                            account={account}
                            onNavigate={() => setOpen(false)}
                        />
                    </Dialog.Content>
                </div>
            </Dialog.Portal>
        </Dialog.Root>
    );
}

const TOPBAR_SLOT_ID = "nl-admin-topbar-slot";

function subscribeNothing() {
    return () => {};
}

// 1056 이상 위 막대 — 현재 구역 이름. 구역 안 하위 화면이면 구역을 링크로 두고 ▸ 뒤에 화면이 넣은 이름(AdminCrumb)을 보인다
export function AdminTopbar({ account }: { account: ShellAccount }) {
    const pathname = usePathname();
    const current = currentAdminSection(pathname);
    const nested =
        current !== undefined &&
        current.href !== "/admin" &&
        pathname.replace(/\/$/, "") !== current.href;
    return (
        <div className="nl-admin-topbar nl-control">
            <AdminMenuDrawer account={account} />
            <div className="nl-admin-topbar__crumb">
                {nested ? (
                    <>
                        <Link href={current.href}>{current.label}</Link>
                        <ChevronRight className="nl-icon-small" aria-hidden />
                        <span
                            id={TOPBAR_SLOT_ID}
                            className="nl-admin-topbar__current nl-truncate"
                        />
                    </>
                ) : (
                    <span className="nl-admin-topbar__current">
                        {current?.label ?? "관리자"}
                    </span>
                )}
            </div>
        </div>
    );
}

// 하위 화면이 위 막대 ▸ 뒤에 자기 이름을 넣는다
export function AdminCrumb({ children }: { children: ReactNode }) {
    const slot = useSyncExternalStore(
        subscribeNothing,
        () => document.getElementById(TOPBAR_SLOT_ID),
        () => null
    );
    return slot ? createPortal(children, slot) : null;
}

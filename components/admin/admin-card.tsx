import Link from "next/link";
import type { KeyboardEvent, MouseEvent, ReactNode } from "react";

import StatusDot, { type StatusDotTone } from "@/components/ui/status-dot";
import { cn } from "@/lib/cn";

// 관리자 목록 · 상세의 카드(판 2 · 3 Medusa) — 머리 줄 · 도구 줄 · 본문(표 · 읽기 줄) · 페이지 줄을 한 카드에 쌓는다
export function AdminCard({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <section className={cn("nl-admin-card", className)}>{children}</section>
    );
}

export function AdminCardHead({
    title,
    actions,
    level = "h1",
}: {
    title: ReactNode;
    actions?: ReactNode;
    level?: "h1" | "h2";
}) {
    const Heading = level;
    return (
        <div className="nl-admin-card__head">
            <Heading className="nl-admin-card__title">{title}</Heading>
            {actions ? (
                <div className="nl-admin-card__actions">{actions}</div>
            ) : null}
        </div>
    );
}

export function AdminCardTools({ children }: { children: ReactNode }) {
    return <div className="nl-admin-card__tools">{children}</div>;
}

export function AdminCardEmpty({ children }: { children: ReactNode }) {
    return <p className="nl-admin-card__empty">{children}</p>;
}

// 표는 칸이 많으면 카드 안에서만 가로로 밀린다
export function AdminTable({ children }: { children: ReactNode }) {
    return (
        <div className="nl-admin-table-scroll">
            <table className="nl-admin-table">{children}</table>
        </div>
    );
}

const ROW_INTERACTIVE =
    "a, button, input, label, select, textarea, [role='menuitem']";

// 줄 어디를 눌러도 「자세히 보기」 를 연다. 줄 안 링크 · 버튼 · 체크박스와 글자 선택은 그대로 두고,
// 포털로 그린 서랍 · 메뉴 안의 클릭이 줄까지 올라와 다시 여는 일도 막는다
export function adminRowOpenProps(open: () => void) {
    return {
        tabIndex: 0,
        "aria-haspopup": "dialog" as const,
        className: "nl-admin-table__row-open nl-focus-inset",
        onClick(event: MouseEvent<HTMLTableRowElement>) {
            const target = event.target as Element;
            if (!event.currentTarget.contains(target)) return;
            if (target.closest(ROW_INTERACTIVE)) return;
            if (window.getSelection()?.toString()) return;
            open();
        },
        onKeyDown(event: KeyboardEvent<HTMLTableRowElement>) {
            if (event.target !== event.currentTarget) return;
            if (event.key !== "Enter" && event.key !== " ") return;
            event.preventDefault();
            open();
        },
    };
}

export function AdminStatus({
    tone,
    children,
}: {
    tone: StatusDotTone;
    children: ReactNode;
}) {
    return (
        <span className="nl-admin-status">
            <StatusDot tone={tone} />
            {children}
        </span>
    );
}

// 페이지 줄(판 2): 왼쪽 「1 — 50 / N단위」, 오른쪽 「1 / N쪽 · 이전 · 다음」
export function AdminPager({
    page,
    pageSize,
    total,
    unit,
    hrefFor,
}: {
    page: number;
    pageSize: number;
    total: number;
    unit: string;
    hrefFor: (page: number) => string;
}) {
    const pages = Math.max(1, Math.ceil(total / pageSize));
    const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
    const to = Math.min(total, page * pageSize);
    return (
        <nav className="nl-admin-pager" aria-label="쪽 이동">
            <span className="nl-admin-pager__range">
                {from.toLocaleString("ko-KR")} — {to.toLocaleString("ko-KR")} /{" "}
                {total.toLocaleString("ko-KR")}
                {unit}
            </span>
            <span>
                {page} / {pages}쪽
            </span>
            <PagerLink href={page > 1 ? hrefFor(page - 1) : null}>
                이전
            </PagerLink>
            <PagerLink href={page < pages ? hrefFor(page + 1) : null}>
                다음
            </PagerLink>
        </nav>
    );
}

function PagerLink({
    href,
    children,
}: {
    href: string | null;
    children: ReactNode;
}) {
    if (!href) {
        return (
            <span className="nl-admin-pager__link" aria-disabled="true">
                {children}
            </span>
        );
    }
    return (
        <Link className="nl-admin-pager__link nl-focus-inset" href={href}>
            {children}
        </Link>
    );
}

// 상세 화면(판 3): 왼쪽 본문 + 오른쪽 열. 좁은 폭에서는 한 열로 쌓는다
export function AdminDetail({
    main,
    side,
}: {
    main: ReactNode;
    side?: ReactNode;
}) {
    return (
        <div className="nl-admin-detail">
            <div className="nl-admin-detail__column">{main}</div>
            {side ? (
                <div className="nl-admin-detail__column">{side}</div>
            ) : null}
        </div>
    );
}

// 읽기 줄 「이름 | 값」
export function AdminReadRow({
    label,
    children,
}: {
    label: ReactNode;
    children: ReactNode;
}) {
    return (
        <div className="nl-admin-read-row">
            <dt>{label}</dt>
            <dd>{children}</dd>
        </div>
    );
}

export function AdminReadRows({ children }: { children: ReactNode }) {
    return <dl className="nl-admin-read-rows">{children}</dl>;
}

// 대기열 상태 탭(판 6 GitLab) — 목록 카드 위 한 줄, 탭마다 건수
export function AdminCountTabs({
    label,
    options,
}: {
    label: string;
    options: readonly {
        key: string;
        label: string;
        count: number;
        href: string;
        selected: boolean;
    }[];
}) {
    return (
        <nav
            aria-label={label}
            className="nl-tabs nl-tabs--primary nl-admin-tabs"
        >
            {options.map((option) => (
                <Link
                    key={option.key}
                    href={option.href}
                    scroll={false}
                    aria-current={option.selected ? "page" : undefined}
                    className="nl-tabs__item nl-control"
                >
                    {option.label}
                    <span className="nl-admin-tabs__count">
                        {option.count.toLocaleString("ko-KR")}
                    </span>
                </Link>
            ))}
        </nav>
    );
}

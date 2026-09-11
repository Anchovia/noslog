"use client";

import * as Popover from "@radix-ui/react-popover";
import { ArrowUpDown, Check, ChevronDown } from "lucide-react";
import { Children, useState } from "react";
import type { KeyboardEvent, ReactNode } from "react";

import { useTranslations } from "@/components/i18n/localeProvider";
import ActionButton from "@/components/ui/actionButton";

export interface SortMenuOption<Value extends string> {
    value: Value;
    label: string;
    description?: string;
    disabled?: boolean;
    /** 고르면 종속 섹션이 붙는 항목 — 고른 뒤에도 메뉴를 닫지 않는다 */
    hasDependent?: boolean;
}

/**
 * 정렬 메뉴 — 배타 선택이라 팝업 버튼(HIG) / 단일 선택 드롭다운(Carbon) 형태.
 * 전 폭에서 같은 팝오버를 쓰고 즉시 적용한다. 종속 옵션(정렬 난이도·방향)은 children 으로 아래에 붙는다.
 */
export default function SortMenu<Value extends string>({
    label,
    value,
    options,
    onValueChange,
    onOpenChange,
    children,
    className,
}: {
    label: string;
    value: Value;
    options: readonly SortMenuOption<Value>[];
    onValueChange: (value: Value) => void;
    onOpenChange?: (open: boolean) => void;
    children?: ReactNode;
    className?: string;
}) {
    const t = useTranslations();
    const [open, setOpen] = useState(false);
    const current = options.find((option) => option.value === value);
    // 종속 섹션이 실제로 있을 때만 구분선·영역을 그리고, 없으면 고르는 즉시 닫는다
    const dependent = Children.toArray(children).filter(Boolean);
    function changeOpen(next: boolean) {
        setOpen(next);
        onOpenChange?.(next);
    }
    // 위·아래 화살표로 항목 사이를 옮긴다 (라디오 그룹 관례) — 선택은 Enter/Space
    function moveFocus(event: KeyboardEvent<HTMLDivElement>) {
        const direction =
            event.key === "ArrowDown" ? 1 : event.key === "ArrowUp" ? -1 : 0;
        if (!direction) return;
        const items = Array.from(
            event.currentTarget.querySelectorAll<HTMLButtonElement>(
                "button:not(:disabled)"
            )
        );
        const index = items.indexOf(
            document.activeElement as HTMLButtonElement
        );
        if (index < 0) return;
        event.preventDefault();
        items[(index + direction + items.length) % items.length]?.focus();
    }
    return (
        <Popover.Root open={open} onOpenChange={changeOpen}>
            <Popover.Trigger asChild>
                <ActionButton
                    variant="secondary"
                    className={["nl-filter-trigger", className]
                        .filter(Boolean)
                        .join(" ")}
                    aria-label={`${label}: ${current?.label ?? ""}`}
                >
                    <ArrowUpDown className="nl-icon-small" aria-hidden />
                    <span className="nl-filter-trigger__label">
                        {current?.label}
                    </span>
                    <ChevronDown className="nl-icon-small" aria-hidden />
                </ActionButton>
            </Popover.Trigger>
            <Popover.Portal>
                <div className="noslog-ui">
                    <Popover.Content
                        className="nl-sort-menu"
                        align="start"
                        sideOffset={8}
                        collisionPadding={16}
                        aria-label={label}
                    >
                        <div
                            role="group"
                            aria-label={label}
                            className="nl-sort-menu__group"
                            onKeyDown={moveFocus}
                        >
                            <p className="nl-sort-menu__heading nl-metadata">
                                {label}
                            </p>
                            {options.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    role="menuitemradio"
                                    aria-checked={option.value === value}
                                    disabled={option.disabled}
                                    className="nl-sort-menu__item nl-body-secondary"
                                    onClick={() => {
                                        onValueChange(option.value);
                                        if (
                                            !dependent.length &&
                                            !option.hasDependent
                                        )
                                            changeOpen(false);
                                    }}
                                >
                                    <span>
                                        {option.label}
                                        {option.description ? (
                                            <span className="nl-sort-menu__description nl-metadata nl-muted">
                                                {option.description}
                                            </span>
                                        ) : null}
                                    </span>
                                    {option.value === value ? (
                                        <Check
                                            className="nl-icon-small"
                                            aria-hidden
                                        />
                                    ) : null}
                                </button>
                            ))}
                        </div>
                        {dependent.length ? (
                            <div className="nl-sort-menu__dependent">
                                {dependent}
                            </div>
                        ) : null}
                        <span className="sr-only">{t("common.close")}</span>
                    </Popover.Content>
                </div>
            </Popover.Portal>
        </Popover.Root>
    );
}

/** SortMenu 안의 종속 그룹 소제목 + 내용 */
export function SortMenuSection({
    label,
    children,
}: {
    label: string;
    children: ReactNode;
}) {
    return (
        <div className="nl-sort-menu__section">
            <p className="nl-sort-menu__heading nl-metadata">{label}</p>
            {children}
        </div>
    );
}

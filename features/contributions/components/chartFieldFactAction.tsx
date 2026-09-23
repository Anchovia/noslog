"use client";

import Link from "next/link";
import { useRef, useState } from "react";

import { useTranslations } from "@/components/i18n/localeProvider";
import ActionMenu from "@/components/ui/actionMenu";
import type { ChartFieldProposalField } from "@/features/contributions/schemas/chartFieldProposalSchema";
import ChartFieldProposalDialog from "./chartFieldProposalDialog";

/**
 * 채보 정보 한 줄 끝의 기여 자리(2026-09-23 S1) — 빈 칸은 「추가」, 값이 있으면 ⋯ → 「수정 제안」.
 * 내 제안이 대기 중이면 「검토 중」 태그. 로그아웃이면 「추가」 가 로그인으로 보내고 ⋯ 는 두지 않는다.
 */
export default function ChartFieldFactAction({
    chartId,
    field,
    fieldLabel,
    currentValue,
    pendingValue,
    signedIn,
    loginHref,
    queryKey,
}: {
    chartId: number;
    field: ChartFieldProposalField;
    fieldLabel: string;
    currentValue: string | null;
    pendingValue?: string;
    signedIn: boolean;
    loginHref: string;
    queryKey: readonly unknown[];
}) {
    const t = useTranslations();
    const [open, setOpen] = useState(false);
    // 열 때마다 새 입력 — 지난번에 쓰다 만 값을 남기지 않는다
    const [session, setSession] = useState(0);
    const show = () => {
        setSession((value) => value + 1);
        setOpen(true);
    };
    const trigger = useRef<HTMLButtonElement>(null);
    const empty = currentValue === null;

    return (
        <>
            {pendingValue !== undefined ? (
                <span
                    className="nl-tag nl-tag--status nl-facts__tag"
                    data-tone="warning"
                >
                    {t("contribution.pending")}
                </span>
            ) : null}
            {empty && !signedIn ? (
                <Link
                    href={loginHref}
                    className="nl-link nl-text-link--underlined"
                    aria-label={t("contribution.addLabel", {
                        field: fieldLabel,
                    })}
                >
                    {t("contribution.add")}
                </Link>
            ) : empty ? (
                <button
                    ref={trigger}
                    type="button"
                    className="nl-link nl-text-link--underlined"
                    aria-label={t("contribution.addLabel", {
                        field: fieldLabel,
                    })}
                    onClick={show}
                >
                    {t("contribution.add")}
                </button>
            ) : signedIn ? (
                <span className="nl-facts__action">
                    <ActionMenu
                        label={t("contribution.more", { field: fieldLabel })}
                        triggerRef={trigger}
                        items={[
                            {
                                label: t("contribution.suggestEdit"),
                                onSelect: show,
                            },
                        ]}
                    />
                </span>
            ) : null}
            {session ? (
                <ChartFieldProposalDialog
                    key={session}
                    open={open}
                    onOpenChange={setOpen}
                    chartId={chartId}
                    field={field}
                    fieldLabel={fieldLabel}
                    currentValue={currentValue}
                    pendingValue={pendingValue}
                    queryKey={queryKey}
                    onCloseAutoFocus={(event) => {
                        event.preventDefault();
                        trigger.current?.focus();
                    }}
                />
            ) : null}
        </>
    );
}

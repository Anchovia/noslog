"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import { toast } from "sonner";

import { getMyChartDraftStatus } from "@/app/(nevigation)/music/[index]/[difficulty]/draftActions";
import { useTranslations } from "@/components/i18n/localeProvider";
import Button from "@/components/ui/Button";
import ModalDialog from "@/components/ui/modalDialog";

/** 에디터는 넓은 화면 도구 — 이 폭 아래에서는 들어가는 대신 안내(2026-09-24 F1) */
const EDITOR_MIN_WIDTH = 1056;

export function myChartDraftOptions(chartId: number, signedIn: boolean) {
    return {
        queryKey: ["chart-draft", "mine", chartId],
        queryFn: () => getMyChartDraftStatus(chartId),
        enabled: signedIn,
        staleTime: 60_000,
        retry: false,
    } as const;
}

/**
 * 채보 초안으로 들어가는 링크(2026-09-24 A1) — 곡 상세 「채보 만들기 ›」 · 뷰어 머리 「고치기 ›」.
 * 내 초안이 있으면 글자가 상태를 말한다(「내 초안 · 수정 요청 ›」). 로그아웃이면 로그인으로,
 * 좁은 화면이면 에디터 대신 「넓은 화면에서」 안내 창(주소 복사).
 */
export default function ChartDraftEntry({
    chartId,
    draftHref,
    loginHref,
    signedIn,
    label,
    className,
    icon,
    iconOnly = false,
    chevron,
}: {
    chartId: number;
    draftHref: string;
    loginHref: string;
    signedIn: boolean;
    /** 초안이 없을 때 글자 — 「채보 만들기」 · 「고치기」 */
    label: string;
    className: string;
    /** 글자 앞 아이콘 — 채보 뷰어 동작 버튼(2026-09-26) */
    icon?: ReactNode;
    /** 아이콘만 보이고 글자는 스크린리더용(채보 뷰어 폰 동작 줄, 2026-09-26 Y1) */
    iconOnly?: boolean;
    chevron?: ReactNode;
}) {
    const t = useTranslations();
    const [narrow, setNarrow] = useState(false);
    // 공개까지 끝난 초안은 다시 열면 지금 공개본으로 새로 시작하므로 상태 대신 원래 글(「고치기」)
    const found = useQuery(myChartDraftOptions(chartId, signedIn)).data;
    const draft = found?.status === "published" ? null : found;
    const text = draft
        ? t("contribution.entry.myDraft", {
              status: t(`contribution.draftStatus.${draft.status}`),
          })
        : label;
    if (!signedIn)
        return (
            <Link
                href={loginHref}
                className={className}
                title={iconOnly ? label : undefined}
            >
                {icon}
                {iconOnly ? <span className="sr-only">{label}</span> : label}
                {chevron}
            </Link>
        );
    return (
        <>
            <Link
                href={draftHref}
                className={className}
                title={iconOnly ? text : undefined}
                data-status={draft?.status}
                onClick={(event) => {
                    if (window.innerWidth >= EDITOR_MIN_WIDTH) return;
                    event.preventDefault();
                    setNarrow(true);
                }}
            >
                {icon}
                {iconOnly ? <span className="sr-only">{text}</span> : text}
                {chevron}
            </Link>
            <ModalDialog
                open={narrow}
                onOpenChange={setNarrow}
                title={t("contribution.entry.wideTitle")}
                description={t("contribution.entry.wideBody")}
                footer={
                    <>
                        <Button
                            variant="secondary"
                            onClick={() => setNarrow(false)}
                        >
                            {t("common.close")}
                        </Button>
                        <Button
                            onClick={() => {
                                void navigator.clipboard
                                    .writeText(
                                        new URL(draftHref, window.location.href)
                                            .href
                                    )
                                    .then(
                                        () => {
                                            toast.success(
                                                t("contribution.entry.copied")
                                            );
                                            setNarrow(false);
                                        },
                                        () =>
                                            toast.error(
                                                t("tiers.linkCopyFailed")
                                            )
                                    );
                            }}
                        >
                            {t("contribution.entry.copyLink")}
                        </Button>
                    </>
                }
            />
        </>
    );
}

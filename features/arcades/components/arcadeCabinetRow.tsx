"use client";

import { useState, useTransition } from "react";
import { Check, CircleCheck, TriangleAlert } from "lucide-react";
import { useLocale, useTranslations } from "@/components/i18n/localeProvider";
import ActionButton from "@/components/ui/actionButton";
import Button from "@/components/ui/Button";
import { confirmCabinetRunning } from "@/app/(nevigation)/gamecenter/actions";
import type {
    ArcadeCabinet,
    PublicArcade,
} from "@/features/arcades/schemas/publicArcadeSchema";
import { daysAgo } from "@/features/arcades/arcadeDiscovery";
import ArcadeReportDialog from "./arcadeReportDialog";

export function cabinetLabel(
    cabinet: ArcadeCabinet,
    t: ReturnType<typeof useTranslations>
) {
    return (
        cabinet.label ??
        t("arcades.cabinetNumber", { count: cabinet.position + 1 })
    );
}

export type CabinetState = "unknown" | "unavailable" | "caution" | "available";

export function cabinetState(cabinet: ArcadeCabinet): CabinetState {
    if (cabinet.stale || cabinet.availability === "unknown") return "unknown";
    if (cabinet.availability === "unavailable") return "unavailable";
    return cabinet.condition === "caution" ? "caution" : "available";
}

/** 「가동 · 양호」·「가동 · 주의」·「이용 불가」·「미확인」 */
export function cabinetStateLabel(
    cabinet: ArcadeCabinet,
    t: ReturnType<typeof useTranslations>
) {
    const state = cabinetState(cabinet);
    if (state === "unknown") return t("arcades.unknown");
    if (state === "unavailable") return t("arcades.status.unavailable");
    return cabinet.condition !== "unknown"
        ? `${t("arcades.cabinetAvailable")} · ${t(`arcades.status.${cabinet.condition}`)}`
        : t("arcades.cabinetAvailable");
}

/**
 * 기체 한 대 = 한 줄. 실제 오락실 표기(1번기·2번기)를 따르고, 위치 메모·상태·신선도를 같이 둔다.
 * 「가동 확인」 은 로그인 이용자의 한 번 누르기, 「고장 신고」 는 이 기체를 대상으로 신고 레이어를 연다.
 */
export default function ArcadeCabinetRow({
    arcade,
    cabinet,
    now,
    isAuthenticated,
    checkedByMe,
    onChecked,
}: {
    arcade: PublicArcade;
    cabinet: ArcadeCabinet;
    now: Date;
    isAuthenticated: boolean;
    checkedByMe: boolean;
    onChecked: (cabinetId: number, checkedAt: string) => void;
}) {
    const t = useTranslations();
    const locale = useLocale();
    const [busy, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    // 로그아웃 상태에서 잠긴 「가동 확인」 을 탭했을 때 — 터치에는 hover(title)가 없어 행 안에 같은 안내를 띄운다
    const [loginHint, setLoginHint] = useState(false);
    const label = cabinetLabel(cabinet, t);
    const state = cabinetState(cabinet);
    const tone =
        state === "caution" || state === "unavailable" ? state : undefined;
    const checkedDays = daysAgo(cabinet.lastCheckedAt, now);
    const verifiedDays = daysAgo(cabinet.verifiedAt, now);
    const reportedDays = daysAgo(cabinet.latestReportAt, now);
    const stateLabel = cabinetStateLabel(cabinet, t);
    function confirm() {
        setError(null);
        startTransition(async () => {
            const result = await confirmCabinetRunning(
                cabinet.id,
                locale
            ).catch(() => ({
                success: false as const,
                message: t("arcades.confirmFailed"),
            }));
            if (result.success) onChecked(cabinet.id, result.checkedAt);
            else setError(result.message);
        });
    }
    return (
        <li className="nl-arcade-cabinet" data-tone={tone}>
            <div className="nl-arcade-cabinet__row">
                <span className="nl-arcade-cabinet__name">
                    <span className="nl-control">{label}</span>
                    {cabinet.note ? (
                        <span className="nl-body-secondary nl-muted">
                            {cabinet.note}
                        </span>
                    ) : null}
                </span>
                <span
                    className="nl-control nl-arcade-cabinet__state"
                    data-state={state}
                >
                    {stateLabel}
                </span>
            </div>
            <div className="nl-arcade-cabinet__meta nl-metadata nl-muted">
                <span>
                    {checkedDays !== null
                        ? checkedDays === 0
                            ? t("arcades.checkedToday")
                            : t("arcades.checkedAgo", { count: checkedDays })
                        : verifiedDays !== null && !cabinet.stale
                          ? verifiedDays === 0
                              ? t("arcades.checkedToday")
                              : t("arcades.checkedAgo", { count: verifiedDays })
                          : t("arcades.neverChecked")}
                </span>
                {cabinet.checkCount ? (
                    <span>
                        ·{" "}
                        {t("arcades.checkedBy", { count: cabinet.checkCount })}
                    </span>
                ) : null}
                {cabinet.openReports ? (
                    <span>
                        ·{" "}
                        {t("arcades.openReports", {
                            count: cabinet.openReports,
                        })}
                        {reportedDays !== null
                            ? ` (${
                                  reportedDays === 0
                                      ? t("arcades.reportedToday")
                                      : t("arcades.reportedAgo", {
                                            count: reportedDays,
                                        })
                              })`
                            : ""}
                    </span>
                ) : null}
            </div>
            <div className="nl-arcade-cabinet__actions">
                {isAuthenticated ? (
                    <ActionButton
                        variant="secondary"
                        size="sm"
                        busy={busy}
                        busyLabel={t("arcades.confirmRunning")}
                        disabled={checkedByMe}
                        aria-label={t("arcades.confirmRunningAria", { label })}
                        aria-pressed={checkedByMe}
                        onClick={confirm}
                    >
                        {checkedByMe ? (
                            <>
                                <Check className="nl-icon-small" aria-hidden />
                                {t("arcades.confirmedRunning")}
                            </>
                        ) : (
                            <>
                                <CircleCheck
                                    className="nl-icon-small"
                                    aria-hidden
                                />
                                {t("arcades.confirmRunning")}
                            </>
                        )}
                    </ActionButton>
                ) : (
                    // 로그아웃 — 비활성처럼 어둡게(data-locked) · hover 에 이유(title). 진짜 disabled 는 hover 를 막아 title 이 안 뜬다
                    <Button
                        appearance="foundation"
                        variant="secondary"
                        size="sm"
                        data-locked=""
                        aria-disabled="true"
                        title={t("arcades.loginToUse")}
                        onClick={() => setLoginHint(true)}
                    >
                        <CircleCheck className="nl-icon-small" aria-hidden />
                        {t("arcades.confirmRunning")}
                    </Button>
                )}
                <ArcadeReportDialog
                    arcade={arcade}
                    isAuthenticated={isAuthenticated}
                    initialCabinetId={cabinet.id}
                    initialReportType="unavailable"
                    triggerLabel={t("arcades.reportBroken")}
                    triggerVariant="danger"
                    triggerIcon={
                        <TriangleAlert className="nl-icon-small" aria-hidden />
                    }
                    triggerAriaLabel={t("arcades.reportBrokenAria", { label })}
                />
            </div>
            {error ? (
                <p className="nl-metadata nl-error-text" role="alert">
                    {error}
                </p>
            ) : null}
            {loginHint && !isAuthenticated ? (
                <p className="nl-metadata nl-muted" role="status">
                    {t("arcades.loginToUse")}
                </p>
            ) : null}
        </li>
    );
}

"use client";

import { useState, useTransition } from "react";
import { useLocale, useTranslations } from "@/components/i18n/localeProvider";
import ActionButton from "@/components/ui/actionButton";
import Button from "@/components/ui/Button";
import TermHelp from "@/components/ui/termHelp";
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

/** 색 점의 단계 — 가동 중이면 상태(양호 · 보통 · 주의)를 따르고, 보통은 노랑 · 주의는 이용 불가와 같은 빨강(2026-09-15) */
export type CabinetState =
    "unknown" | "unavailable" | "caution" | "normal" | "available";

export function cabinetState(cabinet: ArcadeCabinet): CabinetState {
    if (cabinet.stale || cabinet.availability === "unknown") return "unknown";
    if (cabinet.availability === "unavailable") return "unavailable";
    if (cabinet.condition === "caution") return "caution";
    return cabinet.condition === "normal" ? "normal" : "available";
}

/** 「가동 · 양호」·「가동 · 주의」·「이용 불가」·「미확인」 */
function cabinetStateLabel(
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
 * 상태 글자. 관리자가 적은 상태 이유가 있으면 점선 밑줄 → 팝오버로 이유를 보여 준다.
 * 물음표 아이콘은 끈다 — 라벨이 행 오른쪽 끝에 붙어 있어 아이콘만큼 밀리면 줄끼리 끝이 어긋난다.
 * 상태가 미확인·이용 불가로 내려가면(condition unknown) 옛 이유는 보이지 않는다.
 */
export function CabinetStateText({ cabinet }: { cabinet: ArcadeCabinet }) {
    const t = useTranslations();
    const stateLabel = cabinetStateLabel(cabinet, t);
    if (!cabinet.conditionNote || cabinet.condition === "unknown")
        return stateLabel;
    return (
        <TermHelp
            icon={false}
            title={stateLabel}
            description={cabinet.conditionNote}
            ariaLabel={t("arcades.conditionReasonAria", {
                label: cabinetLabel(cabinet, t),
                state: stateLabel,
            })}
        >
            {stateLabel}
        </TermHelp>
    );
}

/**
 * 기체 한 대 = 구분선으로 나눈 한 줄. 실제 오락실 표기(1번기·2번기)를 따르고, 위치 메모·상태(색 점 + 글자)·신선도를 같이 둔다.
 * 「가동 확인」 은 로그인 이용자의 한 번 누르기 — 카드의 주 액션이라 흰 버튼(목록 카드 「자세히 보기」 와 같은 서열),
 * 「고장 신고」 는 이 기체를 대상으로 신고 레이어를 여는 빨간 테두리 버튼(사용자 결정). 둘 다 글자만 —
 * 폰 상세 22곳 중 주 버튼 글자만 15 (2026-09-15).
 * 확인한 사람 수·신고 건수는 각 버튼 글자 오른쪽의 흐린 숫자 — 시각 줄에는 시각만 남긴다.
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
    const meta = [
        checkedDays !== null
            ? checkedDays === 0
                ? t("arcades.checkedToday")
                : t("arcades.checkedAgo", { count: checkedDays })
            : verifiedDays !== null && !cabinet.stale
              ? verifiedDays === 0
                  ? t("arcades.checkedToday")
                  : t("arcades.checkedAgo", { count: verifiedDays })
              : t("arcades.neverChecked"),
        cabinet.openReports && reportedDays !== null
            ? reportedDays === 0
                ? t("arcades.reportedToday")
                : t("arcades.reportedAgo", { count: reportedDays })
            : null,
    ].filter(Boolean);
    const checkCount = cabinet.checkCount ? (
        <span className="nl-metric-value nl-arcade-cabinet__count">
            {cabinet.checkCount}
        </span>
    ) : null;
    const confirmAria = `${t("arcades.confirmRunningAria", { label })}${
        cabinet.checkCount
            ? ` · ${t("arcades.checkedBy", { count: cabinet.checkCount })}`
            : ""
    }`;
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
            {/* 두 열 — 왼쪽 이름 / 위치 메모, 오른쪽 상태 / 확인 시각(상태의 근거라 상태 밑) · 2026-09-16 */}
            <div className="nl-arcade-cabinet__row">
                <span className="nl-arcade-cabinet__name">
                    <span className="nl-control">{label}</span>
                    {cabinet.note ? (
                        <span className="nl-metadata nl-muted">
                            {cabinet.note}
                        </span>
                    ) : null}
                </span>
                <span className="nl-arcade-cabinet__status">
                    <span
                        className="nl-control nl-arcade-cabinet__state"
                        data-state={state}
                    >
                        <span className="nl-arcade-cabinet__dot" aria-hidden />
                        <CabinetStateText cabinet={cabinet} />
                    </span>
                    {/* 한 줄 글로 이어 쓴다 — 조각마다 간격을 주고 「· 」 까지 붙이면 점 앞이 더 벌어진다 */}
                    <span className="nl-arcade-cabinet__meta nl-metadata nl-muted">
                        {meta.join(" · ")}
                    </span>
                </span>
            </div>
            <div className="nl-arcade-cabinet__actions">
                {isAuthenticated ? (
                    <ActionButton
                        size="sm"
                        busy={busy}
                        busyLabel={t("arcades.confirmRunning")}
                        disabled={checkedByMe}
                        aria-label={confirmAria}
                        aria-pressed={checkedByMe}
                        onClick={confirm}
                    >
                        {t(
                            checkedByMe
                                ? "arcades.confirmedRunning"
                                : "arcades.confirmRunning"
                        )}
                        {checkCount}
                    </ActionButton>
                ) : (
                    // 로그아웃 — 비활성처럼 어둡게(data-locked) · hover 에 이유(title). 진짜 disabled 는 hover 를 막아 title 이 안 뜬다
                    <Button
                        size="sm"
                        data-locked=""
                        aria-disabled="true"
                        aria-label={confirmAria}
                        title={t("arcades.loginToUse")}
                        onClick={() => setLoginHint(true)}
                    >
                        {t("arcades.confirmRunning")}
                        {checkCount}
                    </Button>
                )}
                <ArcadeReportDialog
                    arcade={arcade}
                    isAuthenticated={isAuthenticated}
                    initialCabinetId={cabinet.id}
                    initialReportType="unavailable"
                    triggerLabel={t("arcades.reportBroken")}
                    triggerVariant="danger"
                    triggerSuffix={
                        cabinet.openReports ? (
                            <span className="nl-metric-value nl-arcade-cabinet__count">
                                {cabinet.openReports}
                            </span>
                        ) : null
                    }
                    triggerAriaLabel={`${t("arcades.reportBrokenAria", { label })}${
                        cabinet.openReports
                            ? ` · ${t("arcades.openReports", { count: cabinet.openReports })}`
                            : ""
                    }`}
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

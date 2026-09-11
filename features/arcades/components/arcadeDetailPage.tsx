"use client";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Copy, Heart, Navigation, Share2 } from "lucide-react";
import BackLink from "@/components/ui/backLink";
import {
    useLocale,
    useLocalizedHref,
    useTranslations,
} from "@/components/i18n/localeProvider";
import PageContainer from "@/components/layout/pageContainer";
import ActionButton from "@/components/ui/actionButton";
import { foundationButtonClass } from "@/components/ui/Button";
import { StatusMessage } from "@/components/ui/statusMessage";
import { setPreferredArcade } from "@/app/(nevigation)/gamecenter/actions";
import type { PublicArcade } from "@/features/arcades/schemas/publicArcadeSchema";
import type { RecentCabinetCheck } from "@/features/arcades/server/cabinetCheckService";
import {
    arcadeCabinetSummary,
    arcadeDirections,
    arcadeDistance,
    arcadeLastVerifiedAt,
    arcadeOpenState,
    arcadeScheduleHint,
    daysAgo,
    formatArcadePrice,
} from "@/features/arcades/arcadeDiscovery";
import { useArcadeSession } from "@/features/arcades/hooks/useArcadeSession";
import ArcadeCabinetRow from "./arcadeCabinetRow";
import ArcadeDiscoveryMap from "./arcadeDiscoveryMap";
import ArcadeHours from "./arcadeHours";
import ArcadePhotos from "./arcadePhotos";
import ArcadeReportDialog from "./arcadeReportDialog";
import ArcadeContactDetails from "./arcadeContactDetails";

/**
 * 오락실 상세 — Google 지도·카카오맵 장소 시트 순서.
 * 사진 → 이름·상태 한 줄 → 액션 행(길찾기·선호·공유·제보) → 기체(대마다 한 줄) → 위치 → 영업시간 → 정보 → 선호 플레이어.
 * 1056+ 는 본문 | 레일(액션·선호·최근 확인). 빈 정보는 카드가 아니라 한 줄로 접힌다.
 */
export default function ArcadeDetailPage({
    arcade,
    appKey,
    isAuthenticated,
    preferredArcadeId,
    checkedCabinetIds = [],
    recentChecks = [],
}: {
    arcade: PublicArcade;
    appKey: string;
    isAuthenticated: boolean;
    preferredArcadeId: number | null;
    checkedCabinetIds?: number[];
    recentChecks?: RecentCabinetCheck[];
}) {
    const locale = useLocale();
    const href = useLocalizedHref();
    const t = useTranslations();
    const router = useRouter();
    const origin = useArcadeSession((state) => state.origin);
    const discoveryQuery = useArcadeSession((state) => state.discoveryQuery);
    const [now, setNow] = useState(() => new Date());
    const [preferred, setPreferred] = useState(preferredArcadeId === arcade.id);
    const [checked, setChecked] = useState<number[]>(checkedCabinetIds);
    const [notice, setNotice] = useState<{
        success: boolean;
        message: string;
    } | null>(null);
    const [copyState, setCopyState] = useState<"idle" | "copied" | "error">(
        "idle"
    );
    const [shareState, setShareState] = useState<"idle" | "copied" | "error">(
        "idle"
    );
    const [busy, startTransition] = useTransition();
    useEffect(() => {
        const timer = window.setInterval(() => setNow(new Date()), 60_000);
        return () => window.clearInterval(timer);
    }, []);
    const directions = arcadeDirections(arcade);
    const distance = arcadeDistance(arcade, origin);
    const open = arcadeOpenState(arcade, now);
    const hint = arcadeScheduleHint(arcade, now);
    const alias = arcade.identities.find(
        (item) => item.locale === locale
    )?.name;
    const summary = arcadeCabinetSummary(arcade);
    const verifiedDays = daysAgo(arcadeLastVerifiedAt(arcade), now);
    const loginHref = `${href("/login")}?returnTo=${encodeURIComponent(href(`/gamecenter/${arcade.slug}`))}`;
    const price = formatArcadePrice(arcade, locale, (count) =>
        t("arcades.coins", { count })
    );

    function choosePreferred() {
        setNotice(null);
        startTransition(async () => {
            const result = await setPreferredArcade(arcade.id, locale).catch(
                () => ({
                    success: false as const,
                    message: t("arcades.preferredFailed"),
                })
            );
            setNotice(result);
            if (result.success) {
                setPreferred(true);
                router.refresh();
            }
        });
    }
    async function copyAddress() {
        if (!arcade.address) return;
        try {
            await navigator.clipboard.writeText(arcade.address);
            setCopyState("copied");
        } catch {
            setCopyState("error");
        }
    }
    async function share() {
        const url = window.location.href;
        const payload = { title: arcade.name, url };
        try {
            if (
                typeof navigator.share === "function" &&
                (navigator.canShare?.(payload) ?? true)
            ) {
                await navigator.share(payload);
                setShareState("idle");
                return;
            }
            await navigator.clipboard.writeText(url);
            setShareState("copied");
        } catch (error) {
            setShareState(
                error instanceof Error && error.name === "AbortError"
                    ? "idle"
                    : "error"
            );
        }
    }
    function onChecked(cabinetId: number) {
        setChecked((ids) =>
            ids.includes(cabinetId) ? ids : [...ids, cabinetId]
        );
        router.refresh();
    }

    // 액션 행 — 길찾기(주 액션) · 선호 · 공유 · 제보. Compact 는 본문 위, 1056+ 는 레일
    const actions = (
        <div className="nl-arcade-detail__actions">
            {directions ? (
                <a
                    className={foundationButtonClass({ size: "sm" })}
                    href={directions}
                    aria-label={`${t("arcades.directions")} · ${t("shell.externalLink")}`}
                >
                    <Navigation className="nl-icon-small" aria-hidden />
                    {t("arcades.directions")}
                </a>
            ) : (
                <ActionButton size="sm" disabled>
                    <Navigation className="nl-icon-small" aria-hidden />
                    {t("arcades.directions")}
                </ActionButton>
            )}
            {isAuthenticated ? (
                <ActionButton
                    variant="secondary"
                    size="sm"
                    busy={busy}
                    busyLabel={t("arcades.settingPreferred")}
                    disabled={preferred}
                    aria-pressed={preferred}
                    aria-label={t(
                        preferred
                            ? "arcades.currentPreferred"
                            : "arcades.setPreferred"
                    )}
                    onClick={choosePreferred}
                >
                    <Heart className="nl-icon-small" aria-hidden />
                    {t(
                        preferred
                            ? "arcades.preferredShort"
                            : "arcades.preferShort"
                    )}
                </ActionButton>
            ) : (
                <Link
                    className={foundationButtonClass({
                        variant: "secondary",
                        size: "sm",
                    })}
                    href={loginHref}
                    aria-label={t("arcades.loginToSetPreferred")}
                >
                    <Heart className="nl-icon-small" aria-hidden />
                    {t("arcades.preferShort")}
                </Link>
            )}
            <ActionButton variant="secondary" size="sm" onClick={share}>
                <Share2 className="nl-icon-small" aria-hidden />
                {t("arcades.share")}
            </ActionButton>
            <ArcadeReportDialog
                arcade={arcade}
                isAuthenticated={isAuthenticated}
            />
        </div>
    );
    const actionNotices = (
        <>
            {notice ? (
                <StatusMessage
                    severity={notice.success ? "success" : "danger"}
                    title={notice.message}
                    role="status"
                />
            ) : null}
            {shareState !== "idle" ? (
                <p className="nl-metadata nl-muted" role="status">
                    {t(
                        shareState === "copied"
                            ? "arcades.shareCopied"
                            : "arcades.shareFailed"
                    )}
                </p>
            ) : null}
        </>
    );
    const preferredBlock = (
        <div className="nl-arcade-detail__section-head">
            <h2 className="nl-component-title">
                {t("arcades.preferredPlayers")}
            </h2>
            <span className="nl-body-secondary nl-muted nl-arcade-detail__preferred-count">
                {arcade.preferredCount === null
                    ? t("arcades.collectingPreference")
                    : t("arcades.people", { count: arcade.preferredCount })}
            </span>
        </div>
    );

    return (
        <PageContainer className="nl-arcade-detail">
            <BackLink
                href={href(
                    `/gamecenter${discoveryQuery ? `?${discoveryQuery}` : ""}`
                )}
            >
                {t("arcades.title")}
            </BackLink>
            <div className="nl-arcade-detail__layout">
                <div className="nl-arcade-detail__main">
                    <ArcadePhotos photos={arcade.photos} />
                    <div className="nl-arcade-detail__head">
                        <h1
                            className="nl-page-title"
                            lang={arcade.nativeLanguage ?? undefined}
                        >
                            {arcade.name}
                        </h1>
                        {alias && alias !== arcade.name ? (
                            <p className="nl-body-secondary nl-muted">
                                {alias}
                            </p>
                        ) : null}
                        <p
                            className="nl-body-secondary nl-arcade-detail__status"
                            data-open={open === "open" || undefined}
                        >
                            <span className="nl-arcade-detail__open">
                                {t(
                                    open === "unknown"
                                        ? "arcades.hoursUnverified"
                                        : open === "open"
                                          ? "arcades.open"
                                          : "arcades.closed"
                                )}
                            </span>
                            {hint ? (
                                <span className="nl-muted">
                                    ·{" "}
                                    {hint.kind === "closes"
                                        ? t("arcades.closesAt", {
                                              time: hint.time,
                                          })
                                        : t("arcades.opensAt", {
                                              time: hint.time,
                                          })}
                                </span>
                            ) : null}
                            {arcade.region ? (
                                <span className="nl-muted">
                                    ·{" "}
                                    {[arcade.region, arcade.locality]
                                        .filter(Boolean)
                                        .join(" ")}
                                </span>
                            ) : null}
                            {distance !== null ? (
                                <span className="nl-muted">
                                    ·{" "}
                                    {t("arcades.distance", {
                                        distance: distance.toFixed(1),
                                    })}
                                </span>
                            ) : null}
                        </p>
                    </div>
                    <div className="nl-arcade-detail__main-only">
                        {actions}
                        {actionNotices}
                    </div>

                    <section className="nl-arcade-detail__section">
                        <div className="nl-arcade-detail__section-head">
                            <h2 className="nl-component-title">
                                {summary.total
                                    ? t("arcades.machineCountValue", {
                                          count: summary.total,
                                      })
                                    : t("arcades.cabinets")}
                                {price ? (
                                    <span className="nl-body-secondary nl-muted">
                                        {" "}
                                        · {price}
                                    </span>
                                ) : null}
                            </h2>
                            {summary.total ? (
                                <span className="nl-metadata nl-muted">
                                    {verifiedDays === null
                                        ? t("arcades.neverChecked")
                                        : verifiedDays === 0
                                          ? t("arcades.checkedToday")
                                          : t("arcades.checkedAgo", {
                                                count: verifiedDays,
                                            })}
                                    {arcade.checkCount
                                        ? ` · ${t("arcades.checkedBy", { count: arcade.checkCount })}`
                                        : ""}
                                </span>
                            ) : null}
                        </div>
                        {summary.total ? (
                            <ul className="nl-arcade-cabinets">
                                {arcade.cabinets.map((cabinet) => (
                                    <ArcadeCabinetRow
                                        key={cabinet.id}
                                        arcade={arcade}
                                        cabinet={cabinet}
                                        now={now}
                                        isAuthenticated={isAuthenticated}
                                        checkedByMe={checked.includes(
                                            cabinet.id
                                        )}
                                        onChecked={onChecked}
                                    />
                                ))}
                            </ul>
                        ) : (
                            <p className="nl-body-secondary nl-muted">
                                {t("arcades.noCabinetInfo")} ·{" "}
                                {t("arcades.reportInfo")}
                            </p>
                        )}
                    </section>

                    <section className="nl-arcade-detail__section">
                        <div className="nl-arcade-detail__section-head">
                            <h2 className="nl-component-title">
                                {t("arcades.location")}
                            </h2>
                        </div>
                        {arcade.latitude !== null &&
                        arcade.longitude !== null ? (
                            <div className="nl-arcade-detail__map">
                                <ArcadeDiscoveryMap
                                    appKey={appKey}
                                    arcades={[arcade]}
                                    selectedId={null}
                                    onSelect={() => {}}
                                    focusLevel={4}
                                />
                            </div>
                        ) : null}
                        {arcade.address ? (
                            <button
                                type="button"
                                className="nl-arcade-detail__address nl-body"
                                onClick={copyAddress}
                                aria-label={`${arcade.address} · ${t("arcades.copyAddress")}`}
                            >
                                <span>{arcade.address}</span>
                                <span className="nl-arcade-detail__copy">
                                    <Copy className="nl-icon" aria-hidden />
                                </span>
                            </button>
                        ) : (
                            <p className="nl-body-secondary nl-muted">
                                {t("arcades.addressPending")}
                            </p>
                        )}
                        {copyState !== "idle" ? (
                            <p className="nl-metadata" role="status">
                                {t(
                                    copyState === "copied"
                                        ? "arcades.copied"
                                        : "arcades.copyFailed"
                                )}
                            </p>
                        ) : null}
                    </section>

                    <section className="nl-arcade-detail__section">
                        <div className="nl-arcade-detail__section-head">
                            <h2 className="nl-component-title">
                                {t("arcades.hours")}
                            </h2>
                            {open === "unknown" && arcade.hours ? (
                                <span className="nl-metadata nl-muted">
                                    {t("arcades.hoursUnverified")}
                                </span>
                            ) : null}
                        </div>
                        <ArcadeHours arcade={arcade} />
                    </section>

                    {arcade.phone || arcade.website || arcade.notes ? (
                        <section className="nl-arcade-detail__section">
                            <div className="nl-arcade-detail__section-head">
                                <h2 className="nl-component-title">
                                    {t("arcades.info")}
                                </h2>
                            </div>
                            <dl className="nl-arcade-detail__facts">
                                <ArcadeContactDetails arcade={arcade} />
                                {arcade.notes ? (
                                    <div>
                                        <dt className="nl-control">
                                            {t("arcades.notes")}
                                        </dt>
                                        <dd className="nl-body-secondary">
                                            {arcade.notes}
                                        </dd>
                                    </div>
                                ) : null}
                            </dl>
                        </section>
                    ) : null}

                    <section className="nl-arcade-detail__section nl-arcade-detail__main-only">
                        {preferredBlock}
                    </section>
                </div>

                <aside className="nl-arcade-detail__rail nl-arcade-detail__rail-only">
                    <div className="nl-arcade-detail__rail-box">
                        {actions}
                        {actionNotices}
                    </div>
                    <div className="nl-arcade-detail__rail-box">
                        {preferredBlock}
                    </div>
                    {recentChecks.length ? (
                        <div className="nl-arcade-detail__rail-box">
                            <h2 className="nl-component-title">
                                {t("arcades.recentChecks")}
                            </h2>
                            <ul className="nl-arcade-detail__checks nl-body-secondary">
                                {recentChecks.map((check) => {
                                    const days = daysAgo(check.checkedAt, now);
                                    return (
                                        <li
                                            key={`${check.userId}-${check.checkedAt}`}
                                        >
                                            <span className="nl-muted">
                                                {days === 0
                                                    ? t("arcades.checkedToday")
                                                    : t("arcades.checkedAgo", {
                                                          count: days ?? 0,
                                                      })}
                                            </span>
                                            {" · "}
                                            <Link
                                                className="nl-link"
                                                href={href(
                                                    `/profile/${check.userId}`
                                                )}
                                            >
                                                {check.username ??
                                                    t("common.unknownUser")}
                                            </Link>
                                            {" · "}
                                            {check.cabinetLabel ??
                                                t("arcades.cabinetNumber", {
                                                    count:
                                                        check.cabinetPosition +
                                                        1,
                                                })}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ) : null}
                </aside>
            </div>
        </PageContainer>
    );
}

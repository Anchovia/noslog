"use client";
import Link from "next/link";
import { useEffect, useId, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
    ChevronDown,
    Clock,
    Coins,
    Copy,
    ExternalLink,
    Globe,
    Heart,
    Info,
    MapPin,
    Phone,
} from "lucide-react";
import { toast } from "sonner";
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
import {
    clearPreferredArcade,
    setPreferredArcade,
} from "@/app/(nevigation)/gamecenter/actions";
import { normalizeArcadeBusinessHours } from "@/lib/arcadeDetails";
import type { PublicArcade } from "@/features/arcades/schemas/publicArcadeSchema";
import type { RecentCabinetCheck } from "@/features/arcades/server/cabinetCheckService";
import {
    arcadeCabinetSummary,
    arcadeDirections,
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
import { ArcadeFacilities } from "./arcadeTraits";
import ArcadeReportDialog from "./arcadeReportDialog";

/**
 * 오락실 상세 — 사진(없으면 자리표시자) → 이름·상태 → 정보 행(주소·영업시간·요금·연락처) → 위치 → 기체.
 * 액션(길찾기 · 선호 · 제보)은 1056 미만 화면 아래 고정 바, 1056+ 는 레일 첫 상자. 선호 인원은 하트 옆 숫자.
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
    const hoursId = useId();
    const discoveryQuery = useArcadeSession((state) => state.discoveryQuery);
    const [now, setNow] = useState(() => new Date());
    const [preferred, setPreferred] = useState(preferredArcadeId === arcade.id);
    const [checked, setChecked] = useState<number[]>(checkedCabinetIds);
    const [hoursOpen, setHoursOpen] = useState(false);
    const [notice, setNotice] = useState<{
        success: boolean;
        message: string;
    } | null>(null);
    const [busy, startTransition] = useTransition();
    useEffect(() => {
        const timer = window.setInterval(() => setNow(new Date()), 60_000);
        return () => window.clearInterval(timer);
    }, []);
    const directions = arcadeDirections(arcade);
    const open = arcadeOpenState(arcade, now);
    const hint = arcadeScheduleHint(arcade, now);
    const alias = arcade.identities.find(
        (item) => item.locale === locale
    )?.name;
    const summary = arcadeCabinetSummary(arcade);
    const loginHref = `${href("/login")}?returnTo=${encodeURIComponent(href(`/gamecenter/${arcade.slug}`))}`;
    const price = formatArcadePrice(arcade, locale, (count) =>
        t("arcades.coins", { count })
    );
    const hasHours = Boolean(
        arcade.hours || normalizeArcadeBusinessHours(arcade.legacyHours)
    );
    const hasLocation = arcade.latitude !== null && arcade.longitude !== null;
    const telephone = arcade.phone?.replace(/[^+\d]/g, "");
    const openLabel = t(
        open === "unknown"
            ? "arcades.hoursUnknown"
            : open === "open"
              ? "arcades.open"
              : "arcades.closed"
    );
    const hintLabel = hint
        ? hint.kind === "closes"
            ? t("arcades.closesAt", { time: hint.time })
            : t("arcades.opensAt", { time: hint.time })
        : null;
    // 누르면 지정, 채운 하트를 다시 누르면 해제.
    // 결과 알림은 1056+ 레일 안 상자, 그 아래 폭은 하단 바 위 공용 토스트(바 위에 상자를 쌓지 않는다)
    function togglePreferred() {
        const clearing = preferred;
        const inRail = window.matchMedia("(min-width: 1056px)").matches;
        setNotice(null);
        startTransition(async () => {
            const result = await (
                clearing ? clearPreferredArcade : setPreferredArcade
            )(arcade.id, locale).catch(() => ({
                success: false as const,
                message: t(
                    clearing
                        ? "arcades.unsetPreferredFailed"
                        : "arcades.preferredFailed"
                ),
            }));
            if (inRail) setNotice(result);
            else if (result.success) toast.success(result.message);
            else toast.error(result.message);
            if (!result.success) return;
            setPreferred(!clearing);
            router.refresh();
        });
    }
    // 주소 복사 결과는 공용 토스트 — 정보 행 사이에 글줄을 끼워 배치를 흔들지 않는다
    async function copyAddress() {
        if (!arcade.address) return;
        try {
            await navigator.clipboard.writeText(arcade.address);
            toast.success(t("arcades.addressCopied"));
        } catch {
            toast.error(t("arcades.copyFailed"));
        }
    }
    function onChecked(cabinetId: number) {
        setChecked((ids) =>
            ids.includes(cabinetId) ? ids : [...ids, cabinetId]
        );
        router.refresh();
    }

    // 선호 인원 — 3명 이상일 때만 하트 옆 숫자(개인이 드러나지 않게 서버가 3명 미만은 null)
    const preferredCount = arcade.preferredCount;
    const withPreferredCount = (label: string) =>
        preferredCount === null
            ? label
            : `${label} · ${t("arcades.preferredPeople", { count: preferredCount })}`;
    const heartContent = (
        <>
            {busy ? null : <Heart className="nl-icon" aria-hidden />}
            {preferredCount === null ? null : (
                <span className="nl-metric-value">{preferredCount}</span>
            )}
        </>
    );

    // 액션 한 줄 — 길찾기(주 액션, 남는 폭) · 선호(하트, 인원이 있으면 숫자) · 제보(말풍선).
    // 1056 미만 하단 바, 1056+ 레일 — 같은 줄은 컨트롤 높이 하나
    const actions = (
        <div className="nl-arcade-detail__actions">
            {directions ? (
                <a
                    className={`${foundationButtonClass()} nl-arcade-detail__directions`}
                    href={directions}
                    aria-label={`${t("arcades.directions")} · ${t("shell.externalLink")}`}
                >
                    {t("arcades.directions")}
                </a>
            ) : (
                <ActionButton disabled className="nl-arcade-detail__directions">
                    {t("arcades.directions")}
                </ActionButton>
            )}
            {isAuthenticated ? (
                // 토글 — 눌림 상태(aria-pressed)와 채운 하트로 지정 여부를 알린다
                <ActionButton
                    variant="secondary"
                    size={preferredCount === null ? "icon" : undefined}
                    className="nl-arcade-detail__prefer"
                    busy={busy}
                    aria-pressed={preferred}
                    aria-label={withPreferredCount(t("arcades.setPreferred"))}
                    title={t(
                        preferred
                            ? "arcades.unsetPreferred"
                            : "arcades.setPreferred"
                    )}
                    data-active={preferred || undefined}
                    onClick={togglePreferred}
                >
                    {heartContent}
                </ActionButton>
            ) : (
                <Link
                    className={`${foundationButtonClass({
                        variant: "secondary",
                        size: preferredCount === null ? "icon" : undefined,
                    })} nl-arcade-detail__prefer`}
                    href={loginHref}
                    aria-label={withPreferredCount(
                        t("arcades.loginToSetPreferred")
                    )}
                    title={t("arcades.loginToSetPreferred")}
                >
                    {heartContent}
                </Link>
            )}
            <ArcadeReportDialog
                arcade={arcade}
                isAuthenticated={isAuthenticated}
                iconOnly
            />
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
                        {/* 영업 상태 · 지역 줄은 두지 않는다 — 바로 아래 정보 행(주소 · 영업시간)과 같은 글이 겹친다(2026-09-15) */}
                    </div>

                    {/* 정보 행 — 아이콘 + 값 한 줄씩. 제보는 이 목록의 끝 */}
                    <section
                        className="nl-arcade-detail__section"
                        aria-label={t("arcades.info")}
                    >
                        <ul className="nl-arcade-facts">
                            <li className="nl-arcade-fact">
                                <MapPin className="nl-icon" aria-hidden />
                                {arcade.address ? (
                                    <button
                                        type="button"
                                        className="nl-arcade-fact__action nl-body"
                                        onClick={copyAddress}
                                        aria-label={`${arcade.address} · ${t("arcades.copyAddress")}`}
                                    >
                                        <span className="nl-arcade-fact__value">
                                            {arcade.address}
                                        </span>
                                        <span className="nl-arcade-fact__tail">
                                            <Copy
                                                className="nl-icon"
                                                aria-hidden
                                            />
                                        </span>
                                    </button>
                                ) : (
                                    <span className="nl-arcade-fact__value nl-body nl-muted">
                                        {t("arcades.addressPending")}
                                    </span>
                                )}
                            </li>
                            <li className="nl-arcade-fact">
                                <Clock className="nl-icon" aria-hidden />
                                {hasHours ? (
                                    <button
                                        type="button"
                                        className="nl-arcade-fact__action nl-body"
                                        aria-expanded={hoursOpen}
                                        aria-controls={hoursId}
                                        onClick={() =>
                                            setHoursOpen((value) => !value)
                                        }
                                    >
                                        <span className="nl-arcade-fact__value">
                                            <span className="sr-only">
                                                {t("arcades.hours")} ·{" "}
                                            </span>
                                            <span
                                                className="nl-arcade-detail__open"
                                                data-open={
                                                    open === "open" || undefined
                                                }
                                            >
                                                {openLabel}
                                            </span>
                                            {hintLabel ? (
                                                <span className="nl-muted">
                                                    {" "}
                                                    · {hintLabel}
                                                </span>
                                            ) : null}
                                        </span>
                                        <span className="nl-arcade-fact__tail">
                                            <ChevronDown
                                                className="nl-icon nl-disclosure__chevron"
                                                aria-hidden
                                            />
                                        </span>
                                    </button>
                                ) : (
                                    <span className="nl-arcade-fact__value nl-body nl-muted">
                                        {t("arcades.hoursUnknown")}
                                    </span>
                                )}
                            </li>
                            {hasHours ? (
                                <li
                                    id={hoursId}
                                    className="nl-arcade-fact__detail"
                                    hidden={!hoursOpen}
                                >
                                    <ArcadeHours arcade={arcade} now={now} />
                                </li>
                            ) : null}
                            {price ? (
                                <li className="nl-arcade-fact">
                                    <Coins className="nl-icon" aria-hidden />
                                    <span className="nl-arcade-fact__value nl-body">
                                        <span className="sr-only">
                                            {t("arcades.price")} ·{" "}
                                        </span>
                                        {price}
                                    </span>
                                </li>
                            ) : null}
                            {arcade.phone ? (
                                <li className="nl-arcade-fact">
                                    <Phone className="nl-icon" aria-hidden />
                                    <span className="nl-arcade-fact__value nl-body">
                                        <span className="sr-only">
                                            {t("arcades.phone")} ·{" "}
                                        </span>
                                        {telephone && /\d/.test(telephone) ? (
                                            <a
                                                className="nl-link"
                                                href={`tel:${telephone}`}
                                            >
                                                {arcade.phone}
                                            </a>
                                        ) : (
                                            arcade.phone
                                        )}
                                    </span>
                                </li>
                            ) : null}
                            {arcade.website ? (
                                <li className="nl-arcade-fact">
                                    <Globe className="nl-icon" aria-hidden />
                                    <span className="nl-arcade-fact__value nl-body">
                                        <span className="sr-only">
                                            {t("arcades.website")} ·{" "}
                                        </span>
                                        <a
                                            className="nl-link nl-arcade-fact__link"
                                            href={arcade.website}
                                        >
                                            {arcade.website.replace(
                                                /^https?:\/\//,
                                                ""
                                            )}
                                            <ExternalLink
                                                className="nl-icon-small"
                                                aria-hidden
                                            />
                                            <span className="sr-only">
                                                {" "}
                                                · {t("shell.externalLink")}
                                            </span>
                                        </a>
                                    </span>
                                </li>
                            ) : null}
                            {arcade.notes ? (
                                <li className="nl-arcade-fact">
                                    <Info className="nl-icon" aria-hidden />
                                    <span className="nl-arcade-fact__value nl-body">
                                        <span className="sr-only">
                                            {t("arcades.notes")} ·{" "}
                                        </span>
                                        {arcade.notes}
                                    </span>
                                </li>
                            ) : null}
                        </ul>
                    </section>

                    {/* 시설 — 정보 행 다음 · 위치 앞, 입력한 오락실만 (2026-09-22 B2) */}
                    {arcade.facilities.length ? (
                        <section className="nl-arcade-detail__section">
                            <div className="nl-arcade-detail__section-head">
                                <h2 className="nl-section-title">
                                    {t("arcades.facilities")}
                                </h2>
                            </div>
                            <ArcadeFacilities facilities={arcade.facilities} />
                        </section>
                    ) : null}

                    {/* 위치 — 정보 행과 기체 사이 */}
                    {hasLocation ? (
                        <section className="nl-arcade-detail__section">
                            <div className="nl-arcade-detail__section-head">
                                <h2 className="nl-section-title">
                                    {t("arcades.location")}
                                </h2>
                            </div>
                            <div className="nl-arcade-detail__map">
                                <ArcadeDiscoveryMap
                                    appKey={appKey}
                                    arcades={[arcade]}
                                    selectedId={null}
                                    onSelect={() => {}}
                                    focusLevel={4}
                                />
                            </div>
                        </section>
                    ) : null}

                    <section className="nl-arcade-detail__section">
                        <div className="nl-arcade-detail__section-head">
                            <h2 className="nl-section-title">
                                {t("arcades.cabinets")}
                            </h2>
                            {summary.total ? (
                                <span className="nl-body-secondary nl-muted">
                                    {t("arcades.machineCountValue", {
                                        count: summary.total,
                                    })}
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
                </div>

                <aside className="nl-arcade-detail__rail nl-arcade-detail__rail-only">
                    <div className="nl-arcade-detail__rail-box">
                        {actions}
                        {notice ? (
                            <StatusMessage
                                severity={notice.success ? "success" : "danger"}
                                title={notice.message}
                                role="status"
                            />
                        ) : null}
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
            {/* 1056 미만 — 화면 아래 고정 바 */}
            <div className="nl-arcade-detail__bar">{actions}</div>
        </PageContainer>
    );
}

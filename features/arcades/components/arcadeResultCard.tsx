"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown, MapPin, Navigation } from "lucide-react";
import { useId, useState } from "react";
import { useArcadeSession } from "@/features/arcades/hooks/useArcadeSession";
import {
    useLocale,
    useLocalizedHref,
    useTranslations,
} from "@/components/i18n/localeProvider";
import { foundationButtonClass } from "@/components/ui/Button";
import type { PublicArcade } from "@/features/arcades/schemas/publicArcadeSchema";
import {
    arcadeCabinetSummary,
    arcadeDirections,
    arcadeLastVerifiedAt,
    arcadeOpenState,
    arcadeScheduleHint,
    arcadeTodayHours,
    daysAgo,
    formatArcadePrice,
    formatArcadeTime,
} from "@/features/arcades/arcadeDiscovery";
import { cabinetLabel, cabinetStateLabel } from "./arcadeCabinetRow";

const DISCOVERY_KEYS = [
    "q",
    "region",
    "open",
    "available",
    "sort",
    "near",
    "mode",
] as const;

/** 기체 한 줄 — 「기체 2대 · 가동 2대 · 주의 1대」. 정보가 없으면 「기체 정보 없음 · 제보하기」 */
export function ArcadeCabinetLine({ arcade }: { arcade: PublicArcade }) {
    const t = useTranslations();
    const summary = arcadeCabinetSummary(arcade);
    if (!summary.total)
        return (
            <>
                {t("arcades.noCabinetInfo")}
                <span className="nl-muted"> · {t("arcades.reportInfo")}</span>
            </>
        );
    if (!summary.known)
        return <>{t("arcades.cabinetLineUnknown", { count: summary.total })}</>;
    return (
        <>
            {t("arcades.cabinetLine", {
                count: summary.total,
                available: summary.available,
            })}
            {summary.caution
                ? ` · ${t("arcades.cabinetLineCaution", { count: summary.caution })}`
                : ""}
        </>
    );
}

/**
 * 영업 상태 + 확인 신선도 한 줄 — 「영업 중 · 23:00까지 · 오늘 확인」.
 * 지금 시각(오락실 시간대) 기준 영업 상태가 먼저, 점도 영업 상태를 뜻한다. 시간 정보가 없으면 「영업시간 미확인」
 */
export function ArcadeFreshnessLine({
    arcade,
    now,
    tail = null,
}: {
    arcade: PublicArcade;
    now: Date;
    /** 줄 끝에 붙는 보조 항목(선호 인원 등) — 점 뒤 한 덩어리로 흘러야 gap 이 안 생긴다 */
    tail?: string | null;
}) {
    const t = useTranslations();
    const days = daysAgo(arcadeLastVerifiedAt(arcade), now);
    const open = arcadeOpenState(arcade, now);
    const hint = arcadeScheduleHint(arcade, now);
    const rest = [
        hint
            ? hint.kind === "closes"
                ? t("arcades.closesAt", { time: hint.time })
                : t("arcades.opensAt", { time: hint.time })
            : null,
        days === null
            ? t("arcades.neverChecked")
            : days === 0
              ? t("arcades.checkedToday")
              : t("arcades.checkedAgo", { count: days }),
        tail,
    ].filter(Boolean);
    return (
        <>
            <span
                className="nl-arcade-result__dot"
                data-open={open}
                aria-hidden
            />
            <span>
                {t(
                    open === "open"
                        ? "arcades.open"
                        : open === "closed"
                          ? "arcades.closed"
                          : "arcades.hoursUnverified"
                )}
                {` · ${rest.join(" · ")}`}
            </span>
        </>
    );
}

/**
 * 결과 카드 — 누르면 상세로 가지 않고 아래로 펼쳐진다(지도는 페이지가 그 핀으로 옮긴다).
 * 펼친 칸에는 카드에 없는 것만: 주소 · 오늘 영업시간 · 요금 · 기체별 한 줄 + 자세히 보기·지도에서 보기·길찾기.
 * 상세로 가는 길은 「자세히 보기」 링크 하나 — 카카오맵 목록의 「상세보기」 와 같은 역할.
 * `preview` 는 전체 지도 모드(Compact)에서 지도 아래 띄우는 카드라 늘 펼친 채이고 접히지 않는다.
 */
export default function ArcadeResultCard({
    arcade,
    distance,
    now,
    selected,
    expanded,
    onSelect,
    onToggle,
    onShowOnMap,
    preview = false,
}: {
    arcade: PublicArcade;
    distance: number | null;
    now: Date;
    selected: boolean;
    expanded: boolean;
    onSelect: (id: number) => void;
    onToggle?: (id: number) => void;
    /** 지도가 시트에 가려질 수 있는 폭에서만 넘긴다 — 없으면 버튼을 그리지 않는다 */
    onShowOnMap?: (id: number) => void;
    preview?: boolean;
}) {
    const t = useTranslations();
    const locale = useLocale();
    const href = useLocalizedHref();
    const panelId = useId();
    const photo = arcade.photos[0];
    const [failedPhoto, setFailedPhoto] = useState<string | null>(null);
    const saveQuery = useArcadeSession((state) => state.setDiscoveryQuery);
    const open = expanded || preview;
    const summary = (
        <>
            <span className="nl-arcade-result__photo" aria-hidden>
                {photo && failedPhoto !== photo.url ? (
                    <Image
                        src={photo.url}
                        width={64}
                        height={64}
                        alt=""
                        onError={() => setFailedPhoto(photo.url)}
                    />
                ) : (
                    <MapPin className="nl-icon" />
                )}
            </span>
            <span className="nl-arcade-result__copy">
                <span className="nl-arcade-result__heading">
                    <span
                        className="nl-entity-title"
                        lang={arcade.nativeLanguage ?? undefined}
                    >
                        {arcade.name}
                    </span>
                    {distance !== null ? (
                        <span className="nl-metric-value nl-muted">
                            {t("arcades.distance", {
                                distance: distance.toFixed(1),
                            })}
                        </span>
                    ) : null}
                </span>
                <span className="nl-body-secondary nl-arcade-result__cabinets">
                    <ArcadeCabinetLine arcade={arcade} />
                    {arcade.region ? (
                        <span className="nl-muted">
                            {` · ${[arcade.region, arcade.locality].filter(Boolean).join(" ")}`}
                        </span>
                    ) : null}
                </span>
                <span className="nl-metadata nl-muted nl-arcade-result__status">
                    <ArcadeFreshnessLine
                        arcade={arcade}
                        now={now}
                        tail={
                            arcade.preferredCount !== null
                                ? t("arcades.preferredPeople", {
                                      count: arcade.preferredCount,
                                  })
                                : null
                        }
                    />
                </span>
            </span>
        </>
    );
    return (
        <div
            className="nl-arcade-result"
            data-selected={selected || undefined}
            data-expanded={open || undefined}
            data-arcade-id={arcade.id}
            onPointerEnter={() => onSelect(arcade.id)}
        >
            {preview ? (
                <div className="nl-arcade-result__summary">{summary}</div>
            ) : (
                <button
                    type="button"
                    className="nl-arcade-result__summary"
                    aria-expanded={open}
                    aria-controls={panelId}
                    onFocus={() => onSelect(arcade.id)}
                    onClick={() => onToggle?.(arcade.id)}
                >
                    {summary}
                    <ChevronDown
                        className="nl-icon nl-arcade-result__chevron"
                        aria-hidden
                    />
                </button>
            )}
            {open ? (
                <ArcadeResultMore
                    id={panelId}
                    arcade={arcade}
                    now={now}
                    locale={locale}
                    detailHref={href(`/gamecenter/${arcade.slug}`)}
                    onShowOnMap={preview ? undefined : onShowOnMap}
                    onOpenDetail={() => {
                        const current = new URLSearchParams(
                            window.location.search
                        );
                        const query = new URLSearchParams();
                        for (const key of DISCOVERY_KEYS) {
                            const value = current.get(key);
                            if (value !== null) query.set(key, value);
                        }
                        saveQuery(query.toString());
                    }}
                />
            ) : null}
        </div>
    );
}

function ArcadeResultMore({
    id,
    arcade,
    now,
    locale,
    detailHref,
    onShowOnMap,
    onOpenDetail,
}: {
    id: string;
    arcade: PublicArcade;
    now: Date;
    locale: string;
    detailHref: string;
    onShowOnMap?: (id: number) => void;
    onOpenDetail: () => void;
}) {
    const t = useTranslations();
    const today = arcadeTodayHours(arcade, now);
    const price = formatArcadePrice(arcade, locale, (count) =>
        t("arcades.coins", { count })
    );
    const directions = arcadeDirections(arcade);
    return (
        <div id={id} className="nl-arcade-result__more">
            <dl className="nl-arcade-result__facts nl-body-secondary">
                {arcade.address ? (
                    <div>
                        <dt className="nl-muted">{t("arcades.address")}</dt>
                        <dd>{arcade.address}</dd>
                    </div>
                ) : null}
                {today !== undefined ? (
                    <div>
                        <dt className="nl-muted">{t("arcades.today")}</dt>
                        <dd>
                            {today
                                ? `${formatArcadeTime(today.open)}–${formatArcadeTime(today.close)}`
                                : t("arcades.dayOff")}
                        </dd>
                    </div>
                ) : null}
                {price ? (
                    <div>
                        <dt className="nl-muted">{t("arcades.price")}</dt>
                        <dd>{price}</dd>
                    </div>
                ) : null}
            </dl>
            {arcade.cabinets.length ? (
                <ul className="nl-arcade-result__machines nl-body-secondary">
                    {arcade.cabinets.map((cabinet) => (
                        <li key={cabinet.id}>
                            <span>
                                {cabinetLabel(cabinet, t)}
                                {cabinet.note ? (
                                    <span className="nl-muted">
                                        {` · ${cabinet.note}`}
                                    </span>
                                ) : null}
                            </span>
                            <span className="nl-arcade-result__machine-state">
                                {cabinetStateLabel(cabinet, t)}
                            </span>
                        </li>
                    ))}
                </ul>
            ) : null}
            <div
                className="nl-arcade-result__actions"
                data-count={
                    1 +
                    Number(Boolean(onShowOnMap)) +
                    Number(Boolean(directions))
                }
            >
                <Link
                    href={detailHref}
                    prefetch={false}
                    className={foundationButtonClass({ size: "sm" })}
                    onClick={onOpenDetail}
                >
                    {t("arcades.viewDetails")}
                </Link>
                {onShowOnMap ? (
                    <button
                        type="button"
                        className={foundationButtonClass({
                            variant: "secondary",
                            size: "sm",
                        })}
                        onClick={() => onShowOnMap(arcade.id)}
                    >
                        {t("arcades.showOnMap")}
                    </button>
                ) : null}
                {directions ? (
                    <a
                        className={foundationButtonClass({
                            variant: "secondary",
                            size: "sm",
                        })}
                        href={directions}
                        aria-label={`${t("arcades.directions")} · ${t("shell.externalLink")}`}
                    >
                        <Navigation className="nl-icon-small" aria-hidden />
                        {t("arcades.directions")}
                    </a>
                ) : null}
            </div>
        </div>
    );
}

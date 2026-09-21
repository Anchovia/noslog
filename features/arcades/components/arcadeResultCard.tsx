"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown, MapPin } from "lucide-react";
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
    arcadeOpenState,
    arcadeScheduleHint,
    arcadeTodayHours,
    formatArcadePrice,
    formatArcadeClose,
    formatArcadeTime,
} from "@/features/arcades/arcadeDiscovery";
import {
    cabinetLabel,
    cabinetState,
    CabinetStateText,
} from "./arcadeCabinetRow";

const DISCOVERY_KEYS = [
    "q",
    "region",
    "open",
    "available",
    "sort",
    "near",
] as const;

/**
 * 기체 한 줄 — 「기체 2대 · 주의 1대」. 가동 대수는 전체와 다를 때만(「기체 2대 · 가동 1대」) — 같으면 같은 말의 반복이다.
 * 정보가 없으면 「기체 정보 없음 · 제보하기」
 */
function ArcadeCabinetLine({ arcade }: { arcade: PublicArcade }) {
    const t = useTranslations();
    const summary = arcadeCabinetSummary(arcade);
    if (!summary.total)
        return (
            <>
                {t("arcades.noCabinetInfo")}
                <span className="nl-muted"> · {t("arcades.reportInfo")}</span>
            </>
        );
    // 대수만 — 가동·주의·미확인은 카드를 펼치면 기체마다 색 점과 상태로 보인다
    return <>{t("arcades.cabinetTotal", { count: summary.total })}</>;
}

/**
 * 영업 상태 한 줄 — 「영업 중 · 23:00까지」. 점도 영업 상태를 뜻한다.
 * 영업시간을 모르면 「미확인」 한 단어 — 옆 정보가 오락실이라 무엇이 미확인인지는 읽힌다(스크린 리더에는 「영업시간」 을 붙인다).
 * 확인 신선도(「N일 전 확인」)는 목록에서 뺐다 — 기체 줄마다 상세에 있다
 */
function ArcadeOpenLine({ arcade, now }: { arcade: PublicArcade; now: Date }) {
    const t = useTranslations();
    const open = arcadeOpenState(arcade, now);
    const hint = arcadeScheduleHint(arcade, now);
    const rest = [
        hint
            ? hint.kind === "closes"
                ? t("arcades.closesAt", { time: hint.time })
                : t("arcades.opensAt", { time: hint.time })
            : null,
    ].filter(Boolean);
    return (
        <>
            <span
                className="nl-arcade-result__dot"
                data-open={open}
                aria-hidden
            />
            <span>
                {open === "unknown" ? (
                    <span className="sr-only">{t("arcades.hours")} </span>
                ) : null}
                {t(
                    open === "open"
                        ? "arcades.open"
                        : open === "closed"
                          ? "arcades.closed"
                          : "arcades.unknown"
                )}
                {rest.length ? ` · ${rest.join(" · ")}` : ""}
            </span>
        </>
    );
}

/**
 * 결과 카드 — 누르면 상세로 가지 않고 아래로 펼쳐진다(지도는 페이지가 그 핀으로 옮긴다).
 * 펼친 칸에는 카드에 없는 것만: 주소 · 오늘 영업시간 · 요금 · 기체별 한 줄 + 자세히 보기·지도에서 보기·길찾기.
 * 상세로 가는 길은 「자세히 보기」 링크 하나 — 카카오맵 목록의 「상세보기」 와 같은 역할.
 */
export default function ArcadeResultCard({
    arcade,
    distance,
    now,
    eagerPhoto = false,
    selected,
    expanded,
    onSelect,
    onToggle,
    onShowOnMap,
}: {
    arcade: PublicArcade;
    distance: number | null;
    now: Date;
    eagerPhoto?: boolean;
    selected: boolean;
    expanded: boolean;
    onSelect: (id: number) => void;
    onToggle: (id: number) => void;
    /** 지도가 시트에 가려질 수 있는 폭에서만 넘긴다 — 없으면 버튼을 그리지 않는다 */
    onShowOnMap?: (id: number) => void;
}) {
    const t = useTranslations();
    const locale = useLocale();
    const href = useLocalizedHref();
    const panelId = useId();
    const photo = arcade.photos[0];
    const [failedPhoto, setFailedPhoto] = useState<string | null>(null);
    const saveQuery = useArcadeSession((state) => state.setDiscoveryQuery);
    const summary = (
        <>
            <span className="nl-arcade-result__photo" aria-hidden>
                {photo && failedPhoto !== photo.url ? (
                    <Image
                        src={photo.url}
                        width={64}
                        height={64}
                        alt=""
                        loading={eagerPhoto ? "eager" : "lazy"}
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
                    <ArcadeOpenLine arcade={arcade} now={now} />
                </span>
            </span>
        </>
    );
    return (
        <div
            className="nl-arcade-result"
            data-selected={selected || undefined}
            data-expanded={expanded || undefined}
            data-arcade-id={arcade.id}
            onPointerEnter={() => onSelect(arcade.id)}
        >
            <button
                type="button"
                className="nl-arcade-result__summary"
                aria-expanded={expanded}
                aria-controls={panelId}
                onFocus={() => onSelect(arcade.id)}
                onClick={() => onToggle(arcade.id)}
            >
                {summary}
                <ChevronDown
                    className="nl-icon nl-arcade-result__chevron nl-disclosure__chevron"
                    aria-hidden
                />
            </button>
            {expanded ? (
                <ArcadeResultMore
                    id={panelId}
                    arcade={arcade}
                    now={now}
                    locale={locale}
                    detailHref={href(`/gamecenter/${arcade.slug}`)}
                    onShowOnMap={onShowOnMap}
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
                                ? `${formatArcadeTime(today.open)}–${formatArcadeClose(today.close)}`
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
                            {/* 상세 기체 줄과 같은 상태 표시 — 색 점 + 글자 */}
                            <span
                                className="nl-arcade-result__machine-state nl-arcade-cabinet__state"
                                data-state={cabinetState(cabinet)}
                            >
                                <span
                                    className="nl-arcade-cabinet__dot"
                                    aria-hidden
                                />
                                <CabinetStateText cabinet={cabinet} />
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
                    className={foundationButtonClass()}
                    onClick={onOpenDetail}
                >
                    {t("arcades.viewDetails")}
                </Link>
                {onShowOnMap ? (
                    <button
                        type="button"
                        className={foundationButtonClass({
                            variant: "secondary",
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
                        })}
                        href={directions}
                        aria-label={`${t("arcades.directions")} · ${t("shell.externalLink")}`}
                    >
                        {t("arcades.directions")}
                    </a>
                ) : null}
            </div>
        </div>
    );
}

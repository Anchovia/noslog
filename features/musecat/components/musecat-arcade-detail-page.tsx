"use client";

import {
    AtSign,
    ChevronDown,
    Clock,
    Copy,
    ExternalLink,
    Globe,
    Heart,
    MapPin,
    Pencil,
    Phone,
} from "lucide-react";
import { useEffect, useId, useState, useTransition } from "react";
import { toast } from "sonner";

import { setMusecatFavorite } from "@/app/(site)/gamecenter/musecat-actions";
import {
    type MessageKey,
    useLocale,
    useLocalizedHref,
    useTranslations,
} from "@/components/i18n/locale-provider";
import PageContainer from "@/components/layout/page-container";
import ActionButton from "@/components/ui/action-button";
import BackLink from "@/components/ui/back-link";
import Button from "@/components/ui/button";
import ButtonLink from "@/components/ui/button-link";
import IconRow, { IconRows } from "@/components/ui/icon-row";
import {
    arcadeOpenState,
    arcadeScheduleHint,
    arcadeTodayHours,
    formatArcadeClose,
    formatArcadeTime,
} from "@/features/arcades/arcade-discovery";
import ArcadeDiscoveryMap from "@/features/arcades/components/arcade-discovery-map";
import ArcadeHours from "@/features/arcades/components/arcade-hours";
import ArcadePhotos from "@/features/arcades/components/arcade-photos";
import LazyLocationMap from "@/features/arcades/components/lazy-location-map";
import { useArcadeSession } from "@/features/arcades/hooks/use-arcade-session";
import type { MusecatArcade } from "@/features/musecat/musecat-arcade";
import { normalizeArcadeBusinessHours } from "@/lib/arcade-details";

import {
    type MusecatAction,
    MusecatConnectPrompt,
    musecatErrorKey,
    MusecatGameEditDialog,
    type MusecatLinks,
} from "./musecat-dialogs";
import MusecatDirections from "./musecat-directions";
import MusecatGameCard from "./musecat-game-card";

export interface MusecatDetailViewer {
    loggedIn: boolean;
    connected: boolean;
    needsReconnect: boolean;
    username: string | null;
}

const SOCIAL_TYPES = new Set([
    "website",
    "x",
    "instagram",
    "youtube",
    "naver",
    "kakao",
]);
const FACILITY_KEYS = new Set([
    "parking",
    "basket",
    "restroom",
    "air_conditioner",
    "free_wifi",
    "locker",
    "smoking_room",
    "card_sales",
    "gloves",
]);

/** 처음 보이는 게임 수 — 그 뒤는 「게임 더보기」(2026-10-23 게임 목록 시안 — 실측 중앙값 4) */
const GAMES_SHOWN = 4;

/**
 * 뮤즈캣 오락실 상세(연동 A, 2026-10-21 전면 대조 ① 2판 — Google 지도 · 카카오맵 · 네이버 장소 화면).
 * 뒤로 · 이름 · 지역 · 게임 수 · 영업 상태 → 사진 줄(2026-10-22 네이버 지도 순서) → 정보 줄(주소 · 오늘 영업시간 · 소셜 · 전화) ─ 게임(NOSTALGIA 카드 · 다른 게임 줄) ─
 * 공지 · 메모 ─ 시설(있는 것만 태그) ─ 위치 지도. 하단 바 = 길찾기 · 즐겨찾기 · 고치기(그대로).
 * 구역 칩 줄은 두지 않는다. 내용이 없는 구역은 뺀다. 값은 모두 토큰 · 공용 부품(IconRow · SurfaceCard · StatusDot)
 */
export default function MusecatArcadeDetailPage({
    data,
    viewer,
    favorite,
    appKey,
}: {
    data: MusecatArcade;
    viewer: MusecatDetailViewer;
    favorite: boolean;
    appKey: string;
}) {
    const t = useTranslations();
    const locale = useLocale();
    const href = useLocalizedHref();
    const { arcade } = data;
    const weeklyId = useId();
    const [mapFailed, setMapFailed] = useState(false);
    const discoveryQuery = useArcadeSession((state) => state.discoveryQuery);
    const [now, setNow] = useState(() => new Date());
    const [weeklyOpen, setWeeklyOpen] = useState(false);
    const [prompt, setPrompt] = useState<MusecatAction | null>(null);
    const [editing, setEditing] = useState(false);
    const [favorited, setFavorited] = useState(favorite);
    const [noticeOpen, setNoticeOpen] = useState<string[]>([]);
    const [busy, startTransition] = useTransition();
    useEffect(() => {
        const timer = window.setInterval(() => setNow(new Date()), 60_000);
        return () => window.clearInterval(timer);
    }, []);

    const pagePath = href(`/gamecenter/${arcade.slug}`);
    const links: MusecatLinks = {
        loggedIn: viewer.loggedIn,
        loginHref: `${href("/login")}?returnTo=${encodeURIComponent(pagePath)}`,
        connectHref: `/api/musecat/connect?returnTo=${encodeURIComponent(pagePath)}`,
    };
    const shortDate = (iso: string) =>
        new Intl.DateTimeFormat(locale, {
            month: "long",
            day: "numeric",
        }).format(new Date(iso));
    const country =
        new Intl.DisplayNames([locale], { type: "region" }).of(
            arcade.countryCode
        ) ?? arcade.countryCode;
    const area = arcade.region ?? country;
    const nostalgia = data.games.filter((game) => game.nostalgia);
    // 모든 게임(뮤즈캣이 보내는 대로) — NOSTALGIA 를 앞에
    const games = [
        ...nostalgia,
        ...data.games.filter((game) => !game.nostalgia),
    ];
    const [allGames, setAllGames] = useState(false);
    const editable = nostalgia[0] ?? null;
    const hasHours = Boolean(
        arcade.hours || normalizeArcadeBusinessHours(arcade.legacyHours)
    );
    const open = data.closed ? "unknown" : arcadeOpenState(arcade, now);
    const hint = open === "unknown" ? null : arcadeScheduleHint(arcade, now);
    const today = arcadeTodayHours(arcade, now);
    // 영업 상태 글 — 「영업 종료 · 10:00에 영업 시작」(네이버 지도 · 카카오맵 장소 화면 그대로, 상태만 굵게 · 점 없음)
    const statusLine =
        open === "unknown" ? null : (
            <>
                <span className="nl-emphasis-label">
                    {t(open === "open" ? "arcades.open" : "arcades.closed")}
                </span>
                {hint ? (
                    <span className="nl-body-secondary nl-muted">
                        {" · "}
                        {t(
                            hint.kind === "closes"
                                ? "musecat.list.closesAt"
                                : "musecat.list.opensAt",
                            { time: hint.time }
                        )}
                    </span>
                ) : null}
            </>
        );
    const hasLocation =
        Boolean(appKey) &&
        !mapFailed &&
        arcade.latitude !== null &&
        arcade.longitude !== null;
    const facilityGroups = (["interior", "equipment"] as const)
        .map((group) => ({
            group,
            present: data.facilities[group].filter(
                (facility) => facility.state === "yes"
            ),
        }))
        .filter(({ present }) => present.length);
    const facilityName = (key: string) =>
        FACILITY_KEYS.has(key)
            ? t(`musecat.facility.${key}` as MessageKey)
            : key;
    const timeZoneName =
        new Intl.DateTimeFormat(locale, {
            timeZone: arcade.timeZone,
            timeZoneName: "long",
        })
            .formatToParts(now)
            .find((part) => part.type === "timeZoneName")?.value ??
        arcade.timeZone;
    const telephone = arcade.phone?.replace(/[^+\d]/g, "");
    const transit = [data.subwayLines.join(" · "), data.direction]
        .filter(Boolean)
        .join(" · ");

    function requireConnection(action: MusecatAction) {
        if (viewer.connected) return true;
        setPrompt(action);
        return false;
    }
    function toggleFavorite() {
        if (!requireConnection("favorite")) return;
        const next = !favorited;
        setFavorited(next);
        startTransition(async () => {
            const result = await setMusecatFavorite({
                slug: arcade.slug,
                arcade: data.musecatId,
                favorited: next,
            }).catch(() => ({ ok: false as const, error: "failed" as const }));
            if (!result.ok) {
                setFavorited(!next);
                toast.error(t(musecatErrorKey(result.error)));
            }
        });
    }
    async function copy(value: string) {
        try {
            await navigator.clipboard.writeText(value);
            toast.success(t("musecat.copied"));
        } catch {
            toast.error(t("arcades.copyFailed"));
        }
    }
    const external = (
        <span className="sr-only"> · {t("shell.externalLink")}</span>
    );

    const actions = (
        <div className="nl-arcade-detail__actions">
            <MusecatDirections
                arcade={arcade}
                closed={data.closed}
                className="nl-arcade-detail__directions"
            />
            <ActionButton
                variant="secondary"
                size="icon"
                className="nl-arcade-detail__prefer"
                aria-pressed={viewer.connected ? favorited : undefined}
                aria-label={t("musecat.favorite")}
                title={t("musecat.favorite")}
                data-active={favorited || undefined}
                disabled={busy}
                onClick={toggleFavorite}
            >
                <Heart className="nl-icon" aria-hidden />
            </ActionButton>
            {editable && !data.closed ? (
                <Button
                    variant="secondary"
                    size="icon"
                    aria-label={t("musecat.edit.title")}
                    title={t("musecat.edit.title")}
                    onClick={() => {
                        if (requireConnection("edit")) setEditing(true);
                    }}
                >
                    <Pencil className="nl-icon" aria-hidden />
                </Button>
            ) : null}
        </div>
    );

    return (
        <PageContainer className="nl-arcade-detail">
            <div className="nl-arcade-detail__layout">
                <div className="nl-arcade-detail__main">
                    {/* 머리 — 뒤로 → 이름 → 지역 · 게임 수 → 영업 상태 → 사진 줄(네이버 지도 장소 화면 순서, 사용자 2026-10-22) */}
                    <div className="nl-musecat-head">
                        <BackLink
                            href={href(
                                `/gamecenter${discoveryQuery ? `?${discoveryQuery}` : ""}`
                            )}
                        >
                            {t("arcades.title")}
                        </BackLink>
                        {data.closed ? (
                            <span className="nl-musecat-status">
                                <span
                                    className="nl-tag nl-tag--status"
                                    data-tone="danger"
                                >
                                    {t("musecat.closedTag")}
                                </span>
                            </span>
                        ) : null}
                        <h1
                            className="nl-page-title"
                            lang={arcade.nativeLanguage ?? undefined}
                        >
                            {arcade.name}
                        </h1>
                        <p className="nl-body-secondary nl-muted">
                            {[
                                area,
                                data.games.length
                                    ? t("musecat.gameKinds", {
                                          count: data.games.length,
                                      })
                                    : null,
                            ]
                                .filter(Boolean)
                                .join(" · ")}
                        </p>
                        {statusLine ? <p>{statusLine}</p> : null}
                        {data.closed ? (
                            <p className="nl-body-secondary nl-muted">
                                {t("musecat.closedBody")}
                            </p>
                        ) : null}
                        {/* 사진 줄 — 제목 · 상태 아래(네이버 지도 장소 화면 순서, 사용자 2026-10-22) */}
                        <ArcadePhotos
                            strip
                            photos={arcade.photos}
                            credits={Object.fromEntries(
                                arcade.photos.flatMap((photo, index) => {
                                    const credit = data.photoCredits[index];
                                    return credit
                                        ? [
                                              [
                                                  photo.id,
                                                  credit.takenAt
                                                      ? `${credit.author} · ${shortDate(credit.takenAt)}`
                                                      : credit.author,
                                              ],
                                          ]
                                        : [];
                                })
                            )}
                        />
                    </div>

                    <div className="nl-musecat-body">
                        {/* 정보 줄 — 주소(노선) · 오늘 영업시간(펼치면 요일별) · 소셜 · 전화. 구역 제목은 화면 읽기에만 */}
                        <section className="nl-musecat-section">
                            <h2 className="sr-only">
                                {t("musecat.section.basic")}
                            </h2>
                            <IconRows>
                                <IconRow
                                    icon={MapPin}
                                    detail={
                                        transit || data.nicknames.length ? (
                                            <>
                                                {transit}
                                                {data.nicknames.length ? (
                                                    <span className="nl-metadata nl-muted nl-musecat-block">
                                                        {data.nicknames
                                                            .map(
                                                                (name) =>
                                                                    `#${name}`
                                                            )
                                                            .join(" ")}
                                                    </span>
                                                ) : null}
                                            </>
                                        ) : undefined
                                    }
                                    action={
                                        arcade.address ? (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                aria-label={`${arcade.address} · ${t("arcades.copyAddress")}`}
                                                onClick={() =>
                                                    copy(arcade.address!)
                                                }
                                            >
                                                <Copy
                                                    className="nl-icon-small"
                                                    aria-hidden
                                                />
                                                {t("musecat.copy")}
                                            </Button>
                                        ) : undefined
                                    }
                                >
                                    {arcade.address ??
                                        t("arcades.addressPending")}
                                </IconRow>
                                {hasHours ? (
                                    <IconRow
                                        icon={Clock}
                                        action={
                                            <Button
                                                variant="ghost"
                                                size="icon-sm"
                                                aria-label={t(
                                                    "musecat.hours.weekly"
                                                )}
                                                aria-expanded={weeklyOpen}
                                                aria-controls={weeklyId}
                                                onClick={() =>
                                                    setWeeklyOpen(
                                                        (value) => !value
                                                    )
                                                }
                                            >
                                                <ChevronDown
                                                    className="nl-icon nl-disclosure__chevron"
                                                    aria-hidden
                                                />
                                            </Button>
                                        }
                                        detail={
                                            <div
                                                id={weeklyId}
                                                hidden={!weeklyOpen}
                                                className="nl-musecat-weekly"
                                            >
                                                <ArcadeHours
                                                    arcade={arcade}
                                                    now={now}
                                                />
                                                <p className="nl-metadata nl-muted">
                                                    {t(
                                                        "musecat.hours.localTime",
                                                        { zone: timeZoneName }
                                                    )}
                                                </p>
                                            </div>
                                        }
                                    >
                                        {statusLine ??
                                            (today === null
                                                ? t("arcades.closedToday")
                                                : today
                                                  ? `${t("arcades.today")} ${formatArcadeTime(today.open)}–${formatArcadeClose(today.close)}`
                                                  : t("musecat.hours.weekly"))}
                                    </IconRow>
                                ) : null}
                                {data.social.map((social) => {
                                    const name = SOCIAL_TYPES.has(social.type)
                                        ? t(
                                              `musecat.social.${social.type}` as MessageKey
                                          )
                                        : social.type;
                                    const shown = social.name.replace(
                                        /^https?:\/\//,
                                        ""
                                    );
                                    return (
                                        <IconRow
                                            key={`${social.type}-${social.name}`}
                                            icon={
                                                social.type === "website"
                                                    ? Globe
                                                    : AtSign
                                            }
                                            action={
                                                social.link ? (
                                                    <ButtonLink
                                                        plain
                                                        variant="ghost"
                                                        size="icon-sm"
                                                        href={social.link}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        aria-label={`${name} · ${shown} · ${t("shell.externalLink")}`}
                                                    >
                                                        <ExternalLink
                                                            className="nl-icon-small"
                                                            aria-hidden
                                                        />
                                                    </ButtonLink>
                                                ) : undefined
                                            }
                                        >
                                            <span className="sr-only">
                                                {name} ·{" "}
                                            </span>
                                            {shown}
                                        </IconRow>
                                    );
                                })}
                                {arcade.phone ? (
                                    <IconRow
                                        icon={Phone}
                                        action={
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                aria-label={`${arcade.phone} · ${t("musecat.copy")}`}
                                                onClick={() =>
                                                    copy(arcade.phone!)
                                                }
                                            >
                                                <Copy
                                                    className="nl-icon-small"
                                                    aria-hidden
                                                />
                                                {t("musecat.copy")}
                                            </Button>
                                        }
                                    >
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
                                    </IconRow>
                                ) : null}
                            </IconRows>
                        </section>

                        {data.games.length ? (
                            <>
                                <hr className="nl-musecat-rule" />
                                <section className="nl-musecat-section">
                                    <h2 className="nl-section-title">
                                        {t("musecat.section.games")}
                                    </h2>
                                    <ul className="nl-musecat-games">
                                        {games
                                            .slice(
                                                0,
                                                allGames
                                                    ? games.length
                                                    : GAMES_SHOWN
                                            )
                                            .map((game) => (
                                                <MusecatGameCard
                                                    key={game.id}
                                                    data={data}
                                                    game={game}
                                                    viewer={{
                                                        connected:
                                                            viewer.connected,
                                                        username:
                                                            viewer.username,
                                                        requireConnection,
                                                    }}
                                                />
                                            ))}
                                    </ul>
                                    {/* 4개 뒤 폭 가득 「게임 더보기 (n)」(다이닝코드 · Airbnb · ev.or.kr — 남은 수를 버튼에) */}
                                    {!allGames && games.length > GAMES_SHOWN ? (
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            className="nl-musecat-games__more"
                                            onClick={() => setAllGames(true)}
                                        >
                                            {t("musecat.game.showMore", {
                                                count:
                                                    games.length - GAMES_SHOWN,
                                            })}
                                            <ChevronDown
                                                className="nl-icon-small"
                                                aria-hidden
                                            />
                                        </Button>
                                    ) : null}
                                    {/* 연결 안내 — 카드 대신 한 줄 + 보조 버튼(2026-10-21 전면 대조 ①) */}
                                    {!viewer.connected && !data.closed ? (
                                        <div className="nl-heading-row">
                                            <p className="nl-body-secondary nl-muted">
                                                {t("musecat.guest.title")}
                                            </p>
                                            {viewer.loggedIn ? (
                                                <ButtonLink
                                                    plain
                                                    size="sm"
                                                    variant="secondary"
                                                    className="nl-heading-row__end"
                                                    href={links.connectHref}
                                                >
                                                    {t(
                                                        viewer.needsReconnect
                                                            ? "partner.status.reconnect"
                                                            : "partner.settings.connect"
                                                    )}
                                                </ButtonLink>
                                            ) : (
                                                <ButtonLink
                                                    size="sm"
                                                    variant="secondary"
                                                    className="nl-heading-row__end"
                                                    href={links.loginHref}
                                                >
                                                    {t("common.login")}
                                                </ButtonLink>
                                            )}
                                        </div>
                                    ) : null}
                                </section>
                            </>
                        ) : null}

                        {data.notices.length ? (
                            <>
                                <hr className="nl-musecat-rule" />
                                <section className="nl-musecat-section">
                                    <h2 className="nl-section-title">
                                        {t("musecat.section.notice")}
                                    </h2>
                                    <ul className="nl-musecat-lines">
                                        {data.notices.map((notice) => {
                                            const expanded =
                                                noticeOpen.includes(notice.id);
                                            return (
                                                <li key={notice.id}>
                                                    <button
                                                        type="button"
                                                        className="nl-musecat-line nl-hover-layer"
                                                        aria-expanded={expanded}
                                                        onClick={() =>
                                                            setNoticeOpen(
                                                                (current) =>
                                                                    expanded
                                                                        ? current.filter(
                                                                              (
                                                                                  id
                                                                              ) =>
                                                                                  id !==
                                                                                  notice.id
                                                                          )
                                                                        : [
                                                                              ...current,
                                                                              notice.id,
                                                                          ]
                                                            )
                                                        }
                                                    >
                                                        <span className="nl-musecat-line__copy">
                                                            <span
                                                                className={
                                                                    expanded
                                                                        ? "nl-body nl-musecat-pre"
                                                                        : "nl-body nl-musecat-clamp"
                                                                }
                                                            >
                                                                {notice.body}
                                                            </span>
                                                            <span className="nl-metadata nl-muted">
                                                                {[
                                                                    shortDate(
                                                                        notice.createdAt
                                                                    ),
                                                                    t(
                                                                        `musecat.noticeKind.${notice.kind}`
                                                                    ),
                                                                    notice.author,
                                                                ]
                                                                    .filter(
                                                                        Boolean
                                                                    )
                                                                    .join(
                                                                        " · "
                                                                    )}
                                                            </span>
                                                        </span>
                                                        <ChevronDown
                                                            className="nl-icon-small nl-disclosure__chevron"
                                                            aria-hidden
                                                        />
                                                    </button>
                                                    {expanded && notice.link ? (
                                                        <a
                                                            className="nl-heading-link nl-control nl-musecat-notice-link"
                                                            href={notice.link}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                        >
                                                            {t(
                                                                "musecat.notice.homepage"
                                                            )}
                                                            <ExternalLink
                                                                className="nl-icon-small"
                                                                aria-hidden
                                                            />
                                                            {external}
                                                        </a>
                                                    ) : null}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </section>
                            </>
                        ) : null}

                        {data.memo ? (
                            <>
                                <hr className="nl-musecat-rule" />
                                <section className="nl-musecat-section">
                                    <h2 className="nl-section-title">
                                        {t("musecat.section.memo")}
                                    </h2>
                                    <p className="nl-body nl-musecat-pre">
                                        {data.memo}
                                    </p>
                                </section>
                            </>
                        ) : null}

                        {/* 시설 — 있는 것만 태그, 모르는 것은 수와 「뮤즈캣에서 고치기」(2026-10-21 전면 대조 ①) */}
                        {facilityGroups.length ? (
                            <>
                                <hr className="nl-musecat-rule" />
                                <section className="nl-musecat-section">
                                    <h2 className="nl-section-title">
                                        {t("musecat.section.facilities")}
                                    </h2>
                                    {facilityGroups.map(
                                        ({ group, present }) => (
                                            <div
                                                key={group}
                                                className="nl-musecat-facility-group"
                                            >
                                                <p className="nl-metadata nl-muted">
                                                    {t(
                                                        `musecat.facilities.${group}`
                                                    )}
                                                </p>
                                                <div className="nl-musecat-tags">
                                                    {present.map((facility) => (
                                                        <span
                                                            key={facility.key}
                                                            className="nl-tag"
                                                        >
                                                            {facilityName(
                                                                facility.key
                                                            )}
                                                            {facility.note
                                                                ? ` · ${facility.note}`
                                                                : null}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )
                                    )}
                                </section>
                            </>
                        ) : null}

                        {/* 위치 지도(못 띄우면 구역 없음) */}
                        {hasLocation ? (
                            <>
                                <hr className="nl-musecat-rule" />
                                <section className="nl-musecat-section">
                                    <h2 className="sr-only">
                                        {t("musecat.section.location")}
                                    </h2>
                                    <div className="nl-arcade-detail__map">
                                        <LazyLocationMap>
                                            <ArcadeDiscoveryMap
                                                appKey={appKey}
                                                arcades={[arcade]}
                                                selectedId={null}
                                                onSelect={() => {}}
                                                focusLevel={4}
                                                onStateChange={(state) => {
                                                    if (state === "error")
                                                        setMapFailed(true);
                                                }}
                                            />
                                        </LazyLocationMap>
                                    </div>
                                </section>
                            </>
                        ) : null}
                    </div>
                </div>

                <aside className="nl-arcade-detail__rail nl-arcade-detail__rail-only">
                    <div className="nl-arcade-detail__rail-box">{actions}</div>
                </aside>
            </div>
            <div className="nl-arcade-detail__bar">{actions}</div>

            <MusecatConnectPrompt
                open={prompt !== null}
                onOpenChange={(next) => {
                    if (!next) setPrompt(null);
                }}
                links={links}
                action={prompt ?? "favorite"}
            />
            {editable ? (
                <MusecatGameEditDialog
                    slug={arcade.slug}
                    game={editable}
                    currency={arcade.currencyCode}
                    musecatUrl={data.musecatUrl}
                    arcadeId={arcade.id}
                    cabinet={
                        arcade.cabinets.find(
                            (cabinet) =>
                                cabinet.featureNote ||
                                Object.values(cabinet.features).some(Boolean)
                        ) ??
                        arcade.cabinets[0] ??
                        null
                    }
                    open={editing}
                    onOpenChange={setEditing}
                />
            ) : null}
        </PageContainer>
    );
}

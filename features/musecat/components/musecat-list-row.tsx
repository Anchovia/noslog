"use client";

import { MapPin } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { useTranslations } from "@/components/i18n/locale-provider";
import IntentLink from "@/components/ui/intent-link";
import {
    arcadeOpenState,
    arcadeScheduleHint,
} from "@/features/arcades/arcade-discovery";
import type { PublicArcade } from "@/features/arcades/schemas/public-arcade-schema";

/** 썸네일 그림의 원본 크기 힌트(next/image) — 그리는 크기는 CSS(64 + 32) */
const THUMB_HINT = 96;

/**
 * 뮤즈캣 오락실 목록 줄(2026-10-22 목록 시안 안 A — 지도 · 장소 찾기 23곳 실측, 왼쪽 썸네일 = MapQuest · 올리브영 · 다이소 · 여기어때 · Trip.com · Booking).
 * 왼쪽 썸네일(사진이 없으면 회색 칸 + 핀 — MapQuest) → 이름 + 뮤즈캣 로고 + 거리(버거킹 · 다이소) →
 * 이름 오른쪽에 정보를 준 회사 로고 → 상태 태그(폐업 · 고장) 하나 + 대수 → 주소 → 영업 상태(「영업 중」 초록 · 「영업 종료」 빨강 + 시각 — Google · Yahoo · Bing)
 */
export default function MusecatListRow({
    arcade,
    href,
    distance,
    nostalgiaCount,
    openFlags,
    closed,
    selected,
    now,
}: {
    arcade: PublicArcade;
    href: string;
    distance: string | null;
    nostalgiaCount: number;
    openFlags: number;
    closed: boolean;
    selected: boolean;
    now: Date;
}) {
    const t = useTranslations();
    const photo = arcade.photos[0];
    const [failed, setFailed] = useState(false);
    const state = closed ? "unknown" : arcadeOpenState(arcade, now);
    const hint = state === "unknown" ? null : arcadeScheduleHint(arcade, now);
    return (
        <IntentLink
            className="nl-musecat-result nl-hover-layer"
            data-arcade-id={arcade.id}
            data-selected={selected || undefined}
            href={href}
        >
            <span className="nl-musecat-result__thumb" aria-hidden>
                {photo && !failed ? (
                    <Image
                        src={photo.url}
                        width={THUMB_HINT}
                        height={THUMB_HINT}
                        alt=""
                        loading="lazy"
                        onError={() => setFailed(true)}
                    />
                ) : (
                    <MapPin className="nl-icon nl-icon--large" />
                )}
            </span>
            <span className="nl-musecat-result__copy">
                <span className="nl-musecat-result__name">
                    <span className="nl-entity-title">{arcade.name}</span>
                    <span
                        className="nl-musecat-logo nl-tag-label"
                        role="img"
                        aria-label={t("partner.settings.musecat")}
                    >
                        M
                    </span>
                    {distance ? (
                        <span className="nl-body-secondary nl-muted">
                            {distance}
                        </span>
                    ) : null}
                </span>
                {/* 한 줄에 태그 하나 — 상태(폐업이 고장보다 먼저) 태그 하나 + 대수는 메타 글자 */}
                <span className="nl-musecat-result__source">
                    {closed || openFlags ? (
                        <span
                            className="nl-tag nl-tag--status"
                            data-tone="danger"
                        >
                            {closed
                                ? t("musecat.closedTag")
                                : t("musecat.fault.count", {
                                      count: openFlags,
                                  })}
                        </span>
                    ) : null}
                    <span className="nl-body-secondary nl-muted">
                        {t("musecat.list.nostalgiaCount", {
                            count: nostalgiaCount,
                        })}
                    </span>
                </span>
                <span className="nl-body-secondary nl-muted nl-musecat-result__address">
                    {arcade.address ?? arcade.region}
                </span>
                {state !== "unknown" ? (
                    <span className="nl-body-secondary nl-muted">
                        <span
                            className="nl-musecat-result__state"
                            data-open={state}
                        >
                            {t(
                                state === "open"
                                    ? "arcades.open"
                                    : "arcades.closed"
                            )}
                        </span>
                        {hint
                            ? ` · ${t(
                                  hint.kind === "closes"
                                      ? "musecat.list.closesAt"
                                      : "musecat.list.opensAt",
                                  { time: hint.time }
                              )}`
                            : null}
                    </span>
                ) : closed ? null : (
                    // 영업시간이 없으면 같은 자리에 흐린 글자 한 줄(사용자 2026-10-22 — 영업 종료 줄처럼)
                    <span className="nl-body-secondary nl-muted">
                        {t("musecat.list.hoursUnknown")}
                    </span>
                )}
            </span>
        </IntentLink>
    );
}

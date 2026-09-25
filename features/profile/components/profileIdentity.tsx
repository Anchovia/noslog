"use client";

import { Lock, MapPin, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
    useLocale,
    useLocalizedHref,
    useTranslations,
} from "@/components/i18n/localeProvider";
import Avatar from "@/components/ui/avatar";
import { foundationButtonClass } from "@/components/ui/Button";
import CountryMarker from "@/components/ui/countryMarker";
import DiscordIcon from "@/components/ui/DiscordIcon";
import ExamBadge from "@/components/ui/examBadge";
import ExamBadgeGroup from "@/components/ui/examBadgeGroup";
import { SegmentedControl } from "@/components/ui/segmentedControl";
import type { AchievementSummary } from "@/features/achievements/achievementDefinitions";
import AchievementShowcase from "@/features/achievements/components/achievementShowcase";
import { contributionLevel } from "@/features/contributions/contributionLevel";
import ProfileShareDialog from "@/features/profile/components/profileShareDialog";
import { formatProfileDate } from "@/components/profile/dashboard/profileUtils";
import { gradeBandTone, rankTone } from "@/lib/music/scoreTone";
import type { ProfileHeaderContext } from "@/features/profile/server/profileOverviewService";
import type { OwnerPrivateFields } from "@/features/profile/server/ownerPrivateService";
import type {
    ProfileMode,
    ProfileUser,
} from "@/components/profile/dashboard/profileTypes";

function initialForName(name: string | null, locale: string) {
    if (!name) return undefined;
    const graphemes = new Intl.Segmenter(locale, {
        granularity: "grapheme",
    }).segment(name);
    for (const { segment } of graphemes)
        if (/\p{L}/u.test(segment)) return segment.toLocaleUpperCase(locale);
    return undefined;
}

/** 정보 줄 값 — 공개면 기본 글자색, 본인에게만 보이는 값은 흐린 채로 두고 화면 읽기에 「나에게만 보입니다」 */
function MetaValue({
    item,
    onlyMe,
}: {
    item: { text: string; private: boolean };
    onlyMe: string;
}) {
    return (
        <span
            className="nl-profile-identity__value"
            data-private={item.private || undefined}
        >
            {item.text}
            {item.private ? <span className="sr-only"> ({onlyMe})</span> : null}
        </span>
    );
}

/**
 * 프로필 머리(2026-09-25 H3 · K2 · M2 · CM1) — 신원(아바타 · 이름 · 명판 · 라벨 · 업적 진열) · 정보 두 줄(2026-09-26 H1 —
 * 활동: 마지막 플레이 · (본인) 동기화, 계정: Discord · 오락실 · NOSTALGIA) · 모드 세그먼트 · 핵심 수치(공식 Grd 크게 + 세계 · 국가 · 레이팅).
 * 모드 이름 · 상위 % · 90일 변화는 두지 않는다(2026-09-26, 사용자 — 모드는 세그먼트가 말하고, 변화는 성장 추이에 있다).
 * 넓은 화면은 수치가 머리 오른쪽, 좁으면 메타 줄 아래로 쌓인다(폰은 세그먼트가 폭 전체). 점수 비공개면 모드 · 수치가 없다
 */
export default function ProfileIdentity({
    user,
    isOwner,
    sync,
    privateFields,
    showSyncAction = false,
    achievements,
    header,
}: {
    user: ProfileUser;
    isOwner: boolean;
    /** 본인에게만 — 공개 설정으로 숨긴 항목(자물쇠와 함께 보인다, 2026-09-26 P1) */
    privateFields?: OwnerPrivateFields | null;
    /** 본인에게만 — 마지막 동기화: 끝났으면 「N일 전」(값), 아니면 상태 문장 */
    sync?: { distance: string } | { message: string };
    showSyncAction?: boolean;
    /** 업적 요약 — 머리 진열(2026-09-24 P5 · B1) */
    achievements?: AchievementSummary | null;
    /** 모드별 레이팅. 점수 비공개면 null */
    header: ProfileHeaderContext | null;
}) {
    const locale = useLocale();
    const href = useLocalizedHref();
    const t = useTranslations();
    const params = useSearchParams();
    const pathname = usePathname();
    const mode: ProfileMode =
        params.get("mode") === "recital" ? "recital" : "basic";
    function selectMode(value: ProfileMode) {
        if (value === mode) return;
        const next = new URLSearchParams(params);
        if (value === "recital") next.set("mode", value);
        else next.delete("mode");
        const query = next.toString();
        window.history.pushState(
            null,
            "",
            query ? `${pathname}?${query}` : pathname
        );
    }
    const hasGrades = Boolean(
        header && ((user.grade_basic ?? 0) > 0 || (user.grade_recital ?? 0) > 0)
    );
    const grade = mode === "basic" ? user.grade_basic : user.grade_recital;
    const rank = mode === "basic" ? user.rank_basic : user.rank_recital;
    const countryRank =
        mode === "basic" ? user.rank_basic_country : user.rank_recital_country;
    const modeLabel = mode === "basic" ? "Basic" : "Recital";
    const name = user.username || t("common.unnamedUser");
    const discord = user.hide_discord_name
        ? ""
        : [
              user.discord_name,
              user.discord_username ? `@${user.discord_username}` : "",
          ]
              .filter(Boolean)
              .join(" ");
    const hasExam = [user.exam_basic, user.exam_recital].some(
        (exam) => exam !== null && exam >= 1 && exam <= 10
    );
    // 공개 값이 있으면 그대로, 본인에게는 숨긴 값도 비공개 표시로(2026-09-26 P1)
    const pick = (value: string | null | undefined, hidden?: string | null) =>
        value
            ? { text: value, private: false }
            : hidden
              ? { text: hidden, private: true }
              : null;
    const onlyMe = t("profile.onlyMe");
    const lastPlayedValue = pick(
        user.last_played_at
            ? formatProfileDate(user.last_played_at, locale)
            : null,
        privateFields?.lastPlayedAt
            ? formatProfileDate(privateFields.lastPlayedAt, locale)
            : null
    );
    const nostalgia = pick(
        !user.hide_nostalgia_name ? user.nostalgia_name : null,
        privateFields?.nostalgiaName
    );
    const discordValue = pick(discord, privateFields?.discord);
    const arcade = pick(user.preferredArcade?.name, privateFields?.arcade);
    return (
        <section className="nl-profile-identity" aria-labelledby="profile-name">
            <div className="nl-profile-identity__row">
                <Avatar
                    src={user.avatar}
                    alt={t("common.profileImage", { name })}
                    size={108}
                    loading="eager"
                    style={{
                        width: "var(--nl-profile-avatar-size)",
                        height: "var(--nl-profile-avatar-size)",
                    }}
                    fallbackInitial={initialForName(user.username, locale)}
                    className="nl-profile-identity__avatar"
                />
                <div className="nl-profile-identity__name-stack">
                    <div className="nl-profile-identity__name">
                        <h1
                            id="profile-name"
                            className="nl-page-title"
                            title={name}
                        >
                            {name}
                        </h1>
                        <CountryMarker country={user.country} />
                        {/* 공유 · 설정은 이름 줄에만 붙는다(2026-09-25) — 아래 명판 · 배지 줄이 머리 폭 끝까지 가게 */}
                        {isOwner ? (
                            <div className="nl-profile-identity__actions">
                                <ProfileShareDialog
                                    user={user}
                                    mode={mode}
                                    triggerClassName="nl-profile-owner-action"
                                />
                                <Link
                                    href={href("/settings")}
                                    aria-label={t("profile.settings")}
                                    className="nl-profile-owner-action"
                                >
                                    <Settings aria-hidden />
                                </Link>
                            </div>
                        ) : null}
                    </div>
                    <ExamBadgeGroup className="nl-profile-identity__exams">
                        {hasExam ? (
                            <>
                                <ExamBadge
                                    mode="basic"
                                    exam={user.exam_basic}
                                />
                                <ExamBadge
                                    mode="recital"
                                    exam={user.exam_recital}
                                />
                            </>
                        ) : (
                            <span className="nl-exam-badge" data-tier="none">
                                {t("rankings.examNone")}
                            </span>
                        )}
                        {/* 기여 라벨(2026-09-24 P1) — 프로필에서는 Lv.1 부터, 누르면 아래 「기여」 구역으로 */}
                        {user.role === "admin" ? (
                            <a href="#profile-contribution" className="nl-tag">
                                {t("contribution.label.operator")}
                            </a>
                        ) : contributionLevel(user.contribution?.points ?? 0)
                              .level ? (
                            <a href="#profile-contribution" className="nl-tag">
                                <span className="nl-contribution-label__prefix">
                                    {t("contribution.label.prefix")}
                                </span>
                                Lv.
                                {
                                    contributionLevel(
                                        user.contribution?.points ?? 0
                                    ).level
                                }
                            </a>
                        ) : null}
                        {/* 업적 진열(2026-09-24 B1) — 명판 · 라벨 뒤에 이어서. 명판 줄이기 폭 계산에는 넣지 않는다(넘치면 다음 줄) */}
                        {achievements ? (
                            <AchievementShowcase
                                userId={user.id}
                                summary={achievements}
                                isOwner={isOwner}
                            />
                        ) : null}
                    </ExamBadgeGroup>
                </div>
                {/* 정보 두 줄(2026-09-26 H1, osu! 정보 칸) — 활동 줄(아이콘 없이 라벨 + 값) · 계정 줄(링크 성격만 아이콘).
                    본인에게는 숨긴 항목도 보이고, 원래 아이콘 대신 자물쇠 + 흐린 값(2026-09-26 P1) */}
                {nostalgia ||
                discordValue ||
                arcade ||
                lastPlayedValue ||
                (isOwner && sync) ? (
                    <div className="nl-profile-identity__meta nl-metadata nl-muted">
                        {lastPlayedValue || (isOwner && sync) ? (
                            <p className="nl-profile-identity__line">
                                {lastPlayedValue ? (
                                    <span
                                        title={
                                            lastPlayedValue.private
                                                ? onlyMe
                                                : undefined
                                        }
                                    >
                                        {lastPlayedValue.private ? (
                                            <Lock aria-hidden />
                                        ) : null}
                                        {t("profile.meta.lastPlayed")}{" "}
                                        <MetaValue
                                            item={lastPlayedValue}
                                            onlyMe={onlyMe}
                                        />
                                    </span>
                                ) : null}
                                {isOwner && sync ? (
                                    "distance" in sync ? (
                                        <span>
                                            {t("profile.meta.synced")}{" "}
                                            <span className="nl-profile-identity__value">
                                                {sync.distance}
                                            </span>
                                        </span>
                                    ) : (
                                        <span>{sync.message}</span>
                                    )
                                ) : null}
                            </p>
                        ) : null}
                        {discordValue || arcade || nostalgia ? (
                            <ul className="nl-profile-identity__line">
                                {discordValue ? (
                                    <li
                                        title={
                                            discordValue.private
                                                ? onlyMe
                                                : discordValue.text
                                        }
                                    >
                                        {discordValue.private ? (
                                            <Lock aria-hidden />
                                        ) : (
                                            <DiscordIcon />
                                        )}
                                        <span className="sr-only">
                                            Discord{" "}
                                        </span>
                                        <MetaValue
                                            item={discordValue}
                                            onlyMe={onlyMe}
                                        />
                                    </li>
                                ) : null}
                                {arcade ? (
                                    <li
                                        title={
                                            arcade.private
                                                ? onlyMe
                                                : arcade.text
                                        }
                                    >
                                        {arcade.private ? (
                                            <Lock aria-hidden />
                                        ) : (
                                            <MapPin aria-hidden />
                                        )}
                                        <span className="sr-only">
                                            {t("settings.preferredArcade")}{" "}
                                        </span>
                                        <MetaValue
                                            item={arcade}
                                            onlyMe={onlyMe}
                                        />
                                    </li>
                                ) : null}
                                {nostalgia ? (
                                    <li
                                        title={
                                            nostalgia.private
                                                ? onlyMe
                                                : undefined
                                        }
                                    >
                                        {nostalgia.private ? (
                                            <Lock aria-hidden />
                                        ) : null}
                                        NOSTALGIA{" "}
                                        <MetaValue
                                            item={nostalgia}
                                            onlyMe={onlyMe}
                                        />
                                    </li>
                                ) : null}
                            </ul>
                        ) : null}
                    </div>
                ) : null}
                {hasGrades ? (
                    <div className="nl-profile-identity__mode">
                        <SegmentedControl
                            label={t("profile.modeAria")}
                            value={mode}
                            onValueChange={selectMode}
                            options={[
                                { value: "basic", label: "Basic" },
                                { value: "recital", label: "Recital" },
                            ]}
                        />
                    </div>
                ) : null}
                {hasGrades ? (
                    <div
                        id="profile-performance-summary"
                        className="nl-profile-headline"
                        aria-live="polite"
                    >
                        {grade && grade > 0 ? (
                            // 칸 나눈 수치 상자(2026-09-26 B1) — 왼쪽 절반 공식 Grd, 오른쪽 절반 위 세계 · 아래 국가, 칸 사이 1px 선(수치 띠와 같은 만듦새)
                            <dl
                                className="nl-profile-headline__cells"
                                aria-label={`${modeLabel} · ${t("profile.grade")}`}
                            >
                                <div className="nl-profile-headline__grade">
                                    <dt className="nl-metadata nl-muted">
                                        {t("profile.headlineGrade")}
                                    </dt>
                                    <dd
                                        className="nl-metric-display nl-toned"
                                        data-tone={gradeBandTone(
                                            Math.round(grade / 100)
                                        )}
                                    >
                                        {(grade / 100).toLocaleString(locale, {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}
                                    </dd>
                                </div>
                                {(
                                    [
                                        [
                                            "world",
                                            "profile.headlineWorld",
                                            rank,
                                        ],
                                        [
                                            "country",
                                            "profile.headlineCountry",
                                            countryRank,
                                        ],
                                    ] as const
                                ).map(([key, label, value]) => (
                                    <div
                                        key={key}
                                        className="nl-profile-headline__rank"
                                    >
                                        <dt className="nl-metadata nl-muted">
                                            {t(label)}
                                        </dt>
                                        <dd
                                            className={
                                                value
                                                    ? "nl-metric-value nl-toned"
                                                    : "nl-metric-value nl-muted"
                                            }
                                            data-tone={
                                                value
                                                    ? rankTone(value)
                                                    : undefined
                                            }
                                            data-rank={key}
                                        >
                                            {value
                                                ? `#${value.toLocaleString(locale)}`
                                                : "—"}
                                        </dd>
                                    </div>
                                ))}
                            </dl>
                        ) : (
                            <p className="nl-body-secondary nl-muted">
                                {t("profile.modeEmpty", { mode: modeLabel })}
                            </p>
                        )}
                    </div>
                ) : null}
            </div>
            {showSyncAction ? (
                <div className="nl-profile-identity__recovery">
                    <Link
                        className={foundationButtonClass({
                            variant: "secondary",
                        })}
                        href={href("/bookmarklet")}
                    >
                        {t("sync.title")}
                    </Link>
                </div>
            ) : null}
        </section>
    );
}

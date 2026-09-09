"use client";

import { MapPin, Settings } from "lucide-react";
import Link from "next/link";
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
import ProfileShareDialog from "@/features/profile/components/profileShareDialog";
import { formatProfileDate } from "@/components/profile/dashboard/profileUtils";
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

export default function ProfileIdentity({
    user,
    isOwner,
    mode,
    syncLabel,
    showSyncAction = false,
}: {
    user: ProfileUser;
    isOwner: boolean;
    mode: ProfileMode;
    syncLabel?: string;
    showSyncAction?: boolean;
}) {
    const locale = useLocale();
    const href = useLocalizedHref();
    const t = useTranslations();
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
    const lastPlayed = user.last_played_at
        ? t("profile.lastPlayed", {
              date: formatProfileDate(user.last_played_at, locale),
          })
        : null;
    const metadata = [lastPlayed, isOwner ? syncLabel : null]
        .filter(Boolean)
        .join(" · ");
    const privateLabels = [
        user.hide_nostalgia_name ? "NOSTALGIA ID" : null,
        user.hide_discord_name ? "Discord" : null,
        user.hide_preferred_arcade ? t("settings.preferredArcade") : null,
        user.hide_play_count ? t("profile.playCountLabel") : null,
        user.hide_play_activity ? t("profile.recentPlays") : null,
    ]
        .filter(Boolean)
        .join(" · ");
    return (
        <section className="nl-profile-identity" aria-labelledby="profile-name">
            <div className="nl-profile-identity__row">
                <Avatar
                    src={user.avatar}
                    alt={t("common.profileImage", { name })}
                    size={108}
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
                    </div>
                    <div className="nl-profile-identity__exams">
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
                                <span
                                    className="nl-exam-badge__band"
                                    aria-hidden
                                />
                                {t("rankings.examNone")}
                            </span>
                        )}
                    </div>
                </div>
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
                {metadata ? (
                    <p className="nl-profile-identity__metadata nl-body-secondary nl-muted">
                        {metadata}
                    </p>
                ) : null}
            </div>
            {isOwner && privateLabels ? (
                <p className="nl-body-secondary nl-muted">
                    {t("profile.private")} · {privateLabels}{" "}
                    <Link className="nl-control" href={href("/settings")}>
                        {t("profile.settings")}
                    </Link>
                </p>
            ) : null}
            {(!user.hide_nostalgia_name && user.nostalgia_name) ||
            discord ||
            user.preferredArcade ? (
                <div className="nl-profile-identity__chips">
                    {!user.hide_nostalgia_name && user.nostalgia_name ? (
                        <div className="nl-profile-identity__chip">
                            <span className="nl-metadata nl-muted">
                                NOSTALGIA ID
                            </span>
                            <span className="nl-body-secondary">
                                {user.nostalgia_name}
                            </span>
                        </div>
                    ) : null}
                    {discord || user.preferredArcade ? (
                        <div className="nl-profile-identity__chip-pair">
                            {discord ? (
                                <div
                                    className="nl-profile-identity__chip"
                                    title={discord}
                                >
                                    <DiscordIcon />
                                    <span className="nl-body-secondary">
                                        {discord}
                                    </span>
                                </div>
                            ) : null}
                            {user.preferredArcade ? (
                                <div
                                    className="nl-profile-identity__chip"
                                    title={user.preferredArcade.name}
                                >
                                    <MapPin aria-hidden />
                                    <span className="nl-body-secondary">
                                        {user.preferredArcade.name}
                                    </span>
                                </div>
                            ) : null}
                        </div>
                    ) : null}
                </div>
            ) : null}
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

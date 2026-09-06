import { MapPin, Settings } from "lucide-react";
import Link from "next/link";

import {
    useLocale,
    useLocalizedHref,
    useTranslations,
} from "@/components/i18n/localeProvider";
import Badge from "@/components/ui/Badge";
import DiscordIcon from "@/components/ui/DiscordIcon";
import ProfileAvatar from "@/components/profile/profileAvatar";

import ProfileShareDialog from "./profileShareDialog";
import type { ProfileMode, ProfileUser } from "./profileTypes";
import { formatProfileDate, getProfileCountryCode } from "./profileUtils";

interface ProfileHeaderProps {
    user: ProfileUser;
    isOwner: boolean;
    mode: ProfileMode;
}

// 프로필 기본 정보, 공유와 설정 진입을 한곳에서 관리함
export default function ProfileHeader({
    user,
    isOwner,
    mode,
}: ProfileHeaderProps) {
    const locale = useLocale();
    const href = useLocalizedHref();
    const t = useTranslations();

    return (
        <>
            <section className="flex items-center gap-3">
                <ProfileAvatar
                    avatar={user.avatar}
                    username={user.username}
                    size={60}
                />
                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                        <span className="text-text-secondary shrink-0 text-xs font-bold">
                            {getProfileCountryCode(user.country)}
                        </span>
                        <h1 className="text-title min-w-0 flex-1 break-words">
                            {user.username || t("common.unnamedUser")}
                        </h1>
                        <div className="flex shrink-0 gap-1.5">
                            {isOwner ? (
                                <>
                                    <ProfileShareDialog
                                        user={user}
                                        mode={mode}
                                    />
                                    <Link
                                        href={href("/profile/settings")}
                                        className="border-border text-text-secondary hover:bg-surface-muted hover:text-text-primary focus-visible:ring-focus/40 flex size-9 cursor-pointer items-center justify-center rounded-md border transition-colors focus-visible:ring-2 focus-visible:outline-none"
                                        aria-label={t("profile.settings")}
                                    >
                                        <Settings size={16} />
                                    </Link>
                                </>
                            ) : null}
                        </div>
                    </div>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                        {user.exam_basic ? (
                            <Badge variant="basic" className="h-5 px-1.5">
                                {t("rankings.examBadge", {
                                    mode: "Basic",
                                    exam: user.exam_basic,
                                })}
                            </Badge>
                        ) : null}
                        {user.exam_recital ? (
                            <Badge variant="recital" className="h-5 px-1.5">
                                {t("rankings.examBadge", {
                                    mode: "Recital",
                                    exam: user.exam_recital,
                                })}
                            </Badge>
                        ) : null}
                    </div>
                    <p className="text-caption mt-1.5">
                        {t("profile.joined", {
                            date: formatProfileDate(
                                user.created_at,
                                locale,
                                t("profile.noRecord")
                            ),
                        })}
                        {" · "}
                        {t("profile.lastPlayed", {
                            date: formatProfileDate(
                                user.last_played_at,
                                locale,
                                t("profile.noRecord")
                            ),
                        })}
                    </p>
                </div>
            </section>

            <div className="grid min-w-0 grid-cols-2 gap-2">
                {user.hide_nostalgia_name || user.nostalgia_name ? (
                    <span className="bg-surface text-caption col-span-2 flex min-w-0 items-center gap-2 rounded-md px-2.5 py-1.5">
                        <span className="text-text-disabled shrink-0 font-semibold">
                            NOSTALGIA ID
                        </span>
                        <span className="text-text-primary truncate">
                            {user.hide_nostalgia_name
                                ? t("profile.private")
                                : user.nostalgia_name}
                        </span>
                    </span>
                ) : null}
                {user.hide_discord_name ||
                user.discord_name ||
                user.discord_username ? (
                    <span className="bg-surface text-caption flex min-w-0 items-center gap-1.5 rounded-md px-2.5 py-1.5">
                        <DiscordIcon className="text-discord size-3.5" />
                        <span className="truncate">
                            {user.hide_discord_name
                                ? t("profile.private")
                                : [
                                      user.discord_name,
                                      user.discord_username
                                          ? `@${user.discord_username}`
                                          : null,
                                  ]
                                      .filter(Boolean)
                                      .join(" ")}
                        </span>
                    </span>
                ) : null}
                <span
                    className="bg-surface text-caption flex min-w-0 items-center gap-1.5 rounded-md px-2.5 py-1.5"
                    title={
                        user.preferredArcade?.name ?? t("profile.arcadeUnset")
                    }
                >
                    <MapPin className="text-chart size-3.5 shrink-0" />
                    <span
                        className={
                            user.preferredArcade
                                ? "truncate"
                                : "text-text-disabled truncate"
                        }
                    >
                        {user.preferredArcade?.name ?? t("profile.unset")}
                    </span>
                </span>
            </div>
        </>
    );
}

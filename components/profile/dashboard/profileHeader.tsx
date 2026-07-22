import { MapPin, Settings } from "lucide-react";
import Link from "next/link";

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
                            {user.username || "이름 없는 유저"}
                        </h1>
                        <div className="flex shrink-0 gap-1.5">
                            {isOwner ? (
                                <>
                                    <ProfileShareDialog
                                        user={user}
                                        mode={mode}
                                    />
                                    <Link
                                        href="/profile/settings"
                                        className="border-border text-text-secondary hover:bg-surface-muted hover:text-text-primary focus-visible:ring-focus/40 flex size-9 cursor-pointer items-center justify-center rounded-md border transition-colors focus-visible:ring-2 focus-visible:outline-none"
                                        aria-label="프로필 설정"
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
                                Basic {user.exam_basic}급
                            </Badge>
                        ) : null}
                        {user.exam_recital ? (
                            <Badge variant="recital" className="h-5 px-1.5">
                                Recital {user.exam_recital}급
                            </Badge>
                        ) : null}
                    </div>
                    <p className="text-caption mt-1.5 whitespace-nowrap">
                        {formatProfileDate(user.created_at)} 가입 ·{" "}
                        {formatProfileDate(user.last_played_at)} 마지막 플레이
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
                                ? "비공개"
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
                                ? "비공개"
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
                    title={user.preferredArcade?.name ?? "선호 오락실 미설정"}
                >
                    <MapPin className="text-chart size-3.5 shrink-0" />
                    <span
                        className={
                            user.preferredArcade
                                ? "truncate"
                                : "text-text-disabled truncate"
                        }
                    >
                        {user.preferredArcade?.name ?? "미설정"}
                    </span>
                </span>
            </div>
        </>
    );
}

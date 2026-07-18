import { Settings, Share2 } from "lucide-react";
import Link from "next/link";

import Badge from "@/components/ui/Badge";

import type { ProfileUser } from "./profileTypes";
import { formatProfileDate, getProfileCountryCode } from "./profileUtils";

interface ProfileHeaderProps {
    user: ProfileUser;
    isOwner: boolean;
}

// 프로필 기본 정보, 공유와 설정 진입을 한곳에서 관리함
export default function ProfileHeader({ user, isOwner }: ProfileHeaderProps) {
    async function handleShare() {
        const shareData = {
            title: `${user.username || "NosLog 유저"} 프로필`,
            url: window.location.href,
        };

        try {
            if (navigator.share) await navigator.share(shareData);
            else await navigator.clipboard.writeText(shareData.url);
        } catch (error) {
            if (error instanceof Error && error.name !== "AbortError") {
                console.error("프로필 공유에 실패했습니다.", error);
            }
        }
    }

    return (
        <>
            <section className="flex items-center gap-3">
                <span
                    className="border-border bg-surface-muted size-15 shrink-0 rounded-full border bg-cover bg-center"
                    style={{
                        backgroundImage: user.avatar
                            ? `url(${user.avatar})`
                            : undefined,
                    }}
                    aria-label={`${user.username || "유저"} 프로필 이미지`}
                />
                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                        <span className="text-text-secondary shrink-0 text-xs font-bold">
                            {getProfileCountryCode(user.country)}
                        </span>
                        <h1 className="text-title truncate">
                            {user.username || "이름 없는 유저"}
                        </h1>
                    </div>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                        {user.exam_basic ? (
                            <Badge
                                variant="basic"
                                className="h-5 px-1.5 text-[10px]"
                            >
                                Basic {user.exam_basic}급
                            </Badge>
                        ) : null}
                        {user.exam_recital ? (
                            <Badge
                                variant="recital"
                                className="h-5 px-1.5 text-[10px]"
                            >
                                Recital {user.exam_recital}급
                            </Badge>
                        ) : null}
                    </div>
                    <p className="text-caption mt-1.5 truncate">
                        {formatProfileDate(user.created_at)} 가입 ·{" "}
                        {formatProfileDate(user.last_played_at)} 마지막 플레이
                    </p>
                </div>
                <div className="flex shrink-0 gap-1.5">
                    <button
                        type="button"
                        onClick={() => void handleShare()}
                        className="border-border text-text-secondary hover:bg-surface-muted hover:text-text-primary focus-visible:ring-text-secondary/30 flex size-9 cursor-pointer items-center justify-center rounded-md border transition-colors focus-visible:ring-2 focus-visible:outline-none"
                        aria-label="프로필 공유"
                    >
                        <Share2 size={16} />
                    </button>
                    {isOwner ? (
                        <Link
                            href="/profile/settings"
                            className="border-border text-text-secondary hover:bg-surface-muted hover:text-text-primary focus-visible:ring-text-secondary/30 flex size-9 cursor-pointer items-center justify-center rounded-md border transition-colors focus-visible:ring-2 focus-visible:outline-none"
                            aria-label="프로필 설정"
                        >
                            <Settings size={16} />
                        </Link>
                    ) : null}
                </div>
            </section>

            <div className="flex flex-wrap gap-2">
                {user.discord_name ? (
                    <span className="bg-surface text-caption rounded-md px-2.5 py-1.5">
                        {user.discord_name}
                    </span>
                ) : null}
                {user.nostalgia_name &&
                user.nostalgia_name !== user.username ? (
                    <span className="bg-surface text-caption rounded-md px-2.5 py-1.5">
                        게임명 {user.nostalgia_name}
                    </span>
                ) : null}
            </div>
        </>
    );
}

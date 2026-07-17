import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { cn, formatToComma } from "@/lib/utils";

import ProfileJacket from "./profileJacket";
import type { RecentPlayItem } from "./profileTypes";
import { formatProfileDate, getProfileDifficultyColor } from "./profileUtils";

interface ProfileRecentPlaysProps {
    plays: RecentPlayItem[];
    expanded: boolean;
    onToggle: () => void;
}

// 최근 플레이 목록과 확장 상태를 한곳에서 표시함
export default function ProfileRecentPlays({
    plays,
    expanded,
    onToggle,
}: ProfileRecentPlaysProps) {
    const visiblePlays = expanded ? plays : plays.slice(0, 5);

    return (
        <section className="bg-surface rounded-card overflow-hidden">
            <div className="border-divider flex items-center justify-between border-b px-4 py-3">
                <h2 className="text-section font-bold">최근 플레이</h2>
                {plays.length > 5 ? (
                    <button
                        type="button"
                        onClick={onToggle}
                        aria-label={
                            expanded
                                ? "최근 플레이 접기"
                                : "최근 플레이 전체 보기"
                        }
                        className="text-caption flex items-center gap-1"
                    >
                        {expanded ? "접기" : "전체"}
                        <ChevronRight
                            size={13}
                            className={cn(
                                "transition-transform",
                                expanded && "rotate-90"
                            )}
                        />
                    </button>
                ) : null}
            </div>

            {visiblePlays.length ? (
                <ul>
                    {visiblePlays.map((play) => (
                        <li
                            key={play.id}
                            className="border-divider border-t first:border-t-0"
                        >
                            <Link
                                href={`/music/${play.music_idx}/${play.difficulty.toLowerCase()}`}
                                className="flex min-h-14 items-center gap-3 px-3 py-2"
                            >
                                <ProfileJacket
                                    index={play.music_idx}
                                    background={play.music.background}
                                    title={play.music.title}
                                />
                                <div className="min-w-0 flex-1">
                                    <p className="text-text-primary truncate text-sm font-semibold">
                                        {play.music.title}
                                    </p>
                                    <p
                                        className={cn(
                                            "mt-0.5 text-xs",
                                            getProfileDifficultyColor(
                                                play.difficulty
                                            )
                                        )}
                                    >
                                        {play.difficulty} Lv {play.level}
                                    </p>
                                </div>
                                <div className="shrink-0 text-right">
                                    <p className="text-text-primary text-xs font-semibold tabular-nums">
                                        {formatToComma(play.score)}
                                    </p>
                                    <p className="text-caption mt-0.5">
                                        {formatProfileDate(play.play_time)}
                                    </p>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-text-disabled flex h-20 items-center justify-center text-sm">
                    최근 플레이 기록이 없습니다.
                </p>
            )}
        </section>
    );
}

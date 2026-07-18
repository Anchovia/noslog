import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { cn, formatToComma } from "@/lib/utils";

import ProfileJacket from "./profileJacket";
import type { BestPlayItem, ProfileMode } from "./profileTypes";
import { formatProfileGrade, getProfileDifficultyColor } from "./profileUtils";

interface ProfileBestPlaysProps {
    plays: BestPlayItem[];
    mode: ProfileMode;
    expanded: boolean;
    onToggle: () => void;
}

// 모드별 베스트 성과 목록과 확장 상태를 한곳에서 표시함
export default function ProfileBestPlays({
    plays,
    mode,
    expanded,
    onToggle,
}: ProfileBestPlaysProps) {
    const visiblePlays = expanded ? plays : plays.slice(0, 5);

    return (
        <section className="bg-surface rounded-card overflow-hidden">
            <div className="border-divider flex items-center justify-between border-b px-4 py-3">
                <h2 className="text-section font-bold">베스트 성과</h2>
                {plays.length > 5 ? (
                    <button
                        type="button"
                        onClick={onToggle}
                        aria-label={
                            expanded
                                ? "베스트 성과 접기"
                                : "베스트 성과 전체 보기"
                        }
                        className="text-caption hover:bg-surface-muted hover:text-text-primary focus-visible:ring-text-secondary/30 flex cursor-pointer items-center gap-1 rounded px-1.5 py-1 transition-colors focus-visible:ring-2 focus-visible:outline-none"
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
                ) : (
                    <span className="text-caption">Grd 기여 상위 5곡</span>
                )}
            </div>

            {plays.length ? (
                <ol>
                    {visiblePlays.map((play, index) => {
                        const playGrade =
                            mode === "basic"
                                ? play.grade_basic
                                : play.grade_recital;

                        return (
                            <li
                                key={`${mode}-${play.music_idx}-${play.difficulty}`}
                                className="border-divider border-t first:border-t-0"
                            >
                                <Link
                                    href={`/music/${play.music_idx}/${play.difficulty.toLowerCase()}`}
                                    className="flex min-h-14 items-center gap-3 px-3 py-2"
                                >
                                    <span
                                        className={cn(
                                            "w-4 shrink-0 text-center text-xs font-bold",
                                            index === 0 && "text-score",
                                            index === 1 &&
                                                "text-text-secondary",
                                            index === 2 && "text-bronze",
                                            index > 2 && "text-text-disabled"
                                        )}
                                    >
                                        {index + 1}
                                    </span>
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
                                        <p className="text-score mt-0.5 text-xs font-bold tabular-nums">
                                            {formatProfileGrade(playGrade)} Grd
                                        </p>
                                    </div>
                                </Link>
                            </li>
                        );
                    })}
                </ol>
            ) : (
                <p className="text-text-disabled flex h-24 items-center justify-center text-sm">
                    베스트 성과 기록이 없습니다.
                </p>
            )}
        </section>
    );
}

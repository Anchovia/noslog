import OfficialXTimeline from "@/components/home/officialXTimeline";
import {
    CountryMark,
    ExamBadge,
    UserAvatar,
} from "@/components/rankings/table/rankingUserMeta";
import {
    getCachedUserRankingPage,
    getUserRankingPosition,
} from "@/lib/rankings";
import { getUser } from "@/lib/user";
import {
    formatToComma,
    formatToGrade,
    normalizeStoredGrade,
} from "@/lib/utils";
import {
    BadgeCheck,
    ChevronRight,
    Clock3,
    DatabaseZap,
    Grid3X3,
    ListOrdered,
    Music2,
    Search,
    Trophy,
} from "lucide-react";
import Link from "next/link";

export default async function Home() {
    const [user, { rows: rankingUsers }] = await Promise.all([
        getUser(),
        getCachedUserRankingPage("basic", "all", 1, 5),
    ]);
    const userRank = user
        ? await getUserRankingPosition({
              userId: user.id,
              grade: user.grade_basic,
              mode: "basic",
          })
        : null;

    return (
        <div className="flex flex-col gap-4 px-4 py-4">
            {/* 상단 로그인/프로필 카드 */}
            {user ? (
                <section className="bg-surface rounded-card flex min-h-20 items-center gap-3 p-4">
                    <UserAvatar
                        avatar={user.avatar}
                        username={user.username}
                        size={48}
                    />

                    <div className="min-w-0 flex-1">
                        <div className="flex min-w-0 items-center gap-1.5">
                            <strong className="text-section truncate">
                                {user.username || "이름 없는 유저"}
                            </strong>
                            <span className="text-text-secondary shrink-0 text-sm">
                                · {userRank ? `#${userRank}위` : "순위 -"}
                            </span>
                        </div>
                        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                            <span className="text-text-primary shrink-0 text-sm font-medium tabular-nums">
                                Grd{" "}
                                {formatToComma(
                                    normalizeStoredGrade(user.grade_basic)
                                )}
                            </span>
                            <ExamBadge mode="basic" exam={user.exam_basic} />
                            <ExamBadge
                                mode="recital"
                                exam={user.exam_recital}
                            />
                        </div>
                    </div>

                    <Link
                        href={`/profile/${user.id}`}
                        className="border-border text-text-primary rounded-card flex h-9 shrink-0 items-center justify-center border px-3 text-xs font-bold"
                    >
                        내 프로필
                    </Link>
                </section>
            ) : (
                <section className="bg-surface rounded-card flex items-center justify-between p-4">
                    <p className="text-section">내 NOSTALGIA 기록 모아보기</p>
                    <Link
                        href="/login"
                        className="bg-discord rounded-card text-text-primary px-3 py-2 text-xs font-bold"
                    >
                        로그인
                    </Link>
                </section>
            )}
            {/* 히어로 + 검색 */}
            <section className="flex flex-col items-center gap-8 text-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="border-text-primary text-text-primary flex size-11 items-center justify-center rounded-full border-2 text-lg font-bold">
                        N
                    </div>
                    <div>
                        <h1 className="text-title">NosLog</h1>
                        <p className="text-caption mt-2">
                            NOSTALGIA 기록 · 랭킹 · 서열 아카이브
                        </p>
                    </div>
                </div>

                <form action="/music" className="w-full">
                    <div className="border-border bg-surface focus-within:border-text-secondary focus-within:ring-text-secondary/20 flex h-11 w-full items-center gap-2 rounded-full border px-4 transition focus-within:ring-2">
                        <Search
                            className="text-text-disabled size-5 shrink-0"
                            aria-hidden="true"
                        />
                        <input
                            name="q"
                            placeholder="곡 제목 · 아티스트 검색"
                            className="text-input placeholder:text-text-disabled h-full min-w-0 flex-1 bg-transparent outline-none"
                        />
                    </div>
                </form>
            </section>
            {/* 퀵 메뉴 */}
            <section className="grid grid-cols-3 gap-2">
                <Link
                    href="/music"
                    className="bg-surface rounded-card flex h-20 flex-col items-center justify-center gap-2"
                >
                    <Music2
                        className="text-text-secondary size-6"
                        aria-hidden="true"
                    />
                    <span className="text-caption text-text-primary font-semibold">
                        악곡
                    </span>
                </Link>
                <Link
                    href="/rankings"
                    className="bg-surface rounded-card flex h-20 flex-col items-center justify-center gap-2"
                >
                    <Trophy
                        className="text-text-secondary size-6"
                        aria-hidden="true"
                    />
                    <span className="text-caption text-text-primary font-semibold">
                        랭킹
                    </span>
                </Link>
                <Link
                    href="/bingo"
                    className="bg-surface rounded-card flex h-20 flex-col items-center justify-center gap-2"
                >
                    <Grid3X3
                        className="text-text-secondary size-6"
                        aria-hidden="true"
                    />
                    <span className="text-caption text-text-primary font-semibold">
                        빙고
                    </span>
                </Link>
                <Link
                    href="/tiers"
                    className="bg-surface rounded-card flex h-20 flex-col items-center justify-center gap-2"
                >
                    <ListOrdered
                        className="text-text-secondary size-6"
                        aria-hidden="true"
                    />
                    <span className="text-caption text-text-primary font-semibold">
                        서열표
                    </span>
                </Link>
                <Link
                    href="/exams"
                    className="bg-surface rounded-card flex h-20 flex-col items-center justify-center gap-2"
                >
                    <BadgeCheck
                        className="text-text-secondary size-6"
                        aria-hidden="true"
                    />
                    <span className="text-caption text-text-primary font-semibold">
                        검정
                    </span>
                </Link>
                <div className="bg-surface-muted rounded-card relative flex h-20 flex-col items-center justify-center gap-2 opacity-50">
                    <Clock3
                        className="text-text-secondary size-6"
                        aria-hidden="true"
                    />
                    <span className="text-caption text-text-secondary font-semibold">
                        준비중
                    </span>
                    <span className="bg-real/15 text-real absolute top-1 right-1 rounded px-1 text-[10px] font-bold">
                        SOON
                    </span>
                </div>
            </section>
            {/* 데이터 연동 가이드 */}
            <Link
                href="/bookmarklet"
                className="bg-surface rounded-card flex h-10 items-center justify-between px-4"
            >
                <div className="flex items-center gap-2">
                    <DatabaseZap
                        className="text-text-secondary size-4"
                        aria-hidden="true"
                    />
                    <span className="text-caption">데이터 연동 가이드</span>
                </div>
                <ChevronRight
                    className="text-text-disabled size-4"
                    aria-hidden="true"
                />
            </Link>
            {/* 랭킹 카드 */}
            <section className="bg-surface rounded-card overflow-hidden">
                <div className="bg-surface-muted flex h-10 items-center justify-between px-3">
                    <div className="flex items-center gap-2">
                        <h2 className="text-section">유저 랭킹</h2>

                        <div className="border-border rounded-card flex overflow-hidden border">
                            <span className="bg-border text-text-primary px-2 py-1 text-[10px] font-medium">
                                Basic
                            </span>
                            <span className="text-text-secondary px-2 py-1 text-[10px] font-medium">
                                Recital
                            </span>
                        </div>
                    </div>

                    <Link
                        href="/rankings"
                        className="text-caption hover:text-text-primary transition-colors"
                    >
                        전체 →
                    </Link>
                </div>

                <div>
                    {rankingUsers.map((rankingUser, index) => (
                        <Link
                            key={rankingUser.id}
                            href={`/profile/${rankingUser.id}`}
                            className="border-divider flex h-10 items-center border-t px-3"
                        >
                            <span
                                className={
                                    index === 0
                                        ? "text-score w-8 text-sm font-bold"
                                        : index === 2
                                          ? "text-bronze w-8 text-sm font-bold"
                                          : index >= 3
                                            ? "text-text-disabled w-8 text-sm font-bold"
                                            : "text-text-primary w-8 text-sm font-bold"
                                }
                            >
                                {index + 1}
                            </span>

                            <UserAvatar
                                avatar={rankingUser.avatar}
                                username={rankingUser.username}
                                size={24}
                            />

                            <span className="mx-2 flex w-4 shrink-0 items-center justify-center">
                                <CountryMark country={rankingUser.country} />
                            </span>

                            <span className="text-body min-w-0 flex-1 truncate">
                                {rankingUser.username ?? "Unknown"}
                            </span>

                            <span className="text-caption text-text-primary tabular-nums">
                                Grd {formatToGrade(rankingUser.grade)}
                            </span>
                        </Link>
                    ))}
                </div>
            </section>
            {/* NOSTALGIA 공식 소식 */}
            <OfficialXTimeline />
        </div>
    );
}

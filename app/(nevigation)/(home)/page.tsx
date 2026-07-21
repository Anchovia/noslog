import FeedbackDialog from "@/components/feedback/feedbackDialog";
import HomeAnnouncements from "@/components/home/homeAnnouncements";
import HomeRankingCard from "@/components/home/homeRankingCard";
import OfficialXTimeline from "@/components/home/officialXTimeline";
import {
    ExamBadge,
    UserAvatar,
} from "@/components/rankings/table/rankingUserMeta";
import { getPublishedAnnouncements } from "@/lib/announcements";
import {
    createPageMetadata,
    SITE_DESCRIPTION,
    SITE_NAME,
    SITE_URL,
} from "@/lib/metadata/site";
import type { UserRankingMode } from "@/lib/rankings";
import {
    getCachedUserRankingPage,
    getUserRankingPosition,
} from "@/lib/rankings";
import { getUser } from "@/lib/user";
import { formatToComma, normalizeStoredGrade } from "@/lib/utils";
import {
    BadgeCheck,
    ChevronRight,
    DatabaseZap,
    Grid3X3,
    ListOrdered,
    MapPin,
    Music2,
    Search,
    Trophy,
} from "lucide-react";
import Link from "next/link";

export const metadata = createPageMetadata({ path: "/" });

const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    inLanguage: "ko-KR",
    potentialAction: {
        "@type": "SearchAction",
        target: `${SITE_URL}/music?q={search_term_string}`,
        "query-input": "required name=search_term_string",
    },
};

interface HomeProps {
    searchParams: Promise<{
        ranking?: string | string[];
    }>;
}

export default async function Home({ searchParams }: HomeProps) {
    const { ranking } = await searchParams;
    const rankingMode: UserRankingMode =
        ranking === "recital" ? "recital" : "basic";
    const [user, basicRanking, recitalRanking, announcements] =
        await Promise.all([
            getUser(),
            getCachedUserRankingPage("basic", "all", 1, 5),
            getCachedUserRankingPage("recital", "all", 1, 5),
            getPublishedAnnouncements(),
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
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(websiteJsonLd).replaceAll(
                        "<",
                        "\\u003c"
                    ),
                }}
            />
            {/* 상단 로그인/프로필 카드 */}
            {user ? (
                <section className="bg-surface rounded-card sticky top-2 z-20 flex min-h-20 items-center gap-3 p-4 shadow-lg">
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
                                · {userRank ? `#${userRank}` : "순위 -"}
                            </span>
                        </div>
                        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                            <span className="shrink-0 text-sm font-medium tabular-nums">
                                <span className="text-text-secondary">
                                    Grd{" "}
                                </span>
                                <span className="text-score font-bold">
                                    {formatToComma(
                                        normalizeStoredGrade(user.grade_basic)
                                    )}
                                </span>
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
                        className="border-border text-text-primary hover:bg-surface-muted focus-visible:ring-focus/40 rounded-card flex h-10 shrink-0 items-center justify-center border px-3 text-sm font-bold transition-colors focus-visible:ring-2 focus-visible:outline-none"
                    >
                        내 프로필
                    </Link>
                </section>
            ) : (
                <section className="bg-surface rounded-card flex items-center justify-between p-4">
                    <p className="text-section">내 NOSTALGIA 기록 모아보기</p>
                    <Link
                        href="/login"
                        className="bg-discord rounded-card text-text-primary hover:bg-discord/90 flex h-8 items-center px-3 text-sm font-bold transition-colors"
                    >
                        로그인
                    </Link>
                </section>
            )}
            <HomeAnnouncements announcements={announcements} />
            {/* 히어로 + 검색 */}
            <section className="flex flex-col items-center gap-8 pt-4 text-center">
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
                    <div className="border-border bg-surface focus-within:border-focus focus-within:ring-focus/20 flex h-11 w-full items-center gap-2 rounded-full border px-4 transition focus-within:ring-2">
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
                    className="bg-surface hover:bg-surface-muted focus-visible:ring-focus/40 rounded-card group flex h-20 flex-col items-center justify-center gap-2 transition-colors focus-visible:ring-2 focus-visible:outline-none"
                >
                    <Music2
                        className="text-text-secondary group-hover:text-text-primary size-6 transition-colors"
                        aria-hidden="true"
                    />
                    <span className="text-label">악곡</span>
                </Link>
                <Link
                    href="/rankings"
                    className="bg-surface hover:bg-surface-muted focus-visible:ring-focus/40 rounded-card group flex h-20 flex-col items-center justify-center gap-2 transition-colors focus-visible:ring-2 focus-visible:outline-none"
                >
                    <Trophy
                        className="text-text-secondary group-hover:text-text-primary size-6 transition-colors"
                        aria-hidden="true"
                    />
                    <span className="text-label">랭킹</span>
                </Link>
                <Link
                    href="/bingo"
                    className="bg-surface hover:bg-surface-muted focus-visible:ring-focus/40 rounded-card group flex h-20 flex-col items-center justify-center gap-2 transition-colors focus-visible:ring-2 focus-visible:outline-none"
                >
                    <Grid3X3
                        className="text-text-secondary group-hover:text-text-primary size-6 transition-colors"
                        aria-hidden="true"
                    />
                    <span className="text-label">빙고</span>
                </Link>
                <Link
                    href="/tiers"
                    className="bg-surface hover:bg-surface-muted focus-visible:ring-focus/40 rounded-card group flex h-20 flex-col items-center justify-center gap-2 transition-colors focus-visible:ring-2 focus-visible:outline-none"
                >
                    <ListOrdered
                        className="text-text-secondary group-hover:text-text-primary size-6 transition-colors"
                        aria-hidden="true"
                    />
                    <span className="text-label">서열표</span>
                </Link>
                <Link
                    href="/exams"
                    className="bg-surface hover:bg-surface-muted focus-visible:ring-focus/40 rounded-card group flex h-20 flex-col items-center justify-center gap-2 transition-colors focus-visible:ring-2 focus-visible:outline-none"
                >
                    <BadgeCheck
                        className="text-text-secondary group-hover:text-text-primary size-6 transition-colors"
                        aria-hidden="true"
                    />
                    <span className="text-label">검정</span>
                </Link>
                <div className="bg-surface-muted rounded-card relative flex h-20 flex-col items-center justify-center gap-2 opacity-50">
                    <MapPin
                        className="text-text-secondary size-6"
                        aria-hidden="true"
                    />
                    <span className="text-caption text-text-secondary font-semibold">
                        오락실
                    </span>
                    <span className="bg-real/15 text-real absolute top-1 right-1 rounded px-1 text-[10px] font-bold">
                        SOON
                    </span>
                </div>
            </section>
            {/* 데이터 연동 가이드 */}
            <Link
                href="/bookmarklet"
                className="bg-surface hover:bg-surface-muted focus-visible:ring-focus/40 rounded-card group flex h-10 items-center justify-between px-4 transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
                <div className="flex items-center gap-2">
                    <DatabaseZap
                        className="text-text-secondary group-hover:text-text-primary size-4 transition-colors"
                        aria-hidden="true"
                    />
                    <span className="text-body-muted">데이터 연동 가이드</span>
                </div>
                <ChevronRight
                    className="text-text-disabled group-hover:text-text-primary size-4 transition-colors"
                    aria-hidden="true"
                />
            </Link>
            <FeedbackDialog isAuthenticated={Boolean(user)} />
            {/* 랭킹 카드 */}
            <HomeRankingCard
                initialMode={rankingMode}
                rankings={{
                    basic: basicRanking.rows,
                    recital: recitalRanking.rows,
                }}
            />
            {/* NOSTALGIA 공식 소식 */}
            <OfficialXTimeline />
        </div>
    );
}

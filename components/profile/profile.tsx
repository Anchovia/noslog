"use client";

import { logout } from "@/app/(nevigation)/profile/[id]/actions";
import Badge from "@/components/ui/Badge";
import { getJacketUrl } from "@/lib/tiers";
import { cn, formatToComma } from "@/lib/utils";
import {
    ChevronDown,
    ChevronRight,
    LogOut,
    Settings,
    Share2,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import ProfileGradeChart, { type GradeHistoryPoint } from "./chart";

type ProfileMode = "basic" | "recital";

interface ProfileUser {
    id: number;
    username: string | null;
    nostalgia_name: string | null;
    discord_name: string | null;
    avatar: string | null;
    country: string;
    rank_basic: number | null;
    rank_basic_country: number | null;
    rank_recital: number | null;
    rank_recital_country: number | null;
    grade_basic: number | null;
    grade_recital: number | null;
    exam_basic: number | null;
    exam_recital: number | null;
    play_count: number | null;
    score_p: number | null;
    score_f: number | null;
    score_s: number | null;
    score_a2: number | null;
    score_a: number | null;
    score_b2: number | null;
    score_b: number | null;
    score_c: number | null;
    score_d: number | null;
    created_at: string;
    last_played_at: string | null;
}

interface BestPlayItem {
    besttime: string;
    score: number;
    rank: string;
    level: number;
    difficulty: string;
    max_combo: number;
    music_idx: string;
    fc_type: number;
    grade_basic?: number;
    grade_recital?: number;
    music: { title: string; background: string | null };
}

interface RecentPlayItem {
    id: number;
    play_time: string;
    score: number;
    rank: string;
    grade_basic: number;
    difficulty: string;
    level: number;
    music_idx: string;
    music: { title: string; background: string | null };
}

interface ProfileDashboardProps {
    user: ProfileUser;
    gradeHistory: GradeHistoryPoint[];
    basicBestPlays: BestPlayItem[];
    recitalBestPlays: BestPlayItem[];
    recentPlays: RecentPlayItem[];
    isOwner: boolean;
}

const rankColors = [
    "bg-rank-p-start",
    "bg-rank-fc",
    "bg-rank-s",
    "bg-rank-a-plus",
    "bg-rank-a",
    "bg-text-disabled",
    "bg-text-disabled",
    "bg-text-disabled",
    "bg-text-disabled",
];

const rankIconNames = ["p", "fc_bg", "s", "a2", "a", "b2", "b", "c", "d"];
const rankIconBaseUrl =
    "https://p.eagate.573.jp/game/nostalgia/op3/img/pdata/music_data/grade";

const difficultyColors: Record<string, string> = {
    Normal: "text-normal",
    Hard: "text-hard",
    Expert: "text-expert",
    Real: "text-real",
};

function gradeValue(value: number | null) {
    return value ? Math.round(value / 100).toLocaleString("ko-KR") : "-";
}

function shortDate(value: string | null) {
    if (!value) return "기록 없음";
    const date = new Date(value);
    if (Number.isNaN(date.getTime()))
        return value.split(" ")[0].replaceAll("-", ".");
    return new Intl.DateTimeFormat("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    })
        .format(date)
        .replaceAll(". ", ".")
        .replace(/\.$/, "");
}

function countryCode(country: string) {
    if (country === "ko-KR") return "KR";
    if (country === "ja-JP") return "JP";
    return country.split("-").at(-1)?.toUpperCase() || "GLO";
}

function Jacket({
    index,
    background,
    title,
}: {
    index: string;
    background: string | null;
    title: string;
}) {
    return (
        <span
            className="bg-surface-muted size-10 shrink-0 rounded-md bg-cover bg-center"
            style={{
                backgroundImage: `url(${getJacketUrl(index, background)})`,
            }}
            aria-label={`${title} 자켓`}
        />
    );
}

export default function ProfileDashboard({
    user,
    gradeHistory,
    basicBestPlays,
    recitalBestPlays,
    recentPlays,
    isOwner,
}: ProfileDashboardProps) {
    const [mode, setMode] = useState<ProfileMode>("basic");
    const [showAllRanks, setShowAllRanks] = useState(false);
    const [showAllBest, setShowAllBest] = useState(false);
    const [showAllRecent, setShowAllRecent] = useState(false);

    const isBasic = mode === "basic";
    const grade = isBasic ? user.grade_basic : user.grade_recital;
    const globalRank = isBasic ? user.rank_basic : user.rank_recital;
    const countryRank = isBasic
        ? user.rank_basic_country
        : user.rank_recital_country;
    const bestPlays = isBasic ? basicBestPlays : recitalBestPlays;
    const rankRows = [
        { label: "P", value: user.score_p ?? 0 },
        { label: "FC", value: user.score_f ?? 0 },
        { label: "S", value: user.score_s ?? 0 },
        { label: "A+", value: user.score_a2 ?? 0 },
        { label: "A", value: user.score_a ?? 0 },
        { label: "B+", value: user.score_b2 ?? 0 },
        { label: "B", value: user.score_b ?? 0 },
        { label: "C", value: user.score_c ?? 0 },
        { label: "D", value: user.score_d ?? 0 },
    ];
    const maxRankCount = Math.max(...rankRows.map((row) => row.value), 1);
    const visibleBestPlays = showAllBest ? bestPlays : bestPlays.slice(0, 5);
    const visibleRecent = showAllRecent ? recentPlays : recentPlays.slice(0, 5);

    const handleShare = async () => {
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
    };

    return (
        <div className="flex flex-col gap-3 px-4 py-4">
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
                            {countryCode(user.country)}
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
                        {shortDate(user.created_at)} 가입 ·{" "}
                        {shortDate(user.last_played_at)} 마지막 플레이
                    </p>
                </div>
                <div className="flex shrink-0 gap-1.5">
                    <button
                        type="button"
                        onClick={handleShare}
                        className="border-border text-text-secondary hover:text-text-primary flex size-9 items-center justify-center rounded-md border"
                        aria-label="프로필 공유"
                    >
                        <Share2 size={16} />
                    </button>
                    {isOwner ? (
                        <Link
                            href="/profile/settings"
                            className="border-border text-text-secondary hover:text-text-primary flex size-9 items-center justify-center rounded-md border"
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

            <nav
                className="bg-surface rounded-card grid grid-cols-2 p-1"
                aria-label="프로필 모드"
            >
                {(["basic", "recital"] as const).map((item) => (
                    <button
                        key={item}
                        type="button"
                        onClick={() => setMode(item)}
                        className={cn(
                            "h-9 rounded-md text-sm font-semibold transition-colors",
                            mode === item
                                ? "bg-text-primary text-bg"
                                : "text-text-secondary"
                        )}
                    >
                        {item === "basic" ? "Basic" : "Recital"}
                    </button>
                ))}
            </nav>

            <section className="grid grid-cols-2 gap-2">
                <article className="bg-surface rounded-card flex min-w-0 flex-col justify-center p-4">
                    <p className="text-caption">그레이드</p>
                    <p className="mt-1 flex items-baseline gap-1.5 tabular-nums">
                        <strong className="text-score text-3xl leading-none font-black">
                            {gradeValue(grade)}
                        </strong>
                        <span className="text-text-secondary text-xs font-semibold">
                            Grd
                        </span>
                    </p>
                </article>
                <article className="bg-surface rounded-card flex min-w-0 flex-col justify-center p-4">
                    <p className="text-caption">순위</p>
                    <p className="text-text-primary mt-1 text-2xl leading-none font-black tabular-nums">
                        {globalRank ? `#${formatToComma(globalRank)}` : "-"}
                    </p>
                    <p className="text-caption mt-2 flex items-center gap-1.5 tabular-nums">
                        <span className="text-text-primary font-bold">
                            {countryCode(user.country)}
                        </span>
                        <span>
                            {countryRank
                                ? `#${formatToComma(countryRank)}`
                                : "순위 없음"}
                        </span>
                    </p>
                </article>
            </section>

            <section className="bg-surface rounded-card p-4">
                <div className="mb-2 flex items-center justify-between">
                    <h2 className="text-section font-bold">그레이드 추이</h2>
                    <span className="text-caption">
                        최근 {gradeHistory.length}회
                    </span>
                </div>
                <ProfileGradeChart data={gradeHistory} mode={mode} />
                {gradeHistory.length > 1 ? (
                    <div className="text-text-disabled flex justify-between text-[10px]">
                        <span>
                            {gradeHistory[0].besttime.replaceAll("-", ".")}
                        </span>
                        <span>
                            {gradeHistory.at(-1)?.besttime.replaceAll("-", ".")}
                        </span>
                    </div>
                ) : null}
            </section>

            <section className="bg-surface rounded-card p-4">
                <div className="mb-3 flex items-center justify-between">
                    <h2 className="text-section font-bold">랭크 분포</h2>
                    <button
                        type="button"
                        onClick={() => setShowAllRanks((value) => !value)}
                        className="text-caption flex items-center gap-1"
                    >
                        {showAllRanks ? "접기" : "전체"}
                        <ChevronDown
                            size={13}
                            className={cn(
                                "transition-transform",
                                showAllRanks && "rotate-180"
                            )}
                        />
                    </button>
                </div>
                <div className="space-y-2.5">
                    {rankRows
                        .slice(0, showAllRanks ? rankRows.length : 5)
                        .map((row, index) => (
                            <div
                                key={row.label}
                                className="grid grid-cols-[20px_1fr_34px] items-center gap-2"
                            >
                                <span
                                    className="size-5 bg-contain bg-center bg-no-repeat"
                                    style={{
                                        backgroundImage: `url(${rankIconBaseUrl}/grade_${rankIconNames[index]}.png)`,
                                    }}
                                    role="img"
                                    aria-label={`${row.label} 랭크`}
                                />
                                <span className="bg-divider h-1.5 overflow-hidden rounded-full">
                                    <span
                                        className={cn(
                                            "block h-full rounded-full",
                                            rankColors[index]
                                        )}
                                        style={{
                                            width: `${(row.value / maxRankCount) * 100}%`,
                                        }}
                                    />
                                </span>
                                <span className="text-caption text-right tabular-nums">
                                    {formatToComma(row.value)}
                                </span>
                            </div>
                        ))}
                </div>
                <p className="text-caption mt-3">
                    플레이 {formatToComma(user.play_count)}회
                </p>
            </section>

            <section className="bg-surface rounded-card overflow-hidden">
                <div className="border-divider flex items-center justify-between border-b px-4 py-3">
                    <h2 className="text-section font-bold">베스트 성과</h2>
                    {bestPlays.length > 5 ? (
                        <button
                            type="button"
                            onClick={() => setShowAllBest((value) => !value)}
                            aria-label={
                                showAllBest
                                    ? "베스트 성과 접기"
                                    : "베스트 성과 전체 보기"
                            }
                            className="text-caption flex items-center gap-1"
                        >
                            {showAllBest ? "접기" : "전체"}
                            <ChevronRight
                                size={13}
                                className={cn(
                                    "transition-transform",
                                    showAllBest && "rotate-90"
                                )}
                            />
                        </button>
                    ) : (
                        <span className="text-caption">Grd 기여 상위 5곡</span>
                    )}
                </div>
                {bestPlays.length ? (
                    <ol>
                        {visibleBestPlays.map((play, index) => {
                            const playGrade = isBasic
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
                                                index > 2 &&
                                                    "text-text-disabled"
                                            )}
                                        >
                                            {index + 1}
                                        </span>
                                        <Jacket
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
                                                    difficultyColors[
                                                        play.difficulty
                                                    ]
                                                )}
                                            >
                                                {play.difficulty} Lv{" "}
                                                {play.level}
                                            </p>
                                        </div>
                                        <div className="shrink-0 text-right">
                                            <p className="text-text-primary text-xs font-semibold tabular-nums">
                                                {formatToComma(play.score)}
                                            </p>
                                            <p className="text-score mt-0.5 text-xs font-bold tabular-nums">
                                                {playGrade
                                                    ? gradeValue(playGrade)
                                                    : "-"}{" "}
                                                Grd
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

            <section className="bg-surface rounded-card overflow-hidden">
                <div className="border-divider flex items-center justify-between border-b px-4 py-3">
                    <h2 className="text-section font-bold">최근 플레이</h2>
                    {recentPlays.length > 5 ? (
                        <button
                            type="button"
                            onClick={() => setShowAllRecent((value) => !value)}
                            aria-label={
                                showAllRecent
                                    ? "최근 플레이 접기"
                                    : "최근 플레이 전체 보기"
                            }
                            className="text-caption flex items-center gap-1"
                        >
                            {showAllRecent ? "접기" : "전체"}
                            <ChevronRight
                                size={13}
                                className={cn(
                                    "transition-transform",
                                    showAllRecent && "rotate-90"
                                )}
                            />
                        </button>
                    ) : null}
                </div>
                {visibleRecent.length ? (
                    <ul>
                        {visibleRecent.map((play) => (
                            <li
                                key={play.id}
                                className="border-divider border-t first:border-t-0"
                            >
                                <Link
                                    href={`/music/${play.music_idx}/${play.difficulty.toLowerCase()}`}
                                    className="flex min-h-14 items-center gap-3 px-3 py-2"
                                >
                                    <Jacket
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
                                                difficultyColors[
                                                    play.difficulty
                                                ]
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
                                            {shortDate(play.play_time)}
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

            {isOwner ? (
                <form action={logout}>
                    <button
                        type="submit"
                        className="border-danger/50 text-danger rounded-card flex h-11 w-full items-center justify-center gap-2 border text-sm font-semibold"
                    >
                        <LogOut size={16} />
                        로그아웃
                    </button>
                </form>
            ) : null}
        </div>
    );
}

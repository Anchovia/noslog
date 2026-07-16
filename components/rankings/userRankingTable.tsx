import Badge from "@/components/ui/Badge";
import type {
    UserRankingMode,
    UserRankingRegion,
    UserRankingRow,
} from "@/lib/rankings";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Globe2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface UserRankingTableProps {
    mode: UserRankingMode;
    region: UserRankingRegion;
    page: number;
    pageSize: number;
    totalCount: number;
    rows: UserRankingRow[];
    currentUser: UserRankingRow | null;
}

const podiumStyles = ["text-score", "text-text-primary", "text-bronze"];

function UserAvatar({
    avatar,
    username,
    size = 32,
}: {
    avatar: string | null;
    username: string | null;
    size?: number;
}) {
    return (
        <span
            className="border-border bg-surface-muted flex shrink-0 items-center justify-center overflow-hidden rounded-full border bg-cover bg-center text-xs font-bold"
            style={{
                width: size,
                height: size,
                backgroundImage: avatar ? `url(${avatar})` : undefined,
            }}
            aria-label={`${username || "이름 없는 유저"} 프로필 이미지`}
        >
            {!avatar ? (username?.charAt(0).toUpperCase() ?? "?") : null}
        </span>
    );
}

function CountryMark({ country }: { country: string }) {
    if (country === "ko-KR") {
        return (
            <Image
                src="/flag/ko-KR.svg"
                alt="대한민국"
                width={16}
                height={12}
                className="rounded-[2px]"
            />
        );
    }

    if (country === "ja-JP") {
        return (
            <span
                className="relative h-3 w-4 rounded-[2px] bg-white"
                aria-label="일본"
            >
                <span className="bg-danger absolute top-1/2 left-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full" />
            </span>
        );
    }

    return <Globe2 size={14} aria-label="글로벌" />;
}

function ExamBadge({
    mode,
    exam,
}: {
    mode: UserRankingMode;
    exam: number | null;
}) {
    if (!exam) return null;

    return (
        <Badge variant={mode} className="h-5 shrink-0 px-1.5 text-[10px]">
            {mode === "basic" ? "Basic" : "Recital"} {exam}급
        </Badge>
    );
}

function gradeLabel(grade: number) {
    return Math.round(grade / 100).toLocaleString("ko-KR");
}

function paginationItems(page: number, totalPages: number) {
    if (totalPages <= 5) {
        return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    const pages = new Set([1, totalPages, page - 1, page, page + 1]);
    const sortedPages = [...pages]
        .filter((item) => item >= 1 && item <= totalPages)
        .sort((a, b) => a - b);
    const items: (number | "ellipsis")[] = [];

    sortedPages.forEach((item, index) => {
        if (index > 0 && item - sortedPages[index - 1] > 1) {
            items.push("ellipsis");
        }
        items.push(item);
    });

    return items;
}

export default function UserRankingTable({
    mode,
    region,
    page,
    pageSize,
    totalCount,
    rows,
    currentUser,
}: UserRankingTableProps) {
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
    const visiblePages = paginationItems(page, totalPages);
    const pageHref = (targetPage: number) =>
        `/rankings?mode=${mode}&region=${region}&page=${targetPage}`;

    return (
        <div className="flex flex-col gap-3">
            {currentUser ? (
                <section className="border-text-disabled/40 rounded-card flex min-h-15 items-center gap-3 border px-3">
                    <strong className="text-text-primary w-8 shrink-0 text-center text-sm tabular-nums">
                        {currentUser.rank}
                    </strong>
                    <UserAvatar
                        avatar={currentUser.avatar}
                        username={currentUser.username}
                        size={34}
                    />
                    <div className="min-w-0 flex-1">
                        <div className="flex min-w-0 items-center gap-2">
                            <p className="text-text-primary truncate text-sm font-bold">
                                {currentUser.username || "이름 없는 유저"}
                            </p>
                            <ExamBadge mode={mode} exam={currentUser.exam} />
                        </div>
                        <p className="text-caption mt-0.5">내 순위</p>
                    </div>
                    <strong className="text-text-primary shrink-0 text-sm tabular-nums">
                        Grd {gradeLabel(currentUser.grade)}
                    </strong>
                </section>
            ) : (
                <section className="border-border text-text-secondary rounded-card flex min-h-15 items-center justify-center border px-4 text-sm">
                    선택한 조건의 내 랭킹 기록이 없습니다.
                </section>
            )}

            <section className="bg-surface rounded-card overflow-hidden">
                {rows.length > 0 ? (
                    <ol>
                        {rows.map((row) => (
                            <li
                                key={row.id}
                                className="border-divider flex min-h-13 items-center gap-3 border-t px-3 first:border-t-0"
                            >
                                <span
                                    className={cn(
                                        "w-6 shrink-0 text-center text-sm font-bold tabular-nums",
                                        podiumStyles[row.rank - 1] ||
                                            "text-text-disabled"
                                    )}
                                >
                                    {row.rank}
                                </span>
                                <UserAvatar
                                    avatar={row.avatar}
                                    username={row.username}
                                />
                                <div className="min-w-0 flex-1">
                                    <div className="flex min-w-0 items-center gap-2">
                                        <span className="text-text-secondary shrink-0">
                                            <CountryMark
                                                country={row.country}
                                            />
                                        </span>
                                        <Link
                                            href={`/profile/${row.id}`}
                                            className="text-text-primary min-w-0 truncate text-sm font-semibold"
                                        >
                                            {row.username || "이름 없는 유저"}
                                        </Link>
                                        <ExamBadge
                                            mode={mode}
                                            exam={row.exam}
                                        />
                                    </div>
                                </div>
                                <strong className="text-text-primary shrink-0 text-sm tabular-nums">
                                    Grd {gradeLabel(row.grade)}
                                </strong>
                            </li>
                        ))}
                    </ol>
                ) : (
                    <div className="text-text-disabled flex h-32 items-center justify-center text-sm">
                        선택한 조건의 랭킹 기록이 없습니다.
                    </div>
                )}
            </section>

            {totalPages > 1 ? (
                <nav
                    className="flex justify-center gap-1"
                    aria-label="유저 랭킹 페이지"
                >
                    {page > 1 ? (
                        <Link
                            href={pageHref(page - 1)}
                            aria-label="이전 페이지"
                            className="border-border text-text-secondary flex size-8 items-center justify-center rounded-md border"
                        >
                            <ChevronLeft size={15} aria-hidden />
                        </Link>
                    ) : (
                        <span className="border-border text-text-disabled flex size-8 items-center justify-center rounded-md border opacity-40">
                            <ChevronLeft size={15} aria-hidden />
                        </span>
                    )}

                    {visiblePages.map((item, index) =>
                        item === "ellipsis" ? (
                            <span
                                key={`ellipsis-${index}`}
                                className="text-text-disabled flex size-8 items-center justify-center text-xs"
                            >
                                ...
                            </span>
                        ) : (
                            <Link
                                key={item}
                                href={pageHref(item)}
                                aria-current={
                                    item === page ? "page" : undefined
                                }
                                className={cn(
                                    "border-border flex size-8 items-center justify-center rounded-md border text-xs",
                                    item === page
                                        ? "bg-border text-text-primary font-bold"
                                        : "text-text-secondary"
                                )}
                            >
                                {item}
                            </Link>
                        )
                    )}

                    {page < totalPages ? (
                        <Link
                            href={pageHref(page + 1)}
                            aria-label="다음 페이지"
                            className="border-border text-text-secondary flex size-8 items-center justify-center rounded-md border"
                        >
                            <ChevronRight size={15} aria-hidden />
                        </Link>
                    ) : (
                        <span className="border-border text-text-disabled flex size-8 items-center justify-center rounded-md border opacity-40">
                            <ChevronRight size={15} aria-hidden />
                        </span>
                    )}
                </nav>
            ) : null}
        </div>
    );
}

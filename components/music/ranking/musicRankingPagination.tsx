import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

import { getVisibleRankingPages } from "./musicRankingUtils";

interface MusicRankingPaginationProps {
    musicIndex: string;
    difficulty: string;
    page: number;
    pageSize: number;
    totalCount: number;
}

// 랭킹 페이지 이동 링크를 최대 세 개까지 표시함
export default function MusicRankingPagination({
    musicIndex,
    difficulty,
    page,
    pageSize,
    totalCount,
}: MusicRankingPaginationProps) {
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

    if (totalPages <= 1) {
        return null;
    }

    const visiblePages = getVisibleRankingPages(page, totalPages);
    const pageHref = (targetPage: number) =>
        `/music/${musicIndex}/${difficulty.toLowerCase()}?tab=ranking&page=${targetPage}`;

    return (
        <nav className="flex justify-center gap-1" aria-label="랭킹 페이지">
            {page > 1 ? (
                <Link
                    href={pageHref(page - 1)}
                    aria-label="이전 페이지"
                    className="border-border text-text-secondary flex size-7 items-center justify-center rounded-md border"
                >
                    <ChevronLeft size={14} aria-hidden />
                </Link>
            ) : (
                <span className="border-border text-text-disabled flex size-7 items-center justify-center rounded-md border opacity-40">
                    <ChevronLeft size={14} aria-hidden />
                </span>
            )}

            {visiblePages.map((item) => (
                <Link
                    key={item}
                    href={pageHref(item)}
                    aria-current={item === page ? "page" : undefined}
                    className={cn(
                        "border-border flex size-7 items-center justify-center rounded-md border text-xs",
                        item === page
                            ? "bg-border text-text-primary font-bold"
                            : "text-text-secondary"
                    )}
                >
                    {item}
                </Link>
            ))}

            {page < totalPages ? (
                <Link
                    href={pageHref(page + 1)}
                    aria-label="다음 페이지"
                    className="border-border text-text-secondary flex size-7 items-center justify-center rounded-md border"
                >
                    <ChevronRight size={14} aria-hidden />
                </Link>
            ) : (
                <span className="border-border text-text-disabled flex size-7 items-center justify-center rounded-md border opacity-40">
                    <ChevronRight size={14} aria-hidden />
                </span>
            )}
        </nav>
    );
}

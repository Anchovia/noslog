import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { getVisibleRankingPages } from "./musicRankingUtils";

interface MusicRankingPaginationProps {
    page: number;
    pageSize: number;
    totalCount: number;
    onPageChange?: (page: number) => void;
}

// 랭킹 페이지 이동 링크를 최대 세 개까지 표시함
export default function MusicRankingPagination({
    page,
    pageSize,
    totalCount,
    onPageChange,
}: MusicRankingPaginationProps) {
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

    if (totalPages <= 1) {
        return null;
    }

    const visiblePages = getVisibleRankingPages(page, totalPages);
    return (
        <nav className="flex justify-center gap-1" aria-label="랭킹 페이지">
            {page > 1 ? (
                <button
                    type="button"
                    onClick={() => onPageChange?.(page - 1)}
                    aria-label="이전 페이지"
                    className="border-border text-text-secondary flex size-7 items-center justify-center rounded-md border"
                >
                    <ChevronLeft size={14} aria-hidden />
                </button>
            ) : (
                <span className="border-border text-text-disabled flex size-7 items-center justify-center rounded-md border opacity-40">
                    <ChevronLeft size={14} aria-hidden />
                </span>
            )}

            {visiblePages.map((item) => (
                <button
                    type="button"
                    key={item}
                    onClick={() => onPageChange?.(item)}
                    aria-current={item === page ? "page" : undefined}
                    className={cn(
                        "border-border flex size-7 items-center justify-center rounded-md border text-xs",
                        item === page
                            ? "bg-border text-text-primary font-bold"
                            : "text-text-secondary"
                    )}
                >
                    {item}
                </button>
            ))}

            {page < totalPages ? (
                <button
                    type="button"
                    onClick={() => onPageChange?.(page + 1)}
                    aria-label="다음 페이지"
                    className="border-border text-text-secondary flex size-7 items-center justify-center rounded-md border"
                >
                    <ChevronRight size={14} aria-hidden />
                </button>
            ) : (
                <span className="border-border text-text-disabled flex size-7 items-center justify-center rounded-md border opacity-40">
                    <ChevronRight size={14} aria-hidden />
                </span>
            )}
        </nav>
    );
}

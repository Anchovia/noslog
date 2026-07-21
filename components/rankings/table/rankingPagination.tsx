import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getPaginationItems } from "./rankingTableUtils";

interface RankingPaginationProps {
    page: number;
    pageSize: number;
    totalCount: number;
    onPageChange: (page: number) => void;
}

export default function RankingPagination({
    page,
    pageSize,
    totalCount,
    onPageChange,
}: RankingPaginationProps) {
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
    if (totalPages <= 1) return null;

    const visiblePages = getPaginationItems(page, totalPages);
    return (
        <nav
            className="flex justify-center gap-1"
            aria-label="유저 랭킹 페이지"
        >
            {page > 1 ? (
                <button
                    type="button"
                    onClick={() => onPageChange(page - 1)}
                    aria-label="이전 페이지"
                    className="border-border text-text-secondary flex size-8 cursor-pointer items-center justify-center rounded-md border"
                >
                    <ChevronLeft size={15} aria-hidden />
                </button>
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
                    <button
                        key={item}
                        type="button"
                        onClick={() => onPageChange(item)}
                        aria-current={item === page ? "page" : undefined}
                        className={cn(
                            "border-border flex size-8 cursor-pointer items-center justify-center rounded-md border text-xs",
                            item === page
                                ? "bg-border text-text-primary font-bold"
                                : "text-text-secondary"
                        )}
                    >
                        {item}
                    </button>
                )
            )}

            {page < totalPages ? (
                <button
                    type="button"
                    onClick={() => onPageChange(page + 1)}
                    aria-label="다음 페이지"
                    className="border-border text-text-secondary flex size-8 cursor-pointer items-center justify-center rounded-md border"
                >
                    <ChevronRight size={15} aria-hidden />
                </button>
            ) : (
                <span className="border-border text-text-disabled flex size-8 items-center justify-center rounded-md border opacity-40">
                    <ChevronRight size={15} aria-hidden />
                </span>
            )}
        </nav>
    );
}

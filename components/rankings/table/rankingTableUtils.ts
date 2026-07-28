import type {
    UserRankingMetric,
    UserRankingMode,
    UserRankingRegion,
} from "@/lib/rankings";

export type PaginationItem = number | "ellipsis";

export const PODIUM_STYLES = [
    "text-score",
    "text-text-primary",
    "text-bronze",
] as const;

export function formatRankingGrade(grade: number) {
    return Math.round(grade / 100).toLocaleString("ko-KR");
}

export function formatRankingRating(rating: number) {
    return Math.round(rating).toLocaleString("ko-KR");
}

export function getPaginationItems(
    page: number,
    totalPages: number
): PaginationItem[] {
    if (totalPages <= 5) {
        return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    const pages = new Set([1, totalPages, page - 1, page, page + 1]);
    const sortedPages = [...pages]
        .filter((item) => item >= 1 && item <= totalPages)
        .sort((a, b) => a - b);
    const items: PaginationItem[] = [];

    sortedPages.forEach((item, index) => {
        if (index > 0 && item - sortedPages[index - 1] > 1) {
            items.push("ellipsis");
        }
        items.push(item);
    });

    return items;
}

export function getRankingPageHref(
    mode: UserRankingMode,
    region: UserRankingRegion,
    page: number,
    metric: UserRankingMetric = "grade"
) {
    const metricParam = metric === "rating" ? "&metric=rating" : "";
    return `/rankings?mode=${mode}${metricParam}&region=${region}&page=${page}`;
}

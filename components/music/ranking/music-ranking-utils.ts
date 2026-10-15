export function getVisibleRankingPages(page: number, totalPages: number) {
    const safeTotalPages = Math.max(1, totalPages);
    const firstVisiblePage = Math.min(
        Math.max(1, page - 1),
        Math.max(1, safeTotalPages - 2)
    );

    return Array.from(
        { length: Math.min(3, safeTotalPages) },
        (_, index) => firstVisiblePage + index
    );
}

export function getRankingTopPercent(rank: number, totalCount: number) {
    if (totalCount <= 0) {
        return 0;
    }

    return Math.max(1, Math.ceil((rank / totalCount) * 100));
}

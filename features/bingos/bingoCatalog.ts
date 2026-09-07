import type {
    BingoCatalogItem,
    BingoCatalogQuery,
} from "@/features/bingos/schemas/publicBingoSchema";

export function getBingoCatalog(
    items: BingoCatalogItem[],
    query: BingoCatalogQuery
) {
    return items
        .filter((item) => {
            const cells = item.completedPositions.length;
            if (query.status === "progress")
                return cells > 0 && item.completedLines < item.requiredLines;
            if (query.status === "unlocked")
                return item.completedLines >= item.requiredLines && cells < 25;
            if (query.status === "full") return cells === 25;
            if (query.status === "chance") return item.chanceLines > 0;
            return true;
        })
        .sort((a, b) => {
            if (query.sort === "recent")
                return (
                    (b.lastModifiedAt ?? "").localeCompare(
                        a.lastModifiedAt ?? ""
                    ) || a.id - b.id
                );
            if (query.sort === "progress")
                return (
                    b.completedPositions.length - a.completedPositions.length ||
                    a.id - b.id
                );
            return b.id - a.id;
        });
}

export function getRecentBingo(items: BingoCatalogItem[]) {
    return [...items]
        .filter(
            (item) => item.completedPositions.length > 0 && item.lastModifiedAt
        )
        .sort(
            (a, b) =>
                b.lastModifiedAt!.localeCompare(a.lastModifiedAt!) ||
                a.id - b.id
        )[0];
}

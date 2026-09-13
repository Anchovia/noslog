import type {
    BingoCatalogItem,
    BingoCatalogQuery,
} from "@/features/bingos/schemas/publicBingoSchema";

// 오락실 검색과 같은 맞춤 — 전각·반각과 대소문자를 가리지 않는다
const normalized = (value: string) =>
    value.normalize("NFKC").trim().toLocaleLowerCase();

export function getBingoCatalog(
    items: BingoCatalogItem[],
    query: BingoCatalogQuery
) {
    const search = normalized(query.q);
    return items
        .filter((item) => {
            if (
                search &&
                ![item.title, ...(item.searchNames ?? [])].some((name) =>
                    normalized(name).includes(search)
                )
            )
                return false;
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

/**
 * 공개 채보가 「영상에서 추출」 인지 — 공개 버전까지 이어진 채보 줄기에 영상 추출 버전이 있는지(2026-09-24).
 *
 * 관리자 에디터는 공개 뒤에도 공개본을 이어 고치므로 한 줄기지만, 유저 기여 채보(kind "contribution")는
 * 초안을 연 순간의 공개본(기준 버전)에서 갈라져 나온다. 그 사이 관리자 초안에만 있던 영상 추출 버전은
 * 공개 채보의 조상이 아니고, 빈 채보에서 시작한 기여 채보는 영상 추출과 관계없다.
 */
export interface ChartSourceRevision {
    number: number;
    kind: string;
    /** 기여 채보의 기준 공개 버전 — 빈 채보에서 시작했으면 null */
    baseRevision?: number | null;
}

/** 기여 버전 메시지 끝 「· 기준 v18」 / 「· 새 채보」 — 공개할 때 남기는 형식 */
export function contributionRevisionMessage(
    draftId: number,
    authorName: string,
    baseRevision: number | null
) {
    return `기여 초안 #${draftId} · ${authorName} · ${
        baseRevision === null ? "새 채보" : `기준 v${baseRevision}`
    }`;
}

export function contributionBaseRevision(message: string | null) {
    const match = message?.match(/ · 기준 v(\d+)$/);
    return match ? Number(match[1]) : null;
}

export function isExtractedChart(
    publishedRevision: number,
    revisions: readonly ChartSourceRevision[]
): boolean {
    const sorted = [...revisions].sort((a, b) => b.number - a.number);
    let upper: number | null = publishedRevision;
    while (upper !== null) {
        const top: number = upper;
        const contribution = sorted.find(
            (revision) =>
                revision.kind === "contribution" && revision.number <= top
        );
        const floor = contribution?.number ?? 0;
        if (
            sorted.some(
                (revision) =>
                    revision.kind === "vid2bmap" &&
                    revision.number > floor &&
                    revision.number <= top
            )
        )
            return true;
        if (!contribution) return false;
        const base = contribution.baseRevision ?? null;
        // 기준 버전은 기여 버전보다 앞선다 — 잘못된 값이면 멈춘다
        upper = base !== null && base < contribution.number ? base : null;
    }
    return false;
}

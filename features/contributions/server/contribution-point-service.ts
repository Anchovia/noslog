import "server-only";

import type { Prisma } from "@prisma/client";
import { updateTag } from "next/cache";

import {
    CONTRIBUTION_KINDS,
    type ContributionKind,
    type ContributionTotals,
    type NameLabel,
    nameLabelFor,
} from "@/features/contributions/contribution-level";
import { getUserProfileTag } from "@/lib/cache-tags";
import db from "@/lib/db";
import { logServerError } from "@/lib/observability/server";

export interface ContributionAward {
    userId: number;
    kind: ContributionKind;
    sourceKey: string;
    points?: number;
}

/** 적립 한 줄 — 트랜잭션에 넣을 때 쓴다(대화형 트랜잭션이면 그 tx 를 넘긴다). 같은 기여는 한 번만(유일 키) */
export function contributionAwardQuery(
    awards: ContributionAward[],
    client: Pick<Prisma.TransactionClient, "contributionPoint"> = db
) {
    return client.contributionPoint.createMany({
        data: awards.map((award) => ({
            userId: award.userId,
            kind: award.kind,
            sourceKey: award.sourceKey,
            points: award.points ?? 1,
        })),
        skipDuplicates: true,
    });
}

/**
 * 적립 뒤 그 사람 프로필 캐시 갱신 — 라벨이 바로 바뀌게.
 * 랭킹 캐시에는 기여 정보가 없고 라벨은 캐시 밖에서 읽어(global-ranking-data) 랭킹은 비우지 않는다(2026-10-15 S4)
 */
export function refreshContributionViews(userIds: number[]) {
    for (const userId of new Set(userIds)) updateTag(getUserProfileTag(userId));
}

/**
 * 원래 동작과 떼어 적립 — 적립이 실패해도 제보 처리 · 기체 확인은 그대로 성공시킨다(로그만 남김)
 */
export async function awardContribution(award: ContributionAward) {
    try {
        const result = await contributionAwardQuery([award]);
        if (result.count) refreshContributionViews([award.userId]);
    } catch (error) {
        logServerError(error, {
            event: "contribution.points.award.failed",
            routePath: "/",
            routeType: "action",
        });
    }
}

export type { ContributionTotals };

function emptyTotals(): ContributionTotals {
    return {
        points: 0,
        chart_field: 0,
        chart: 0,
        chart_comment: 0,
        arcade_report: 0,
        cabinet_check: 0,
    };
}

/** 여러 사람의 점수 · 종류별 수를 한 번에 — 랭킹 · 의견 목록처럼 이름이 여럿 나오는 곳 */
export async function getContributionTotals(
    userIds: readonly number[]
): Promise<Map<number, ContributionTotals>> {
    const ids = [...new Set(userIds)].filter(
        (id) => Number.isSafeInteger(id) && id > 0
    );
    const totals = new Map<number, ContributionTotals>();
    if (!ids.length) return totals;
    const rows = await db.contributionPoint.groupBy({
        by: ["userId", "kind"],
        where: { userId: { in: ids } },
        _sum: { points: true },
        _count: { _all: true },
    });
    for (const row of rows) {
        const current = totals.get(row.userId) ?? emptyTotals();
        current.points += row._sum.points ?? 0;
        if (CONTRIBUTION_KINDS.includes(row.kind as ContributionKind)) {
            current[row.kind as ContributionKind] += row._count._all;
        }
        totals.set(row.userId, current);
    }
    return totals;
}

export async function getContributionTotal(userId: number) {
    return (await getContributionTotals([userId])).get(userId) ?? emptyTotals();
}

/**
 * 이름 옆 라벨을 여러 사람 한 번에 — minLevel 이상의 「기여 Lv.N」.
 * 라벨이 없는 사람은 Map 에 null.
 */
export async function getNameLabels(
    userIds: readonly number[],
    minLevel?: number
): Promise<Map<number, NameLabel | null>> {
    const ids = [...new Set(userIds)].filter(
        (id) => Number.isSafeInteger(id) && id > 0
    );
    const labels = new Map<number, NameLabel | null>();
    if (!ids.length) return labels;
    const [users, totals] = await Promise.all([
        db.user.findMany({
            where: { id: { in: ids } },
            select: { id: true },
        }),
        getContributionTotals(ids),
    ]);
    for (const user of users) {
        labels.set(
            user.id,
            nameLabelFor(totals.get(user.id)?.points ?? 0, minLevel)
        );
    }
    return labels;
}

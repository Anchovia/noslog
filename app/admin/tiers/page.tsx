import { listAdminTierLists } from "@/features/tiers/server/tier-admin-data";
import Link from "next/link";

import {
    AdminCard,
    AdminCardEmpty,
    AdminCardHead,
    AdminStatus,
    AdminTable,
} from "@/components/admin/admin-card";
import {
    TIER_MODE_GOALS,
    TIER_MODES,
    isCurrentTierScope,
    tierListLabel,
    type TierGoal,
    type TierMode,
} from "@/lib/tiers/tier-scope";
import { requireAdmin } from "@/lib/admin";

const statusLabel: Record<string, string> = {
    draft: "임시 저장",
    published: "공개",
    archived: "보관",
};

// 서열표 화면과 같은 순서 — Basic S · 990k · Pianist → Recital
function scopeOrder(mode: TierMode, goal: TierGoal) {
    return TIER_MODES.indexOf(mode) * 10 + TIER_MODE_GOALS[mode].indexOf(goal);
}

export default async function AdminTiersPage() {
    await requireAdmin();
    const tierLists = await listAdminTierLists();
    // 지금 쓰는 서열표만 위에, 목표가 없거나 모드별 목록에서 빠진 표(Recital S·FC 등)는 보관으로
    const activeTierLists = tierLists
        .filter((tierList) => isCurrentTierScope(tierList.mode, tierList.goal))
        .map((tierList) => ({
            ...tierList,
            mode: tierList.mode as TierMode,
            goal: tierList.goal as TierGoal,
        }))
        .sort(
            (left, right) =>
                scopeOrder(left.mode, left.goal) -
                scopeOrder(right.mode, right.goal)
        );
    const legacyTierLists = tierLists.filter(
        (tierList) => !isCurrentTierScope(tierList.mode, tierList.goal)
    );

    return (
        <div className="nl-admin-stack">
            <AdminCard>
                <AdminCardHead title="서열표" />
                {activeTierLists.length === 0 ? (
                    <AdminCardEmpty>등록된 서열표가 없습니다.</AdminCardEmpty>
                ) : (
                    <AdminTable>
                        <thead>
                            <tr>
                                <th scope="col">서열표</th>
                                <th scope="col">모드</th>
                                <th scope="col">상수 구간</th>
                                <th scope="col">채보</th>
                                <th scope="col">상태</th>
                            </tr>
                        </thead>
                        <tbody>
                            {activeTierLists.map((tierList) => (
                                <tr key={tierList.id}>
                                    <td>
                                        <Link
                                            href={`/admin/tiers/${tierList.id}`}
                                        >
                                            {tierList.mode === "recital"
                                                ? tierListLabel(
                                                      tierList.mode,
                                                      tierList.goal
                                                  )
                                                : `Basic · ${tierListLabel(tierList.mode, tierList.goal)}`}
                                        </Link>
                                    </td>
                                    <td>
                                        {tierList.mode === "recital"
                                            ? "Recital"
                                            : "Basic"}
                                    </td>
                                    <td>{tierList._count.bands}개</td>
                                    <td>{tierList._count.entries}곡</td>
                                    <td>
                                        <TierStatus status={tierList.status} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </AdminTable>
                )}
            </AdminCard>

            {legacyTierLists.length > 0 ? (
                <AdminCard>
                    <AdminCardHead
                        level="h2"
                        title={`기존 보관 서열표 ${legacyTierLists.length}개`}
                    />
                    <AdminTable>
                        <thead>
                            <tr>
                                <th scope="col">제목</th>
                                <th scope="col">상수 구간</th>
                                <th scope="col">채보</th>
                                <th scope="col">상태</th>
                            </tr>
                        </thead>
                        <tbody>
                            {legacyTierLists.map((tierList) => (
                                <tr key={tierList.id}>
                                    <td>
                                        <Link
                                            href={`/admin/tiers/${tierList.id}`}
                                        >
                                            {tierList.title}
                                        </Link>
                                    </td>
                                    <td>{tierList._count.bands}개</td>
                                    <td>{tierList._count.entries}곡</td>
                                    <td>
                                        <TierStatus status={tierList.status} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </AdminTable>
                </AdminCard>
            ) : null}
        </div>
    );
}

function TierStatus({ status }: { status: string }) {
    return (
        <AdminStatus tone={status === "published" ? "success" : "empty"}>
            {statusLabel[status] ?? status}
        </AdminStatus>
    );
}

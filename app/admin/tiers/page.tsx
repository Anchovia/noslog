import { listAdminTierLists } from "@/features/tiers/server/tier-admin-data";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

import {
    TIER_MODE_GOALS,
    TIER_MODES,
    isCurrentTierScope,
    tierListLabel,
    type TierGoal,
    type TierMode,
} from "@/lib/tiers";

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
        <div className="flex flex-col gap-nl-16 py-nl-24">
            <section>
                <div>
                    <h1 className="nl-section-title text-nl-content">
                        서열표 관리
                    </h1>
                    <p className="nl-metadata mt-nl-4 text-nl-subdued">
                        서열표의 상수 구간과 채보 배치를 관리합니다.
                    </p>
                </div>
            </section>

            <section className="overflow-hidden rounded-nl-control bg-nl-surface">
                {activeTierLists.map((tierList, index) => (
                    <Link
                        key={tierList.id}
                        href={`/admin/tiers/${tierList.id}`}
                        className={`nl-hover-layer flex min-h-nl-64 items-center gap-nl-12 px-nl-12 ${index > 0 ? "border-t-nl-stroke border-nl-divider" : ""}`}
                    >
                        <span className="nl-tag shrink-0">
                            {tierList.mode === "recital" ? "Recital" : "Basic"}
                        </span>
                        <span className="min-w-0 flex-1">
                            <strong className="nl-emphasis-label block truncate text-nl-content">
                                {tierList.mode === "recital"
                                    ? tierListLabel(
                                          tierList.mode,
                                          tierList.goal
                                      )
                                    : `Basic · ${tierListLabel(tierList.mode, tierList.goal)}`}
                            </strong>
                            <span className="nl-metadata block truncate text-nl-subdued">
                                상수 구간 {tierList._count.bands}개 · 채보{" "}
                                {tierList._count.entries}곡 ·{" "}
                                {statusLabel[tierList.status] ??
                                    tierList.status}
                            </span>
                        </span>
                        <ChevronRight className="nl-icon-small text-nl-disabled" />
                    </Link>
                ))}
                {activeTierLists.length === 0 ? (
                    <p className="nl-body-secondary py-nl-48 text-center text-nl-subdued">
                        등록된 서열표가 없습니다.
                    </p>
                ) : null}
            </section>

            {legacyTierLists.length > 0 ? (
                <details className="rounded-nl-control bg-nl-surface px-nl-12 py-nl-12">
                    <summary className="nl-emphasis-label cursor-pointer list-none text-nl-content">
                        기존 보관 서열표 {legacyTierLists.length}개
                    </summary>
                    <div className="mt-nl-12 flex flex-col border-t-nl-stroke border-nl-divider pt-nl-8">
                        {legacyTierLists.map((tierList) => (
                            <Link
                                key={tierList.id}
                                href={`/admin/tiers/${tierList.id}`}
                                className="nl-hover-layer flex min-h-nl-48 items-center gap-nl-8 rounded-nl-control px-nl-8"
                            >
                                <span className="nl-body-secondary min-w-0 flex-1 truncate">
                                    {tierList.title}
                                </span>
                                <ChevronRight className="nl-icon-small text-nl-disabled" />
                            </Link>
                        ))}
                    </div>
                </details>
            ) : null}
        </div>
    );
}

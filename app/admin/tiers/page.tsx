import { ChevronRight } from "lucide-react";
import Link from "next/link";

import db from "@/lib/db";
import { tierGoalLabels, type TierGoal } from "@/lib/tiers";

const modeColor: Record<string, string> = {
    basic: "bg-basic/10 text-basic",
    recital: "bg-recital/10 text-recital",
};

const statusLabel: Record<string, string> = {
    draft: "임시 저장",
    published: "공개",
    archived: "보관",
};

export default async function AdminTiersPage() {
    const tierLists = await db.tierList.findMany({
        include: {
            _count: { select: { bands: true, entries: true } },
        },
        orderBy: [{ mode: "asc" }, { goal: "asc" }, { updatedAt: "desc" }],
    });
    const activeTierLists = tierLists.filter((tierList) => tierList.goal);
    const legacyTierLists = tierLists.filter((tierList) => !tierList.goal);

    return (
        <div className="flex flex-col gap-4 px-4 py-5">
            <section>
                <div>
                    <h1 className="text-title">서열표 관리</h1>
                    <p className="text-caption mt-1">
                        서열표의 상수 구간과 채보 배치를 관리합니다.
                    </p>
                </div>
            </section>

            <section className="bg-surface rounded-card overflow-hidden">
                {activeTierLists.map((tierList, index) => (
                    <Link
                        key={tierList.id}
                        href={`/admin/tiers/${tierList.id}`}
                        className={`hover:bg-surface-muted flex min-h-17 items-center gap-3 px-3 ${index > 0 ? "border-divider border-t" : ""}`}
                    >
                        <span
                            className={`flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-bold ${modeColor[tierList.mode] ?? "bg-surface-muted text-text-secondary"}`}
                        >
                            {tierList.mode === "recital" ? "Recital" : "Basic"}
                        </span>
                        <span className="min-w-0 flex-1">
                            <strong className="text-body block truncate font-bold">
                                {tierList.mode === "recital"
                                    ? "Recital"
                                    : "Basic"}{" "}
                                · {tierGoalLabels[tierList.goal as TierGoal]}
                            </strong>
                            <span className="text-caption block truncate">
                                상수 구간 {tierList._count.bands}개 · 채보{" "}
                                {tierList._count.entries}곡 ·{" "}
                                {statusLabel[tierList.status] ??
                                    tierList.status}
                            </span>
                        </span>
                        <ChevronRight className="text-text-disabled size-4" />
                    </Link>
                ))}
                {activeTierLists.length === 0 ? (
                    <p className="text-body-muted py-12 text-center">
                        등록된 서열표가 없습니다.
                    </p>
                ) : null}
            </section>

            {legacyTierLists.length > 0 ? (
                <details className="bg-surface rounded-card px-3 py-3">
                    <summary className="text-body cursor-pointer list-none font-semibold">
                        기존 보관 서열표 {legacyTierLists.length}개
                    </summary>
                    <div className="border-divider mt-3 flex flex-col border-t pt-2">
                        {legacyTierLists.map((tierList) => (
                            <Link
                                key={tierList.id}
                                href={`/admin/tiers/${tierList.id}`}
                                className="hover:bg-surface-muted flex min-h-12 items-center gap-2 rounded-md px-2"
                            >
                                <span className="min-w-0 flex-1 truncate text-sm">
                                    {tierList.title}
                                </span>
                                <ChevronRight className="text-text-disabled size-4" />
                            </Link>
                        ))}
                    </div>
                </details>
            ) : null}
        </div>
    );
}

import { ChevronRight, Plus } from "lucide-react";
import Link from "next/link";

import db from "@/lib/db";

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
        orderBy: { updatedAt: "desc" },
    });

    return (
        <div className="flex flex-col gap-4 px-4 py-5">
            <section className="flex items-start justify-between gap-3">
                <div>
                    <h1 className="text-title">서열표 관리</h1>
                    <p className="text-caption mt-1">
                        서열표의 상수 구간과 채보 배치를 관리합니다.
                    </p>
                </div>
                <Link
                    href="/admin/tiers/new"
                    aria-label="서열표 추가"
                    title="서열표 추가"
                    className="bg-text-primary text-bg flex size-10 items-center justify-center rounded-md"
                >
                    <Plus className="size-5" />
                </Link>
            </section>

            <section className="bg-surface rounded-card overflow-hidden">
                {tierLists.map((tierList, index) => (
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
                                {tierList.title}
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
                {tierLists.length === 0 ? (
                    <p className="text-body-muted py-12 text-center">
                        등록된 서열표가 없습니다.
                    </p>
                ) : null}
            </section>
        </div>
    );
}

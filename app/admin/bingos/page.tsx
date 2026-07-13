import { ChevronRight, Plus } from "lucide-react";
import Link from "next/link";

import db from "@/lib/db";

export default async function AdminBingosPage() {
    const bingos = await db.bingo.findMany({
        include: {
            coverMusic: { select: { title: true } },
            _count: { select: { cells: true } },
        },
        orderBy: { updatedAt: "desc" },
    });

    return (
        <div className="flex flex-col gap-4 px-4 py-5">
            <section className="flex items-start justify-between gap-3">
                <div>
                    <h1 className="text-title">빙고 관리</h1>
                    <p className="text-caption mt-1">
                        빙고판의 미션과 공개 상태를 관리합니다.
                    </p>
                </div>
                <Link
                    href="/admin/bingos/new"
                    aria-label="빙고 추가"
                    title="빙고 추가"
                    className="bg-text-primary text-bg flex size-10 items-center justify-center rounded-md"
                >
                    <Plus className="size-5" />
                </Link>
            </section>
            <section className="bg-surface rounded-card overflow-hidden">
                {bingos.map((bingo, index) => (
                    <Link
                        key={bingo.id}
                        href={`/admin/bingos/${bingo.id}`}
                        className={`hover:bg-surface-muted flex min-h-17 items-center gap-3 px-3 ${index > 0 ? "border-divider border-t" : ""}`}
                    >
                        <span
                            className={`flex size-10 shrink-0 items-center justify-center rounded-md text-xs font-bold ${bingo.status === "published" ? "bg-success/10 text-success" : "bg-surface-muted text-text-secondary"}`}
                        >
                            {bingo.requiredLines}줄
                        </span>
                        <span className="min-w-0 flex-1">
                            <strong className="text-body block truncate font-bold">
                                {bingo.title ?? "제목 없음"}
                            </strong>
                            <span className="text-caption block truncate">
                                {bingo.coverMusic.title} · {bingo._count.cells}
                                /25칸 ·{" "}
                                {bingo.rewardNos.toLocaleString("ko-KR")} nos
                            </span>
                        </span>
                        <ChevronRight className="text-text-disabled size-4" />
                    </Link>
                ))}
                {bingos.length === 0 ? (
                    <p className="text-body-muted py-12 text-center">
                        등록된 빙고가 없습니다.
                    </p>
                ) : null}
            </section>
        </div>
    );
}

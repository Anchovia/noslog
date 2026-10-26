import { listAdminBingos } from "@/features/bingos/server/bingo-admin-data";
import { ChevronRight, Plus } from "lucide-react";
import Link from "next/link";

import { foundationButtonClass } from "@/components/ui/button";

export default async function AdminBingosPage() {
    const bingos = await listAdminBingos();

    return (
        <div className="flex flex-col gap-nl-16 py-nl-24">
            <section className="flex items-start justify-between gap-nl-12">
                <div>
                    <h1 className="nl-section-title text-nl-content">
                        빙고 관리
                    </h1>
                    <p className="nl-metadata mt-nl-4 text-nl-subdued">
                        빙고판의 미션과 공개 상태를 관리합니다.
                    </p>
                </div>
                <Link
                    href="/admin/bingos/new"
                    aria-label="빙고 추가"
                    title="빙고 추가"
                    className={foundationButtonClass({ size: "icon" })}
                >
                    <Plus className="nl-icon" />
                </Link>
            </section>
            <section className="overflow-hidden rounded-nl-control bg-nl-surface">
                {bingos.map((bingo, index) => (
                    <Link
                        key={bingo.id}
                        href={`/admin/bingos/${bingo.id}`}
                        className={`nl-hover-layer flex min-h-nl-64 items-center gap-nl-12 px-nl-12 ${index > 0 ? "border-t-nl-stroke border-nl-divider" : ""}`}
                    >
                        <span
                            className={`nl-metadata flex size-nl-32 shrink-0 items-center justify-center rounded-nl-control bg-nl-surface ${bingo.status === "published" ? "text-nl-success" : "text-nl-subdued"}`}
                        >
                            {bingo.requiredLines}줄
                        </span>
                        <span className="min-w-0 flex-1">
                            <strong className="nl-emphasis-label block truncate text-nl-content">
                                {bingo.title ?? "제목 없음"}
                            </strong>
                            <span className="nl-metadata block truncate text-nl-subdued">
                                {bingo.coverMusic.title} · {bingo._count.cells}
                                /25칸 ·{" "}
                                {bingo.rewardNos.toLocaleString("ko-KR")} nos
                            </span>
                        </span>
                        <ChevronRight className="nl-icon-small text-nl-disabled" />
                    </Link>
                ))}
                {bingos.length === 0 ? (
                    <p className="nl-body-secondary py-nl-48 text-center text-nl-subdued">
                        등록된 빙고가 없습니다.
                    </p>
                ) : null}
            </section>
        </div>
    );
}

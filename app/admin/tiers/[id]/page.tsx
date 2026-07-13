import { Plus } from "lucide-react";
import { notFound } from "next/navigation";

import {
    addTierBand,
    deleteTierList,
    updateTierList,
} from "@/app/admin/tiers/actions";
import TierBoard from "@/components/admin/tierBoard";
import TierListForm from "@/components/admin/tierListForm";
import db from "@/lib/db";

export default async function EditTierListPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const tierListId = Number(id);
    if (!Number.isInteger(tierListId)) notFound();

    const tierList = await db.tierList.findUnique({
        where: { id: tierListId },
        include: {
            bands: {
                include: {
                    entries: {
                        include: {
                            chart: {
                                include: {
                                    music: {
                                        select: {
                                            title: true,
                                            artist: true,
                                            background: true,
                                        },
                                    },
                                },
                            },
                        },
                        orderBy: { position: "asc" },
                    },
                },
                orderBy: { position: "asc" },
            },
        },
    });
    if (!tierList) notFound();

    return (
        <div className="flex flex-col gap-5 px-4 py-5">
            <section>
                <h1 className="text-title">{tierList.title}</h1>
                <p className="text-caption mt-1">
                    채보를 끌어서 구간과 배치 순서를 변경합니다.
                </p>
            </section>

            <details className="bg-surface rounded-card group p-3">
                <summary className="text-body cursor-pointer list-none font-bold">
                    서열표 정보
                </summary>
                <div className="border-divider mt-3 border-t pt-3">
                    <TierListForm
                        action={updateTierList}
                        tierList={{
                            id: tierList.id,
                            slug: tierList.slug,
                            title: tierList.title,
                            mode: tierList.mode,
                            description: tierList.description ?? "",
                            status: tierList.status,
                        }}
                    />
                </div>
            </details>

            <section className="flex flex-col gap-3">
                <form
                    action={addTierBand}
                    className="border-divider flex items-center gap-2 rounded-md border border-dashed p-2"
                >
                    <input
                        type="hidden"
                        name="tierListId"
                        value={tierList.id}
                    />
                    <input
                        name="value"
                        type="number"
                        min="1"
                        max="14"
                        step="0.01"
                        required
                        aria-label="추가할 서열표 상수"
                        placeholder="구간 추가 (예: 12.7)"
                        className="h-8 min-w-0 flex-1 bg-transparent text-center text-sm font-semibold outline-none"
                    />
                    <button
                        type="submit"
                        aria-label="상수 구간 추가"
                        title="상수 구간 추가"
                        className="text-text-secondary hover:text-text-primary ml-auto flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-md"
                    >
                        <Plus className="size-4" />
                    </button>
                </form>

                <TierBoard
                    tierListId={tierList.id}
                    bands={tierList.bands.map((band) => ({
                        id: band.id,
                        value: band.value,
                        entries: band.entries.map((entry) => ({
                            id: entry.id,
                            position: entry.position,
                            chart: {
                                id: entry.chart.id,
                                difficulty: entry.chart.difficulty,
                                level: entry.chart.level,
                                music: entry.chart.music,
                            },
                        })),
                    }))}
                />
            </section>

            <form
                action={deleteTierList}
                className="border-divider border-t pt-5"
            >
                <input type="hidden" name="id" value={tierList.id} />
                <button className="border-danger/60 text-danger hover:bg-danger/10 h-10 w-full cursor-pointer rounded-md border text-sm font-bold">
                    서열표 삭제
                </button>
            </form>
        </div>
    );
}

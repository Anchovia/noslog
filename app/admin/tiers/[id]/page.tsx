import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { notFound } from "next/navigation";

import {
    addTierBand,
    deleteTierBand,
    deleteTierEntry,
    deleteTierList,
    moveTierEntryOrder,
    updateTierBand,
    updateTierList,
} from "@/app/admin/tiers/actions";
import TierBandSelect from "@/components/admin/tierBandSelect";
import TierChartPicker from "@/components/admin/tierChartPicker";
import TierListForm from "@/components/admin/tierListForm";
import db from "@/lib/db";

const difficultyColor: Record<string, string> = {
    normal: "text-normal",
    hard: "text-hard",
    expert: "text-expert",
    real: "text-real",
};

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
                    상수 구간을 만든 뒤 채보를 원하는 순서로 배치합니다.
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
                <div className="flex items-end justify-between gap-3">
                    <div>
                        <h2 className="text-section font-bold">상수 구간</h2>
                        <p className="text-caption mt-1">
                            서열표에 사용할 값을 높은 순서대로 추가합니다.
                        </p>
                    </div>
                    <form
                        action={addTierBand}
                        className="flex items-center gap-1"
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
                            placeholder="12.9"
                            className="border-border bg-bg text-input h-9 w-20 rounded-md border px-2 text-right font-bold tabular-nums"
                        />
                        <button
                            type="submit"
                            aria-label="상수 구간 추가"
                            title="상수 구간 추가"
                            className="bg-text-primary text-bg flex size-9 cursor-pointer items-center justify-center rounded-md"
                        >
                            <Plus className="size-4" />
                        </button>
                    </form>
                </div>

                <TierChartPicker
                    tierListId={tierList.id}
                    bands={tierList.bands.map((band) => ({
                        id: band.id,
                        value: band.value,
                    }))}
                />

                {tierList.bands.map((band) => (
                    <article
                        key={band.id}
                        className="bg-surface border-real/70 rounded-card overflow-hidden border-l-3"
                    >
                        <header className="bg-surface-muted flex items-center gap-2 px-3 py-2">
                            <form
                                action={updateTierBand}
                                className="flex items-center gap-2"
                            >
                                <input
                                    type="hidden"
                                    name="id"
                                    value={band.id}
                                />
                                <input
                                    name="value"
                                    type="number"
                                    min="1"
                                    max="14"
                                    step="0.01"
                                    required
                                    defaultValue={band.value}
                                    aria-label="서열표 상수"
                                    className="border-border bg-bg h-9 w-20 rounded-md border px-2 text-right font-bold tabular-nums"
                                />
                                <button className="border-border hover:bg-bg h-9 cursor-pointer rounded-md border px-2 text-xs font-bold">
                                    저장
                                </button>
                            </form>
                            <span className="text-caption ml-auto">
                                {band.entries.length}곡
                            </span>
                            <form action={deleteTierBand}>
                                <input
                                    type="hidden"
                                    name="id"
                                    value={band.id}
                                />
                                <button
                                    aria-label={`${band.value} 구간 삭제`}
                                    title="구간 삭제"
                                    className="text-danger hover:bg-danger/10 flex size-9 cursor-pointer items-center justify-center rounded-md"
                                >
                                    <Trash2 className="size-4" />
                                </button>
                            </form>
                        </header>

                        {band.entries.map((entry, index) => {
                            const difficulty =
                                entry.chart.difficulty.toLowerCase();
                            return (
                                <div
                                    key={entry.id}
                                    className={`p-3 ${index > 0 ? "border-divider border-t" : ""}`}
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="text-text-disabled w-5 shrink-0 text-center text-xs tabular-nums">
                                            {entry.position}
                                        </span>
                                        <div
                                            className="bg-surface-muted size-10 shrink-0 rounded-md bg-cover bg-center"
                                            style={
                                                entry.chart.music.background
                                                    ? {
                                                          backgroundImage: `url(${entry.chart.music.background})`,
                                                      }
                                                    : undefined
                                            }
                                            aria-hidden="true"
                                        />
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-bold">
                                                {entry.chart.music.title}
                                            </p>
                                            <p className="text-caption truncate">
                                                <span
                                                    className={`font-semibold ${difficultyColor[difficulty] ?? ""}`}
                                                >
                                                    {entry.chart.difficulty} Lv
                                                    {entry.chart.level}
                                                </span>
                                                {entry.chart.music.artist
                                                    ? ` · ${entry.chart.music.artist}`
                                                    : ""}
                                            </p>
                                        </div>
                                        <form action={deleteTierEntry}>
                                            <input
                                                type="hidden"
                                                name="id"
                                                value={entry.id}
                                            />
                                            <button
                                                aria-label="채보 제거"
                                                title="채보 제거"
                                                className="text-danger hover:bg-danger/10 flex size-8 cursor-pointer items-center justify-center rounded-md"
                                            >
                                                <Trash2 className="size-4" />
                                            </button>
                                        </form>
                                    </div>
                                    <div className="mt-2 flex items-center justify-end gap-1 pl-7">
                                        <span className="text-caption mr-auto">
                                            상수 구간
                                        </span>
                                        <TierBandSelect
                                            entryId={entry.id}
                                            currentBandId={band.id}
                                            title={entry.chart.music.title}
                                            bands={tierList.bands.map(
                                                (option) => ({
                                                    id: option.id,
                                                    value: option.value,
                                                })
                                            )}
                                        />
                                        <form
                                            action={moveTierEntryOrder}
                                            className="flex shrink-0"
                                        >
                                            <input
                                                type="hidden"
                                                name="id"
                                                value={entry.id}
                                            />
                                            <button
                                                name="direction"
                                                value="up"
                                                disabled={index === 0}
                                                aria-label="위로 이동"
                                                title="위로 이동"
                                                className="text-text-secondary hover:text-text-primary flex size-8 cursor-pointer items-center justify-center disabled:cursor-not-allowed disabled:opacity-30"
                                            >
                                                <ArrowUp className="size-4" />
                                            </button>
                                            <button
                                                name="direction"
                                                value="down"
                                                disabled={
                                                    index ===
                                                    band.entries.length - 1
                                                }
                                                aria-label="아래로 이동"
                                                title="아래로 이동"
                                                className="text-text-secondary hover:text-text-primary flex size-8 cursor-pointer items-center justify-center disabled:cursor-not-allowed disabled:opacity-30"
                                            >
                                                <ArrowDown className="size-4" />
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            );
                        })}
                        {band.entries.length === 0 ? (
                            <p className="text-body-muted py-8 text-center">
                                이 구간에 배치된 채보가 없습니다.
                            </p>
                        ) : null}
                    </article>
                ))}

                {tierList.bands.length === 0 ? (
                    <p className="bg-surface rounded-card text-body-muted py-12 text-center">
                        먼저 서열표 상수 구간을 추가해주세요.
                    </p>
                ) : null}
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

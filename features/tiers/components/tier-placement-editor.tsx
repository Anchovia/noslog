"use client";

import { Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { type FormEvent, useState, useTransition } from "react";
import { toast } from "sonner";

import { moveTierEntryToBand } from "@/app/admin/tiers/actions";
import MusicJacket from "@/components/music/music-jacket";
import { createTierEntryMoveFormData } from "@/features/tiers/schemas/tier-admin-schema";
import { formatOfficialChartLevel, formatTierValue } from "@/lib/tiers";

// 관리자 악곡 관리(musicMetadataForms)와 같은 난이도 색
const difficultyColor: Record<string, string> = {
    normal: "text-normal",
    hard: "text-hard",
    expert: "text-expert",
    real: "text-real",
};

interface TierPlacementEditorProps {
    tierListId: number;
    bands: { id: number; value: number }[];
    entries: {
        id: number;
        tierBandId: number;
        chart: {
            difficulty: string;
            level: number;
            music: {
                index: string;
                title: string;
                artist: string | null;
                background: string | null;
            };
        };
    }[];
    totalCount: number;
}

export default function TierPlacementEditor({
    bands,
    entries,
    totalCount,
}: TierPlacementEditorProps) {
    const router = useRouter();
    const [pendingEntryId, setPendingEntryId] = useState<number | null>(null);
    const [isPending, startTransition] = useTransition();

    function handleSubmit(event: FormEvent<HTMLFormElement>, entryId: number) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const tierBandId = Number(formData.get("tierBandId"));
        setPendingEntryId(entryId);

        startTransition(async () => {
            try {
                const result = await moveTierEntryToBand(
                    createTierEntryMoveFormData({ entryId, tierBandId })
                );
                if (!result.success) {
                    toast.error(result.message);
                    return;
                }

                toast.success(result.message);
                router.refresh();
            } catch {
                toast.error("채보의 서열 상수를 저장하지 못했습니다.");
            } finally {
                setPendingEntryId(null);
            }
        });
    }

    return (
        <section className="flex flex-col gap-3">
            <p className="px-1 text-caption">
                검색 결과 {totalCount}곡 · 한 페이지에 최대 100곡
            </p>
            <div className="overflow-hidden rounded-card bg-surface">
                {entries.map((entry, index) => (
                    <form
                        key={entry.id}
                        onSubmit={(event) => handleSubmit(event, entry.id)}
                        className={`flex min-h-18 items-center gap-2 p-3 ${index > 0 ? "border-t border-divider" : ""}`}
                    >
                        <MusicJacket
                            index={entry.chart.music.index}
                            background={entry.chart.music.background}
                            title={entry.chart.music.title}
                            className="size-11 shrink-0 rounded-md"
                        />
                        <span className="min-w-0 flex-1">
                            <strong className="block truncate text-sm">
                                {entry.chart.music.title}
                            </strong>
                            <span className="block truncate text-caption">
                                <span
                                    className={
                                        difficultyColor[
                                            entry.chart.difficulty.toLowerCase()
                                        ]
                                    }
                                >
                                    {entry.chart.difficulty} ·{" "}
                                    {formatOfficialChartLevel(
                                        entry.chart.difficulty,
                                        entry.chart.level
                                    )}
                                </span>
                            </span>
                        </span>
                        <select
                            name="tierBandId"
                            defaultValue={entry.tierBandId}
                            aria-label={`${entry.chart.music.title} 서열 상수`}
                            className="h-10 w-22 shrink-0 rounded-md border border-border bg-bg px-2 text-input text-xs font-semibold tabular-nums"
                        >
                            {bands.map((band) => (
                                <option key={band.id} value={band.id}>
                                    {formatTierValue(band.value)}
                                </option>
                            ))}
                        </select>
                        <button
                            type="submit"
                            disabled={isPending}
                            aria-label={`${entry.chart.music.title} 서열 상수 저장`}
                            title="서열 상수 저장"
                            className="flex size-10 shrink-0 items-center justify-center rounded-md text-text-secondary hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <Save className="size-4" aria-hidden />
                            <span className="sr-only">
                                {pendingEntryId === entry.id
                                    ? "저장 중"
                                    : "저장"}
                            </span>
                        </button>
                    </form>
                ))}
                {entries.length === 0 ? (
                    <p className="py-12 text-center text-body-muted">
                        조건에 해당하는 채보가 없습니다.
                    </p>
                ) : null}
            </div>
        </section>
    );
}

"use client";

import { Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { type FormEvent, useState, useTransition } from "react";
import { toast } from "sonner";

import { moveTierEntryToBand } from "@/app/admin/tiers/actions";
import MusicJacket from "@/components/music/music-jacket";
import { foundationButtonClass } from "@/components/ui/button";
import { createTierEntryMoveFormData } from "@/features/tiers/schemas/tier-admin-schema";
import { cn } from "@/lib/cn";
import { formatOfficialChartLevel, formatTierValue } from "@/lib/tiers";

// 관리자 악곡 관리(musicMetadataForms)와 같은 난이도 색
const difficultyColor: Record<string, string> = {
    normal: "text-nl-difficulty-normal",
    hard: "text-nl-difficulty-hard",
    expert: "text-nl-difficulty-expert",
    real: "text-nl-difficulty-real",
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
        <section className="flex flex-col gap-nl-12">
            <p className="nl-metadata px-nl-4 text-nl-subdued">
                검색 결과 {totalCount}곡 · 한 페이지에 최대 100곡
            </p>
            <div className="overflow-hidden rounded-nl-container bg-nl-surface">
                {entries.map((entry, index) => (
                    <form
                        key={entry.id}
                        onSubmit={(event) => handleSubmit(event, entry.id)}
                        className={`flex min-h-nl-64 items-center gap-nl-8 p-nl-12 ${index > 0 ? "border-t-nl-stroke border-nl-divider" : ""}`}
                    >
                        <MusicJacket
                            index={entry.chart.music.index}
                            background={entry.chart.music.background}
                            title={entry.chart.music.title}
                            className="size-nl-48 shrink-0 rounded-nl-field"
                        />
                        <span className="min-w-0 flex-1">
                            <strong className="nl-body-secondary block truncate">
                                {entry.chart.music.title}
                            </strong>
                            <span className="nl-metadata block truncate text-nl-subdued">
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
                            className="nl-input nl-admin-number-input shrink-0"
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
                            className={cn(
                                foundationButtonClass({
                                    variant: "ghost",
                                    size: "icon",
                                }),
                                "shrink-0"
                            )}
                        >
                            <Save className="nl-icon-small" aria-hidden />
                            <span className="sr-only">
                                {pendingEntryId === entry.id
                                    ? "저장 중"
                                    : "저장"}
                            </span>
                        </button>
                    </form>
                ))}
                {entries.length === 0 ? (
                    <p className="nl-body-secondary py-nl-48 text-center text-nl-subdued">
                        조건에 해당하는 채보가 없습니다.
                    </p>
                ) : null}
            </div>
        </section>
    );
}

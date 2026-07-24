import { Save } from "lucide-react";

import { moveTierEntryToBand } from "@/app/admin/tiers/actions";
import MusicJacket from "@/components/music/musicJacket";
import { formatOfficialChartLevel, formatTierValue } from "@/lib/tiers";

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
    tierListId,
    bands,
    entries,
    totalCount,
}: TierPlacementEditorProps) {
    return (
        <section className="flex flex-col gap-3">
            <p className="text-caption px-1">
                검색 결과 {totalCount}곡 · 한 페이지에 최대 100곡
            </p>
            <div className="bg-surface rounded-card overflow-hidden">
                {entries.map((entry, index) => (
                    <form
                        key={entry.id}
                        action={moveTierEntryToBand}
                        className={`flex min-h-18 items-center gap-2 p-3 ${index > 0 ? "border-divider border-t" : ""}`}
                    >
                        <input type="hidden" name="entryId" value={entry.id} />
                        <input
                            type="hidden"
                            name="tierListId"
                            value={tierListId}
                        />
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
                            <span className="text-caption block truncate">
                                {entry.chart.difficulty} ·{" "}
                                {formatOfficialChartLevel(
                                    entry.chart.difficulty,
                                    entry.chart.level
                                )}
                            </span>
                        </span>
                        <select
                            name="tierBandId"
                            defaultValue={entry.tierBandId}
                            aria-label={`${entry.chart.music.title} 서열 상수`}
                            className="border-border bg-bg text-input h-10 w-22 shrink-0 rounded-md border px-2 text-xs font-semibold tabular-nums"
                        >
                            {bands.map((band) => (
                                <option key={band.id} value={band.id}>
                                    {formatTierValue(band.value)}
                                </option>
                            ))}
                        </select>
                        <button
                            type="submit"
                            aria-label={`${entry.chart.music.title} 서열 상수 저장`}
                            title="서열 상수 저장"
                            className="text-text-secondary hover:bg-surface-muted flex size-10 shrink-0 items-center justify-center rounded-md"
                        >
                            <Save className="size-4" />
                        </button>
                    </form>
                ))}
                {entries.length === 0 ? (
                    <p className="text-body-muted py-12 text-center">
                        조건에 해당하는 채보가 없습니다.
                    </p>
                ) : null}
            </div>
        </section>
    );
}

import { getAdminChartPatternEditor } from "@/features/music/server/chart-pattern-data";
import { notFound } from "next/navigation";

import ChartTimingEditor from "@/components/admin/chart-pattern/chartTimingEditor";
import {
    chartDocumentSchema,
    createDefaultChartDocument,
} from "@/lib/chart-pattern/schema";
import { parseChartDifficulty } from "@/lib/tiers";
import { requireAdmin } from "@/lib/admin";

export default async function AdminChartPatternEditorPage({
    params,
}: {
    params: Promise<{ index: string; difficulty: string }>;
}) {
    await requireAdmin();
    const { index, difficulty } = await params;
    const musicIndex = decodeURIComponent(index);
    const chartDifficulty = parseChartDifficulty(
        decodeURIComponent(difficulty)
    );
    if (!chartDifficulty) notFound();
    const chart = await getAdminChartPatternEditor(musicIndex, chartDifficulty);
    if (!chart) notFound();

    const storedDocument = chart.pattern
        ? chartDocumentSchema.safeParse(chart.pattern.draftContent)
        : null;
    const initialDocument =
        storedDocument?.success === true
            ? storedDocument.data
            : createDefaultChartDocument({
                  bpm: chart.bpmMin,
                  durationMs:
                      chart.durationSeconds === null
                          ? 0
                          : chart.durationSeconds * 1_000,
              });

    return (
        <ChartTimingEditor
            metadata={{
                chartId: chart.id,
                musicIndex: chart.music.index,
                title: chart.music.title,
                artist: chart.music.artist,
                difficulty: chart.difficulty,
                level: chart.level,
                noteCount: chart.noteCount,
            }}
            initialDocument={initialDocument}
            draftVersion={chart.pattern?.draftVersion ?? 0}
            savedRevision={chart.pattern?.savedRevision ?? 0}
            publishedRevision={chart.pattern?.publishedRevision ?? null}
            updatedAt={chart.pattern?.updatedAt.toISOString() ?? null}
            mode={{
                kind: "admin",
                revisions:
                    chart.pattern?.revisions.map((revision) => ({
                        id: revision.id,
                        number: revision.number,
                        kind: revision.kind,
                        message: revision.message,
                        createdAt: revision.createdAt.toISOString(),
                        createdBy:
                            revision.createdBy?.nostalgiaName ??
                            revision.createdBy?.username ??
                            null,
                    })) ?? [],
            }}
        />
    );
}

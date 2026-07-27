import { notFound } from "next/navigation";

import ChartTimingEditor from "@/components/admin/chart-pattern/chartTimingEditor";
import {
    chartDocumentSchema,
    createDefaultChartDocument,
} from "@/lib/chart-pattern/schema";
import db from "@/lib/db";

export default async function AdminChartPatternEditorPage({
    params,
}: {
    params: Promise<{ index: string; difficulty: string }>;
}) {
    const { index, difficulty } = await params;
    const musicIndex = decodeURIComponent(index);
    const chart = await db.musicChart.findFirst({
        where: {
            music_idx: musicIndex,
            difficulty: {
                equals: decodeURIComponent(difficulty),
                mode: "insensitive",
            },
        },
        select: {
            id: true,
            difficulty: true,
            level: true,
            bpm_min: true,
            duration_seconds: true,
            music: {
                select: {
                    index: true,
                    title: true,
                    artist: true,
                },
            },
            pattern: {
                select: {
                    draftContent: true,
                    draftVersion: true,
                    savedRevision: true,
                    publishedRevision: true,
                    updatedAt: true,
                    revisions: {
                        orderBy: { number: "desc" },
                        take: 20,
                        select: {
                            id: true,
                            number: true,
                            kind: true,
                            message: true,
                            createdAt: true,
                            createdBy: {
                                select: {
                                    username: true,
                                    nostalgia_name: true,
                                },
                            },
                        },
                    },
                },
            },
        },
    });
    if (!chart) notFound();

    const storedDocument = chart.pattern
        ? chartDocumentSchema.safeParse(chart.pattern.draftContent)
        : null;
    const initialDocument =
        storedDocument?.success === true
            ? storedDocument.data
            : createDefaultChartDocument({
                  bpm: chart.bpm_min,
                  durationMs:
                      chart.duration_seconds === null
                          ? 0
                          : chart.duration_seconds * 1_000,
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
            }}
            initialDocument={initialDocument}
            draftVersion={chart.pattern?.draftVersion ?? 0}
            savedRevision={chart.pattern?.savedRevision ?? 0}
            publishedRevision={chart.pattern?.publishedRevision ?? null}
            updatedAt={chart.pattern?.updatedAt.toISOString() ?? null}
            revisions={
                chart.pattern?.revisions.map((revision) => ({
                    id: revision.id,
                    number: revision.number,
                    kind: revision.kind,
                    message: revision.message,
                    createdAt: revision.createdAt.toISOString(),
                    createdBy:
                        revision.createdBy?.nostalgia_name ??
                        revision.createdBy?.username ??
                        null,
                })) ?? []
            }
        />
    );
}

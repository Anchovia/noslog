import { notFound } from "next/navigation";

import ChartSheetViewer from "@/components/chart-pattern/chartSheetViewer";
import { requireAdmin } from "@/lib/admin";
import { chartDocumentSchema } from "@/lib/chart-pattern/schema";
import db from "@/lib/db";

export default async function AdminChartPatternPreviewPage({
    params,
}: {
    params: Promise<{ index: string; difficulty: string }>;
}) {
    await requireAdmin();
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
            difficulty: true,
            level: true,
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
                    savedRevision: true,
                },
            },
        },
    });
    if (!chart?.pattern) notFound();

    const document = chartDocumentSchema.safeParse(chart.pattern.draftContent);
    if (!document.success) notFound();

    return (
        <ChartSheetViewer
            title={chart.music.title}
            artist={chart.music.artist}
            difficulty={chart.difficulty}
            level={chart.level}
            revision={chart.pattern.savedRevision}
            document={document.data}
            preview
            backHref={`/admin/music/${encodeURIComponent(chart.music.index)}/${chart.difficulty.toLowerCase()}/pattern`}
        />
    );
}

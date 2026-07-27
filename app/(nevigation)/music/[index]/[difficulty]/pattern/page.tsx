import { notFound } from "next/navigation";

import ChartSheetViewer from "@/components/chart-pattern/chartSheetViewer";
import { chartDocumentSchema } from "@/lib/chart-pattern/schema";
import db from "@/lib/db";

export default async function PublicChartPatternPage({
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
                    publishedContent: true,
                    publishedRevision: true,
                },
            },
        },
    });
    if (
        !chart?.pattern?.publishedContent ||
        chart.pattern.publishedRevision === null
    ) {
        notFound();
    }

    const document = chartDocumentSchema.safeParse(
        chart.pattern.publishedContent
    );
    if (!document.success) notFound();

    return (
        <ChartSheetViewer
            title={chart.music.title}
            artist={chart.music.artist}
            difficulty={chart.difficulty}
            level={chart.level}
            revision={chart.pattern.publishedRevision}
            document={document.data}
            backHref={`/music/${encodeURIComponent(chart.music.index)}/${chart.difficulty.toLowerCase()}?tab=detail`}
        />
    );
}

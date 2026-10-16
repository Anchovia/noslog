import { getAdminChartPatternPreview } from "@/features/music/server/chart-pattern-data";
import { notFound } from "next/navigation";

import ChartSheetViewer from "@/components/chart-pattern/chartSheetViewer";
import { requireAdmin } from "@/lib/admin";
import { chartDocumentSchema } from "@/lib/chart-pattern/schema";
import { parseChartDifficulty } from "@/lib/tiers";
import { getJacketUrl } from "@/lib/music-jackets";

export default async function AdminChartPatternPreviewPage({
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
    const chart = await getAdminChartPatternPreview(
        musicIndex,
        chartDifficulty
    );
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
            jacketUrl={getJacketUrl(chart.music.index, chart.music.background)}
            preview
            backHref={`/admin/music/${encodeURIComponent(chart.music.index)}/${chart.difficulty.toLowerCase()}/pattern`}
        />
    );
}

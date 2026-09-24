import { notFound } from "next/navigation";

import ChartTimingEditor from "@/components/admin/chart-pattern/chartTimingEditor";
import { getChartDraftForReview } from "@/features/contributions/server/chartDraftService";
import { getNameLabels } from "@/features/contributions/server/contributionPointService";
import db from "@/lib/db";

/**
 * 유저 채보 초안 검토(2026-09-24 C1) — 같은 에디터를 읽기 전용 검토 모드로.
 * 시각 댓글을 남기고 「수정 요청」 또는 「공개」 한다.
 */
export default async function AdminChartDraftReviewPage({
    params,
}: {
    params: Promise<{ index: string; difficulty: string; draftId: string }>;
}) {
    const { draftId } = await params;
    const id = Number(draftId);
    if (!Number.isSafeInteger(id) || id < 1) notFound();
    const draft = await getChartDraftForReview(id);
    if (!draft) notFound();
    const [chart, labels] = await Promise.all([
        db.musicChart.findUnique({
            where: { id: draft.chartId },
            select: {
                id: true,
                difficulty: true,
                level: true,
                music: { select: { index: true, title: true, artist: true } },
            },
        }),
        getNameLabels([draft.user.id], 1),
    ]);
    if (!chart) notFound();

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
            initialDocument={draft.document}
            draftVersion={draft.version}
            savedRevision={0}
            publishedRevision={null}
            updatedAt={draft.updatedAt}
            mode={{
                kind: "review",
                draftId: draft.id,
                status: draft.status,
                author: {
                    name: draft.user.username ?? "이름 없음",
                    label: labels.get(draft.user.id) ?? null,
                },
                backHref: "/admin/contributions?kind=chart",
            }}
        />
    );
}

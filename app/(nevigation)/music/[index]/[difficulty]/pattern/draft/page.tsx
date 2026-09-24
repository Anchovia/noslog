import { notFound, redirect } from "next/navigation";

import ChartTimingEditor from "@/components/admin/chart-pattern/chartTimingEditor";
import { openMyChartDraft } from "@/features/contributions/server/chartDraftService";
import db from "@/lib/db";
import { localizePath } from "@/lib/i18n/routing";
import { getServerI18n } from "@/lib/i18n/server";
import getSession from "@/lib/session";

export async function generateMetadata() {
    const { t } = await getServerI18n();
    return {
        title: t("editor.myDraft"),
        robots: { index: false, follow: false },
    };
}

/**
 * 내 채보 초안(2026-09-24 유저 기여 3단계) — 채보 에디터 기여자 모드.
 * 처음 열면 공개 채보(없으면 빈 채보)를 복사해 초안을 만든다. 나만 보고, 공개는 운영자만 한다.
 */
export default async function ChartDraftPage({
    params,
}: {
    params: Promise<{ index: string; difficulty: string }>;
}) {
    const [{ index, difficulty }, { locale }, session] = await Promise.all([
        params,
        getServerI18n(),
        getSession(),
    ]);
    const musicIndex = decodeURIComponent(index);
    const musicPath = `/music/${encodeURIComponent(musicIndex)}/${decodeURIComponent(difficulty).toLowerCase()}`;
    if (!session.id) {
        redirect(
            localizePath(
                `/login?returnTo=${encodeURIComponent(
                    localizePath(`${musicPath}/pattern/draft`, locale)
                )}`,
                locale
            )
        );
    }
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
            music: { select: { index: true, title: true, artist: true } },
        },
    });
    if (!chart) notFound();
    const draft = await openMyChartDraft(chart.id);
    if (!draft) notFound();

    return (
        <div className="noslog-ui">
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
                    kind: "contributor",
                    draftId: draft.id,
                    status: draft.status,
                    backHref: localizePath(`${musicPath}?tab=detail`, locale),
                }}
            />
        </div>
    );
}

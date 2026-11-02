import { getChartForDraft } from "@/features/music/server/chart-pattern-data";
import { notFound, redirect } from "next/navigation";

import ChartDraftEditor from "@/features/contributions/components/chart-draft-editor";
import { findMyOpenChartDraft } from "@/features/contributions/server/chart-draft-service";
import { parseChartDifficulty } from "@/lib/tiers";
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
 * 다른 사이트의 링크로 초안이 생기지 않도록 만드는 일은 GET 이 아니라 화면이 서버 액션으로 한다.
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
    const chartDifficulty = parseChartDifficulty(
        decodeURIComponent(difficulty)
    );
    if (!chartDifficulty) notFound();
    const chart = await getChartForDraft(musicIndex, chartDifficulty);
    if (!chart) notFound();
    const draft = await findMyOpenChartDraft(chart.id);

    return (
        <div className="noslog-ui">
            <ChartDraftEditor
                metadata={{
                    chartId: chart.id,
                    musicIndex: chart.music.index,
                    title: chart.music.title,
                    artist: chart.music.artist,
                    difficulty: chart.difficulty,
                    level: chart.level,
                }}
                initialDraft={draft}
                backHref={localizePath(`${musicPath}?tab=detail`, locale)}
                profileHref={localizePath(
                    `/profile/${session.id}#profile-contribution`,
                    locale
                )}
            />
        </div>
    );
}

import { notFound } from "next/navigation";

import ChartSheetViewer from "@/components/chart-pattern/chartSheetViewer";
import { chartDocumentSchema } from "@/lib/chart-pattern/schema";
import db from "@/lib/db";
import {
    getLocalizedMusicTitle,
    getMusicTitleDisplayPreference,
} from "@/lib/i18n/musicTitle";
import { localizePath } from "@/lib/i18n/routing";
import { getServerI18n } from "@/lib/i18n/server";
import { getJacketUrl } from "@/lib/musicJackets";
import getSession from "@/lib/session";

export default async function PublicChartPatternPage({
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
                    title_kana: true,
                    artist: true,
                    background: true,
                    translations: {
                        where: {
                            status: "approved",
                            locale: { in: ["ko", "en"] },
                        },
                        select: {
                            locale: true,
                            title: true,
                            status: true,
                        },
                    },
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
    const showLocalizedTitle = await getMusicTitleDisplayPreference(session.id);

    return (
        <ChartSheetViewer
            title={chart.music.title}
            localizedTitle={getLocalizedMusicTitle(
                chart.music,
                locale,
                showLocalizedTitle
            )}
            artist={chart.music.artist}
            difficulty={chart.difficulty}
            level={chart.level}
            revision={chart.pattern.publishedRevision}
            document={document.data}
            jacketUrl={getJacketUrl(chart.music.index, chart.music.background)}
            backHref={localizePath(
                `/music/${encodeURIComponent(chart.music.index)}/${chart.difficulty.toLowerCase()}?tab=detail`,
                locale
            )}
        />
    );
}

import { getPublicChartPattern } from "@/features/music/server/chart-pattern-data";
import { unstable_cache } from "next/cache";
import { notFound } from "next/navigation";

import ChartSheetViewer from "@/components/chart-pattern/chartSheetViewer";
import { parseTimeParam } from "@/components/chart-pattern/playbackClock";
import { listChartComments } from "@/features/contributions/server/chart-draft-service";
import { getNameLabels } from "@/features/contributions/server/contribution-point-service";
import {
    contributionBaseRevision,
    isExtractedChart,
} from "@/lib/chart-pattern/chartSource";
import { chartDocumentSchema } from "@/lib/chart-pattern/schema";
import { PUBLIC_DATA_REVALIDATE_SECONDS } from "@/lib/cache-policy";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { parseChartDifficulty } from "@/lib/tiers";
import {
    getLocalizedMusicTitle,
    getMusicTitleDisplayPreference,
} from "@/lib/i18n/music-title";
import { localizePath } from "@/lib/i18n/routing";
import { getServerI18n } from "@/lib/i18n/server";
import getSession from "@/lib/session";
import { getUser } from "@/lib/user";

/*
 * 공개 채보 · 곡 정보는 모두에게 같다 — 채보 공개(musicDetails) · 곡 정보 변경(musicCatalog) 때 비운다(2026-10-15 S7).
 * 작성자 이름 · 아바타는 최대 한 시간 늦게 바뀔 수 있다
 */
const getPublishedChartPattern = unstable_cache(
    async (musicIndex: string, difficulty: string) => {
        // 난이도는 enum — 주소의 소문자 난이도를 값으로 바꿔 찾는다(2026-10-16 D4-C 2차)
        const chartDifficulty = parseChartDifficulty(difficulty);
        if (!chartDifficulty) return null;
        const chart = await getPublicChartPattern(musicIndex, chartDifficulty);
        if (!chart) return null;
        if (!chart.pattern) return { ...chart, pattern: null };
        return {
            ...chart,
            pattern: {
                ...chart.pattern,
                publishedAt: chart.pattern.publishedAt?.toISOString() ?? null,
            },
        };
    },
    ["public-chart-pattern-v1"],
    {
        tags: [CACHE_TAGS.musicDetails, CACHE_TAGS.musicCatalog],
        revalidate: PUBLIC_DATA_REVALIDATE_SECONDS,
    }
);

export default async function PublicChartPatternPage({
    params,
    searchParams,
}: {
    params: Promise<{ index: string; difficulty: string }>;
    searchParams?: Promise<{ t?: string | string[] }>;
}) {
    const [{ index, difficulty }, query, { locale }, session] =
        await Promise.all([
            params,
            searchParams ?? Promise.resolve({} as { t?: string | string[] }),
            getServerI18n(),
            getSession(),
        ]);
    const musicIndex = decodeURIComponent(index);
    const chart = await getPublishedChartPattern(
        musicIndex,
        decodeURIComponent(difficulty)
    );
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
    const pattern = chart.pattern;
    const publishedRevision = chart.pattern.publishedRevision;
    const author = pattern.author?.username
        ? {
              id: pattern.author.id,
              username: pattern.author.username,
              avatar: pattern.author.avatar ?? null,
          }
        : null;
    const [showLocalizedTitle, labels, viewer, initialComments] =
        await Promise.all([
            getMusicTitleDisplayPreference(session.id),
            author ? getNameLabels([author.id]) : null,
            // 레이아웃이 이미 읽은 로그인 사용자 행(React cache)
            getUser(),
            listChartComments({ chartId: chart.id }),
        ]);
    const musicPath = `/music/${encodeURIComponent(chart.music.index)}/${chart.difficulty.toLowerCase()}`;
    const draftHref = localizePath(`${musicPath}/pattern/draft`, locale);
    const patternHref = localizePath(`${musicPath}/pattern`, locale);
    const t = Array.isArray(query.t) ? query.t[0] : query.t;

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
            source={{
                author: author
                    ? {
                          id: author.id,
                          name: author.username,
                          avatar: author.avatar,
                          label: labels?.get(author.id) ?? null,
                      }
                    : pattern.publishedBy?.username
                      ? {
                            id: null,
                            name: pattern.publishedBy.username,
                            avatar: pattern.publishedBy.avatar ?? null,
                            label: null,
                        }
                      : null,
                // 유저 기여 채보만 — 출처 창에 「공개 · 운영자 이름」 을 따로 적는다
                publisher:
                    author && pattern.publishedBy?.username
                        ? { name: pattern.publishedBy.username }
                        : null,
                publishedAt: pattern.publishedAt ?? null,
                extracted: isExtractedChart(
                    publishedRevision,
                    pattern.revisions.map((revision) => ({
                        number: revision.number,
                        kind: revision.kind,
                        baseRevision:
                            revision.kind === "contribution"
                                ? contributionBaseRevision(revision.message)
                                : null,
                    }))
                ),
            }}
            contribution={{
                chartId: chart.id,
                signedIn: Boolean(session.id),
                canModerate: viewer?.role === "admin",
                draftHref,
                loginHref: localizePath(
                    `/login?returnTo=${encodeURIComponent(draftHref)}`,
                    locale
                ),
                returnTo: patternHref,
                initialComments: initialComments ?? [],
                initialTimeMs: parseTimeParam(t),
            }}
            document={document.data}
            backHref={localizePath(
                `/music/${encodeURIComponent(chart.music.index)}/${chart.difficulty.toLowerCase()}?tab=detail`,
                locale
            )}
        />
    );
}

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
import db from "@/lib/db";
import {
    getLocalizedMusicTitle,
    getMusicTitleDisplayPreference,
} from "@/lib/i18n/music-title";
import { localizePath } from "@/lib/i18n/routing";
import { getServerI18n } from "@/lib/i18n/server";
import { getJacketUrl } from "@/lib/music-jackets";
import getSession from "@/lib/session";
import { getUser } from "@/lib/user";

/*
 * 공개 채보 · 곡 정보는 모두에게 같다 — 채보 공개(musicDetails) · 곡 정보 변경(musicCatalog) 때 비운다(2026-10-15 S7).
 * 작성자 이름 · 아바타는 최대 한 시간 늦게 바뀔 수 있다
 */
const getPublishedChartPattern = unstable_cache(
    async (musicIndex: string, difficulty: string) => {
        const chart = await db.musicChart.findFirst({
            where: {
                music_idx: musicIndex,
                difficulty: {
                    equals: difficulty,
                    mode: "insensitive",
                },
            },
            select: {
                id: true,
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
                        publishedAt: true,
                        publishedBy: {
                            select: {
                                username: true,
                                role: true,
                                avatar: true,
                            },
                        },
                        // 유저 기여 채보면 실제 작성자(2026-09-24 E1)
                        author: {
                            select: { id: true, username: true, avatar: true },
                        },
                        // 출처 표기(2026-09-24 C2) — 공개 채보 줄기에 「영상 추출」 버전이 있으면 영상에서 추출한 채보.
                        // 기여 버전은 기준 공개 버전에서 갈라지므로 함께 읽는다(lib/chart-pattern/chartSource)
                        revisions: {
                            where: {
                                kind: { in: ["vid2bmap", "contribution"] },
                            },
                            select: { number: true, kind: true, message: true },
                            orderBy: { number: "desc" },
                        },
                    },
                },
            },
        });
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
                            label:
                                pattern.publishedBy.role === "admin"
                                    ? { kind: "operator" }
                                    : null,
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
            jacketUrl={getJacketUrl(chart.music.index, chart.music.background)}
            backHref={localizePath(
                `/music/${encodeURIComponent(chart.music.index)}/${chart.difficulty.toLowerCase()}?tab=detail`,
                locale
            )}
        />
    );
}

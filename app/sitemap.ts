import db from "@/lib/db";
import { localizePath, SUPPORTED_LOCALES } from "@/lib/i18n/routing";
import { SITE_URL } from "@/lib/metadata/site";
import type { MetadataRoute } from "next";

export const revalidate = 3600;

const staticRoutes: Array<{
    path: string;
    changeFrequency: "daily" | "weekly" | "monthly";
    priority: number;
}> = [
    { path: "", changeFrequency: "daily", priority: 1 },
    { path: "/music", changeFrequency: "daily", priority: 0.9 },
    { path: "/rankings", changeFrequency: "daily", priority: 0.8 },
    { path: "/tiers", changeFrequency: "weekly", priority: 0.8 },
    { path: "/bingo", changeFrequency: "weekly", priority: 0.8 },
    { path: "/exams", changeFrequency: "weekly", priority: 0.8 },
    { path: "/gamecenter", changeFrequency: "weekly", priority: 0.8 },
    { path: "/bookmarklet", changeFrequency: "monthly", priority: 0.6 },
    { path: "/privacy", changeFrequency: "monthly", priority: 0.3 },
];

function absoluteUrl(path: string) {
    return `${SITE_URL}${path}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const localizedEntries = (
        path: string,
        options: Omit<MetadataRoute.Sitemap[number], "url" | "alternates">
    ): MetadataRoute.Sitemap =>
        SUPPORTED_LOCALES.map((locale) => ({
            ...options,
            url: absoluteUrl(localizePath(path || "/", locale)),
            alternates: {
                languages: Object.fromEntries(
                    SUPPORTED_LOCALES.map((item) => [
                        item,
                        absoluteUrl(localizePath(path || "/", item)),
                    ])
                ),
            },
        }));

    const staticEntries: MetadataRoute.Sitemap = staticRoutes.flatMap((route) =>
        localizedEntries(route.path, {
            changeFrequency: route.changeFrequency,
            priority: route.priority,
        })
    );

    try {
        const now = new Date();
        const [musics, tierLists, bingos] = await Promise.all([
            db.music.findMany({
                select: {
                    index: true,
                    updated_at: true,
                    charts: {
                        select: { difficulty: true, updated_at: true },
                    },
                },
            }),
            db.tierList.findMany({
                where: { status: "published" },
                select: { slug: true, updatedAt: true },
            }),
            db.bingo.findMany({
                where: {
                    status: "published",
                    AND: [
                        {
                            OR: [
                                { startsAt: null },
                                { startsAt: { lte: now } },
                            ],
                        },
                        { OR: [{ endsAt: null }, { endsAt: { gte: now } }] },
                    ],
                },
                select: { id: true, updatedAt: true },
            }),
        ]);

        const musicEntries: MetadataRoute.Sitemap = musics.flatMap((music) =>
            music.charts.flatMap((chart) =>
                localizedEntries(
                    `/music/${encodeURIComponent(music.index)}/${chart.difficulty.toLowerCase()}`,
                    {
                        lastModified:
                            chart.updated_at > music.updated_at
                                ? chart.updated_at
                                : music.updated_at,
                        changeFrequency: "monthly",
                        priority: 0.7,
                    }
                )
            )
        );
        const tierEntries: MetadataRoute.Sitemap = tierLists.flatMap((tier) =>
            localizedEntries(`/tiers/${encodeURIComponent(tier.slug)}`, {
                lastModified: tier.updatedAt,
                changeFrequency: "weekly",
                priority: 0.7,
            })
        );
        const bingoEntries: MetadataRoute.Sitemap = bingos.flatMap((bingo) =>
            localizedEntries(`/bingo/${bingo.id}`, {
                lastModified: bingo.updatedAt,
                changeFrequency: "weekly",
                priority: 0.7,
            })
        );

        return [
            ...staticEntries,
            ...musicEntries,
            ...tierEntries,
            ...bingoEntries,
        ];
    } catch (error) {
        console.error("동적 사이트맵 생성에 실패했습니다.", error);
        return staticEntries;
    }
}

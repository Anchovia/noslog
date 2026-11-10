import "server-only";

import {
    MUSIC_TRANSLATION_LOCALES,
    type MusicTranslationLocale,
    type MusicTranslationStatus,
    normalizeMusicTranslationLocale,
    normalizeMusicTranslationStatus,
} from "@/features/music/schemas/music-translation-admin-schema";
import { logMusicTranslationError } from "@/features/music/server/music-translation-admin-shared";
import type {
    AdminMusicListData,
    AdminMusicPage,
} from "@/features/music/types/music-admin";
import { requireAdmin } from "@/lib/admin";
import db from "@/lib/db";

export interface AdminMusicListParams {
    missing?: string;
    q?: string;
    translationLocale?: string;
    translationStatus?: string;
}

/** 관리자 악곡 목록 한 번에 불러오는 수(2026-09-25) — 무한 스크롤로 이어 붙인다 */
export const ADMIN_MUSIC_PAGE_SIZE = 40;

function adminMusicFilters(params: AdminMusicListParams) {
    const query = params.q ?? "";
    const keyword = query.trim();
    const activeLocale = normalizeMusicTranslationLocale(
        params.translationLocale
    );
    const activeStatus =
        params.translationStatus === "missing"
            ? ("missing" as const)
            : normalizeMusicTranslationStatus(params.translationStatus);
    const missingLevelConstant = params.missing === "1";
    const translationFilter =
        !activeLocale || !activeStatus
            ? {}
            : activeStatus === "missing"
              ? { translations: { none: { locale: activeLocale } } }
              : {
                    translations: {
                        some: {
                            locale: activeLocale,
                            status: activeStatus,
                        },
                    },
                };
    // 검색(2026-09-25) — 사용자 악곡 검색과 같게 대소문자를 가리지 않고(ILIKE) 식별자 · 제목 · 읽기(가나) ·
    // 아티스트 · 번역 제목(관리자는 초안 번역도)에서 찾는다
    const insensitive = { contains: keyword, mode: "insensitive" as const };
    return {
        query,
        activeLocale,
        activeStatus,
        missingLevelConstant,
        where: {
            ...translationFilter,
            ...(missingLevelConstant
                ? { charts: { some: { levelConstant: null } } }
                : {}),
            ...(keyword
                ? {
                      OR: [
                          { title: insensitive },
                          { titleKana: insensitive },
                          { artist: insensitive },
                          { index: insensitive },
                          { translations: { some: { title: insensitive } } },
                      ],
                  }
                : {}),
        },
    };
}

/** 목록 한 쪽 — offset 부터 ADMIN_MUSIC_PAGE_SIZE 곡, 더 있는지는 한 곡 더 읽어 안다 */
async function queryAdminMusicPage(
    filters: ReturnType<typeof adminMusicFilters>,
    offset: number
) {
    const rows = await db.music.findMany({
        where: filters.where,
        select: {
            index: true,
            title: true,
            artist: true,
            categoryShort: true,
            charts: { select: { levelConstant: true } },
            translations: {
                where: filters.activeLocale
                    ? { locale: filters.activeLocale }
                    : { locale: { in: [...MUSIC_TRANSLATION_LOCALES] } },
                select: { locale: true, title: true, status: true },
            },
        },
        orderBy: [{ title: "asc" }, { index: "asc" }],
        skip: offset,
        take: ADMIN_MUSIC_PAGE_SIZE + 1,
    });
    const hasMore = rows.length > ADMIN_MUSIC_PAGE_SIZE;
    return {
        hasMore,
        musics: rows.slice(0, ADMIN_MUSIC_PAGE_SIZE).map((music) => {
            const translation = filters.activeLocale
                ? music.translations.find(
                      (item) => item.locale === filters.activeLocale
                  )
                : null;
            return {
                index: music.index,
                title: music.title,
                artist: music.artist,
                categoryShort: music.categoryShort,
                chartCount: music.charts.length,
                configuredChartCount: music.charts.filter(
                    (chart) => chart.levelConstant !== null
                ).length,
                translation: translation
                    ? {
                          title: translation.title,
                          status:
                              normalizeMusicTranslationStatus(
                                  translation.status
                              ) ?? "draft",
                      }
                    : null,
            };
        }),
    };
}

/** 무한 스크롤 다음 쪽(2026-09-25) — 관리자만 */
export async function getAdminMusicPage(
    params: AdminMusicListParams,
    offset: number
): Promise<AdminMusicPage> {
    await requireAdmin();
    try {
        return await queryAdminMusicPage(
            adminMusicFilters(params),
            Math.max(0, Math.floor(offset))
        );
    } catch (error) {
        logMusicTranslationError(error, "admin.music.page.failed");
        throw error;
    }
}

export async function getAdminMusicList(
    params: AdminMusicListParams
): Promise<AdminMusicListData> {
    await requireAdmin();
    const filters = adminMusicFilters(params);
    try {
        const [page, totalMusicCount, translationGroups] = await Promise.all([
            queryAdminMusicPage(filters, 0),
            db.music.count(),
            db.musicTranslation.groupBy({
                by: ["locale", "status"],
                where: { locale: { in: [...MUSIC_TRANSLATION_LOCALES] } },
                _count: { _all: true },
            }),
        ]);
        const coverage = [
            { locale: "ko", label: "한국어" },
            { locale: "en", label: "영어" },
        ].map(({ locale, label }) => {
            const translationLocale = locale as MusicTranslationLocale;
            const count = (status: MusicTranslationStatus) =>
                translationGroups.find(
                    (group) =>
                        group.locale === translationLocale &&
                        group.status === status
                )?._count._all ?? 0;
            const approved = count("approved");
            const draft = count("draft");

            return {
                locale: translationLocale,
                label,
                approved,
                draft,
                missing: Math.max(0, totalMusicCount - approved - draft),
                total: totalMusicCount,
            };
        });

        return {
            query: filters.query,
            activeLocale: filters.activeLocale,
            activeStatus: filters.activeStatus,
            missingLevelConstant: filters.missingLevelConstant,
            coverage,
            musics: page.musics,
            hasMore: page.hasMore,
        };
    } catch (error) {
        logMusicTranslationError(error, "admin.music.list.failed", "page");
        throw error;
    }
}

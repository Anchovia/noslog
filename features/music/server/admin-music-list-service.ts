import "server-only";

import {
    MUSIC_TRANSLATION_LOCALES,
    type MusicTranslationLocale,
    type MusicTranslationStatus,
    normalizeMusicTranslationLocale,
    normalizeMusicTranslationStatus,
} from "@/features/music/schemas/music-translation-admin-schema";
import { logMusicTranslationError } from "@/features/music/server/music-translation-admin-shared";
import type { AdminMusicListData } from "@/features/music/types/music-admin";
import { requireAdmin } from "@/lib/admin";
import { adminPageArgs } from "@/lib/admin/page";
import db from "@/lib/db";

export interface AdminMusicListParams {
    missing?: string;
    q?: string;
    translationLocale?: string;
    translationStatus?: string;
}

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

function adminMusicSelect(filters: ReturnType<typeof adminMusicFilters>) {
    return {
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
    } as const;
}

const adminMusicOrder = [{ title: "asc" as const }, { index: "asc" as const }];

function toAdminMusicItem(
    filters: ReturnType<typeof adminMusicFilters>,
    music: {
        index: string;
        title: string;
        artist: string | null;
        categoryShort: string;
        charts: { levelConstant: unknown }[];
        translations: { locale: string; title: string; status: string }[];
    }
) {
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
                      normalizeMusicTranslationStatus(translation.status) ??
                      "draft",
              }
            : null,
    };
}

/** 관리자 악곡 목록 화면 — 쪽(ADMIN_PAGE_SIZE)과 같은 조건의 전체 수, 번역 현황 */
export async function getAdminMusicList(
    params: AdminMusicListParams,
    page = 1
): Promise<AdminMusicListData> {
    await requireAdmin();
    const filters = adminMusicFilters(params);
    try {
        const [rows, totalCount, totalMusicCount, translationGroups] =
            await Promise.all([
                db.music.findMany({
                    where: filters.where,
                    select: adminMusicSelect(filters),
                    orderBy: adminMusicOrder,
                    ...adminPageArgs(page),
                }),
                db.music.count({ where: filters.where }),
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
            musics: rows.map((music) => toAdminMusicItem(filters, music)),
            totalCount,
            page,
        };
    } catch (error) {
        logMusicTranslationError(error, "admin.music.list.failed", "page");
        throw error;
    }
}

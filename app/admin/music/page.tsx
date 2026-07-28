import { ChevronRight, Search } from "lucide-react";
import Link from "next/link";

import { approveMusicTranslation } from "@/app/admin/music/actions";
import MusicTranslationCoverage, {
    type TranslationCoverage,
} from "@/components/admin/musicTranslationCoverage";
import db from "@/lib/db";
import MusicTranslationCsvImport from "@/components/admin/musicTranslationCsvImport";
import {
    MUSIC_TRANSLATION_LOCALES,
    MUSIC_TRANSLATION_STATUSES,
    type MusicTranslationLocale,
    type MusicTranslationStatus,
} from "@/lib/musicTranslations/csv";

export default async function AdminMusicPage({
    searchParams,
}: {
    searchParams: Promise<{
        q?: string;
        missing?: string;
        translationLocale?: string;
        translationStatus?: string;
    }>;
}) {
    const {
        q = "",
        missing,
        translationLocale,
        translationStatus,
    } = await searchParams;
    const keyword = q.trim();
    const activeLocale = MUSIC_TRANSLATION_LOCALES.includes(
        translationLocale as MusicTranslationLocale
    )
        ? (translationLocale as MusicTranslationLocale)
        : undefined;
    const activeStatus =
        translationStatus === "missing" ||
        MUSIC_TRANSLATION_STATUSES.includes(
            translationStatus as MusicTranslationStatus
        )
            ? (translationStatus as MusicTranslationStatus | "missing")
            : undefined;
    const translationFilter =
        activeLocale && activeStatus === "missing"
            ? { translations: { none: { locale: activeLocale } } }
            : activeLocale && activeStatus
              ? {
                    translations: {
                        some: {
                            locale: activeLocale,
                            status: activeStatus,
                        },
                    },
                }
              : {};

    const [musics, totalMusicCount, translationGroups] = await Promise.all([
        db.music.findMany({
            where: {
                ...translationFilter,
                ...(missing === "1"
                    ? { charts: { some: { level_constant: null } } }
                    : {}),
                ...(keyword
                    ? {
                          OR: [
                              { title: { contains: keyword } },
                              { artist: { contains: keyword } },
                              { index: { contains: keyword } },
                              {
                                  translations: {
                                      some: {
                                          title: { contains: keyword },
                                      },
                                  },
                              },
                          ],
                      }
                    : {}),
            },
            select: {
                index: true,
                title: true,
                artist: true,
                category_short: true,
                charts: { select: { id: true, level_constant: true } },
                translations: {
                    where: activeLocale
                        ? { locale: activeLocale }
                        : { locale: { in: [...MUSIC_TRANSLATION_LOCALES] } },
                    select: {
                        locale: true,
                        title: true,
                        status: true,
                    },
                },
            },
            orderBy: { title: "asc" },
            take: 100,
        }),
        db.music.count(),
        db.musicTranslation.groupBy({
            by: ["locale", "status"],
            where: { locale: { in: [...MUSIC_TRANSLATION_LOCALES] } },
            _count: { _all: true },
        }),
    ]);

    const coverage: TranslationCoverage[] = [
        { locale: "ko", label: "한국어" },
        { locale: "en", label: "영어" },
    ].map(({ locale, label }) => {
        const count = (status: MusicTranslationStatus) =>
            translationGroups.find(
                (group) => group.locale === locale && group.status === status
            )?._count._all ?? 0;
        const approved = count("approved");
        const draft = count("draft");

        return {
            locale: locale as MusicTranslationLocale,
            label,
            approved,
            draft,
            missing: Math.max(0, totalMusicCount - approved - draft),
            total: totalMusicCount,
        };
    });

    return (
        <div className="flex flex-col gap-4 px-4 py-5">
            <section>
                <h1 className="text-title">악곡 정보</h1>
                <p className="text-caption mt-1">
                    채보별 상세 정보와 공식 레벨 상수를 관리합니다.
                </p>
            </section>
            <MusicTranslationCoverage
                coverage={coverage}
                activeLocale={activeLocale}
                activeStatus={activeStatus}
            />
            <MusicTranslationCsvImport />
            <form className="relative">
                <Search className="text-text-disabled pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                <input
                    name="q"
                    defaultValue={q}
                    placeholder="곡 제목 · 아티스트 · 식별자 검색"
                    className="border-border bg-surface text-input h-11 w-full rounded-md border pr-3 pl-10"
                />
                {missing === "1" ? (
                    <input type="hidden" name="missing" value="1" />
                ) : null}
                {activeLocale ? (
                    <input
                        type="hidden"
                        name="translationLocale"
                        value={activeLocale}
                    />
                ) : null}
                {activeStatus ? (
                    <input
                        type="hidden"
                        name="translationStatus"
                        value={activeStatus}
                    />
                ) : null}
            </form>
            <section className="bg-surface rounded-card overflow-hidden">
                {musics.map((music, index) => {
                    const configured = music.charts.filter(
                        (chart) => chart.level_constant !== null
                    ).length;
                    const translation = activeLocale
                        ? music.translations.find(
                              (item) => item.locale === activeLocale
                          )
                        : null;
                    return (
                        <div
                            key={music.index}
                            className={`flex min-h-16 items-center gap-2 px-3 ${index > 0 ? "border-divider border-t" : ""}`}
                        >
                            <Link
                                href={`/admin/music/${encodeURIComponent(music.index)}`}
                                className="hover:bg-surface-muted -mx-1 flex min-w-0 flex-1 items-center gap-3 rounded-md px-1 py-2"
                            >
                                <span className="bg-surface-muted text-text-secondary flex size-9 shrink-0 items-center justify-center rounded-md text-xs font-bold">
                                    {music.category_short}
                                </span>
                                <span className="min-w-0 flex-1">
                                    <strong className="text-body block truncate font-bold">
                                        {music.title}
                                    </strong>
                                    {activeLocale ? (
                                        <span className="text-caption block truncate">
                                            {translation
                                                ? `${translation.title} · ${translation.status === "approved" ? "승인" : "초안"}`
                                                : `${activeLocale.toUpperCase()} 번역 없음`}
                                        </span>
                                    ) : (
                                        <span className="text-caption block truncate">
                                            {music.artist ?? "아티스트 미상"} ·
                                            상수 {configured}/
                                            {music.charts.length}
                                        </span>
                                    )}
                                </span>
                                <ChevronRight className="text-text-disabled size-4 shrink-0" />
                            </Link>
                            {activeLocale && translation?.status === "draft" ? (
                                <form action={approveMusicTranslation}>
                                    <input
                                        type="hidden"
                                        name="musicIndex"
                                        value={music.index}
                                    />
                                    <input
                                        type="hidden"
                                        name="locale"
                                        value={activeLocale}
                                    />
                                    <button
                                        type="submit"
                                        className="border-border hover:bg-surface-muted h-9 shrink-0 rounded-md border px-2.5 text-xs font-bold"
                                    >
                                        승인
                                    </button>
                                </form>
                            ) : null}
                        </div>
                    );
                })}
                {musics.length === 0 ? (
                    <p className="text-body-muted py-12 text-center">
                        검색 결과가 없습니다.
                    </p>
                ) : null}
            </section>
        </div>
    );
}

import type { NextRequest } from "next/server";

import { requireAdmin } from "@/lib/admin";
import db from "@/lib/db";
import {
    MUSIC_TRANSLATION_LOCALES,
    MUSIC_TRANSLATION_STATUSES,
    type MusicTranslationLocale,
    type MusicTranslationStatus,
} from "@/lib/musicTranslations/csv";
import {
    serializeMusicTranslationCsv,
    type MusicTranslationExportRow,
} from "@/lib/musicTranslations/export";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
    await requireAdmin();

    const localeParam = request.nextUrl.searchParams.get("locale");
    const statusParam = request.nextUrl.searchParams.get("status");
    const locales = MUSIC_TRANSLATION_LOCALES.includes(
        localeParam as MusicTranslationLocale
    )
        ? [localeParam as MusicTranslationLocale]
        : [...MUSIC_TRANSLATION_LOCALES];
    const status = MUSIC_TRANSLATION_STATUSES.includes(
        statusParam as MusicTranslationStatus
    )
        ? (statusParam as MusicTranslationStatus)
        : null;

    const musics = await db.music.findMany({
        where: status
            ? {
                  translations: {
                      some: {
                          locale: { in: locales },
                          status,
                      },
                  },
              }
            : undefined,
        select: {
            index: true,
            title: true,
            title_kana: true,
            translations: {
                where: {
                    locale: { in: locales },
                    ...(status ? { status } : {}),
                },
                select: {
                    locale: true,
                    title: true,
                    status: true,
                },
            },
        },
        orderBy: { title: "asc" },
    });

    const rows: MusicTranslationExportRow[] = musics.flatMap((music) =>
        locales.flatMap((locale) => {
            const translation = music.translations.find(
                (item) => item.locale === locale
            );
            if (status && !translation) return [];

            return [
                {
                    index: music.index,
                    originalTitle: music.title,
                    titleKana: music.title_kana,
                    locale,
                    title: translation?.title ?? "",
                    status:
                        (translation?.status as MusicTranslationStatus) ??
                        "draft",
                },
            ];
        })
    );

    const csv = serializeMusicTranslationCsv(rows);
    const localeSuffix = locales.length === 1 ? `-${locales[0]}` : "";
    const statusSuffix = status ? `-${status}` : "";

    return new Response(csv, {
        headers: {
            "Cache-Control": "private, no-store",
            "Content-Disposition": `attachment; filename="noslog-music-translations${localeSuffix}${statusSuffix}.csv"`,
            "Content-Type": "text/csv; charset=utf-8",
            "X-Content-Type-Options": "nosniff",
        },
    });
}

"use server";

import db from "@/lib/db";

interface SearchParamsProps {
    q?: string;
    normal?: string;
    hard?: string;
    expert?: string;
    real?: string;
}

export async function getMoreMusics(
    page: number,
    { q, normal, hard, expert, real }: SearchParamsProps
) {
    const musics = await db.music.findMany({
        where: {
            AND: [
                q
                    ? {
                          OR: [
                              { title: { contains: q } },
                              { artist: { contains: q } },
                          ],
                      }
                    : {},
                normal
                    ? {
                          normal: {
                              equals: parseInt(normal),
                          },
                      }
                    : {},
                hard
                    ? {
                          hard: {
                              equals: parseInt(hard),
                          },
                      }
                    : {},
                expert
                    ? {
                          expert: {
                              equals: parseInt(expert),
                          },
                      }
                    : {},

                real
                    ? {
                          real: {
                              equals: parseInt(real),
                              not: null,
                          },
                      }
                    : {},
            ],
        },
        select: {
            index: true,
            title: true,
            artist: true,
            category_short: true,
            background: true,
            sheet_len: true,
            difficulty_levels: true,
        },
        skip: page * 20,
        take: 20,
    });
    return musics;
}

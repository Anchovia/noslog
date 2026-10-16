import "server-only";

import type { ChartDifficulty } from "@prisma/client";

import db from "@/lib/db";

/** 운영자 채보 에디터 — 채보 정보 · 초안 · 최근 버전 20개(2026-10-16 D8 — 화면에서 옮김) */
export function getAdminChartPatternEditor(
    musicIndex: string,
    chartDifficulty: ChartDifficulty
) {
    return db.musicChart.findFirst({
        where: {
            musicIdx: musicIndex,
            difficulty: chartDifficulty,
        },
        select: {
            id: true,
            difficulty: true,
            level: true,
            bpmMin: true,
            noteCount: true,
            durationSeconds: true,
            music: {
                select: {
                    index: true,
                    title: true,
                    artist: true,
                },
            },
            pattern: {
                select: {
                    draftContent: true,
                    draftVersion: true,
                    savedRevision: true,
                    publishedRevision: true,
                    updatedAt: true,
                    revisions: {
                        orderBy: { number: "desc" },
                        take: 20,
                        select: {
                            id: true,
                            number: true,
                            kind: true,
                            message: true,
                            createdAt: true,
                            createdBy: {
                                select: {
                                    username: true,
                                    nostalgiaName: true,
                                },
                            },
                        },
                    },
                },
            },
        },
    });
}

/** 운영자 초안 미리보기 */
export function getAdminChartPatternPreview(
    musicIndex: string,
    chartDifficulty: ChartDifficulty
) {
    return db.musicChart.findFirst({
        where: {
            musicIdx: musicIndex,
            difficulty: chartDifficulty,
        },
        select: {
            difficulty: true,
            level: true,
            music: {
                select: {
                    index: true,
                    title: true,
                    artist: true,
                    background: true,
                },
            },
            pattern: {
                select: {
                    draftContent: true,
                    savedRevision: true,
                },
            },
        },
    });
}

/** 공개 채보 뷰어 — 공개본 · 공개한 사람 · 작성자 · 출처 표기용 버전 */
export function getPublicChartPattern(
    musicIndex: string,
    chartDifficulty: ChartDifficulty
) {
    return db.musicChart.findFirst({
        where: {
            musicIdx: musicIndex,
            difficulty: chartDifficulty,
        },
        select: {
            id: true,
            difficulty: true,
            level: true,
            music: {
                select: {
                    index: true,
                    title: true,
                    titleKana: true,
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
}

/** 기여 초안 에디터의 채보 머리 정보 */
export function getChartForDraft(
    musicIndex: string,
    chartDifficulty: ChartDifficulty
) {
    return db.musicChart.findFirst({
        where: {
            musicIdx: musicIndex,
            difficulty: chartDifficulty,
        },
        select: {
            id: true,
            difficulty: true,
            level: true,
            music: { select: { index: true, title: true, artist: true } },
        },
    });
}

/** 채보 머리 정보(검토 화면) */
export function getChartHeader(chartId: number) {
    return db.musicChart.findUnique({
        where: { id: chartId },
        select: {
            id: true,
            difficulty: true,
            level: true,
            music: { select: { index: true, title: true, artist: true } },
        },
    });
}

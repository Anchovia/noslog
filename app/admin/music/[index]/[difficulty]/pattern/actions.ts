"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";

import { requireAdmin } from "@/lib/admin";
import { CACHE_TAGS } from "@/lib/cacheTags";
import {
    chartDocumentSchema,
    type ChartDocument,
} from "@/lib/chart-pattern/schema";
import db from "@/lib/db";

const saveInputSchema = z.object({
    chartId: z.number().int().positive(),
    baseVersion: z.number().int().nonnegative(),
    document: chartDocumentSchema,
});

const revisionInputSchema = saveInputSchema.extend({
    message: z.string().trim().max(120).optional(),
});

const restoreInputSchema = z.object({
    chartId: z.number().int().positive(),
    revisionId: z.number().int().positive(),
    baseVersion: z.number().int().nonnegative(),
});

export interface ChartPatternActionResult {
    success: boolean;
    message: string;
    draftVersion?: number;
    savedRevision?: number;
    publishedRevision?: number | null;
    revision?: {
        id: number;
        number: number;
        kind: string;
        message: string | null;
        createdAt: string;
        createdBy: string | null;
    };
    conflict?: boolean;
    document?: ChartDocument;
}

function inputJson(document: ChartDocument) {
    return document as unknown as Prisma.InputJsonValue;
}

async function chartExists(chartId: number) {
    return Boolean(
        await db.musicChart.findUnique({
            where: { id: chartId },
            select: { id: true },
        })
    );
}

function invalidInputResult(): ChartPatternActionResult {
    return {
        success: false,
        message: "채보 데이터 형식이 올바르지 않습니다.",
    };
}

function conflictResult(): ChartPatternActionResult {
    return {
        success: false,
        conflict: true,
        message:
            "다른 저장 내용이 먼저 반영되었습니다. 페이지를 새로고침한 뒤 다시 시도해주세요.",
    };
}

export async function saveChartPatternDraft(
    input: unknown
): Promise<ChartPatternActionResult> {
    const admin = await requireAdmin();
    const parsed = saveInputSchema.safeParse(input);
    if (!parsed.success) return invalidInputResult();

    const { chartId, baseVersion, document } = parsed.data;
    if (!(await chartExists(chartId))) {
        return { success: false, message: "악곡 채보를 찾을 수 없습니다." };
    }

    const current = await db.chartPattern.findUnique({
        where: { chartId },
        select: {
            id: true,
            draftVersion: true,
            savedRevision: true,
            publishedRevision: true,
        },
    });

    if (!current) {
        if (baseVersion !== 0) return conflictResult();

        try {
            const created = await db.chartPattern.create({
                data: {
                    chartId,
                    formatVersion: document.version,
                    draftContent: inputJson(document),
                    draftVersion: 1,
                    createdById: admin.id,
                    updatedById: admin.id,
                },
                select: {
                    draftVersion: true,
                    savedRevision: true,
                    publishedRevision: true,
                },
            });
            return {
                success: true,
                message: "초안이 자동 저장되었습니다.",
                ...created,
            };
        } catch (error) {
            if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === "P2002"
            ) {
                return conflictResult();
            }
            throw error;
        }
    }

    const updated = await db.chartPattern.updateMany({
        where: {
            id: current.id,
            draftVersion: baseVersion,
        },
        data: {
            formatVersion: document.version,
            draftContent: inputJson(document),
            draftVersion: { increment: 1 },
            updatedById: admin.id,
        },
    });
    if (updated.count !== 1) return conflictResult();

    return {
        success: true,
        message: "초안이 자동 저장되었습니다.",
        draftVersion: baseVersion + 1,
        savedRevision: current.savedRevision,
        publishedRevision: current.publishedRevision,
    };
}

async function saveRevision(
    input: unknown,
    kind: "manual" | "publish"
): Promise<ChartPatternActionResult> {
    const admin = await requireAdmin();
    const parsed = revisionInputSchema.safeParse(input);
    if (!parsed.success) return invalidInputResult();

    const { chartId, baseVersion, document, message } = parsed.data;
    if (!(await chartExists(chartId))) {
        return { success: false, message: "악곡 채보를 찾을 수 없습니다." };
    }

    return db.$transaction(async (transaction) => {
        const current = await transaction.chartPattern.findUnique({
            where: { chartId },
            select: {
                id: true,
                draftVersion: true,
                savedRevision: true,
                publishedRevision: true,
            },
        });
        const nextRevision = (current?.savedRevision ?? 0) + 1;
        const nextDraftVersion = baseVersion + 1;
        const publishData =
            kind === "publish"
                ? {
                      publishedContent: inputJson(document),
                      publishedRevision: nextRevision,
                      publishedById: admin.id,
                      publishedAt: new Date(),
                  }
                : {};

        if (!current) {
            if (baseVersion !== 0) return conflictResult();

            try {
                const created = await transaction.chartPattern.create({
                    data: {
                        chartId,
                        formatVersion: document.version,
                        draftContent: inputJson(document),
                        draftVersion: nextDraftVersion,
                        savedRevision: nextRevision,
                        createdById: admin.id,
                        updatedById: admin.id,
                        ...publishData,
                    },
                    select: {
                        id: true,
                        draftVersion: true,
                        savedRevision: true,
                        publishedRevision: true,
                    },
                });
                const revision = await transaction.chartPatternRevision.create({
                    data: {
                        patternId: created.id,
                        number: nextRevision,
                        kind,
                        message: message || null,
                        content: inputJson(document),
                        createdById: admin.id,
                    },
                    select: {
                        id: true,
                        number: true,
                        kind: true,
                        message: true,
                        createdAt: true,
                    },
                });
                return {
                    success: true,
                    message:
                        kind === "publish"
                            ? "채보를 공개했습니다."
                            : "복구 가능한 버전을 저장했습니다.",
                    draftVersion: created.draftVersion,
                    savedRevision: created.savedRevision,
                    publishedRevision: created.publishedRevision,
                    revision: {
                        ...revision,
                        createdAt: revision.createdAt.toISOString(),
                        createdBy: null,
                    },
                };
            } catch (error) {
                if (
                    error instanceof Prisma.PrismaClientKnownRequestError &&
                    error.code === "P2002"
                ) {
                    return conflictResult();
                }
                throw error;
            }
        }

        const updated = await transaction.chartPattern.updateMany({
            where: {
                id: current.id,
                draftVersion: baseVersion,
            },
            data: {
                formatVersion: document.version,
                draftContent: inputJson(document),
                draftVersion: { increment: 1 },
                savedRevision: nextRevision,
                updatedById: admin.id,
                ...publishData,
            },
        });
        if (updated.count !== 1) return conflictResult();

        const revision = await transaction.chartPatternRevision.create({
            data: {
                patternId: current.id,
                number: nextRevision,
                kind,
                message: message || null,
                content: inputJson(document),
                createdById: admin.id,
            },
            select: {
                id: true,
                number: true,
                kind: true,
                message: true,
                createdAt: true,
            },
        });

        return {
            success: true,
            message:
                kind === "publish"
                    ? "채보를 공개했습니다."
                    : "복구 가능한 버전을 저장했습니다.",
            draftVersion: nextDraftVersion,
            savedRevision: nextRevision,
            publishedRevision:
                kind === "publish" ? nextRevision : current.publishedRevision,
            revision: {
                ...revision,
                createdAt: revision.createdAt.toISOString(),
                createdBy: null,
            },
        };
    });
}

export async function createChartPatternRevision(input: unknown) {
    return saveRevision(input, "manual");
}

export async function publishChartPattern(input: unknown) {
    const result = await saveRevision(input, "publish");
    if (result.success) {
        revalidateTag(CACHE_TAGS.musicDetails, "max");
        revalidatePath("/music");
    }
    return result;
}

export async function restoreChartPatternRevision(
    input: unknown
): Promise<ChartPatternActionResult> {
    const admin = await requireAdmin();
    const parsed = restoreInputSchema.safeParse(input);
    if (!parsed.success) return invalidInputResult();

    const { chartId, revisionId, baseVersion } = parsed.data;
    const revision = await db.chartPatternRevision.findFirst({
        where: {
            id: revisionId,
            pattern: { chartId },
        },
        select: {
            content: true,
            patternId: true,
        },
    });
    if (!revision) {
        return { success: false, message: "저장 버전을 찾을 수 없습니다." };
    }

    const document = chartDocumentSchema.safeParse(revision.content);
    if (!document.success) {
        return {
            success: false,
            message: "이 저장 버전의 데이터 형식을 읽을 수 없습니다.",
        };
    }

    const updated = await db.chartPattern.updateMany({
        where: {
            id: revision.patternId,
            draftVersion: baseVersion,
        },
        data: {
            draftContent: inputJson(document.data),
            formatVersion: document.data.version,
            draftVersion: { increment: 1 },
            updatedById: admin.id,
        },
    });
    if (updated.count !== 1) return conflictResult();

    return {
        success: true,
        message: "선택한 버전을 현재 초안으로 복원했습니다.",
        draftVersion: baseVersion + 1,
        document: document.data,
    };
}

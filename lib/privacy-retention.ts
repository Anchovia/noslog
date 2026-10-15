import { subDays, subMonths } from "date-fns";

import { analyticsDateKey } from "@/lib/analytics";
import { deleteBlobStrict } from "@/lib/blob";
import db from "@/lib/db";

const RETENTION_MONTHS = 6;
// 방문·API 통계의 날짜별 합계 보관 기간(2026-09-13 사용자 결정)
const ANALYTICS_RETENTION_DAYS = 90;
const BATCH_SIZE = 500;

export interface PrivacyRetentionResult {
    cutoff: string;
    feedbackDeleted: number;
    approvedExamRedacted: number;
    rejectedExamDeleted: number;
    analyticsVisitorsDeleted: number;
    analyticsSaltsDeleted: number;
    analyticsCountsDeleted: number;
    failed: number;
}

// 방문 통계 — 방문자 해시와 그날의 무작위 값은 오늘(서울) 이전 것을 전부, 날짜별 합계는 90일이 지난 것을 지운다
async function cleanAnalytics(now: Date, result: PrivacyRetentionResult) {
    const today = analyticsDateKey(now);
    const countsCutoff = analyticsDateKey(
        subDays(now, ANALYTICS_RETENTION_DAYS)
    );
    try {
        result.analyticsVisitorsDeleted = await db.$executeRaw`
            DELETE FROM "analytics_visitors" WHERE "date" < ${today}::date`;
        result.analyticsSaltsDeleted = await db.$executeRaw`
            DELETE FROM "analytics_salts" WHERE "date" < ${today}::date`;
        result.analyticsCountsDeleted = await db.$executeRaw`
            DELETE FROM "analytics_daily_counts" WHERE "date" < ${countsCutoff}::date`;
    } catch (error) {
        result.failed += 1;
        console.error("방문 통계 보관 만료 정리 실패", error);
    }
}

export async function runPrivacyRetention(
    now = new Date()
): Promise<PrivacyRetentionResult> {
    const cutoff = subMonths(now, RETENTION_MONTHS);
    const [feedbackReports, approvedSubmissions, rejectedSubmissions] =
        await Promise.all([
            db.feedbackReport.findMany({
                where: {
                    status: "resolved",
                    resolvedAt: { lte: cutoff },
                },
                select: { id: true, imageUrl: true },
                take: BATCH_SIZE,
            }),
            db.examSubmission.findMany({
                where: {
                    status: "approved",
                    reviewedAt: { lte: cutoff },
                    OR: [
                        { proofImageUrl: { not: null } },
                        { reviewerNote: { not: null } },
                    ],
                },
                select: { id: true, proofImageUrl: true },
                take: BATCH_SIZE,
            }),
            db.examSubmission.findMany({
                where: {
                    status: "rejected",
                    reviewedAt: { lte: cutoff },
                },
                select: { id: true, proofImageUrl: true },
                take: BATCH_SIZE,
            }),
        ]);

    const result: PrivacyRetentionResult = {
        cutoff: cutoff.toISOString(),
        feedbackDeleted: 0,
        approvedExamRedacted: 0,
        rejectedExamDeleted: 0,
        analyticsVisitorsDeleted: 0,
        analyticsSaltsDeleted: 0,
        analyticsCountsDeleted: 0,
        failed: 0,
    };

    for (const report of feedbackReports) {
        try {
            await deleteBlobStrict(report.imageUrl);
            const deleted = await db.feedbackReport.deleteMany({
                where: {
                    id: report.id,
                    status: "resolved",
                    resolvedAt: { lte: cutoff },
                },
            });
            result.feedbackDeleted += deleted.count;
        } catch (error) {
            result.failed += 1;
            console.error(`피드백 ${report.id} 보관 만료 정리 실패`, error);
        }
    }

    for (const submission of approvedSubmissions) {
        try {
            await deleteBlobStrict(submission.proofImageUrl);
            const updated = await db.examSubmission.updateMany({
                where: {
                    id: submission.id,
                    status: "approved",
                    reviewedAt: { lte: cutoff },
                },
                data: {
                    proofImageUrl: null,
                    reviewerNote: null,
                },
            });
            result.approvedExamRedacted += updated.count;
        } catch (error) {
            result.failed += 1;
            console.error(
                `승인 검정 제출 ${submission.id} 보관 만료 정리 실패`,
                error
            );
        }
    }

    for (const submission of rejectedSubmissions) {
        try {
            await deleteBlobStrict(submission.proofImageUrl);
            const deleted = await db.examSubmission.deleteMany({
                where: {
                    id: submission.id,
                    status: "rejected",
                    reviewedAt: { lte: cutoff },
                },
            });
            result.rejectedExamDeleted += deleted.count;
        } catch (error) {
            result.failed += 1;
            console.error(
                `반려 검정 제출 ${submission.id} 보관 만료 정리 실패`,
                error
            );
        }
    }

    await cleanAnalytics(now, result);

    return result;
}

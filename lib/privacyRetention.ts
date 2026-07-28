import { subMonths } from "date-fns";

import { deleteBlobStrict } from "@/lib/blob";
import db from "@/lib/db";

const RETENTION_MONTHS = 6;
const BATCH_SIZE = 500;

export interface PrivacyRetentionResult {
    cutoff: string;
    feedbackDeleted: number;
    approvedExamRedacted: number;
    rejectedExamDeleted: number;
    failed: number;
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

    return result;
}

"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/admin";
import db from "@/lib/db";

export async function reviewExamSubmission(formData: FormData) {
    await requireAdmin();

    const submissionId = Number(formData.get("submissionId"));
    const status = String(formData.get("status") ?? "");
    const reviewerNote = String(formData.get("reviewerNote") ?? "").trim();

    if (
        !Number.isInteger(submissionId) ||
        !["approved", "rejected"].includes(status)
    ) {
        return;
    }

    const submission = await db.examSubmission.findFirst({
        where: { id: submissionId, status: "pending" },
        select: { id: true, userId: true, examId: true },
    });
    if (!submission) return;

    await db.$transaction(async (tx) => {
        await tx.examSubmission.update({
            where: { id: submission.id },
            data: {
                status,
                reviewerNote: reviewerNote || null,
                reviewedAt: new Date(),
            },
        });

        if (status === "approved") {
            await tx.examAchievement.upsert({
                where: {
                    userId_examId: {
                        userId: submission.userId,
                        examId: submission.examId,
                    },
                },
                create: {
                    userId: submission.userId,
                    examId: submission.examId,
                    submissionId: submission.id,
                },
                update: { submissionId: submission.id, achievedAt: new Date() },
            });
        } else {
            await tx.examAchievement.deleteMany({
                where: { submissionId: submission.id },
            });
        }
    });

    revalidatePath("/admin");
    revalidatePath("/admin/submissions");
    revalidatePath("/exams");
}

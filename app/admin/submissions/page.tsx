import Link from "next/link";

import ExamSubmissionCard from "@/features/exams/components/admin/exam-submission-card";
import {
    examSubmissionStatusSchema,
    normalizeExamSubmissionStatus,
} from "@/features/exams/schemas/exam-submission-admin-schema";
import { listExamSubmissions } from "@/features/exams/server/exam-submission-admin-service";
import { requireAdmin } from "@/lib/admin";

const statuses = examSubmissionStatusSchema.options;

export default async function AdminSubmissionsPage({
    searchParams,
}: {
    searchParams: Promise<{ status?: string }>;
}) {
    await requireAdmin();
    const params = await searchParams;
    const status = normalizeExamSubmissionStatus(params.status);
    const submissions = await listExamSubmissions(status);

    return (
        <div className="flex flex-col gap-nl-16 py-nl-24">
            <section>
                <h1 className="nl-section-title text-nl-content">인증 심사</h1>
                <p className="nl-metadata mt-nl-4 text-nl-subdued">
                    검정 합격 증빙을 확인하고 승인하거나 반려합니다.
                </p>
            </section>

            <nav className="flex gap-nl-8">
                {statuses.map((item) => (
                    <Link
                        key={item}
                        href={`/admin/submissions?status=${item}`}
                        className={`nl-emphasis-label rounded-nl-control px-nl-12 py-nl-8 ${status === item ? "bg-nl-primary text-nl-on-primary" : "bg-nl-surface text-nl-subdued"}`}
                    >
                        {item === "pending"
                            ? "대기"
                            : item === "approved"
                              ? "승인"
                              : "반려"}
                    </Link>
                ))}
            </nav>

            <section className="flex flex-col gap-nl-12">
                {submissions.map((submission) => (
                    <ExamSubmissionCard
                        key={submission.id}
                        submission={submission}
                    />
                ))}
                {submissions.length === 0 ? (
                    <p className="nl-body-secondary rounded-nl-control bg-nl-surface py-nl-48 text-center text-nl-subdued">
                        해당하는 인증이 없습니다.
                    </p>
                ) : null}
            </section>
        </div>
    );
}

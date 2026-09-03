import Link from "next/link";

import ExamSubmissionCard from "@/features/exams/components/admin/examSubmissionCard";
import {
    examSubmissionStatusSchema,
    normalizeExamSubmissionStatus,
} from "@/features/exams/schemas/examSubmissionAdminSchema";
import { listExamSubmissions } from "@/features/exams/server/examSubmissionAdminService";

const statuses = examSubmissionStatusSchema.options;

export default async function AdminSubmissionsPage({
    searchParams,
}: {
    searchParams: Promise<{ status?: string }>;
}) {
    const params = await searchParams;
    const status = normalizeExamSubmissionStatus(params.status);
    const submissions = await listExamSubmissions(status);

    return (
        <div className="flex flex-col gap-4 px-4 py-5">
            <section>
                <h1 className="text-title">인증 심사</h1>
                <p className="text-caption mt-1">
                    검정 합격 증빙을 확인하고 승인하거나 반려합니다.
                </p>
            </section>

            <nav className="flex gap-2">
                {statuses.map((item) => (
                    <Link
                        key={item}
                        href={`/admin/submissions?status=${item}`}
                        className={`rounded-md px-3 py-2 text-sm font-semibold ${status === item ? "bg-text-primary text-bg" : "bg-surface text-text-secondary"}`}
                    >
                        {item === "pending"
                            ? "대기"
                            : item === "approved"
                              ? "승인"
                              : "반려"}
                    </Link>
                ))}
            </nav>

            <section className="flex flex-col gap-3">
                {submissions.map((submission) => (
                    <ExamSubmissionCard
                        key={submission.id}
                        submission={submission}
                    />
                ))}
                {submissions.length === 0 ? (
                    <p className="text-body-muted bg-surface rounded-card py-12 text-center">
                        해당하는 인증이 없습니다.
                    </p>
                ) : null}
            </section>
        </div>
    );
}
